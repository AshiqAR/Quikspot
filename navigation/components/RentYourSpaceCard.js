import { View, Text, Pressable } from 'react-native'
import React from 'react'

export default function RentYourSpaceCard({ underVerification, setUnderVerification }) {
    return (
        <View style={{ borderRadius: 15, margin: 20, marginTop: 20, overflow: 'hidden' }}>
            <Pressable
                onPress={() => setUnderVerification(!underVerification)}
            >

                {underVerification ? (
                    <View
                        style={{
                            padding: 20,
                            justifyContent: 'space-between',
                            backgroundColor: 'tomato',
                            borderRadius: 15,
                            height: 200,
                            elevation: 5,
                            shadowColor: 'gray',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.25,
                            shadowRadius: 3.84,
                        }}
                    >
                        <Text style={{fontSize: 30, fontWeight: 'bold', color: 'black'}}>Currently under verification</Text>
                        <Text>Address under verification</Text>
                        <Text style={{fontSize: 15}}>QuikSpot Team will be contacting you shortly...</Text>
                    </View>
                ) : (
                    <View
                        style={{
                            padding: 20,
                            justifyContent: 'space-between',
                            backgroundColor: '#EEEEEE',
                            borderRadius: 15,
                            height: 200,
                            elevation: 5,
                            shadowColor: 'gray',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.25,
                            shadowRadius: 3.84,
                        }}
                    >
                        <Text style={{ color: 'black', fontSize: 20, fontWeight: 'bold' }}>Rent Your Space Title</Text>
                        <View>
                            <Text>Be a park space provider with quikspot...</Text>
                            <Text>Who can join</Text>
                            <Text>Why you should join</Text>
                        </View>
                    </View>
                )}
            </Pressable>
        </View>
    )
}