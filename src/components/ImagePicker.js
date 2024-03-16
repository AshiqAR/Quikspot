import React, { useState } from 'react';
import * as ImagePicker from 'react-native-image-picker'
import { set } from 'react-hook-form';
import { View, Image, Button, StyleSheet, Alert, TouchableOpacity, Text } from 'react-native';

const ImagePickerComponent = () => {
    const [imageUris, setImageUris] = useState([]);

    const handleChoosePhoto = () => {
        const options = {
            mediaType: 'photo',
            quality: 1,
            includeBase64: true,
            presentationStyle: 'fullscreen',
        };

        ImagePicker.launchImageLibrary(options, (response) => {
            if (response.error) {
                Alert.alert('Error', response.error);
            }
            else if (response.didCancel) {
                Alert.alert('Error', 'User cancelled image picker');
            }
            else if (response.assets && response.assets[0].uri) {
                setImageUris(prevUris => [...prevUris, response.assets[0].uri]);
            }
        });
    };

    const handleDeleteImage = (index) => {
        setImageUris(currentUris => currentUris.filter((_, i) => i !== index));
    };

    return (
        <View style={imagePickerStyles.container}>
            <View style={imagePickerStyles.imageContainer}>
                {imageUris.map((uri, index) => (
                    <View key={index} style={imagePickerStyles.imageWrapper}>
                        <Image source={{ uri: uri }} style={imagePickerStyles.image} />
                        <TouchableOpacity
                            style={imagePickerStyles.closeButton}
                            onPress={() => handleDeleteImage(index)}
                        >
                            <Text style={imagePickerStyles.closeButtonText}>X</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
            <TouchableOpacity onPress={handleChoosePhoto} style={imagePickerStyles.choosePhotoButton} activeOpacity={0.6}>
                <Text style={{fontSize: 15, color: 'black', fontWeight: '500'}}>Select Images</Text>
            </TouchableOpacity>
        </View>
    );
};

const imagePickerStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 10,
    },
    image: {
        width: 100,
        height: 100,
        resizeMode: 'cover',
        margin: 5,
        borderWidth: 0.5,
        borderColor: 'lightgray',
        shadowColor: 'gray',
        shadowOpacity: 1,
        shadowRadius: 3,
        shadowOffset: { width: 0, height: 0 },
    },
    imageWrapper: {
        position: 'relative',
        margin: 5,
    },
    closeButton: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: 'gray',
        borderRadius: 15,
        width: 25,
        height: 25,
        justifyContent: 'center',
        alignItems: 'center',
        opacity: 0.6,
    },
    closeButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    choosePhotoButton: {
        backgroundColor: 'lightgray',
        padding: 10,
        borderRadius: 15,
        width: 200,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
});

export default ImagePickerComponent;
