import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function ChangePassword() {
    const { user } = useAuth();
    const [phoneNumber] = useState(user.phonenumber.toString());
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    const passwordsMatch = newPassword === confirmNewPassword && newPassword !== '';

    const handlePasswordChange = () => {
        console.log('Password change requested');
    };

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.container}>
                <Text style={styles.label}>Phone Number</Text>
                <TextInput
                    style={styles.input}
                    value={phoneNumber}
                    editable={false}
                />

                <Text style={styles.label}>Current Password</Text>
                <TextInput
                    style={styles.input}
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                    secureTextEntry
                />

                <Text style={styles.label}>New Password</Text>
                <TextInput
                    style={styles.input}
                    value={newPassword}
                    onChangeText={setNewPassword}
                    secureTextEntry
                />

                <Text style={styles.label}>Confirm New Password</Text>
                <TextInput
                    style={styles.input}
                    value={confirmNewPassword}
                    onChangeText={setConfirmNewPassword}
                    secureTextEntry
                />

                {!passwordsMatch && newPassword.length > 0 && confirmNewPassword.length > 0 && (
                    <Text style={styles.errorText}>Passwords do not match</Text>
                )}
                <Pressable
                    style={({ pressed }) => [
                        styles.button,
                        { backgroundColor: passwordsMatch ? '#004F7C' : 'grey' },
                    ]}
                    onPress={handlePasswordChange}
                    disabled={!passwordsMatch}
                >
                    <Text style={styles.buttonText}>
                        Change Password
                    </Text>
                </Pressable>
            </View>


        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    label: {
        marginBottom: 5,
        fontSize: 16,
    },
    input: {
        borderWidth: 1,
        borderColor: 'gray',
        paddingHorizontal: 10,
        paddingVertical: 8,
        fontSize: 16,
        borderRadius: 5,
        marginBottom: 15,
        backgroundColor: '#f9f9f9',

        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,

        elevation: 2,
    },
    button: {
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
    errorText: {
        color: 'red',
        marginBottom: 20, // Ensure there's some space before the button
    },
});
