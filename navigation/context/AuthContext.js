import React, {createContext, useContext, useState} from "react";

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [vehicles, setVehicles] = useState(null);
  const [activeBookings, setActiveBookings] = useState(null);
  const [messages, setMessages] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const getState = state => {
    switch (state) {
      case "vehicles":
        return vehicles;
      case "messages":
        return messages;
      case "transactions":
        return transactions;
      default:
        return null;
    }
  };

  const setState = (state, data) => {
    switch (state) {
      case "vehicles":
        setVehicles(data);
        break;
      case "messages":
        setMessages(data);
        break;
      case "activeBookings":
        setActiveBookings(data);
        break;
      case "transactions":
        setTransactions(data);
        break;
      default:
        break;
    }
  };

  const signIn = userData => {
    const updatedUserData = {
      ...userData,
    };
    setUser(updatedUserData);
  };

  const signOut = () => {
    setUser(null);
    setVehicles(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
        signOut,
        setUser,
        getState,
        setState,
        vehicles,
        setVehicles,
        activeBookings,
        setActiveBookings,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
