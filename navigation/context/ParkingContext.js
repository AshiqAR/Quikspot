import React, {createContext, useContext, useEffect, useState} from "react";
import {PermissionsAndroid, Linking} from "react-native";
import {check, request, PERMISSIONS, RESULTS} from "react-native-permissions";
import {getDistanceFromLatLonInKm} from "../utilities/utils";
import Geolocation from "react-native-geolocation-service";
import parkAreas from "../utilities/parkAreas";
import useCloseWithIndicator from "../customHooks/useCloseWithIndicator";

const ParkingContext = createContext();

export const ParkingDataProvider = ({children}) => {
  const [locationSharingEnabled, setLocationSharingEnabled] = useState(false);
  const [location, setLocation] = useState(null); // users location
  const [bookingDetails, setBookingDetails] = useState({}); // {parkSpaceId, vehicleId, startTime, endTime
  const [searchLocation, setSearchLocation] = useState(null); // location to search for park areas
  const [suggestedParkAreas, setSuggestedParkAreas] = useState([]);
  const [selectedParkArea, setSelectedParkArea] = useState(null);

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
      // Simulate fetching suggested park areas with a 4-second delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      setSuggestedParkAreas(
        getParkAreasWithinDistance(
          searchLocation.location.latitude,
          searchLocation.location.longitude,
          1,
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

  const NavigateToParkArea = (latitude, longitude) => {
    Linking.openURL(
      `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=driving&dir_action=navigate`
    );
  };

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
    return parkAreas.filter(parkArea => {
      const distance = getDistanceFromLatLonInKm(
        latitude,
        longitude,
        parkArea.coords.latitude,
        parkArea.coords.longitude
      );
      return distance <= dist;
    });
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
        NavigateToParkArea,
        searchLocation,
        setSearchLocation,
        suggestedParkAreas,
        fetchSuggestedParkAreas,
        resetSuggestedParkAreas,
        setSuggestedParkAreas,
        isLoading,
        updateSelectedParkArea,
        resetSelectedParkArea,
      }}
    >
      {children}
    </ParkingContext.Provider>
  );
};

export const useParkingDetails = () => useContext(ParkingContext);
