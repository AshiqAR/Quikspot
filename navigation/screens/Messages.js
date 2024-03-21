import { View, Text, FlatList, StyleSheet } from 'react-native';
import React from 'react';

const messages = [
  {
    id: '1',
    title: 'Booking Successful',
    details: 'Your booking at Central Park is confirmed for 24th Mar.',
    date: '2024-03-18',
  },
  {
    id: '2',
    title: 'Payment Received',
    details: 'Payment of ₹500 received for parking at Downtown Parking Lot.',
    date: '2024-03-17',
  },
];

export default function Messages() {
  const renderMessageItem = ({ item }) => (
    <View style={styles.messageCard}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.details}>{item.details}</Text>
      <Text style={styles.date}>{item.date}</Text>
    </View>
  );

  return (
    <FlatList
      data={messages}
      keyExtractor={item => item.id}
      renderItem={renderMessageItem}
      style={styles.container}
      ListEmptyComponent={<Text style={styles.noMessages}>No messages to display</Text>}
    />
  );
}

const styles = StyleSheet.create({
  container: {
		marginVertical: 8,
	},
  messageCard: {
    backgroundColor: 'white',
    marginVertical: 4,
		marginHorizontal: 8,
    padding: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  details: {
    fontSize: 14,
    marginBottom: 5,
  },
  date: {
    fontSize: 12,
    color: '#777',
  },
  noMessages: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    marginTop: 20,
  },
});
