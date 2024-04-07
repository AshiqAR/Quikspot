// UserReviews.js

import React from "react";
import {View, Text, FlatList, StyleSheet, Dimensions} from "react-native";

const screenWidth = Dimensions.get("window").width;
const CARD_WIDTH = screenWidth * 0.8;
const CARD_MARGIN = 15;

const UserReviews = ({reviews}) => {
  const renderReview = ({item}) => (
    <View style={styles.reviewCard}>
      <Text style={styles.reviewText}>{item.review}</Text>
      <Text style={styles.reviewerName}>- {item.userName}</Text>
    </View>
  );

  return (
    <View style={styles.reviewsContainer}>
      <Text style={styles.userReviewsTitle}>User Reviews</Text>
      <FlatList
        data={reviews}
        renderItem={renderReview}
        keyExtractor={(item, index) => index.toString()}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + CARD_MARGIN * 2}
        decelerationRate="fast"
        contentContainerStyle={{
          paddingLeft: CARD_MARGIN,
          paddingRight: CARD_MARGIN,
        }}
        ListEmptyComponent={
          <Text style={{marginLeft: 15, color: "#666"}}>
            No reviews available
          </Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  reviewsContainer: {
    marginBottom: 20,
  },
  userReviewsTitle: {
    fontSize: 18,
    marginVertical: 15,
    color: "#333",
    fontWeight: "bold",
    marginLeft: 15,
  },
  reviewCard: {
    width: CARD_WIDTH,
    backgroundColor: "#F0F0F0",
    padding: 15,
    marginHorizontal: CARD_MARGIN,
    borderRadius: 8,
  },
  reviewText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 5,
  },
  reviewerName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#444",
  },
});

export default UserReviews;
