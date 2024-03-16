import React, { createContext, useContext, useEffect, useState } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import Geolocation from 'react-native-geolocation-service';
import { set } from 'react-hook-form';

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
    const [locationSharingEnabled, setLocationSharingEnabled] = useState(false);
    const [location, setLocation] = useState(null);

    const requestLocationPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: 'Geolocation Permission',
                    message: 'Can we access your location?',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                },
            );
            console.log('granted', granted);
            if (granted === 'granted') {
                console.log('You can use Geolocation');
                return true;
            } else {
                console.log('You cannot use Geolocation');
                return false;
            }
        } catch (err) {
            return false;
        }
    };

    const getLocation = () => {
        const result = requestLocationPermission();
        result.then(res => {
            console.log('res is:', res);
            if (res) {
                Geolocation.getCurrentPosition(
                    position => {
                        console.log(position);
                        setLocationSharingEnabled(true);
                        setLocation(position['coords']);
                    },
                    error => {
                        console.log(error.code, error.message);
                        setLocationSharingEnabled(false);
                    },
                    { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
                );
            }
        });
    };

    useEffect(() => {
        setLocationSharingEnabled(false);
        getLocation();
    }, []);

    return (
        <LocationContext.Provider value={{ locationSharingEnabled, getLocation, location }}>
            {children}
        </LocationContext.Provider>
    );
};

export const useLocation = () => useContext(LocationContext);
