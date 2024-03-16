import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'

const parkArea = [
  {
    id: 1,
    name: 'Sam\'s Parking Space',
    location: '123 Main St',
    price: 10,
    verified: true,
    total_slots: 5,
    available_slots: 3,
    vehicles: [
      { id: 1, make: 'Toyota', model: 'Camry', year: 2015, color: 'black', start_time: '2021-07-01T12:00:00' },
      { id: 2, make: 'Honda', model: 'Civic', year: 2018, color: 'white', start_time: '2021-07-01T12:00:00' }
    ]
  },
  {
    id: 2,
    name: 'Parking Space 2',
    location: '456 Elm St',
    price: 15,
    verified: true,
    total_slots: 3,
    available_slots: 2,
    vehicles: [
      { id: 3, make: 'Ford', model: 'Fusion', year: 2017, color: 'blue', start_time: '2021-07-01T12:00:00' }
    ]
  },
  {
    id: 3,
    name: 'Parking Space 3',
    location: '789 Oak St',
    price: 20,
    verified: false,
    total_slots: 2,
  }
]

const ManageMyParkingSpaces = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>My Parking Spaces</Text>
      {parkArea.length === 0 && <Text style={{ fontSize: 18, textAlign: 'center' }}>No parking spaces found</Text>}
      <ScrollView>
        {parkArea.filter(parkingSpace => parkingSpace.verified)
          .map((parkingSpace, index) => (
            <Pressable
              key={index}
              style={({ pressed }) => [
                { padding: 20, borderBottomWidth: 1, borderBottomColor: 'lightgray', backgroundColor: 'lightgray'},
                pressed ? styles.pressedItem : {backgroundColor: 'white'}
              ]}
              onPress={() =>
                //navigation.navigate('ParkingSpaceDetails', { parkingSpace })
                console.log('pressed', parkingSpace)
              }
            >
              <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{parkingSpace.name}</Text>
              <Text style={{ fontSize: 16 }}>{parkingSpace.location}</Text>
              <Text style={{ fontSize: 16 }}>Total Slots: {parkingSpace.total_slots}</Text>
              <Text style={{ fontSize: 16 }}>Available Slots: {parkingSpace.available_slots}</Text>
            </Pressable>
          ))}

        {parkArea.filter(parkingSpace => !parkingSpace.verified)
          .map((parkingSpace, index) => (
            <Pressable
              key={index}
              style={({ pressed }) => [
                { padding: 20, borderBottomWidth: 1, borderBottomColor: 'lightgray', backgroundColor: 'lightyellow'},
                pressed ? styles.pressedItem : {}
              ]}
              onPress={() =>
                //navigation.navigate('ParkingSpaceDetails', { parkingSpace })
                Alert.alert('Parking Space is currently under Verification', 'Please check back later')
              }
            >
              <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{parkingSpace.name}</Text>
              <Text style={{ fontSize: 16 }}>{parkingSpace.location}</Text>
              <Text style={{ fontSize: 18, color: 'red'}}>Under Verification</Text>
            </Pressable>
          ))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 20,
    color: 'darkred',
    backgroundColor: 'white',
  }
});

export default ManageMyParkingSpaces;