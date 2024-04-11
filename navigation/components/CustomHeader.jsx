import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const CustomHeader = ({ navigation, title, onRightPress, rightIcon, onBackPress }) => {
  return (
    <View style={styles.container}>
      {navigation.canGoBack() && (
        <Pressable
          onPress={() => {
            if (onBackPress) {
              onBackPress();
            } else {
              navigation.goBack();
            }
          }}

          style={[styles.iconButton, styles.leftIcon]}
          android_ripple={{ color: 'gray', borderless: true, radius: 30 }}
          pressRetentionOffset={{ top: 20, left: 20, right: 20, bottom: 20 }}
        >
          <Icon name="arrow-back" size={24} color="#000" />
        </Pressable>
      )}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
      </View>
      {onRightPress && (
        <Pressable
          onPress={onRightPress}
          style={[styles.iconButton, styles.rightIcon]}
        >
          <Icon name={rightIcon} size={24} color="#000" />
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    height: 60,
  },
  iconButton: {
    padding: 10,
    position: 'absolute',
    height: '100%',
    justifyContent: 'center',
  },
  leftIcon: {
    left: 0,
    marginLeft: 10,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightIcon: {
    right: 0,
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#000',
  },
});

export default CustomHeader;
