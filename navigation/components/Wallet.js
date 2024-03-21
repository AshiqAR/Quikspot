import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Pressable, TextInput, Animated, StyleSheet, Alert, Modal, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import useCloseWithIndicator from '../customHooks/useCloseWithIndicator';

function waitForRandomTime(maxTime = 1500) {
    const randomTime = Math.floor(Math.random() * maxTime);

    return new Promise((resolve) => {
        setTimeout(resolve, randomTime);
    });
}

export default function Wallet({ user }) {
    const [isAdding, setIsAdding] = useState(false);
    const [fadeAnim] = useState(new Animated.Value(0)); // Initial value for opacity: 0
    const [amount, setAmount] = useState('');
    const animation = useRef(new Animated.Value(0)).current;
    const [handleTopUp, isLoading] = useCloseWithIndicator(async () => {
        console.log('wallet topup');
        if (isNaN(parseInt(amount)) || parseInt(amount) < 0) {
            await waitForRandomTime(2000);
            Alert.alert('Error', 'Please enter a valid amount');
            setAmount('');
        }
        else {
            await waitForRandomTime(7000);
            user.walletBalance += parseInt(amount);
            Alert.alert('Success', `Successfully added \u20B9${amount} to your wallet`);
            setAmount('');
            setIsAdding(false);
        }
    });

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: isAdding ? 1 : 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [isAdding, fadeAnim]);

    const toggleAddMoney = () => {
        setIsAdding(!isAdding);
        Animated.timing(animation, {
            toValue: isAdding ? 0 : 1,
            duration: 300,
            useNativeDriver: true, // Change this line to true
        }).start();
    };

    // const handleTopUp = () => {
    //     console.log('Top up logic here');
    //     if (amount !== '') {
    //         user.walletBalance += parseInt(amount);
    //         Alert.alert('Success', `Successfully added \u20B9${amount} to your wallet`);
    //         setAmount('');
    //         setIsAdding(false);
    //     }
    //     else {
    //         Alert.alert('Error', 'Please enter a valid amount');
    //     }
    // };

    const handleCancel = () => {
        console.log('Cancel add money');
        setAmount('');
        setIsAdding(false);
    }

    return (
        <View
            style={{
                padding: 20,
                justifyContent: 'space-between',
                backgroundColor: 'darkgreen',
                margin: 20,
                borderRadius: 15,
                height: 250,
                elevation: 5,
                shadowColor: 'black',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
            }}
        >
            {isLoading && (
                <Modal transparent={true} visible={isLoading}>
                    <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.1)', alignItems: 'center', justifyContent: 'center' }}>
                        <ActivityIndicator size="large" color="black" />
                    </View>
                </Modal>
            )}
            <View style={{borderBottomWidth: 2, borderColor: 'gray', flex: 1, flexDirection:'row', justifyContent: 'space-between'}}>

                <Text style={{ fontWeight: 'bold', fontSize: 25, color: 'white', paddingBottom: 10 }}>
                    quikSpot Wallet
                </Text>
                <Icon name='wallet' color={'gold'} size={30}></Icon>
            </View>
            <View style={{ flex: 1, flexDirection: 'row', paddingVertical: 10 }}>
                <Text style={{ color: '#ffeded', fontSize: 20 }}>Balance: </Text>
                <Text style={{ color: '#ffabab', fontSize: 20 }}> {'\u20B9'} {user.walletBalance}</Text>
            </View>

            <View style={{ height: 100 }}>

                {!isAdding && (
                    <View style={{ borderRadius: 10, overflow: 'hidden', elevation: 5 }}>
                        <Pressable
                            onPress={toggleAddMoney}
                            style={{ backgroundColor: 'green', padding: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderRadius: 10 }}
                            android_ripple={{ color: 'lightgray', borderless: false }}
                        >
                            <Text style={{ color: 'white', fontSize: 20 }}>Add Money</Text>
                            <Icon name='add-circle-outline' size={25} color={'gold'}></Icon>
                        </Pressable>
                    </View>
                )}

                {isAdding && (
                    <Animated.View
                        style={[
                            {
                                opacity: fadeAnim, // Bind opacity to animated value
                            },
                        ]}
                    >
                        <TextInput
                            style={styles.input}
                            value={amount}
                            onChangeText={setAmount}
                            placeholder="Enter amount"
                            keyboardType="numeric"
                        />
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Pressable
                                onPress={handleTopUp}
                                style={[styles.button, styles.topUpButton]}
                                android_ripple={{ color: 'lightgray', borderless: false }}
                            >
                                <Text style={styles.buttonText}>Top Up</Text>
                            </Pressable>
                            <Pressable
                                onPress={handleCancel}
                                style={[styles.button, styles.cancelButton]}
                                android_ripple={{ color: 'lightgray', borderless: false }}
                            >
                                <Text style={styles.buttonText}>Cancel</Text>
                            </Pressable>
                        </View>
                    </Animated.View>
                )}
            </View>
        </View>
    );
}

// export default function Wallet({ user }) {
//     const [isAdding, setIsAdding] = useState(false);
//     const [amount, setAmount] = useState('');
//     const animation = useRef(new Animated.Value(0)).current;

//     const toggleAddMoney = () => {
//         setIsAdding(!isAdding);
//         Animated.timing(animation, {
//             toValue: isAdding ? 0 : 1,
//             duration: 300,
//             useNativeDriver: true, // Change this line to true
//         }).start();
//     };

//     const inputOpacity = animation.interpolate({
//         inputRange: [0, 1],
//         outputRange: [0, 1],
//     });

//     const buttonOpacity = animation.interpolate({
//         inputRange: [0, 1],
//         outputRange: [1, 0],
//     });

//     return (
//         <View style={styles.container}>
//             <Text style={styles.walletTitle}>quikSpot Wallet</Text>
//             <View style={styles.balanceRow}>
//                 <Text style={styles.balanceText}>Balance: </Text>
//                 <Text style={styles.balanceAmount}>{'\u20B9'} {user.walletBalance}</Text>
//             </View>

//             <Animated.View style={[styles.row, { opacity: buttonOpacity }]}>
//                 <Pressable onPress={toggleAddMoney} style={styles.button}>
//                     <Text style={styles.buttonText}>Add Money</Text>
//                 </Pressable>
//             </Animated.View>

//             <Animated.View style={[styles.row, styles.inputRow, { opacity: inputOpacity }]}>
//                 <TextInput
//                     style={styles.input}
//                     value={amount}
//                     onChangeText={setAmount}
//                     placeholder="Enter amount"
//                     keyboardType="numeric"
//                 />
//                 <Pressable onPress={() => {/* Handle top up logic here */ }} style={[styles.button, styles.topUpButton]}>
//                     <Text style={styles.buttonText}>Top Up</Text>
//                 </Pressable>
//                 <Pressable onPress={toggleAddMoney} style={[styles.button, styles.cancelButton]}>
//                     <Text style={styles.buttonText}>Cancel</Text>
//                 </Pressable>
//             </Animated.View>
//         </View>
//     );
// }

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: 'darkgreen',
        margin: 20,
        borderRadius: 15,
        elevation: 5,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    walletTitle: {
        fontWeight: 'bold',
        fontSize: 25,
        color: 'white',
        paddingBottom: 10,
        borderBottomWidth: 2,
        borderColor: 'gray',
    },
    balanceRow: {
        flexDirection: 'row',
        paddingVertical: 10,
    },
    balanceText: {
        color: '#ffeded',
        fontSize: 20,
    },
    balanceAmount: {
        color: '#ffabab',
        fontSize: 20,
    },
    button: {
        height: 45,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'green',
        padding: 10,
        borderRadius: 5,
        elevation: 5,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        marginVertical: 15,
        width: '45%'
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    inputRow: {
        alignItems: 'center',
    },
    input: {
        backgroundColor: 'white',
        padding: 5,
        borderRadius: 5,
        fontSize: 20,
        fontWeight: 'bold',
    },
    topUpButton: {
    },
    cancelButton: {
        backgroundColor: 'red',
    },
});
