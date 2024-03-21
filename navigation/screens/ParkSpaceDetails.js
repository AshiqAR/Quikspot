import React, { useLayoutEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ScrollView } from 'react-native';

export default function ParkSpaceDetails({ navigation, route }) {
    const { space } = route.params;

    useLayoutEffect(() => {
        navigation.setOptions({
            title: space.details.name,
            headerTitleStyle: {
                fontWeight: 'bold',
            },
        });
    }, [navigation, space.details.name]);

    // Render each vehicle as a card in the list
    const renderVehicle = ({ item: vehicle }) => (
        <View style={styles.vehicleCard}>
            <Text style={styles.vehicleTextBold}>Vehicle Number: {vehicle.vehicleNumber}</Text>
            <Text style={styles.vehicleText}>Owner: {vehicle.ownerName}</Text>
            <Text style={styles.vehicleText}>Parked Time: {vehicle.parkedTime}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.detailCard}>
                <Text style={styles.sectionTitle}>Space Details</Text>
                <Text style={styles.detailText}>Address: {space.details.address}, {space.details.street}, {space.details.city}</Text>
                <Text style={styles.detailText}>Price: ₹{space.price}</Text>
                <Text style={styles.detailText}>Available Slots: {space.freeSlots} / {space.numSlots}</Text>
                <Text style={styles.detailText}>Today's Earnings: ₹{space.todaysEarnings}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Parked Vehicles</Text>
                {space.parkedVehicleDetails.length > 0 ? (
                    <FlatList
                        data={space.parkedVehicleDetails}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={renderVehicle}
                    />
                ) : (
                    <Text style={styles.noVehicles}>No vehicles parked.</Text>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EFEFEF',
    },
    detailCard: {
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderRadius: 8,
        margin: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    section: {
        margin: 15,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    detailText: {
        fontSize: 16,
        marginBottom: 5,
        color: '#555',
    },
    vehicleList: {
        marginTop: 20,
    },
    vehicleCard: {
        backgroundColor: '#FFFFFF',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    vehicleTextBold: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#333',
    },
    vehicleText: {
        fontSize: 16,
        marginBottom: 5,
        color: '#555',
    },
    noVehicles: {
        fontSize: 16,
        color: '#666',
        marginTop: 20,
        textAlign: 'center',
    },
});
