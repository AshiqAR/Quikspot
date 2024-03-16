import React, { useState, useCallback } from "react";
import { ScrollView, Button, FlatList } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import tw from 'twrnc'
const plus_symbol = require('../assets/plus_icon.png');
import { useAuth } from '../context/AuthContext.js';
import { DownCircleOutlined } from '@ant-design/icons-react-native';



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
    Modal,
    TextInput,
    Alert,
} from "react-native";
import { BACKEND_URL } from '@env';

const VehicleDetails = ({ navigation }) => {
    const { user, setUser } = useAuth();
    const details = user.vehicles;
    const [isModalVisible, setModalVisible] = useState(false);
    const [vehicle, setVehicle] = useState({ vehicleNumber: '', vehicleType: '', makeCompany: '', modelName: '' });
    const [vehicleTypes, setVehicleTypes] = useState(['Two Wheeler', 'Three Wheeler', 'Four Wheeler']);
    const [selectedVehicleType, setSelectedVehicleType] = useState('Select Type');

    const toggleModal = () => {
        setVehicle({ vehicleNumber: '', vehicleType: '', makeCompany: '', modelName: '' });
        setSelectedVehicleType('Select Type');
        setModalVisible(!isModalVisible);
    };

    const handleAddVehicle = () => {
        if (!vehicle.vehicleNumber || !vehicle.vehicleType || !vehicle.makeCompany || !vehicle.modelName) {
            Alert.alert('Please fill all the fields', "All fields are mandatory");
            return;
        }
        const url = BACKEND_URL;
        const apiUrl = url + "/vehicleInfo";
        const requestData = {
            phonenumber: user.phonenumber,
            vehicleNumber: vehicle.vehicleNumber,
            model: vehicle.modelName,
            make: vehicle.makeCompany,
            type: vehicle.vehicleType
        };

        fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestData),
        })
            .then((response) => {
                if (response.status == 201) {
                    return response.json();
                }
                else {
                    Alert.alert("Adding Vehicle Details Failed");
                    return { success: "false" };
                }
            })
            .then((data) => {
                if (data.success != "false") {
                    Alert.alert("Success", "Vehicle details added successfully.");
                    setUser(data.userDetails);
                }
                else {
                    Alert.alert("Error", "Failed to add the new vehicle.");
                }
                setVehicle({ vehicleNumber: '', vehicleType: '', makeCompany: '', modelName: '' });
            })
            .catch((error) => {
                Alert.alert("Error", "An error occurred while adding vehicle details.");
            });
        toggleModal();
    };

    const handleInputChange = (key, formattedValue) => {
        if (key === 'vehicleNumber')
            formattedValue = formattedValue.toUpperCase();
        else if(key==='vehicleType')
            setSelectedVehicleType(formattedValue);
        setVehicle({ ...vehicle, [key]: formattedValue });
    }

    const Dropdown = ({ label, items, selectedVehicleType, onChange }) => {
        const [visible, setVisible] = useState(false);

        const styles = StyleSheet.create({
            button: {
                height: 45,
                backgroundColor: 'lightgrey',
                padding: 10,
                borderRadius: 7,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 15,
            },
            dropdown: {
                position: 'absolute',
                elevation: 10,
                zIndex: 10,
                maxHeight: 200,
                backgroundColor: 'white',
                borderRadius: 5,
            },
            item: {
                padding: 10,
            }
        });

        const renderItem = ({ item }) => (
            <TouchableOpacity
                style={styles.item}
                onPress={() => {
                    onChange('vehicleType', item);
                    setVisible(false);
                }}
            >
                <Text>{item}</Text>
            </TouchableOpacity>
        );

        return (
            <View>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => setVisible(!visible)}
                    activeOpacity={0.8}
                >
                    <Text>{selectedVehicleType}</Text>
                </TouchableOpacity>

                {visible && (
                    <View style={styles.dropdown}>
                        <FlatList
                            data={items}
                            renderItem={renderItem}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    </View>
                )}
            </View>
        );
    };

    return (
        <View style={{ height: "100%" }}>
            <View style={styles.title}>
                <Text style={styles.titleText}>
                    My Vehicles
                </Text>
            </View>

            <View style={styles.safeArea}>
                <FlatList
                    data={details}
                    renderItem={({ item }) => (
                        <View style={tw.style(`flex flex-row justify-between items-center border-b border-[#B8C6DB] py-[24px] px-[21px] w-full`)}>
                            <Text style={tw.style(`text-[#4E4D4D] text-[18px] font-medium`)}>{item.vehicleNumber}</Text>
                            <View style={tw.style(`flex flex-col items-end`)}>
                                <Text style={tw.style(`text-[#4E4D4D] text-[12px] font-light`)}>{item.make} : {item.model}</Text>
                                <Text style={tw.style(`text-[#4E4D4D] text-[12px] font-light`)}>{item.type}</Text>
                            </View>
                        </View>
                    )}
                />

            </View>
            <View style={{ width: "100%", backgroundColor: 'white', alignItems: 'center', paddingVertical: 20 }}>
                {!isModalVisible &&
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={styles.addButton}
                        onPress={toggleModal}
                    >
                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>Add a New Vehicle</Text>
                    </TouchableOpacity>
                }
            </View>

            <Modal
                animated={true}
                statusBarTranslucent={true}
                animationType="slide"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={toggleModal}
                style={{ backgroundColor: 'rgba(0,0,0,1)' }}
            >
                <View style={styles.modalView}>
                    <Text style={styles.modalTitle}>Add New Vehicle</Text>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Vehicle Number:</Text>
                        <TextInput
                            style={styles.input}
                            value={vehicle.vehicleNumber}
                            placeholder="Enter Vehicle Number"
                            onChangeText={(value) => handleInputChange('vehicleNumber', value)}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Vehicle Type:</Text>
                        <Dropdown
                            label="Select Type"
                            items={vehicleTypes}
                            onChange={handleInputChange}
                            selectedVehicleType={selectedVehicleType}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Make Company:</Text>
                        <TextInput
                            style={styles.input}
                            value={vehicle.makeCompany}
                            placeholder="Enter Make Company"
                            onChangeText={(value) => handleInputChange('makeCompany', value)}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Model Name:</Text>
                        <TextInput
                            style={styles.input}
                            value={vehicle.modelName}
                            placeholder="Enter Model Name"
                            onChangeText={(value) => handleInputChange('modelName', value)}
                        />
                    </View>
                    {/* Add more input fields as needed */}
                    <View style={styles.modalButtons}>
                        <Pressable
                            style={[styles.modalButton, styles.modalCancelButton]}
                            onPress={toggleModal}
                        >
                            <Text style={styles.modalButtonText}>Cancel</Text>
                        </Pressable>
                        <Pressable
                            style={[styles.modalButton, styles.modalAddButton]}
                            onPress={handleAddVehicle}
                        >
                            <Text style={styles.modalButtonText}>Add Vehicle</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    title: {
        backgroundColor: 'white'
    },
    titleText: {
        fontSize: 25,
        fontWeight: '900',
        margin: 20,
        alignSelf: 'flex-start',
    },
    safeArea: {
        flex: 1,
        backgroundColor: 'white',
        position: 'relative',
    },
    addButton: {
        backgroundColor: '#066',
        borderRadius: 4,
        padding: 3,
        height: 50,
        width: "70%",
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
    },
    buttonStyle: {
        backgroundColor: 'green',
        height: 50,
        width: "80%",
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 40,
        elevation: 2,
        position: 'relative',
        bottom: 10,
        alignSelf: 'center',
    },
    modalView: {
        margin: 20,
        backgroundColor: "beige",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#88f",
        shadowOffset: {
            width: 6,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 20,
        elevation: 10,
        position: 'relative',
        top: '10%',
    },
    modalTitle: {
        fontSize: 25,
        fontWeight: '900',
        marginBottom: 20,
        width: '100%',
        paddingBottom: 10,
        textAlign: 'center',
    },
    input: {
        height: 40,
        width: "100%",
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
        borderRadius: 6,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    modalButton: {
        borderRadius: 6,
        padding: 10,
        width: '45%',
        alignItems: 'center',
    },
    modalCancelButton: {
        backgroundColor: '#f00',
    },
    modalAddButton: {
        backgroundColor: '#066',
    },
    modalButtonText: {
        color: 'white',
    },
    inputContainer: {
        marginBottom: 20,
        width: '100%',
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
    },
});


export default VehicleDetails;
