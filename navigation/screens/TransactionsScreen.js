import React from 'react';
import { View, Text, FlatList, StyleSheet, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const transactions = [
	{
	  id: 'tx1',
	  paymentType: 'Debit',
	  date: '2024-03-18',
	  time: '14:00',
	  amount: 100.00,
	  from: 'quikSpot wallet',
	  to: 'Antony\'s parking lot',
	},
	{
	  id: 'tx2',
	  paymentType: 'Credit',
	  date: '2024-03-17',
	  time: '10:30',
	  amount: 250.00,
	  from: 'User Account',
	  to: 'quikSpot wallet',
	},
];

export default function TransactionsScreen() {
	const renderItem = ({ item }) => (
		<View style={styles.card}>
			<View style={styles.transactionItem}>
				<Icon name={item.paymentType === 'Credit' ? 'arrow-down-circle' : 'arrow-up-circle'} size={30} color={item.paymentType === 'Credit' ? '#4CAF50' : '#F44336'} />
				<View style={styles.transactionDetails}>
					<Text style={styles.dateText}>{item.date} at {item.time}</Text>
					<Text style={styles.amountText}>{'\u20B9'} {item.amount.toFixed(2)}</Text>
					<View style={styles.fromToContainer}>
						<Text style={styles.detailsText}>From: {item.from}</Text>
						<Text style={styles.detailsText}>To: {item.to}</Text>
					</View>
				</View>
			</View>
		</View>
	);

	return (
		<FlatList
			data={transactions}
			renderItem={renderItem}
			keyExtractor={item => item.id}
			style={styles.container}
			ListEmptyComponent={<Text style={styles.emptyList}>No transactions to display</Text>}
		/>
	);
}

const styles = StyleSheet.create({
	container: {
		marginVertical: 8,
	},
	card: {
		backgroundColor: '#FFFFFF',
		marginVertical: 4,
		marginHorizontal: 8,
		borderRadius: 8,
		...Platform.select({
			ios: {
				shadowColor: '#000',
				shadowOffset: { width: 0, height: 2 },
				shadowOpacity: 0.1,
				shadowRadius: 2,
			},
			android: {
				elevation: 5,
			},
		}),
	},
	transactionItem: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 16,
	},
	transactionDetails: {
		marginLeft: 16,
		flex: 1,
	},
	dateText: {
		fontSize: 16,
		color: '#424242',
		marginBottom: 4,
	},
	amountText: {
		fontSize: 20,
		fontWeight: 'bold',
		color: '#212121',
	},
	detailsText: {
		fontSize: 14,
		color: '#757575',
	},
	fromToContainer: {
		marginTop: 8,
	},
	emptyList: {
		textAlign: 'center',
		fontSize: 16,
		color: '#757575',
		marginTop: 16,
	},
});
