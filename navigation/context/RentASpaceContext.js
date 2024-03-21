import React, { createContext, useContext, useState } from 'react';

const RentASpaceContext = createContext();
const initialParkAreaDetails = {
    name: '',
    phone: '',
    alternatePhone: '',
    parkSpaceName: '',
    email: '',
    address: '',
    street: '',
    city: '',
    district: '',
    state: '',
    pincode: '',
    estimatedCapacity: '',
    expectedPricePerHour: '',
    parkSpaceType: '',
    facilitiesAvailable: [{ name: 'CCTV', value: false }, { name: 'Security Guard', value: false }, { name: 'EV Charging', value: false }, { name: 'Parking Attendant', value: false }, { name: 'Drinking Water', value: false }],
    location: {},
    images: [],
    documents: []
};

export const RentASpaceProvider = ({ children }) => {
    const [parkAreaDetails, setParkAreaDetails] = useState(initialParkAreaDetails);

    const resetUserDetails = () => {
        setParkAreaDetails(initialParkAreaDetails);
    };

    const handleSubmitForVerification = async () => {
        // wait for random time
        await new Promise(resolve => setTimeout(resolve, 2000));
        resetUserDetails();
    };

    const updateDetails = (field, value) => {
        setParkAreaDetails(prevDetails => ({
            ...prevDetails,
            [field]: value,
        }));
    };

    const updateImages = (images) => {
        setParkAreaDetails(prevDetails => ({
            ...prevDetails,
            images: images,
        }));
    };

    const updateDocument = (document) => {
        if (document.length == 0) {
            setParkAreaDetails(prevDetails => ({
                ...prevDetails,
                documents: [],
            }));
        }
        else {
            setParkAreaDetails(prevDetails => ({
                ...prevDetails,
                documents: [document],
            }));
        }
    };

    const addItemToArray = (arrayName, item) => {
        setParkAreaDetails(prevDetails => ({
            ...prevDetails,
            [arrayName]: [...prevDetails[arrayName], item],
        }));
    };

    const updateParkAreaDetails = { updateDetails, resetUserDetails };

    return (
        <RentASpaceContext.Provider value={{ parkAreaDetails, handleSubmitForVerification, updateParkAreaDetails, updateImages, updateDocument }}>
            {children}
        </RentASpaceContext.Provider>
    );
};

export const useRentASpaceContext = () => useContext(RentASpaceContext);