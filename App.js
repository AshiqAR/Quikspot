import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { UserStackScreen, AuthStackScreen } from './src/navigation/Stacks';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

function Account() {
	const { user } = useAuth();
	if (user) {
		return <UserStackScreen />;
	} else {
		return <AuthStackScreen />;
	}
}

function App() {
	return (
		<GestureHandlerRootView style={{flex: 1}}>
			<StatusBar
				translucent={true}
				backgroundColor="transparent"
				barStyle="dark-content"
			/>
			<AuthProvider>
				<NavigationContainer>
					<Account />
				</NavigationContainer>
			</AuthProvider>
		</GestureHandlerRootView>
	);
}
export default App;
