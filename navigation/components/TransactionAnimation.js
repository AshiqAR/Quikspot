import React from "react";
import {View, StyleSheet, Text} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  withRepeat,
  interpolateColor,
  interpolate,
} from "react-native-reanimated";
import LinearGradient from "react-native-linear-gradient";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const gradientColors = [
  ["#ff9a9e", "#fad0c4"],
  ["#a18cd1", "#fbc2eb"],
  ["#84fab0", "#8fd3f4"],
  ["#a6c0fe", "#f68084"],
  ["#ff7e5f", "#feb47b"],
  ["#ff9a9e", "#fad0c4"],
  ["#2E3192", "#1BFFFF"],
  ["#c2e59c", "#64b3f4"],
  ["#00fffc", "#00ffff"],
  ["#f9d423", "#ff4e50"],
  ["#141E30", "#243B55"],
  ["#bdc3c7", "#2c3e50"],
  ["#f09819", "#edde5d"],
  ["#5A3F37", "#2C7744"],
  ["#a8e063", "#56ab2f"],
  ["#4CAF50", "#00695C"], // green shade
];

const greenShadeGradients = [
  ["#4CAF50", "#00695C"], // Green to darker green
  ["#a8e063", "#56ab2f"], // Light green to green
  ["#2ecc71", "#3498db"], // Green to blue
  ["#00b09b", "#96c93d"], // Teal to lime green
  ["#76b852", "#8DC26F"], // Olive green to lighter olive
  ["#1D976C", "#93F9B9"], // Turquoise green to light green
  ["#004D40", "#48A999"], // Deep green to medium sea green
  ["#2ECC40", "#AAFFA9"], // Lime green to very light green
  ["#16A085", "#F4D03F"], // Sea green to yellow
  ["#004D40", "#00BFA5"], // Deep green to teal
  ["#11998E", "#38EF7D"], // Teal to bright green
  ["#6A9113", "#141517"], // Olive green to almost black
  ["#00C851", "#FEE140"], // Bright green to yellow
  ["#009688", "#B2EBF2"], // Teal to light cyan
  ["#88B04B", "#F7DC6F"], // Pear green to banana mania
  ["#32CD32", "#7FFF00"], // Lime green to chartreuse
];

const AnimatedIcon = Animated.createAnimatedComponent(MaterialCommunityIcons);

const TransactionAnimation = ({message}) => {
  const progress = useSharedValue(0);

  const customEasing = Easing.bezier(0.22, 1, 0.36, 1);

  const animatedBallStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {translateX: progress.value * (250 - 20)},
        {scale: 1 + progress.value * 0.5},
      ],
    };
  });

  const animatedCarStyle = useAnimatedStyle(() => {
    // Calculate the starting position from the right edge to the center
    // Assuming the container width is 250
    // Assuming the icon's width is about 40, so the center would be at (250 / 2) - (40 / 2) = 105
    // The car starts from the right edge (250 - 40 = 210) and moves towards 105
    // Using interpolate to smoothly transition the translateX value based on the progress
    const translateX = interpolate(progress.value, [0, 1], [0, -210]);
    return {
      position: "absolute",
      transform: [{translateX}],
      opacity: interpolate(progress.value, [0, 0.5, 1], [1, 0.8, 0]),
    };
  });

  const animatedContainerStyle = useAnimatedStyle(() => {
    const scale = interpolate(progress.value, [0, 0.5, 1], [1, 1.05, 1]);
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      ["#ffffff", "#4CAF50"]
    );
    return {
      backgroundColor,
      transform: [{scale}],
    };
  });

  const AnimatedLinearGradient =
    Animated.createAnimatedComponent(LinearGradient);

  const animatedRupeeStyle = useAnimatedStyle(() => {
    const rotate = interpolate(progress.value, [0, 1], [0, 360]);
    const scale = interpolate(progress.value, [0, 0.5, 1], [1, 1.5, 1]);
    return {
      transform: [{rotate: `${rotate}deg`}, {scale}],
    };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(progress.value, [0, 0.5, 1], [0, 1, 1]),
    };
  });

  React.useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, {duration: 2000, easing: customEasing}),
      -1,
      true
    );
  }, []);

  return (
    <AnimatedLinearGradient
      colors={greenShadeGradients[0]} // Use the same gradient colors as the container
      style={[styles.container, animatedContainerStyle]}
    >
      <AnimatedLinearGradient
        colors={gradientColors[9]} // Use the same gradient colors as the container
        style={[styles.ballGradient, animatedBallStyle]} // Apply the same animation styles as the ball
      />
      <Animated.View style={[styles.ball, animatedBallStyle]} />

      {/* <Animated.Text style={[styles.rupee, animatedRupeeStyle]}>
        {"\u20B9"}
      </Animated.Text> */}
      <AnimatedIcon
        name="car-brake-parking" // Ensure you have the correct icon name
        size={39} // Adjust the size as needed
        style={[animatedCarStyle]} // Apply the animated style for left-to-right motion
        color="#000" // Icon color
      />
      <Animated.Text style={[styles.statusText, animatedTextStyle]}>
        {message}
      </Animated.Text>
    </AnimatedLinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: 80, // Increased height for better visibility of elements
    overflow: "hidden",
    padding: 20,
  },
  ball: {
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: "lightgreen",
    opacity: 0.3,
    shadowColor: "#000",
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    position: "absolute",
  },
  rupee: {
    fontSize: 48, // Larger for emphasis
    color: "#000",
    fontWeight: "bold",
    position: "absolute",
  },
  statusText: {
    marginTop: 10,
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
  icon: {
    position: "absolute",
  },
});

export default TransactionAnimation;
