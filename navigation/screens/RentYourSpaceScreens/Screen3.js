import { View, Text, Pressable, Alert, StyleSheet, ScrollView, Modal, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import ImagePickerComponent from '../../components/ImagePicker';
import DocumentPicker from 'react-native-document-picker';
import { useRentASpaceContext } from '../../context/RentASpaceContext';
import useCloseWithIndicator from '../../customHooks/useCloseWithIndicator';

export default function Screen3({ navigation }) {
    const { updateDocument, updateImages, parkAreaDetails, handleSubmitForVerification } = useRentASpaceContext();

    const [pdfFile, setPdfFile] = useState(parkAreaDetails.documents.length == 0 ? null : parkAreaDetails.documents[0]);
    useEffect(() => {
        if (pdfFile) {
            updateDocument(pdfFile);
        } else {
            updateDocument([]);
        }
    }, [pdfFile]);

    const [imageUris, setImageUris] = useState(parkAreaDetails.images);
    useEffect(() => {
        updateImages(imageUris);
    }, [imageUris]);

    const handleFileUpload = async () => {
        try {
            // Opening Document Picker to select one file
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.pdf],
            });
            setPdfFile(res[0]);
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                // User cancelled the picker
                console.log('User cancelled the document picker');
            } else {
                Alert.alert('Error', 'An error occurred while picking the file.');
                console.error(err);
            }
        }
    };

    const truncateFileName = (fileName, maxLength) => {
        if (!fileName) return "";
        if (fileName.length <= maxLength) {
            return fileName;
        }
        const baseName = fileName.replace('.pdf', '');
        return `${baseName.substring(0, maxLength - 4)}_.pdf`;
    };

    const [handleSubmitPress, isLoading] = useCloseWithIndicator(async () => {
        if(imageUris.length === 0 || pdfFile == null ) {
            Alert.alert('Error', 'Please upload all the required documents');
            return;
        }
        console.log('submtting data');
        await handleSubmitForVerification();
        Alert.alert('Success', `Successfully added details`);
        navigation.navigate('RentParkSpace');
    });

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            {isLoading && (
                <Modal transparent={true} visible={isLoading}>
                    <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.1)', alignItems: 'center', justifyContent: 'center' }}>
                        <ActivityIndicator size="large" color="black" />
                    </View>
                </Modal>
            )}
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View style={{ margin: 20 }}>
                    <Text style={styles.label}>Select Sample Images of your park space</Text>
                    <ImagePickerComponent
                        imageUris={imageUris}
                        setImageUris={setImageUris}
                    />
                </View>

                <View style={{ margin: 20 }}>
                    <Text style={styles.label}>Document Upload</Text>
                    {/* Document Upload Section */}
                    {pdfFile ? (
                        <View style={styles.fileContainer}>
                            <Text style={styles.fileName}>{truncateFileName(pdfFile.name, 25)} ({Math.round(pdfFile.size / (1024))}kB)</Text>
                            <Pressable
                                style={styles.removeFileButton}
                                onPress={() => setPdfFile(null)}
                            >
                                <Icon name='close-circle-outline' size={35}></Icon>
                            </Pressable>
                        </View>
                    ) : (
                        <Pressable
                            style={styles.uploadButton}
                            onPress={handleFileUpload}
                        >
                            <Text style={styles.uploadButtonText}>Upload PDF File (Ownership Proof)</Text>
                        </Pressable>
                    )}
                </View>
            </ScrollView>

            <View style={{ marginHorizontal: 15, marginVertical: 10 }}>
                <Pressable
                    style={styles.submitButton}
                    android_ripple={{ color: 'gray' }}
                    onPress={handleSubmitPress}
                >
                    <Text style={styles.submitButtonText}>Submit for Verification</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    label: {
        marginBottom: 5,
        fontSize: 16,
    },
    fileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderColor: 'gray',
        borderWidth: 0.5,
        padding: 10,
    },
    fileName: {
        color: 'black',
        fontWeight: 'bold',
    },
    removeFileButton: {
        backgroundColor: 'white',
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    removeFileButtonText: {
        fontSize: 15,
        fontWeight: 'bold',
    },
    uploadButton: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 5,
        padding: 10,
        backgroundColor: 'lightgray',
    },
    uploadButtonText: {
        fontSize: 15,
        color: 'black',
        fontWeight: '500',
    },
    submitButton: {
        backgroundColor: 'black',
        borderRadius: 10,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    submitButtonText: {
        color: 'white',
        fontSize: 20,
    },
});