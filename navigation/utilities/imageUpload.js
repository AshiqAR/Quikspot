import storage from "@react-native-firebase/storage";
import firestore from "@react-native-firebase/firestore";

async function uploadImage(imageUri, parkAreaId, vehicleNumber) {
  const filename = imageUri.substring(imageUri.lastIndexOf("/") + 1);
  const uploadUri =
    Platform.OS === "ios" ? imageUri.replace("file://", "") : imageUri;

  try {
    // Upload the file to Firebase Storage
    const response = await fetch(uploadUri);
    const blob = await response.blob();
    const ref = storage().ref("uploads").child(filename);
    const task = ref.put(blob);

    // Listen for state changes, errors, and completion of the upload.
    task.on(
      "state_changed",
      snapshot => {
        console.log(snapshot.state);
      },
      error => {
        console.log(error);
        return null;
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        task.snapshot.ref.getDownloadURL().then(downloadURL => {
          console.log("File available at", downloadURL);
          saveImageURLToFirestore(downloadURL, parkAreaId, vehicleNumber);
        });
      }
    );
  } catch (e) {
    console.error(e);
    return null;
  }
}

async function saveImageURLToFirestore(url, parkAreaId, vehicleNumber) {
  // Assuming you have a collection named 'images'
  const imageRef = firestore().collection("checkInImages").doc();

  await imageRef.set({
    url: url,
    parkAreaId: parkAreaId,
    vehicleNumber: vehicleNumber,
    checkInTime: firestore.FieldValue.serverTimestamp(), // Save the timestamp
  });
}

export {uploadImage};
