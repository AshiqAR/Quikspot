import React, { useEffect, useCallback, useState } from 'react';
import { View, ScrollView, TextInput, PermissionsAndroid, Platform, Button, Image, Text, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { set, useForm } from 'react-hook-form';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ImagePickerComponent from '../components/ImagePicker';
import { style } from 'twrnc';
const currLocationPng = require('../assets/images/currentLocation.png');
import DocumentPicker from 'react-native-document-picker';
import Geolocation from 'react-native-geolocation-service';

const BeParkSpaceProvider = () => {
    const { register, handleSubmit, setValue } = useForm();
    const [isRegistered, setIsRegistered] = useState(false);
    const [selectedOption, setSelectedOption] = useState('Home Parking');
    const [pdfFile, setPdfFile] = useState(null);

    const onSubmit = useCallback((formData) => {
        console.log(formData);
        setIsRegistered(true);
    }, []);

    const onChangeField = useCallback((name) => (text) => {
        setValue(name, text);
    }, []);

    useEffect(() => {
        register('parkSpaceName');
        register('pincode');
        register('city');
        register('district');
        register('state');
        register('selectedOption');
    }, [register]);

    const onChangeSelectedOption = useCallback((option) => {
        setSelectedOption(option);
        setValue('selectedOption', option);
    }, [setValue]);

    const handleFileUpload = async () => {
        try {
            // Opening Document Picker to select one file
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.pdf],
            });
            setPdfFile(res[0]);
            console.log(
                res[0].uri,
                res[0].type,
                res[0].name,
                res[0].size
            );

        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                // User cancelled the picker
                console.log('User cancelled the document picker');
            } else {
                // Handle any errors
                Alert.alert('Error', 'An error occurred while picking the file.');
                console.error(err);
            }
        }
    };

    const truncateFileName = (fileName, maxLength) => {
        if (fileName.length <= maxLength) {
            return fileName;
        }
        const baseName = fileName.replace('.pdf', '');
        return `${baseName.substring(0, maxLength - 4)}_.pdf`;
    };

    const [location, setLocation] = useState(false);
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
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log('You can use Geolocation');
                return true;
            } else {
                console.log('Geolocation permission denied');
                return false;
            }
        } catch (err) {
            console.warn('PermissionsAndroid.request error:', err);
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
                        setLocation(position);
                    },
                    error => {
                        // See error code charts below.
                        console.log(error.code, error.message);
                        setLocation(false);
                    },
                    { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
                );
            }
        });
        console.log(location);
    };


    const RadioComponent = ({ selectedValue, onChangeOption }) => {

        const options = ['Dedicated Parking Spaces', 'Home Parking', 'Open Space Parking'];

        return (
            <View style={{ flex: 1, flexDirection: 'row', height: 100, justifyContent: 'space-between', marginTop: 10 }}>
                {options.map((option) => (
                    <TouchableOpacity
                        key={option}
                        style={selectedValue === option ? styles.radioSelected : styles.radio}
                        onPress={() => onChangeOption(option)}
                    >
                        <Text style={{ color: 'black', fontSize: 14, fontWeight: '600' }}>{option}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        );
    };


    return (
        <SafeAreaView style={styles.container}>
            <View style={{ width: '100%', paddingLeft: 20 }}>
                <Text style={styles.title}>Your Park Space Details</Text>
            </View>
            <ScrollView
                contentContainerStyle={styles.contentContainer}
            >
                <Text style={styles.label}>Park Space Name:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Park space name"
                    onChangeText={onChangeField('parkSpaceName')}
                />

                <Text style={styles.label}>City: </Text>
                <TextInput
                    style={styles.input}
                    textContentType="addressCity"
                    placeholder="City"
                    onChangeText={onChangeField('city')}
                />

                <Text style={styles.label}>District: </Text>
                <TextInput
                    style={styles.input}
                    placeholder="District"
                    onChangeText={onChangeField('district')}
                />

                <Text style={styles.label}>State: </Text>
                <TextInput
                    style={styles.input}
                    textContentType="addressState"
                    placeholder="State"
                    onChangeText={onChangeField('state')}
                />

                <Text style={styles.label}>Pincode:</Text>
                <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    textContentType="postalCode"
                    placeholder="Pincode"
                    onChangeText={onChangeField('pincode')}
                />

                <Text style={styles.label}>Type of Park Space:</Text>
                <RadioComponent
                    selectedValue={selectedOption}
                    onChangeOption={onChangeSelectedOption}
                />
                <Text style={styles.label}>Sample Images</Text>
                <ImagePickerComponent></ImagePickerComponent>

                <Text style={styles.label}>Document Upload</Text>
                {pdfFile ?
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderColor: 'gray', borderWidth: 0.5, padding: 10, marginVertical: 10 }}>
                        <Text style={{ color: 'black', fontWeight: 'bold' }}>{truncateFileName(pdfFile.name, 25)} ({Math.round(pdfFile.size / (1024))}kB)</Text>
                        <TouchableOpacity
                            style={{ backgroundColor: 'lightgray', width: 30, height: 30, borderRadius: 100, alignItems: 'center', justifyContent: 'center' }}
                            onPress={() => setPdfFile(null)}
                        >
                            <Text style={{ fontSize: 15, fontWeight: 'bold' }}>X</Text>
                        </TouchableOpacity>
                    </View>
                    :
                    <TouchableOpacity
                        style={{ flex: 1, flexDirection: 'row', alignItems: 'center', marginVertical: 10, borderRadius: 5, padding: 10, backgroundColor: 'lightgray' }}
                        onPress={handleFileUpload}
                    >
                        <Text style={{ fontSize: 15, color: 'black', fontWeight: '500' }}>Upload PDF File (Ownership Proof)</Text>
                    </TouchableOpacity>}

                <Text style={styles.label}>Park Space Location: </Text>
                <TouchableOpacity
                    style={{ flex: 1, flexDirection: 'row', alignItems: 'center', marginBottom: 10, borderRadius: 5, padding: 10, backgroundColor: 'lightgray' }}
                    onPress={getLocation}
                >
                    <Text style={{ fontSize: 15, color: 'black', fontWeight: '500' }}>Fetch My Current Location</Text>
                    <Image source={currLocationPng} style={{ width: 20, height: 20 }} />
                </TouchableOpacity>

                <TouchableOpacity onPress={handleSubmit(onSubmit)} style={styles.submitButton}>
                    <Text style={{ color: 'white', textAlign: 'center', fontSize: 20 }}>Submit For Verification</Text>
                </TouchableOpacity>

                {isRegistered && <Text style={styles.successText}>Submission Successful!</Text>}

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        height: '100%',
        backgroundColor: 'white',
    },
    contentContainer: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    title: {
        fontSize: 24,
        fontWeight: '900',
        marginBottom: 20,
        color: 'black',
    },
    label: {
        fontSize: 14,
        marginVertical: 4,
        alignSelf: 'flex-start'
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 20, // Increased margin between boxes
        width: '100%', // Shortened width
        borderRadius: 4,
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'Roboto',
    },
    submitButton: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#407BFF',
        padding: 10,
        height: 50,
        borderRadius: 100,
        width: 300,
        alignSelf: 'center',
        marginTop: 20,
    },
    successText: {
        color: 'green',
        marginTop: 10,
        fontSize: 17,
        alignSelf: 'center',
    },
    radio: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 20, // Increased margin between boxes
        width: 110, // Shortened width
        height: 80,
        borderRadius: 10,
        fontSize: 16,
        fontWeight: 'bold',
        justifyContent: 'center',
        backgroundColor: 'lightgray',
    },
    radioSelected: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 20, // Increased margin between boxes
        width: 110, // Shortened width
        height: 80,
        borderRadius: 10,
        fontSize: 16,
        fontWeight: 'bold',
        justifyContent: 'center',
        backgroundColor: 'lightblue',
    },
});

export default BeParkSpaceProvider;