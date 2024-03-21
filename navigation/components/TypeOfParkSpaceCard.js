import { View, Text, Pressable } from 'react-native'
import React from 'react'

export default function TypeOfParkSpaceCard() {
  return (
        <View style={{ borderRadius: 15, margin: 20, marginTop: 20, overflow: 'hidden' }}>
            <View
                style={{
                    padding: 20,
                    justifyContent: 'space-between',
                    backgroundColor: '#EEEEEE',
                    borderRadius: 15,
                    height: 400,
                    elevation: 5,
                    shadowColor: 'gray',
                    shadowOffset: { width: 1, height: 5 },
                    shadowOpacity: 0.5,
                    shadowRadius: 3.84,
                }}
            >
                <Text style={{ color: 'black', fontSize: 20, fontWeight: 'bold' }}>Rent Your Space Title</Text>
                <View>
                    <Text>Which types of parkspaces can be added</Text>
                    <Text>Carousal display</Text>
                    <Text>Moving between the images and data</Text>
                </View>
            </View>
        </View>
    )
}