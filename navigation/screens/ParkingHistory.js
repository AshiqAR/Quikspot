import React, { useState, useCallback } from "react";
import { ScrollView, Button, FlatList } from 'react-native';
import tw, { style } from 'twrnc'


import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    SafeAreaView,
    Keyboard,
    Pressable,
    TextInput,
    Alert,
} from "react-native";

const history = [
    {
        location: "Kallara",
        date: "12/12/2021",
        time: "12:00 PM",
        duration: "2 hours",
        price: "Rs. 20"
    },
    {
        location: 'Alathanpara',
        date: "12/12/2021",
        time: "12:00 PM",
        duration: "2 hours",
        price: "Rs. 20"
    },
    {
        location: 'Trivandrum',
        date: "12/12/2021",
        time: "12:00 PM",
        duration: "2 hours",
        price: "Rs. 20"
    },
]

const ParkingHistory = ({ navigation, route }) => {
    return (
            <SafeAreaView style={styles.safeArea}>
                <Text style={styles.heading}>Your Parking History</Text>
                {/* <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainerStyle}> */}
                <FlatList style={styles.flatList}
                    data={history}
                    renderItem={({ item }) => (
                        <View style={tw.style(`flex flex-row justify-between items-center border-b border-[#B8C6DB] py-[24px] px-[21px] w-full`)}>
                            <Text style={tw.style(`text-[#4E4D4D] text-[18px] font-medium`)}>{item.location}</Text>
                            <View style={tw.style(`flex flex-col items-end`)}>
                                <Text style={tw.style(`text-[#4E4D4D] text-[12px] font-light`)}>{item.date}</Text>
                                <Text style={tw.style(`text-[#4E4D4D] text-[12px] font-light`)}>{item.time}</Text>
                            </View>
                        </View>
                    )}
                />
                {/* </ScrollView> */}
            </SafeAreaView>


    );
};


export const styles = StyleSheet.create({
    heading: {
        fontSize: 24,
        fontWeight: '900',
        color: "#4E4D54",
        marginVertical: 16,
        marginLeft: 16
    },
    safeArea: {
        flex: 1,
        backgroundColor: 'white',
        position: 'relative',
    },

    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: "flex-start",
        padding: 16,
    },
    ownerImage: {
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: "red",
        marginBottom: 25
    },
    card: {
        display: 'flex',
        backgroundColor: 'white',
        borderRadius: 13,
        elevation: 3,
        shadowColor: 'skyblue',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        padding: 16,
        width: '100%',
        marginVertical: 10,
    },
    formItem: {
        marginBottom: 16,
        align: "left"
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    label1: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 16,

    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        padding: 4,
    },
    button: {
        backgroundColor: 'green',
        borderRadius: 4,
        paddingVertical: 12,
        paddingHorizontal: 24,
        alignItems: 'center',
    },
});



export default ParkingHistory;
