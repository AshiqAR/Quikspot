import { Entypo } from 'react-native-vector-icons';
import {StyleSheet, View} from 'react-native';

const Rating = (props) => {
    const rating = props.rating || 2;
    return (
        <View style={styles.ratingContainer}>
            <Entypo name="star" size={24} color="black" />
        </View>
    );
}

const styles = StyleSheet.create({
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: 50,
        height: 50, 
        backgroundColor: 'red',
    },
});

export default Rating;
