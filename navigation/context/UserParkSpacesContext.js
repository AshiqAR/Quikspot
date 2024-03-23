import React, {createContext, useContext, useState, useCallback} from 'react';

const UserParkSpaceContext = createContext();
const dummyUserParkSpaces = [
  {
    id: 1,
    details: {
      name: 'Space 1',
      address: 'Address 1',
      street: 'Street 1',
      city: 'City 1',
      state: 'State 1',
      location: 'Location 1',
    },
    price: 50,
    numSlots: 5,
    freeSlots: 3,
    available: true,
    parkedVehicleDetails: [
      {
        vehicleNumber: 'KL 21 R 4040',
        type: 'Car',
        make: 'Maruti Suzuki',
        model: 'Swift',
      },
      {
        vehicleNumber: 'KL 01 A 1234',
        type: 'Car',
        make: 'Toyota',
        model: 'Corolla',
      },
    ],
    todaysEarnings: 200,
  },
  {
    id: 2,
    details: {
      name: 'Space 2',
      address: 'Address 2',
      street: 'Street 2',
      city: 'City 2',
      state: 'State 2',
      location: 'Location 2',
    },
    price: 200,
    numSlots: 1,
    freeSlots: 1,
    available: true,
    parkedVehicleDetails: [],
    todaysEarnings: 3000,
  },
  {
    id: 3,
    details: {
      name: 'Space 3',
      address: 'Address 3',
      street: 'Street 3',
      city: 'City 3',
      state: 'State 3',
      location: 'Location 3',
    },
    price: 30,
    numSlots: 1,
    freeSlots: 0,
    available: true,
    parkedVehicleDetails: [
      {
        vehicleNumber: 'KL 01 A 1',
        type: 'Motorcycle',
        make: 'Honda',
        model: 'CBR500R',
      },
      {
        vehicleNumber: 'KL 01 A 1234',
        type: 'Motorcycle',
        make: 'Yamaha',
        model: 'FaZer 25',
      },
    ],
    todaysEarnings: 1000,
  },
];

export const UserParkSpacesProvider = ({children}) => {
  const [userParkSpaces, setUserParkSpaces] = useState([]);

  const fetchParkSpaces = useCallback(async () => {
    const waitTime = Math.floor(Math.random() * 2) + 1;
    await new Promise(resolve => setTimeout(resolve, waitTime * 1000));
    setUserParkSpaces(dummyUserParkSpaces);
  }, []);

  return (
    <UserParkSpaceContext.Provider
      value={{userParkSpaces, fetchParkSpaces, setUserParkSpaces}}>
      {children}
    </UserParkSpaceContext.Provider>
  );
};

export const useUserParkSpacesContext = () => useContext(UserParkSpaceContext);
