import { createStackNavigator } from '@react-navigation/stack';
import { LocationProvider } from '../context/LocationContext';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import Loading from '../screens/Loading'
import BeParkSpaceProvider from '../screens/BeParkSpaceProvider';
import Profile from '../screens/Profile';
import HomeScreen from '../screens/HomeScreen';
import Header from '../components/Header';
import ParkingHistory from '../screens/ParkingHistory';
import VehicleDetails from '../screens/VehicleDetails';
import ManageMyParkingSpaces from '../screens/ManageMyParkingSpaces';
import Settings from '../screens/Settings';
import EditProfilePage from '../screens/EditProfilePage';

const AuthStack = createStackNavigator();

const screenOptions = {
};

function AuthStackScreen() {
    return (
        <AuthStack.Navigator screenOptions={{ headerShown: false }}>
            <AuthStack.Screen name="Login" component={LoginScreen} />
            <AuthStack.Screen name="SignUp" component={SignupScreen} />
        </AuthStack.Navigator>
    );
}

const UserStack = createStackNavigator();

function UserStackScreen() {

    return (
        <LocationProvider>
            <UserStack.Navigator
                screenOptions={{
                    headerTitle: () => <Header />,
                    headerStyle: {
                    },
                }}
            >
                {/* <UserStack.Screen name="Loading" component={Loading} /> */}
                <UserStack.Screen name="Home" component={HomeScreen} />
                <UserStack.Screen name="Profile" component={Profile} />
                <UserStack.Screen name="BeParkSpaceProvider" component={BeParkSpaceProvider} options={screenOptions} />
                <UserStack.Screen name="ParkingHistory" component={ParkingHistory} options={screenOptions} />
                <UserStack.Screen name="VehicleDetails" component={VehicleDetails} options={screenOptions} />
                <UserStack.Screen name="ManageMyParkingSpaces" component={ManageMyParkingSpaces} options={screenOptions} />
                <UserStack.Screen name="Settings" component={Settings} options={screenOptions} />
                <UserStack.Screen name="EditProfile" component={EditProfilePage} options={screenOptions} />
            </UserStack.Navigator >
        </LocationProvider >
    );
}

export { UserStackScreen, AuthStackScreen };