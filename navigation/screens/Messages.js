import {View, Text, FlatList, StyleSheet, Alert} from "react-native";
import React, {useEffect, useState} from "react";
import axios from "axios";
import backendUrls from "../connections/backendUrls";
const {getMyMessagesURL} = backendUrls;
import {useAuth} from "../context/AuthContext";
import useLoadingWithinComponent from "../customHooks/useLoadingWithinComponent";
import LoadingModal from "../components/LoadingModal";

export default function Messages() {
  const {isLoading, startLoading, stopLoading} = useLoadingWithinComponent();
  const {user, getState, setState} = useAuth();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      startLoading();
      try {
        await axios
          .post(getMyMessagesURL, {userId: user._id})
          .then(response => {
            setMessages(response.data.messages.reverse());
          })
          .catch(error => {
            Alert.alert("Error", "An error occurred in fetching messages");
          });
      } catch (error) {
        Alert.alert("Error", "An error occurred in fetching messages");
      } finally {
        stopLoading();
      }
    };
    fetchMessages();
  }, []);

  const renderMessageItem = ({item}) => (
    <View style={styles.messageItem}>
      <View style={styles.messageBubble}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.details}>{item.message}</Text>
        <Text style={styles.date}>{new Date(item.time).toLocaleString()}</Text>
      </View>
    </View>
  );

  return (
    <>
      {isLoading && (
        <LoadingModal
          isLoading={isLoading}
          message="Fetching your messages..."
          activityIndicatorColor="black"
        />
      )}
      <FlatList
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderMessageItem}
        style={styles.container}
        ListEmptyComponent={
          !isLoading && (
            <Text style={styles.noMessages}>No messages to display</Text>
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
  loadingContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    alignItems: "center",
    justifyContent: "center",
  },
  messageItem: {
    flexDirection: "row", // Use 'row-reverse' for messages from the user
    marginVertical: 4,
    marginHorizontal: 8,
  },
  messageBubble: {
    backgroundColor: "#e5e5ea", // Differentiate sender and receiver with colors
    borderRadius: 20,
    padding: 10,
    maxWidth: "80%",
    alignSelf: "flex-start", // Use 'flex-end' for messages from the user
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  details: {
    fontSize: 14,
    marginTop: 4,
    color: "#000",
  },
  date: {
    fontSize: 12,
    color: "#777",
    marginTop: 4,
    alignSelf: "flex-end",
  },
  noMessages: {
    fontSize: 16,
    color: "#777",
    textAlign: "center",
    marginTop: 20,
  },
});
