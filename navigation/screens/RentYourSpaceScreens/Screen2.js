import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useRentASpaceContext} from '../../context/RentASpaceContext';

export default function Screen2({navigation}) {
  const {parkAreaDetails, updateParkAreaDetails} = useRentASpaceContext();
  const parkSpaceOptions = ['Home', 'Outdoor', 'Dedicated'];
  const [currentLocation, setCurrentLocation] = useState({
    latitude: 0,
    longitude: 0,
  });

  const handleNextPress = () => {
    // Convert input values to numbers for validation
    const estimatedCarsParked = parseInt(parkAreaDetails.estimatedCapacity);
    const pricePerHour = parseInt(parkAreaDetails.expectedPricePerHour);

    // Check if values are filled in and valid

    if (
      isNaN(estimatedCarsParked) ||
      estimatedCarsParked <= 0 ||
      isNaN(pricePerHour) ||
      pricePerHour <= 0 ||
      parkAreaDetails.parkSpaceType == ''
    ) {
      alert(
        'Please fill in all required fields with valid numbers where applicable.',
      );
      return;
    }

    console.log(parkAreaDetails);
    navigation.navigate('Screen3');
  };

  const handleInputChange = (name, value) => {
    updateParkAreaDetails.updateDetails(name, value);
  };

  const handleLocationFetch = () => {
    handleInputChange('location', currentLocation);
  };

  const handleToggleFacility = index => {
    const updatedFacilities = parkAreaDetails.facilitiesAvailable.map(
      (facility, i) => {
        if (i === index) {
          return {...facility, value: !facility.value};
        }
        return facility;
      },
    );
    updateParkAreaDetails.updateDetails(
      'facilitiesAvailable',
      updatedFacilities,
    );
  };

  const renderFacilityToggles = () => {
    return parkAreaDetails.facilitiesAvailable.map((facility, index) => (
      <LabelToggle
        key={index}
        label={facility.name}
        value={facility.value}
        onToggle={() => handleToggleFacility(index)}
      />
    ));
  };

  const renderParkSpaceOptions = () => {
    return parkSpaceOptions.map((option, index) => (
      <Pressable
        key={index}
        style={styles.radioContainer}
        onPress={() => handleInputChange('parkSpaceType', option)}>
        <Icon
          name={
            parkAreaDetails.parkSpaceType === option
              ? 'radio-button-on'
              : 'radio-button-off'
          }
          size={20}
          color={'black'}
        />
        <Text style={styles.radioLabel}>{option}</Text>
      </Pressable>
    ));
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollSection}>
        <LabelInput
          label="Estimated Parking Capacity (No. of Cars)*"
          value={parkAreaDetails.estimatedCapacity}
          onChangeText={value => handleInputChange('estimatedCapacity', value)}
          keyboardType="numeric"
        />
        <LabelInput
          label="Expected Price Per Hour*"
          value={parkAreaDetails.expectedPricePerHour}
          onChangeText={value =>
            handleInputChange('expectedPricePerHour', value)
          }
          keyboardType="numeric"
        />
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Type of Park Space*</Text>
          <View style={styles.radioGroup}>{renderParkSpaceOptions()}</View>
        </View>
        <View style={[{alignItems: 'center', paddingVertical: 10}]}>
          <Text style={styles.label}>Park Space Facilities Available</Text>
        </View>

        {renderFacilityToggles()}

        <View
          style={[styles.label, {alignItems: 'center', paddingVertical: 10}]}>
          <Text style={styles.label}>Locate the parking area</Text>
        </View>
        <Pressable
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 10,
            backgroundColor: '#dfdfdf',
            padding: 10,
            borderRadius: 5,
          }}
          onPress={handleLocationFetch}>
          <Icon name="location-outline" size={24} color="gray" />
          <Text style={{marginLeft: 8, color: 'gray'}}>
            Use Current Location
          </Text>
        </Pressable>
      </ScrollView>

      <View style={styles.nextButtonContainer}>
        <Pressable
          style={styles.nextButton}
          onPress={handleNextPress}
          android_ripple={{color: 'gray', borderless: false}}>
          <Text style={styles.nextButtonText}>Next</Text>
          <Icon name="arrow-forward-circle-outline" size={30} color={'white'} />
        </Pressable>
      </View>
    </View>
  );
}

const LabelInput = ({label, ...props}) => (
  <View style={styles.inputContainer}>
    <Text style={styles.label}>{label}</Text>
    <TextInput style={styles.input} {...props} />
  </View>
);

const LabelToggle = ({label, value, onToggle}) => (
  <Pressable onPress={onToggle} style={styles.toggleContainer}>
    <Text style={styles.label}>{label}</Text>
    <Icon
      name={value ? 'checkbox-outline' : 'square-outline'}
      size={24}
      color={'black'}
    />
  </Pressable>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollSection: {
    paddingHorizontal: 20,
  },
  inputContainer: {
    marginBottom: 10,
  },
  label: {
    marginBottom: 5,
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 20,
    borderRadius: 5,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
    borderColor: 'gray',

    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,

    elevation: 2,
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioLabel: {
    marginLeft: 8,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  nextButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 70,
    paddingHorizontal: 15,
  },
  nextButton: {
    backgroundColor: 'black',
    borderRadius: 10,
    height: 50,
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 30,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
  },
});
