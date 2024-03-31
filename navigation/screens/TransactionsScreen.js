import React, {useState, useEffect} from "react";
import {View, Text, FlatList, StyleSheet, Platform} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import {useAuth} from "../context/AuthContext";
import axios from "axios";
import backendUrls from "../connections/backendUrls";
const {getMyTransactionsURL} = backendUrls;
import useLoadingWithinComponent from "../customHooks/useLoadingWithinComponent";
import LoadingModal from "../components/LoadingModal";

export default function TransactionsScreen() {
  const {user} = useAuth();
  const [transactions, setTransactions] = useState([]);
  const {isLoading, startLoading, stopLoading} = useLoadingWithinComponent();

  useEffect(() => {
    const fetchTransactions = async () => {
      startLoading();
      try {
        await axios
          .post(getMyTransactionsURL, {userId: user._id})
          .then(response => {
            setTransactions(response.data.transactions.reverse());
          })
          .catch(error => {
            Alert.alert("Error", "An error occurred in fetching transactions");
          });
      } catch (error) {
        Alert.alert("Error", "An error occurred in fetching transactions");
      } finally {
        stopLoading();
      }
    };
    fetchTransactions();
  }, []);

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
    <>
      {isLoading && (
        <LoadingModal
          message="Fetching your transactions..."
          isLoading={isLoading}
        />
      )}
      <FlatList
        data={transactions}
        renderItem={renderItem}
        keyExtractor={item => item._id}
        style={styles.container}
        ListEmptyComponent={
          !isLoading && (
            <Text style={styles.emptyList}>No transactions to display</Text>
          )
        }
      />
    </>
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
