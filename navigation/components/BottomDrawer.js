import React, { useCallback, useRef, useMemo } from "react";
import { StyleSheet, View, Text, Button, Image, TouchableOpacity } from "react-native";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";

const starIcon = require("../assets/images/star.png");
const badge = require("../assets/images/badge.png");
const badgemini = require("../assets/images/badge-mini.png");
import parkAreas from "../../src/data/parkAreas";

const BottomDrawer = () => {

  const parkArea = parkAreas[0];

  const sheetRef = useRef(null);

  const snapPoints = useMemo(() => ["22%", "50%", "100%"], []);

  // callbacks
  const handleSheetChange = useCallback((index) => {
    console.log("handleSheetChange", index);
  }, []);
  const handleSnapPress = useCallback((index) => {
    sheetRef.current?.snapToIndex(index);
  }, []);
  const handleClosePress = useCallback(() => {
    sheetRef.current?.close();
  }, []);

  return (
    <View style={styles.container}>
      <Button title="Snap To 90%" onPress={() => handleSnapPress(2)} />
      <Button title="Snap To 50%" onPress={() => handleSnapPress(1)} />
      <Button title="Snap To 25%" onPress={() => handleSnapPress(0)} />
      <Button title="Close" onPress={() => handleClosePress()} />
      <BottomSheet
        ref={sheetRef}
        index={0}
        snapPoints={snapPoints}
        onChange={handleSheetChange}
        showsVerticalScrollIndicator={false}
      >
        <BottomSheetScrollView contentContainerStyle={styles.contentContainer}>
          <Contents
            parkArea={parkArea}
          />
        </BottomSheetScrollView>
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 200,
  },
  contentContainer: {
    backgroundColor: "white",
  },
  itemContainer: {
    padding: 6,
    margin: 6,
    backgroundColor: "#eee",
  },
});

export default BottomDrawer;

const Contents = (props) => {
  const { parkArea } = props;

  const MainDetails = () => {
    return (
      <View style={contentStyles.mainDetails}>
        <View style={{}}>
          <Text style={{ fontSize: 25, color: 'black', fontWeight: '700' }}>{parkArea.name}</Text>
          <Text style={{ fontSize: 20, paddingVertical: 5 }}>{parkArea.place}</Text>
          <Text>Available Slots: {parkArea.no_free_slots}</Text>
          <View style={{ flex: 1, flexDirection: 'row', width: '100%', paddingVertical: 10 }}>
            <Image source={starIcon} style={{ width: 35, height: 35 }} />
            <Image source={starIcon} style={{ width: 35, height: 35 }} />
            <Image source={starIcon} style={{ width: 35, height: 35 }} />
            <Image source={starIcon} style={{ width: 35, height: 35 }} />
            <Image source={starIcon} style={{ width: 35, height: 35 }} />
            <Text style={{ alignSelf: 'center', paddingHorizontal: 5, fontSize: 20 }}>({parkArea.total_reviews})</Text>
            {/* <Text>{parkArea.average_rating}</Text> */}
          </View>
        </View>
        <View style={{}}>
          <Text style={{ color: 'black', fontSize: 25, fontWeight: '500' }}>{'\u20B9'}{parkArea.price_per_hr} /hr</Text>
          <Text style={{ fontSize: 20, paddingVertical: 15, fontWeight: 'bold' }}>{parkArea.distance} m</Text>
        </View>
      </View>
    )
  };

  const ParkHere = () => {
    return (
      <View>
        <TouchableOpacity
          onPress={() => console.log('park here clicked')}
          style={{ width: "80%", height: 50, backgroundColor: "#00BFdd", borderRadius: 10, justifyContent: 'center', alignItems: 'center', alignSelf: 'center', marginVertical: 15 }}
          activeOpacity={0.7}
        >
          <Text
            style={{ fontSize: 20, fontWeight: 'bold', paddingVertical: 10, paddingHorizontal: 15 }}
          >
            Park Here
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const ExclusiveFeatures = () => {
    return (
      <View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image source={badgemini} style={{ width: 25, height: 25 }}></Image>
          <Text style={contentStyles.sectionHeading}>Exclusive Features</Text>
        </View>
        {parkArea.exclusive_features.map((feature, index) => (
          <View key={index} style={{ borderWidth: 1, borderColor: 'lightgray', borderRadius: 5, marginBottom: 4, paddingVertical: 3, flexDirection: 'row', alignItems: 'flex-start', marginHorizontal: 5, paddingHorizontal: 10, paddingLeft: 25 }}>
            <Text style={{ fontSize: 17 }}>{feature}</Text>
          </View>
        ))}
      </View>
    );
  };

  const ImagesSection = () => {
    return (
      <View>
        <Text style={contentStyles.sectionHeading}>Images</Text>
        <View style={{ height: 200, backgroundColor: 'lightblue' }}></View>
      </View>
    );
  };

  const UserReviews = () => {
    return (
      <View>
        <Text style={contentStyles.sectionHeading}>User Reviews</Text>
        <View style={{ height: 200, backgroundColor: 'lightgreen' }}></View>
      </View>
    )
  }

  const ContactDetails = () => {
    return (
      <View>
        <Text style={contentStyles.sectionHeading}>Contact Details</Text>
        <View style={{ height: 100, backgroundColor: 'wheat' }}></View>
      </View>
    );
  };

  return (
    <View style={contentStyles.container}>
      <MainDetails />
      <ParkHere />
      <ExclusiveFeatures />
      <ImagesSection />
      <UserReviews />
      <ContactDetails />
    </View>
  );
};

const contentStyles = StyleSheet.create({
  container: {
    padding: 15
  },
  mainDetails: {
    flex: 1,
    backgroundColor: "white",
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingVertical: 10
  }
});
