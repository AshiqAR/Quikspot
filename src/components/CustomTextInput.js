import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Animated } from 'react-native';

const CustomTextInput = ({
  style,
  label,
  value,
  onChangeText,
  keyboardType = 'default',
  secureTextEntry = false,
  autoCapitalize = 'none',
  autoCorrect = false,
  placeholder = '',
  onFocusColor = '#2196F3',
  onBlurColor = '#888',
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const animatedLabelPosition = new Animated.Value((isFocused || (value!='' && value !=undefined)) ? -9 : 39);

  const handleFocus = () => {
    setIsFocused(true);
    console.log("handle focus value",value);
    Animated.timing(animatedLabelPosition, {
      toValue: 2,
      duration: 150,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    console.log("handle blur value",value);
    Animated.timing(animatedLabelPosition, {
      toValue: value ? 2 : 16,
      duration: 150,
      useNativeDriver: false,
    }).start();
  };

  return (
    <View style={[styles.container]}>
      <Animated.Text
        style={[(isFocused || (value!='' && value!=undefined)) ? styles.labelFocused :
          styles.label,
          {
            transform: [{ translateY: animatedLabelPosition }],
            fontSize: (isFocused || (value!='' && value!=undefined)) ? 13 : 18,
            color: isFocused ? onFocusColor : onBlurColor,
          },
        ]}
      >
        {label}
      </Animated.Text>
      <TextInput
        style={[styles.input, style]}
        placeholder={placeholder}
        placeholderTextColor={onBlurColor}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        autoCapitalize={autoCapitalize}
        autoCorrect={autoCorrect}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    </View>
  );
};


const styles = StyleSheet.create({
    container: {
      marginBottom: 16,
      width: '100%',
      paddingVertical: 10,
    },
    input: {
      height: 48,
      fontSize: 16,
      color: '#333',
      borderWidth: 1,
      borderColor: 'green', // Material UI primary color
      borderRadius: 4,
      paddingHorizontal: 12,
    },
    label: {
      position: 'relative',
      color: '#888',
      padding: 2,
      zIndex: 0,
    },
    labelFocused: {
        zIndex: 1,
        position: 'relative',
        left: 5,
    },
  });

export default CustomTextInput;
