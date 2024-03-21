import React, { useState, useEffect, useRef } from 'react';
import { View, Pressable, StyleSheet, Text, Alert, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useAuth } from '../context/AuthContext';
import MapView from 'react-native-maps';
import { mapStyle } from '../utilities/mapStyles';
import CustomUserLocationMarker from '../components/CurrentLocationMarker';
import ParkAreaMarker from '../components/ParkAreaMarker';
import parkAreas from '../utilities/parkAreas';
import { useParkingDetails } from '../context/ParkingContext';



export default function Home({ navigation }) {
	const { user } = useAuth();
	const { locationSharingEnabled, getLocation, location } = useParkingDetails();

	const mapViewRef = useRef(null);

	const [mapRegion, setMapRegion] = useState({
		latitude: 8.546133,
		longitude: 76.906665,
		latitudeDelta: 0.01,
		longitudeDelta: 0.005,
	});

	useEffect(() => {
		if (locationSharingEnabled && location && mapViewRef.current) {
			mapViewRef.current.animateToRegion({
				latitude: location.latitude,
				longitude: location.longitude,
				latitudeDelta: 0.005,
				longitudeDelta: 0.0025,
			}, 1500);
		}
	}, [locationSharingEnabled, location]);

	const handleSearchForParkingSpace = () => {
		if (user.walletBalance < 100) {
			Alert.alert('Insufficient balance', 'You need at least 100 in your wallet to search for a parking space.');
			return;
		}
		navigation.navigate('SelectVehicle');
	};

	return (
		<View style={styles.container}>
			{!locationSharingEnabled && (
				<Pressable
					style={{ backgroundColor: 'lightyellow', height: 30, alignItems: 'center', justifyContent: "space-evenly", flexDirection: 'row' }}
					onPress={getLocation}
				>
					<Text style={{ color: 'black', fontWeight: 400 }}>
						Location Sharing Disabled. Tap here to enable
					</Text>
					<Text style={{ color: 'orange', fontWeight: 'bold' }}>Enable</Text>
				</Pressable>
			)}
			<MapView
				ref={mapViewRef} // Assign the ref to the MapView
				style={styles.map}
				customMapStyle={mapStyle}
				initialRegion={mapRegion}
			>
				{locationSharingEnabled && location != null &&
					<CustomUserLocationMarker
						latitude={location.latitude}
						longitude={location.longitude}
					/>
				}
				{parkAreas.map((parkArea, index) => (
					<ParkAreaMarker
						key={index}
						index={index}
						coordinate={parkArea.coords}
						title={parkArea.name}
					/>
				))}
			</MapView>
			<View style={styles.searchContainer}>
				<Pressable
					style={styles.searchPressable}
					onPress={handleSearchForParkingSpace}
				>
					<Text style={styles.searchText}>Search For Parking Space</Text>
					<Icon name="parking" size={30} color="#000" />
				</Pressable>
			</View>
		</View>
	);
}



const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#FFFFFF',
	},
	searchContainer: {
		position: 'absolute',
		bottom: 10,
		left: 10,
		right: 10,
		zIndex: 1,
		backgroundColor: 'transparent',
	},
	searchPressable: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 10,
		paddingVertical: 10,
		borderRadius: 15,
		backgroundColor: 'white',
	},
	searchText: {
		fontSize: 18,
		fontWeight: 'bold',
	},
	listItem: {
		padding: 10,
		borderBottomWidth: 1,
		borderBottomColor: '#CCCCCC',
	},
	placeName: {
		fontSize: 18,
	},
	map: {
		flex: 1,
		marginBottom: -70,
	},
	appDetails: {
		// Add any styles for the app details section if needed
	},
	appDetailsText: {
		// Add any styles for the app details text if needed
	},
});
