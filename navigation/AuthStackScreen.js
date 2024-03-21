import { createStackNavigator } from '@react-navigation/stack';
import SignInScreen from './screens/SignInScreen';
import SignUpScreen from './screens/SignUpScreen';
import CustomHeader from './components/CustomHeader';
import { View, StatusBar, Image } from 'react-native';

const AuthStack = createStackNavigator();

export default function AuthStackScreen() {
    return (
        <AuthStack.Navigator
            screenOptions={{
                presentation: 'modal',
                cardStyle: { backgroundColor: 'white' },
                cardStyleInterpolator: ({ current, next, layouts }) => {
                    return {
                        cardStyle: {
                            transform: [
                                {
                                    translateX: current.progress.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [layouts.screen.width, 0],
                                    }),
                                },
                            ],
                        },
                        overlayStyle: {
                            opacity: current.progress.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0, 0.7],
                            }),

                        },
                    };
                },
                // header: (props) => {
                //     const title = props.options.title || props.route.name;
                //     return (
                //         <>
                //             <StatusBar translucent={false} />
                //             <View style={{backgroundColor: 'white' }}>
                //                 <CustomHeader
                //                     title={title}
                //                     navigation={props.navigation}
                //                 />
                //             </View>
                //         </>
                //     );
                // },
            }}
        >
            <AuthStack.Screen
                name="SignIn"
                component={SignInScreen}
                options={{ headerShown: false }}
            />
            <AuthStack.Screen
                name="SignUp"
                component={SignUpScreen}
                options={{
                    title: 'Sign Up',
                    headerShown: false,
                }}
            />
        </AuthStack.Navigator>
    );
}
