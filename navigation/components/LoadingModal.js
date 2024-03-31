import {
  Modal,
  ActivityIndicator,
  View,
  Text,
  FlatList,
  StyleSheet,
} from "react-native";
import React from "react";

export default function LoadingModal({
  message = "Loading...",
  activityIndicatorColor = "black",
  isLoading,
}) {
  return (
    <Modal transparent={true} visible={isLoading}>
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0, 0, 0, 0.07)",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator size="small" color={activityIndicatorColor} />
        <Text style={{fontSize: 16, color: "gray", marginTop: 20}}>
          {message}
        </Text>
      </View>
    </Modal>
  );
}
