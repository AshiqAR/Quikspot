import {View, Text, Pressable} from "react-native";
import React, {useEffect} from "react";
import RentYourSpaceCard from "../components/RentYourSpaceCard";
import TypeOfParkSpaceCard from "../components/TypeOfParkSpaceCard";
import Icon from "react-native-vector-icons/Ionicons";
import {useAuth} from "../context/AuthContext";
import {useFocusEffect} from "@react-navigation/native";

export default function RentParkSpace({navigation, route}) {
  const {user} = useAuth();
  const [underVerification, setUnderVerification] = React.useState(false);

  // Use useFocusEffect to run side-effects when the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      // Check if the park area is under verification when the screen is focused
      const isUnderVerification = user.parkAreaUnderVerification !== null;
      setUnderVerification(isUnderVerification);

      // Return a cleanup function to avoid side effects if the component unmounts
      return () => {};
    }, [user.parkAreaUnderVerification]) // Ensure effect runs when user.parkAreaUnderVerification changes
  );

  const handleNextPress = () => {
    navigation.navigate("Screen1");
  };

  return (
    <View
      style={{
        flex: 1,
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "white",
      }}
    >
      <RentYourSpaceCard
        underVerification={underVerification}
        setUnderVerification={setUnderVerification}
      />
      {!underVerification && (
        <>
          <TypeOfParkSpaceCard />

          <View
            style={{alignItems: "center", justifyContent: "center", height: 70}}
          >
            <View style={{borderRadius: 10, overflow: "hidden"}}>
              <Pressable
                style={{
                  backgroundColor: "black",
                  borderRadius: 10,
                  height: 50,
                  width: 400,
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexDirection: "row",
                  paddingHorizontal: 30,
                }}
                android_ripple={{color: "gray", borderless: false}}
                onPress={handleNextPress}
              >
                <Text
                  style={{color: "white", fontSize: 20, textAlign: "center"}}
                >
                  Yes im in
                </Text>
                <Icon
                  name="arrow-forward-circle-outline"
                  size={30}
                  color={"white"}
                ></Icon>
              </Pressable>
            </View>
          </View>
        </>
      )}
    </View>
  );
}
