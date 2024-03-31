import React, {createContext, useContext, useState, useEffect} from "react";
import {useAuth} from "./AuthContext";

const RentASpaceContext = createContext();

export const RentASpaceProvider = ({children}) => {
  const {user} = useAuth();

  const initialParkAreaDetails = {
    name: "",
    phoneNumber: user.phoneNumber,
    alternatePhoneNumber: "",
    parkSpaceName: "",
    email: "",
    address: "",
    street: "",
    city: "",
    district: "",
    state: "",
    pincode: "",
    estimatedCapacity: "",
    expectedPricePerHour: "",
    parkSpaceType: "",
    facilitiesAvailable: [
      {name: "CCTV", value: false},
      {name: "Security Guard", value: false},
      {name: "EV Charging", value: false},
      {name: "Parking Attendant", value: false},
      {name: "Drinking Water", value: false},
    ],
    location: {},
    images: [],
    document: [],
  };

  const [parkAreaDetails, setParkAreaDetails] = useState(
    initialParkAreaDetails
  );

  const resetUserDetails = () => {
    setParkAreaDetails(initialParkAreaDetails);
  };

  const updateDetails = (field, value) => {
    setParkAreaDetails(prevDetails => ({
      ...prevDetails,
      [field]: value,
    }));
  };

  const updateImages = images => {
    setParkAreaDetails(prevDetails => ({
      ...prevDetails,
      images: images,
    }));
  };

  const updateDocument = document => {
    if (document.length == 0) {
      setParkAreaDetails(prevDetails => ({
        ...prevDetails,
        documents: [],
      }));
    } else {
      setParkAreaDetails(prevDetails => ({
        ...prevDetails,
        documents: [document],
      }));
    }
  };

  const updateLocation = location => {
    setParkAreaDetails(prevDetails => ({
      ...prevDetails,
      location: location,
    }));
  };

  const addItemToArray = (arrayName, item) => {
    setParkAreaDetails(prevDetails => ({
      ...prevDetails,
      [arrayName]: [...prevDetails[arrayName], item],
    }));
  };

  const updateParkAreaDetails = {
    updateDetails,
    resetUserDetails,
    updateLocation,
  };

  return (
    <RentASpaceContext.Provider
      value={{
        parkAreaDetails,
        updateParkAreaDetails,
        updateImages,
        updateDocument,
      }}
    >
      {children}
    </RentASpaceContext.Provider>
  );
};

export const useRentASpaceContext = () => useContext(RentASpaceContext);
