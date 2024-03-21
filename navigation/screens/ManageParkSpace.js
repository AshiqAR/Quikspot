import React, { useEffect } from 'react';
import { View, Text, Pressable, ActivityIndicator, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { useUserParkSpacesContext } from '../context/UserParkSpacesContext';

export default function ManageParkSpace({ navigation}) {
	const { userParkSpaces, fetchParkSpaces } = useUserParkSpacesContext();
	const [refreshing, setRefreshing] = React.useState(false);

	useEffect(() => {
		const initializeParkSpaces = async () => {
			setRefreshing(true);
			await fetchParkSpaces();
			setRefreshing(false);
		};

		initializeParkSpaces();
	}, [fetchParkSpaces]);

	const onRefresh = React.useCallback(async () => {
		setRefreshing(true);
		await fetchParkSpaces();
		setRefreshing(false);
	}, [fetchParkSpaces]);

	const renderParkSpace = ({ item: space }) => (
		<Pressable
			style={[styles.spaceContainer]}
			onPress={() => navigation.navigate('ParkSpaceDetails', { space })}
		>
			<Text style={styles.spaceName}>{space.details.name}</Text>
			<Text>Address: {space.details.address}, {space.details.city}</Text>
			<Text>Current Price Per Hour: {'	\u20B9'} {space.price}</Text>
			<Text>Available Slots: {space.freeSlots} / {space.numSlots}</Text>
		</Pressable>
	);

	if (refreshing) {
		return (
			<View style={styles.centered}>
				<Text style={{ fontSize: 18, marginVertical: 10 }}>Fetching Your Park Space Details...</Text>
				<ActivityIndicator size="large" color="black" />
			</View>
		);
	}

	return (
		<View style={{ flex: 1 }}>
			<FlatList
				data={userParkSpaces}
				keyExtractor={(item) => item.id.toString()}
				renderItem={renderParkSpace}
				ListEmptyComponent={<Text style={styles.noSpacesText}>No park spaces available.</Text>}
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={onRefresh}
					/>
				}
			/>
		</View>
	);
}


const styles = StyleSheet.create({
	centered: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	spaceContainer: {
		backgroundColor: '#fff',
		paddingVertical: 20,
		paddingHorizontal: 25,
		marginVertical: 5,
		marginHorizontal: 12,
		borderRadius: 5,

		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,

		elevation: 5,
	},
	spaceName: {
		fontSize: 18,
		fontWeight: 'bold',
		marginBottom: 10,
		color: '#333',
	},
	text: {
		fontSize: 16,
		color: '#333',
		marginBottom: 8,
	},
	noSpacesText: {
		textAlign: 'center',
		marginVertical: 20,
		fontSize: 20,
		color: '#666',
		fontWeight: 'bold',
	},
});
