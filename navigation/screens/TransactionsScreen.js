import React from "react";
import {View, Text, FlatList, StyleSheet, Platform} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import {useAuth} from "../context/AuthContext";

export default function TransactionsScreen() {
  const {user} = useAuth();
  const transactions = user.walletTransactions.reverse();

  const renderItem = ({item}) => {
    const transactionDate = new Date(item.time);

    const formattedDate = transactionDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const formattedTime = transactionDate.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });

    return (
      <View style={styles.card}>
        <View style={styles.transactionItem}>
          <Icon
            name={
              item.transactiontype === "credit"
                ? "arrow-down-circle"
                : "arrow-up-circle"
            }
            size={30}
            color={item.transactiontype === "credit" ? "#4CAF50" : "#F44336"}
          />
          <View style={styles.transactionDetails}>
            <Text style={styles.dateText}>
              {formattedDate} at {formattedTime}
            </Text>
            <Text style={styles.amountText}>
              {"\u20B9"} {item.amount.toFixed(2)}
            </Text>
            <View style={styles.fromToContainer}>
              <Text style={styles.detailsText}>From: {item.from}</Text>
              <Text style={styles.detailsText}>To: {item.to}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <FlatList
      data={transactions}
      renderItem={renderItem}
      keyExtractor={item => item._id}
      style={styles.container}
      ListEmptyComponent={
        <Text style={styles.emptyList}>No transactions to display</Text>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  card: {
    backgroundColor: "#FFFFFF",
    marginVertical: 4,
    marginHorizontal: 8,
    borderRadius: 8,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  transactionDetails: {
    marginLeft: 16,
    flex: 1,
  },
  dateText: {
    fontSize: 16,
    color: "#424242",
    marginBottom: 4,
  },
  amountText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#212121",
  },
  detailsText: {
    fontSize: 14,
    color: "#757575",
  },
  fromToContainer: {
    marginTop: 8,
  },
  emptyList: {
    textAlign: "center",
    fontSize: 16,
    color: "#757575",
    marginTop: 16,
  },
});
