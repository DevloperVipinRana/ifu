import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Image, Animated, Easing, ViewStyle } from 'react-native';

interface Card {
  imgSrc: any;
  color: string;
}

interface AnimatedCardProps {
  imgSrc: any;
  color: string;
}

interface CardColumnProps {
  cards: Card[];
  direction?: 'up' | 'down';
  duration?: number;
  style?: ViewStyle;
  isFocused: boolean;
}
 
// This is a single card in the column
const AnimatedCard = ({ imgSrc, color }: AnimatedCardProps) => (
  <View style={styles.card}>
    <Image source={imgSrc} style={styles.image} />
    <View style={[styles.overlay, { backgroundColor: color, opacity: 0.3 }]} />
  </View>
);
 
const CardColumn = ({ cards, direction = 'up', duration = 25000, style, isFocused }: CardColumnProps) => {
  const animationValue = useRef(new Animated.Value(0)).current;
 
  const animation = useRef(
    Animated.loop(
      Animated.timing(animationValue, {
        toValue: 1,
        duration: duration,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    )
  ).current;
 
  useEffect(() => {
    if (isFocused) {
      animation.start();
    } else {
      animation.stop();
      animationValue.setValue(0); // Reset animation
    }

    return () => animation.stop();
  }, [isFocused, animation, animationValue]);
 
  // Triple the cards for a smoother infinite loop
  const duplicatedCards = [...cards, ...cards, ...cards];
  const totalHeight = cards.length * (CARD_HEIGHT + CARD_MARGIN);
 
  // Interpolate based on direction
  // For down direction, start from negative position to fill the top
  const translateY = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: direction === 'up' ? [0, -totalHeight] : [-totalHeight, 0],
  });
 
  return (
    <View style={[styles.column, style]}>
      <Animated.View style={{ transform: [{ translateY }] }}>
        {duplicatedCards.map((card, index) => (
          <AnimatedCard key={`card-${index}`} {...card} />
        ))}
      </Animated.View>
    </View>
  );
};
 
// Define constants for card dimensions to calculate total height
const CARD_HEIGHT = 180;
const CARD_MARGIN = 16;
 
const styles = StyleSheet.create({
  column: {
    flex: 1,
    marginHorizontal: 8,
    overflow: 'hidden', // Changed from 'visible' to 'hidden'
  },
  card: {
    width: '100%',
    height: CARD_HEIGHT,
    marginBottom: CARD_MARGIN,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
  },
});
 
export default CardColumn;