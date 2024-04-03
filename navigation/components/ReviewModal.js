import React, {useState} from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  StatusBar,
  Keyboard,
} from "react-native";

const ReviewModal = ({visible, onClose, onSubmit, parkAreaId}) => {
  const [rating, setRating] = useState("");
  const [review, setReview] = useState("");

  const handlePressSubmit = async () => {
    Keyboard.dismiss();
    const ratingNumber = parseInt(rating, 10);
    if (ratingNumber < 1 || ratingNumber > 5) {
      Alert.alert("Rating must be between 1 and 5.");
      return;
    }
    await onSubmit(parkAreaId, ratingNumber, review);
    setRating("");
    setReview("");
    onClose();
  };

  handleClosePress = () => {
    Keyboard.dismiss();
    setRating("");
    setReview("");
    onClose();
  };

  return (
    <>
      {visible && <StatusBar backgroundColor="rgba(0, 0, 0, 0.2)" />}
      <Modal
        visible={visible}
        animationType="slide"
        transparent={true}
        onRequestClose={onClose}
      >
        <View style={styles.overlay}>
          <View style={styles.modalView}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleClosePress}
            >
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Add Review and Rating</Text>
            <TextInput
              style={styles.input}
              placeholder="Rating (1-5)"
              value={rating}
              onChangeText={setRating}
              keyboardType="numeric"
            />
            <TextInput
              style={[styles.input, {height: 100}]}
              placeholder="Review"
              value={review}
              onChangeText={setReview}
              multiline={true}
            />
            <TouchableOpacity style={styles.button} onPress={handlePressSubmit}>
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  // Inside your styles
  modalView: {
    width: "80%",
    margin: 10,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    justifyContent: "center",
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  title: {
    marginBottom: 15,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18,
  },
  input: {
    width: "100%",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 6,
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 20,
    width: 100,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 10,
    zIndex: 1, // Ensure it's clickable over other elements
  },
  closeButtonText: {
    color: "#333",
    fontSize: 16,
  },
});

export default ReviewModal;
