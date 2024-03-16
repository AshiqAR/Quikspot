import React, { useState, useEffect } from "react";
import { styles } from '../styles/homeStyles'
import { useLocation } from "../context/LocationContext";
import EventSource from 'react-native-event-source';
import axios from "axios";
import { mapStyle } from "../data/mapStyles";
import MapView, { Marker } from 'react-native-maps';

import {
	View,
	Image,
	TouchableOpacity,
	Text,
	Pressable,
} from "react-native";
const profileIcon = require("../assets/images/userLogo.png");
const markerIcon = require("../assets/images/parkSpace.png");

const HomeScreen = ({ navigation, route }) => {
	const { locationSharingEnabled, getLocation } = useLocation();
	return (
		<>
			<View style={styles.con}>
				<View>
					<TouchableOpacity
						style={styles.topacity}
						onPress={() => navigation.navigate("Profile")}
					>
						<Image
							source={profileIcon}
							style={styles.userLogo}
						/>
					</TouchableOpacity>
				</View>
			</View>
			<View style={styles.container}>
				{!locationSharingEnabled && (
					<Pressable
						style={{ backgroundColor: 'lightyellow', height: 30, alignItems: 'center', justifyContent: "space-evenly", flexDirection: 'row' }}
						onPress={ () => { getLocation(); }}
					>
						<Text style={{ color: 'black', fontWeight: 400 }}>
							Location Sharing Disabled. Tap here to enable
						</Text>
						<Text style={{ color: 'orange', fontWeight: 'bold' }}>Enable</Text>
					</Pressable>
				)}
				<MapView
					style={styles.mapStyle}
					initialRegion={{
						latitude: 8.546133,
						longitude: 76.906665,
						latitudeDelta: 0.005,
						longitudeDelta: 0.0025,
					}}
					customMapStyle={mapStyle}>
				</MapView>
			</View>
		</>
	);
}

export default HomeScreen;


