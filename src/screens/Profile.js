import React, { Children } from "react";
import {
    Text,
    View,
    SafeAreaView,
    Image,
    ScrollView,
    TouchableWithoutFeedback,
    TouchableOpacity,
    Animated,
} from "react-native";
import { useState, useEffect } from "react";
import { styles } from "../styles/profileStyles";
import { useRoute } from '@react-navigation/native';
import tw from 'twrnc'
import { Path, Svg } from "react-native-svg";
import { useAuth } from '../context/AuthContext';
import { useLocation } from "../context/LocationContext";

const parkingHistoryIcon = require("../assets/images/parkingHistory.png");
const vehicleDetailsIcon = require("../assets/images/vehicleDetails.png");
const manageParkingSpacesIcon = require("../assets/images/manageParkingSpaces.png");
const settingsIcon = require("../assets/images/settings.png");

const ExpandableView = ({ expanded = false }) => {
    const [height] = useState(new Animated.Value(0));

    useEffect(() => {
        Animated.timing(height, {
            toValue: expanded ? height : 0,
            duration: 150,
            useNativeDriver: false,
        }).start();
    }, [expanded]);

    console.log('rerendered');
    return (
        <Animated.View
            style={{ height, backgroundColor: "orange" }}
        >
        </Animated.View>
    );
};

const ProfilePage = ({ navigation }) => {
    const { signOut, user } = useAuth();
    const { name, address, phonenumber, email, pincode } = user;
    const totalBookings = "5";
    const [isExpanded, setIsExpanded] = useState(false);


    const logout = () => {
        signOut();
    };

    const addMyParkingSpace = () => {
        navigation.navigate("BeParkSpaceProvider");
    };
    const moveTopage = (page) => {
        navigation.navigate(page)
    };
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={tw.style(`flex-1`)} contentContainerStyle={styles.contentContainerStyle}>
                <TouchableOpacity
                    activeOpacity={0.6}
                    style={
                        !isExpanded
                            ?
                            tw.style(`rounded-[24px] w-full bg-[#F5B10130] mt-4 relative flex flex-row items-center pt-[16px] pb-[24px] px-[21px]`)
                            :
                            tw.style(`rounded-[24px] w-full bg-[#F5B10130] mt-4 relative flex flex-col items-center pt-[16px] pb-[24px] px-[21px]`)
                    }
                    onPress={() => setIsExpanded(!isExpanded)}
                >
                    <View style={tw.style(``)}>
                        <Image
                            source={require('../assets/images/userLogo.png')}
                            style={tw.style(`w-[50px] h-[50px]`)}

                        />
                    </View>
                    <View style={tw.style(`flex flex-col justify-between ml-[18px]`)}>
                        <Text style={tw.style(`text-[#242424] text-[18px] font-medium`)}>{name}</Text>
                        <Text style={tw.style(`text-[#515151] text-[14px] font-light`)}>{email}</Text>
                        {isExpanded && (
                            <>
                                <Text style={tw.style(`text-[#515151] text-[14px] font-light`)}>{pincode}</Text>
                                <Text style={tw.style(`text-[#515151] text-[14px] font-light`)}>{address}</Text>
                                <Text style={tw.style(`text-[#515151] text-[14px] font-light`)}>{phonenumber}</Text>
                            </>
                        )}
                    </View>
                    <TouchableWithoutFeedback>
                        <View style={tw.style(`absolute top-4 right-4`)}>
                            <TouchableOpacity
                                onPress={() => moveTopage("EditProfile")}
                            >
                                <Svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 20 20" fill="none">
                                    <Path d="M2.5 8.33333H11.6667V10H2.5V8.33333ZM2.5 6.66667H11.6667V5H2.5V6.66667ZM2.5 13.3333H8.33333V11.6667H2.5V13.3333ZM15.0083 10.725L15.6 10.1333C15.6771 10.0561 15.7687 9.99479 15.8695 9.95297C15.9703 9.91115 16.0784 9.88963 16.1875 9.88963C16.2966 9.88963 16.4047 9.91115 16.5055 9.95297C16.6063 9.99479 16.6979 10.0561 16.775 10.1333L17.3667 10.725C17.6917 11.05 17.6917 11.575 17.3667 11.9L16.775 12.4917L15.0083 10.725ZM14.4167 11.3167L10 15.7333V17.5H11.7667L16.1833 13.0833L14.4167 11.3167Z" fill="#242424" />
                                </Svg>
                            </TouchableOpacity>
                        </View>
                    </TouchableWithoutFeedback>
                </TouchableOpacity>

                <View style={tw.style(`mt-[28px]`)}>
                    <TouchableWithoutFeedback onPress={() => moveTopage("ParkingHistory")}>
                        <View style={tw.style(`flex flex-row justify-between items-center border-b border-[#B8C6DB] py-[24px] px-[12px] w-full`)}>
                            <Image source={parkingHistoryIcon} style={{ width: 30, height: 30, borderRadius: 50 }}
                            ></Image>
                            <Text style={tw.style(`text-[#4E4D4D] text-[18px] font-medium`)}>My Previous Parkings</Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => moveTopage("VehicleDetails")}>
                        <View style={tw.style(`flex flex-row justify-between items-center border-b border-[#B8C6DB] py-[24px] px-[12px] w-full`)}>
                            <Image source={vehicleDetailsIcon} style={{ width: 30, height: 30, borderRadius: 50 }}></Image>
                            <Text style={tw.style(`text-[#4E4D4D] text-[18px] font-medium`)}>Vehicle Details</Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => moveTopage("ManageMyParkingSpaces")}>
                        <View style={tw.style(`flex flex-row justify-between items-center border-b border-[#B8C6DB] py-[24px] px-[12px] w-full`)}>
                            <Image source={manageParkingSpacesIcon} style={{ width: 30, height: 30, borderRadius: 50 }}></Image>
                            <Text style={tw.style(`text-[#4E4D4D] text-[18px] font-medium`)}>Manage My Parking Spaces</Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => moveTopage("Settings")}>
                        <View style={tw.style(`flex flex-row justify-between items-center border-b border-[#B8C6DB] py-[24px] px-[12px] w-full`)}>
                            <Image source={settingsIcon} style={{ width: 30, height: 30 }}></Image>
                            <Text style={tw.style(`text-[#4E4D4D] text-[18px] font-medium`)}>Settings</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>

            </ScrollView>
            <View style={tw.style(`absolute bottom-[24px] left-0 right-0 flex flex-col gap-[10px] px-[24px]`)}>
                <TouchableWithoutFeedback onPress={() => addMyParkingSpace()}>
                    <View style={tw.style(`bg-[#C6D3FF5E] py-[20px] rounded-[7px] border border-[#0011AA] `)}>
                        <Text style={tw.style(`text-[#262628] text-[18px] font-medium text-center`)}>Add My Parking Space</Text>
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => logout()}>
                    <View style={tw.style(`bg-[#FB6D6D17] py-[20px] rounded-[7px] border border-[#FB6D6D] `)}>
                        <Text style={tw.style(`text-[#FF0000] text-[18px] font-medium text-center`)}>Logout</Text>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        </SafeAreaView>
    )
}

export default ProfilePage;
