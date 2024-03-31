import React, {createContext, useContext, useEffect, useState} from "react";
import axios from "axios";
import {Alert} from "react-native";
import backendUrls from "../connections/backendUrls";
import {useAuth} from "./AuthContext";

const UserParkSpaceContext = createContext();

export const UserParkSpacesProvider = ({children}) => {
  const {user} = useAuth();
  const [userParkSpaces, setUserParkSpaces] = useState([]);

  const fetchParkSpaces = async () => {
    if (!user?._id) {
      Alert.alert("Error", "User ID is not available");
      return;
    }

    try {
      const response = await axios.post(backendUrls.getMyParkSpacesURL, {
        userId: user._id,
      });
      if (response.data?.success) {
        setUserParkSpaces(response.data.parkAreas);
        console.log(response.data.parkAreas);
      } else {
        Alert.alert(
          "Error",
          response.data.message || "Failed to fetch park spaces"
        );
      }
    } catch (error) {
      console.error(error);
      Alert.alert(
        "Error",
        "Cannot fetch your park spaces due to a network or server issue"
      );
    }
  };

  return (
    <UserParkSpaceContext.Provider value={{userParkSpaces, fetchParkSpaces}}>
      {children}
    </UserParkSpaceContext.Provider>
  );
};

export const useUserParkSpaces = () => useContext(UserParkSpaceContext);
