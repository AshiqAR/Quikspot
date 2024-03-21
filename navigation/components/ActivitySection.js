import { View, Text, Pressable } from 'react-native'
import React from 'react'
import useCloseWithIndicator from '../customHooks/useCloseWithIndicator';


function waitForRandomTime(maxTime = 1500) {
    const randomTime = Math.floor(Math.random() * maxTime);

    return new Promise((resolve) => {
        setTimeout(resolve, randomTime);
    });
}

export default function ActivitySection({ navigation, isScrolling }) {

    const [handleYourActivityClick, isLoading] = useCloseWithIndicator(async () => {
        console.log('Close account');
        if(!isScrolling) {
            await waitForRandomTime(500);
            navigation.navigate('Activity');
        }
    });

    return (
        <View style={{ borderRadius: 15, margin: 20, marginTop: 5, overflow: 'hidden' }}>
            <Pressable
                style={{
                    padding: 20,
                    justifyContent: 'space-between',
                    backgroundColor: '#efefef',
                    borderRadius: 15,
                    height: 100,
                    elevation: 5,
                    shadowColor: 'black',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                }}

                android_ripple={{ color: 'gray', borderless: false }}
                onPress={handleYourActivityClick}
            >
                <Text style={{ color: 'black', fontSize: 20, fontWeight: 'bold' }}>Your Activity</Text>
                <View>
                    <Text>View your past and active bookings</Text>
                </View>
            </Pressable>
        </View>
    )
}