import React, {useState} from "react";
import * as ImagePicker from "react-native-image-picker";
import {set} from "react-hook-form";
import Icon from "react-native-vector-icons/Ionicons";
import {
  View,
  Image,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Text,
} from "react-native";

const ImagePickerComponent = ({imageUris, setImageUris}) => {
  const handleChoosePhoto = () => {
    if (imageUris.length >= 3) {
      Alert.alert("Limit Reached", "You can only upload a maximum of 3 images");
      return;
    }

    const options = {
      mediaType: "photo",
      quality: 0.4,
    };

    ImagePicker.launchImageLibrary(options, response => {
      if (response.errorCode) {
        Alert.alert("Error", response.error);
      } else if (response.didCancel) {
        Alert.alert("Error", "User cancelled image picker");
      } else if (response.errorMessage) {
        Alert.alert("Error message", response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const newImages = response.assets
          .filter(asset => {
            if (["image/jpeg", "image/jpg", "image/png"].includes(asset.type)) {
              return true;
            } else {
              Alert.alert(
                "Unsupported Format",
                "Only JPG, JPEG, and PNG files are supported."
              );
              return false;
            }
          })
          .map(asset => ({
            uri: asset.uri,
            type: asset.type,
          }));
        setImageUris(prevUris => [...prevUris, ...newImages]);
      }
    });
  };

  const handleDeleteImage = index => {
    setImageUris(currentUris => currentUris.filter((_, i) => i !== index));
  };

  return (
    <View style={imagePickerStyles.container}>
      <View style={imagePickerStyles.imageContainer}>
        {imageUris.map((image, index) => (
          <View key={index} style={imagePickerStyles.imageWrapper}>
            <Image source={{uri: image.uri}} style={imagePickerStyles.image} />
            <TouchableOpacity
              style={imagePickerStyles.closeButton}
              onPress={() => handleDeleteImage(index)}
            >
              <Icon
                name="close-circle-outline"
                size={30}
                color={"black"}
              ></Icon>
            </TouchableOpacity>
          </View>
        ))}
      </View>
      <TouchableOpacity
        onPress={handleChoosePhoto}
        style={imagePickerStyles.choosePhotoButton}
        activeOpacity={0.6}
      >
        <Text style={{fontSize: 15, color: "black", fontWeight: "500"}}>
          Select Images
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const imagePickerStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    flex: 1,
    justifyContent: "flex-start",
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: "cover",
    margin: 5,
    borderWidth: 0.5,
    borderColor: "lightgray",
    shadowColor: "gray",
    shadowOpacity: 1,
    shadowRadius: 3,
    shadowOffset: {width: 0, height: 0},
  },
  imageWrapper: {
    position: "relative",
    margin: 5,
  },
  closeButton: {
    position: "absolute",
    borderRadius: 15,
    top: -12,
    right: -12,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  choosePhotoButton: {
    backgroundColor: "lightgray",
    padding: 10,
    borderRadius: 5,
    width: "100%",
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
});

export default ImagePickerComponent;
