import { View, Text, Pressable } from 'react-native'
import React from 'react'
import RentYourSpaceCard from '../components/RentYourSpaceCard'
import TypeOfParkSpaceCard from '../components/TypeOfParkSpaceCard'
import Icon from 'react-native-vector-icons/Ionicons';

export default function RentParkSpace({ navigation, route }) {
  const [underVerification, setUnderVerification] = React.useState(true);

  const handleNextPress = () => {
    navigation.navigate('Screen1');
  }
  return (
    <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-between', backgroundColor: 'white' }}>
      <RentYourSpaceCard
        underVerification={underVerification}
        setUnderVerification={setUnderVerification}
      />
      {!underVerification &&
        <>

          <TypeOfParkSpaceCard />


          <View style={{ alignItems: 'center', justifyContent: 'center', height: 70 }}>
            <View style={{ borderRadius: 10, overflow: 'hidden' }}>
              <Pressable style={{ backgroundColor: 'black', borderRadius: 10, height: 50, width: 400, justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', paddingHorizontal: 30 }}
                android_ripple={{ color: 'gray', borderless: false }}
                onPress={handleNextPress}
              >
                <Text style={{ color: 'white', fontSize: 20, textAlign: 'center' }}>Yes im in</Text>
                <Icon name='arrow-forward-circle-outline' size={30} color={'white'}></Icon>
              </Pressable>
            </View>
          </View>
        </>
      }
    </View>
  )
}