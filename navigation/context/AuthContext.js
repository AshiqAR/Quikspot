import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const signIn = (userData) => {
        const updatedUserData = {
            ...userData,
            walletBalance: 1000,
            city: 'Kallara',
            district: 'Trivandrum',
            state: 'Kerala',
        };
        setUser(updatedUserData);
    };

    const signOut = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
