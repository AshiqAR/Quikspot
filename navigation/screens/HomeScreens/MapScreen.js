import { View, Text } from 'react-native'
import React from 'react'

export default function MapScreen() {
    const handleSearch = (query) => {
        setSearchQuery(query);
        if (query.trim() === '') {
            setFilteredPlaces(PLACE_NAMES);
        } else {
            const filteredData = PLACE_NAMES.filter((place) =>
                place.toLowerCase().includes(query.toLowerCase().trim())
            );
            setFilteredPlaces(filteredData);
        }
    };
    return (
        <View>
            <Text>MapScreen</Text>
        </View>
    )
}