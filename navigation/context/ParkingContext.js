import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import {PermissionsAndroid, Linking, Alert} from "react-native";
import {getDistanceFromLatLonInKm} from "../utilities/utils";
import Geolocation from "react-native-geolocation-service";
import useCloseWithIndicator from "../customHooks/useCloseWithIndicator";
import axios from "axios";
import backendUrls from "../connections/backendUrls";
const {getAllParkAreasURL, bookASlotURL} = backendUrls;
import {isEqual} from "lodash";
import {useAuth} from "./AuthContext";
import {MAP_API_KEY} from "@env";

const calculateDistanceUsingAPI = async (origin, destinations) => {
  const destinationsQuery = destinations
    .map(dest => `${dest.lat},${dest.lng}`)
    .join("|");
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${origin.latitude},${origin.longitude}&destinations=${destinationsQuery}&key=${MAP_API_KEY}`
    );
    return response.data.rows[0].elements;
  } catch (error) {
    console.error("Error fetching distance matrix: ", error);
    return [];
  }
};

const ParkingContext = createContext();

export const ParkingDataProvider = ({children}) => {
  const {user} = useAuth();
  const [parkAreas, setParkAreas] = useState([]);
  const [locationSharingEnabled, setLocationSharingEnabled] = useState(false);
  const [location, setLocation] = useState(null); // users location
  const [bookingDetails, setBookingDetails] = useState({}); // {parkSpaceId, vehicleId}
  const [searchLocation, setSearchLocation] = useState(null); // location to search for park areas
  const [suggestedParkAreas, setSuggestedParkAreas] = useState([]);
  const [selectedParkArea, setSelectedParkArea] = useState(null);
  const [currentUserLocation, setCurrentUserLocation] = useState(null);

  const bookParkSpace = async coolOffTime => {
    try {
      const requestBody = {
        parkArea: {_id: bookingDetails.parkArea._id},
        vehicle: bookingDetails.vehicle,
        user: {_id: user._id},
        coolOffTime: coolOffTime, // in minutes
      };

      const response = await axios.post(bookASlotURL, requestBody);
      return {
        success: true,
        message: response.data.message,
        user: response.data.user,
      };
    } catch (error) {
      const errorMessage =
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : "An error occurred while booking the slot.";

      console.error(errorMessage);
      return {success: false, error: errorMessage};
    }
  };
  const fetchAllParkAreas = useCallback(async () => {
    if (!currentUserLocation) {
      console.log("User location is not available.");
      return;
    }

    try {
      const response = await axios.get(getAllParkAreasURL);
      if (response.data.success) {
        if (!isEqual(response.data.parkAreas, parkAreas)) {
          const parkAreasWithDistance = await Promise.all(
            response.data.parkAreas.map(async parkArea => {
              const distances = await calculateDistanceUsingAPI(
                currentUserLocation,
                [
                  {
                    lat: parkArea.location.latitude,
                    lng: parkArea.location.longitude,
                  },
                ]
              );
              const distanceValue = distances[0].distance.value; // meters
              const durationValue = distances[0].duration.value; // seconds

              return {
                ...parkArea,
                distance: distanceValue,
                duration: durationValue,
              };
            })
          );
          setParkAreas(
            parkAreasWithDistance.sort((a, b) => a.distance - b.distance)
          );
          console.log("Park Areas updated: ", parkAreasWithDistance);
        } else {
          console.log("No changes in Park Areas.");
        }
      } else {
        Alert.alert("Error", "Failed to fetch park areas.");
      }
    } catch (err) {
      console.error("Error fetching park areas: ", err);
      Alert.alert("Error", "Failed to fetch park areas.");
    }
  }, [currentUserLocation, parkAreas]);

  const updateSelectedParkArea = parkArea => {
    setSelectedParkArea(parkArea);
  };
  const resetSelectedParkArea = () => {
    setSelectedParkArea(null);
  };
  const resetSuggestedParkAreas = () => {
    setSuggestedParkAreas([]);
  };

  const [fetchSuggestedParkAreas, isLoading] = useCloseWithIndicator(
    async () => {
      await new Promise(resolve => setTimeout(resolve, 3000));
      setSuggestedParkAreas(
        getParkAreasWithinDistance(
          searchLocation.location.latitude,
          searchLocation.location.longitude,
          2,
          parkAreas
        )
      );
    }
  );

  useEffect(() => {
    const performAsyncFetch = async () => {
      if (searchLocation != null) {
        await fetchSuggestedParkAreas();
      }
    };
    performAsyncFetch();
  }, [searchLocation]);

  const updateBookingDetails = details => {
    setBookingDetails(prevDetails => ({
      ...prevDetails,
      ...details,
    }));
  };

  useEffect(() => {
    console.log("Booking Details: ", bookingDetails);
  }, [bookingDetails]);

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Geolocation Permission",
          message: "Can we access your location?",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );
      if (granted === "granted") {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      return false;
    }
  };

  const getLocation = () => {
    const result = requestLocationPermission();
    result.then(res => {
      if (res) {
        Geolocation.getCurrentPosition(
          position => {
            setLocationSharingEnabled(true);
            setLocation(position["coords"]);
            setCurrentUserLocation(position["coords"]);
          },
          error => {
            setLocationSharingEnabled(false);
          },
          {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000}
        );
      }
      // setLocationSharingEnabled(true);
      // setLocation({"accuracy": 20, "altitude": 32, "altitudeAccuracy": 2.132702112197876, "heading": 0, "latitude": 8.7504607, "longitude": 76.9356233, "speed": 0})
    });
  };

  useEffect(() => {
    setLocationSharingEnabled(false);
    getLocation();
  }, []);

  function getParkAreasWithinDistance(latitude, longitude, dist, parkAreas) {
    let filtered = parkAreas.filter(parkArea => {
      const distance = getDistanceFromLatLonInKm(
        latitude,
        longitude,
        parkArea.location.latitude,
        parkArea.location.longitude
      );
      return distance <= dist;
    });
    return filtered.sort((a, b) => a.distance - b.distance);
  }

  return (
    <ParkingContext.Provider
      value={{
        locationSharingEnabled,
        getLocation,
        location,
        bookingDetails,
        updateBookingDetails,
        parkAreas,
        searchLocation,
        setSearchLocation,
        suggestedParkAreas,
        fetchSuggestedParkAreas,
        resetSuggestedParkAreas,
        setSuggestedParkAreas,
        isLoading,
        updateSelectedParkArea,
        resetSelectedParkArea,
        fetchAllParkAreas,
        currentUserLocation,

        bookParkSpace,
      }}
    >
      {children}
    </ParkingContext.Provider>
  );
};

export const useParkingDetails = () => useContext(ParkingContext);
