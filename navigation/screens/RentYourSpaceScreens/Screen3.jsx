import {
  View,
  Text,
  Pressable,
  Alert,
  StyleSheet,
  ScrollView,
  Modal,
  ActivityIndicator,
} from "react-native";
import React, {useState, useEffect} from "react";
import Icon from "react-native-vector-icons/Ionicons";
import ImagePickerComponent from "../../components/ImagePicker";
import DocumentPicker from "react-native-document-picker";
import {useRentASpaceContext} from "../../context/RentASpaceContext";
import useCloseWithIndicator from "../../customHooks/useCloseWithIndicator";
import backendUrls from "../../connections/backendUrls";
const {sendParkAreaVerificationURL} = backendUrls;
import axios from "axios";
import {useAuth} from "../../context/AuthContext";

export default function Screen3({navigation}) {
  const {updateDocument, updateImages, parkAreaDetails, updateParkAreaDetails} =
    useRentASpaceContext();
  const {setUser} = useAuth();

  const [pdfFile, setPdfFile] = useState(
    parkAreaDetails.document.length == 0 ? null : parkAreaDetails.document[0]
  );
  useEffect(() => {
    if (pdfFile) {
      updateDocument(pdfFile);
    } else {
      updateDocument([]);
    }
  }, [pdfFile]);

  const [imageUris, setImageUris] = useState(parkAreaDetails.images);
  useEffect(() => {
    updateImages(imageUris);
  }, [imageUris]);

  const handleFileUpload = async () => {
    try {
      // Opening Document Picker to select one file
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
      });
      setPdfFile(res[0]);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        Alert.alert("Error", "User cancelled the file picker.");
      } else {
        Alert.alert("Error", "An error occurred while picking the file.");
      }
    }
  };

  const truncateFileName = (fileName, maxLength) => {
    if (!fileName) return "";
    if (fileName.length <= maxLength) {
      return fileName;
    }
    const baseName = fileName.replace(".pdf", "");
    return `${baseName.substring(0, maxLength - 4)}_.pdf`;
  };

  const [handleSubmitPress, isLoading] = useCloseWithIndicator(async () => {
    if (imageUris.length === 0 || pdfFile == null) {
      Alert.alert("Error", "Please upload all the required documents");
      return;
    }

    const selectedFacilitiesNames = parkAreaDetails.facilitiesAvailable
      .filter(facility => facility.value)
      .map(facility => facility.name);

    const parkAreaDetailsSend = {
      ...parkAreaDetails,
      facilitiesAvailable: selectedFacilitiesNames,
      alternatePhoneNumber:
        parseInt(parkAreaDetails.alternatePhoneNumber) || "",
      expectedPricePerHour:
        parseInt(parkAreaDetails.expectedPricePerHour) || "",
      estimatedCapacity: parseInt(parkAreaDetails.estimatedCapacity) || "",
      phoneNumber: parseInt(parkAreaDetails.phoneNumber) || "",
      pincode: parseInt(parkAreaDetails.pincode) || "",
    };
    // const formData = new FormData();
    // imageUris.forEach((image, index) => {
    //   formData.append("images", {
    //     uri: image.uri,
    //     type: image.type || "image/jpeg",
    //     name: `park-space-image-${parkAreaDetails.phoneNumber}-${index}.jpg`,
    //   });
    // });

    // formData.append("document", {
    //   uri: pdfFile,
    //   type: "application/pdf",
    //   name: `park-space-document-${parkAreaDetails.phoneNumber}.pdf`,
    // });

    // formData.append("name", parkAreaDetails.name);
    // formData.append("phoneNumber", parkAreaDetails.phoneNumber);
    // formData.append(
    //   "alternatePhoneNumber",
    //   parkAreaDetails.alternatePhoneNumber
    // );
    // formData.append("parkSpaceName", parkAreaDetails.parkSpaceName);
    // formData.append("email", parkAreaDetails.email);
    // formData.append("address", parkAreaDetails.address);
    // formData.append("street", parkAreaDetails.street);
    // formData.append("city", parkAreaDetails.city);
    // formData.append("district", parkAreaDetails.district);
    // formData.append("state", parkAreaDetails.state);
    // formData.append("pincode", parkAreaDetails.pincode);
    // formData.append("location", parkAreaDetails.location);
    // formData.append("parkSpaceType", parkAreaDetails.parkSpaceType);
    // formData.append(
    //   "facilitiesAvailable",
    //   JSON.stringify(parkAreaDetails.facilitiesAvailable)
    // );
    // formData.append("expectedPricePerHour", parkAreaDetails.pricePerHour);
    // formData.append("estimatedCapacity", parkAreaDetails.estimatedCapacity);

    try {
      console.log(parkAreaDetailsSend);
      const response = await axios.post(
        sendParkAreaVerificationURL,
        parkAreaDetailsSend
        // {
        //   headers: {
        //     "Content-Type": "multipart/form-data",
        //   },
        // }
      );
      if (response.status === 200) {
        Alert.alert("Success", "Park area details submitted successfully");
        setUser(response.data.user);
        updateParkAreaDetails.resetUserDetails();
        navigation.navigate("RentParkSpace");
      } else {
        Alert.alert(
          "Notice",
          "Your request is processed with status: " + response.status
        );
      }
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data.message;
        if (status === 404) {
          Alert.alert("User Not Found", message);
        } else if (status === 500) {
          Alert.alert("Server Error", message);
        } else {
          Alert.alert("Error", message);
        }
      } else if (error.request) {
        Alert.alert(
          "Network Error",
          "The request was made but no response was received"
        );
      } else {
        Alert.alert("Error", error.message);
      }
    }
  });

  return (
    <View style={{flex: 1, backgroundColor: "white"}}>
      {isLoading && (
        <Modal transparent={true} visible={isLoading}>
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0, 0, 0, 0.1)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ActivityIndicator size="large" color="black" />
          </View>
        </Modal>
      )}
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        <View style={{margin: 20}}>
          <Text style={styles.label}>
            Select Sample Images of your park space
          </Text>
          <ImagePickerComponent
            imageUris={imageUris}
            setImageUris={setImageUris}
          />
        </View>

        <View style={{margin: 20}}>
          <Text style={styles.label}>Document Upload</Text>
          {pdfFile ? (
            <View style={styles.fileContainer}>
              <Text style={styles.fileName}>
                {truncateFileName(pdfFile.name, 25)} (
                {Math.round(pdfFile.size / 1024)}kB)
              </Text>
              <Pressable
                style={styles.removeFileButton}
                onPress={() => setPdfFile(null)}
              >
                <Icon name="close-circle-outline" size={35}></Icon>
              </Pressable>
            </View>
          ) : (
            <Pressable style={styles.uploadButton} onPress={handleFileUpload}>
              <Text style={styles.uploadButtonText}>
                Upload PDF File (Ownership Proof)
              </Text>
            </Pressable>
          )}
        </View>
      </ScrollView>

      <View style={{marginHorizontal: 15, marginVertical: 10}}>
        <Pressable
          style={styles.submitButton}
          android_ripple={{color: "gray"}}
          onPress={handleSubmitPress}
        >
          <Text style={styles.submitButtonText}>Submit for Verification</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    marginBottom: 5,
    fontSize: 16,
  },
  fileContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderColor: "gray",
    borderWidth: 0.5,
    padding: 10,
  },
  fileName: {
    color: "black",
    fontWeight: "bold",
  },
  removeFileButton: {
    backgroundColor: "white",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  removeFileButtonText: {
    fontSize: 15,
    fontWeight: "bold",
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 5,
    padding: 10,
    backgroundColor: "lightgray",
  },
  uploadButtonText: {
    fontSize: 15,
    color: "black",
    fontWeight: "500",
  },
  submitButton: {
    backgroundColor: "black",
    borderRadius: 10,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  submitButtonText: {
    color: "white",
    fontSize: 20,
  },
});
