import {View, Text, StyleSheet, TextInput, Button} from "react-native";
import React, {useState} from "react";
import {db} from "../config";
import {set, ref} from "firebase/database";

const FirebaseIndex = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const AddData = () => {
    set(ref(db, "posts/" + title), {
      title: title,
      body: body,
    });
    setTitle("");
    setBody("");
  };

  return (
    <View style={styles.container}>
      <Text>Add Data to Realtime db</Text>
      <TextInput
        style={{height: 40, borderColor: "gray", borderWidth: 1, width: 200}}
        onChangeText={setTitle}
        value={title}
        placeholder="Title"
      />
      <TextInput
        style={{height: 40, borderColor: "gray", borderWidth: 1, width: 200}}
        onChangeText={setBody}
        value={body}
        placeholder="Body"
      />
      <Button title="Add Data" onPress={AddData} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default FirebaseIndex;
