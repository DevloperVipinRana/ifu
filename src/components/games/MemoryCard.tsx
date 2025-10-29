// mobile/src/components/Games/MemoryCard.tsx

import React, { useEffect, useRef } from 'react';
import { StyleSheet, Animated, TouchableOpacity } from 'react-native'; // Import TouchableOpacity here
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

interface MemoryCardProps {
  iconName: string;
  isFlipped: boolean;
  isMatched: boolean;
  onPress: () => void;
  disabled: boolean;
}

// Define our beautiful new color palettes
const gradients = {
  back: ['#4a5568', '#2d3748'],       // Subtle, cool dark gray
  front: ['#63b3ed', '#3182ce'],      // Vibrant blue
  matched: ['#68d391', '#38a169'],     // Success green
};

export const MemoryCard: React.FC<MemoryCardProps> = ({ iconName, isFlipped, isMatched, onPress, disabled }) => {
  const animatedValue = useRef(new Animated.Value(isFlipped ? 180 : 0)).current;
  const scaleValue = useRef(new Animated.Value(1)).current; // For the match "pop" animation

  // Flip animation handler
  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isFlipped ? 180 : 0,
      duration: 400, // Slightly slower for a smoother feel
      useNativeDriver: true,
    }).start();
  }, [isFlipped]);

  // "Pop" animation when a match is found
  useEffect(() => {
    if (isMatched) {
      Animated.sequence([
        Animated.timing(scaleValue, { toValue: 1.1, duration: 150, useNativeDriver: true }),
        Animated.timing(scaleValue, { toValue: 1, duration: 150, useNativeDriver: true }),
      ]).start();
    }
  }, [isMatched]);

  const frontInterpolate = animatedValue.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = animatedValue.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });

  // Apply all animated transforms
  const frontAnimatedStyle = { transform: [{ rotateY: frontInterpolate }] };
  const backAnimatedStyle = { transform: [{ rotateY: backInterpolate }] };
  const scaleAnimatedStyle = { transform: [{ scale: scaleValue }] };

  return (
    // The TouchableOpacity is now the main container that gets the size and animations
    <TouchableOpacity
      style={[styles.cardContainer, scaleAnimatedStyle]}
      onPress={onPress}
      disabled={disabled || isFlipped || isMatched}
      activeOpacity={0.8} // Good practice for visual feedback on press
    >
        {/* Card Back (Flower) */}
        <Animated.View style={[styles.card, frontAnimatedStyle]}>
          <LinearGradient colors={gradients.back} style={styles.gradient}>
            <Icon name="flower-outline" size={40} color={'#e2e8f0'} />
          </LinearGradient>
        </Animated.View>

        {/* Card Front (Revealed Icon) */}
        <Animated.View style={[styles.card, backAnimatedStyle]}>
          <LinearGradient colors={isMatched ? gradients.matched : gradients.front} style={styles.gradient}>
            <Icon name={iconName} size={40} color={'white'} />
          </LinearGradient>
        </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    aspectRatio: 1,
    margin: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
    // Add a fallback background color to help with rendering
    backgroundColor: 'transparent',
  },
  card: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backfaceVisibility: 'hidden',
    borderRadius: 18,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
  },
});