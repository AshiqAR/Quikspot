import React, { useEffect, useState } from 'react'; // Added useState import
import { View, Text, ActivityIndicator, Image, StyleSheet, Button, TouchableOpacity, Alert } from 'react-native'; // Added Alert import
import useLoading from '../customHooks/useLoading';
import * as ImagePicker from 'react-native-image-picker';
import { useAuth } from '../context/AuthContext';

const profileIcon = require("../assets/images/userLogo.png");

const wait1sec = () => new Promise(resolve => setTimeout(() => resolve({ success: true }), 1000)); // Corrected time to 1000 for 1 second

async function fetchData() {
    const result = await wait1sec();
    console.log(result);
}

const EditProfilePage = () => {
    const { user } = useAuth();
    const { isLoading, error, execute } = useLoading(fetchData);
    const [imageUri, setImageUri] = useState(null); // Initialized as null

    const PickImage = () => {
        const options = {
            mediaType: 'photo',
            quality: 1,
            includeBase64: false, // Changed to false since we're not using base64 in this example
            presentationStyle: 'fullscreen',
        };
        ImagePicker.launchImageLibrary(options, (response) => {
            if (response.error) {
                Alert.alert('Error', response.error);
            } else if (response.didCancel) {
                Alert.alert('Error', 'User cancelled image picker');
            } else if (response.assets && response.assets.length > 0) {
                setImageUri(response.assets[0].uri);
            }
        });
    };

    useEffect(() => {
        execute().catch(console.error);
    }, []);

    if (isLoading) {
        return (
            <View style={styles.cont}>
                <ActivityIndicator size={'large'} />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.cont}>
                <Text>Error: {error.message}</Text>
                <Button title="Retry" onPress={() => execute().catch(console.error)} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Edit Profile Details</Text>
            <TouchableOpacity
                onPress={PickImage}
                style={{ alignItems: 'center' }}
            >
                <Image source={imageUri ? { uri: imageUri } : profileIcon} style={styles.profile}></Image>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    cont: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        padding: 10,
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    profile: {
        width: 100,
        height: 100,
        alignSelf: 'center',
        marginTop: 20,
        borderRadius: 50,
    },
});

export default EditProfilePage;
