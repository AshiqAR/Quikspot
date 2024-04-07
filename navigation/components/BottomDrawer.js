import React, {useCallback, useRef, useMemo} from "react";
import {StyleSheet, View, Button} from "react-native";
import BottomSheet, {BottomSheetScrollView} from "@gorhom/bottom-sheet";

const BottomDrawer = ({children}) => {
  const sheetRef = useRef(null);

  // Define your snap points (or make them props if you want it to be more dynamic)
  const snapPoints = useMemo(() => ["25%", "50%", "75%"], []);

  // Callbacks (you might adjust or remove these depending on your needs)
  const handleSheetChange = useCallback(index => {
    console.log("handleSheetChange", index);
  }, []);

  const handleClosePress = useCallback(() => {
    sheetRef.current?.close();
  }, []);

  return (
    <View style={styles.container}>
      {/* Control buttons (optional, depending on your UI/UX design) */}
      <Button title="Close" onPress={handleClosePress} />

      {/* BottomSheet setup */}
      <BottomSheet
        ref={sheetRef}
        index={0} // Starting index, you might want to control this with props
        snapPoints={snapPoints}
        onChange={handleSheetChange}
      >
        {/* Using BottomSheetScrollView to allow the children to be scrollable */}
        <BottomSheetScrollView contentContainerStyle={styles.contentContainer}>
          {children}
        </BottomSheetScrollView>
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Take up the full screen; adjust as necessary
  },
  contentContainer: {
    // Style for the scrollable content container
  },
});

export default BottomDrawer;
