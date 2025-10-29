//1 min ProgressBar

// mobile/src/components/common/ProgressBar.tsx

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { colors } from '../../theme/color';

interface ProgressBarProps {
  progress?: number; // A value from 0 to 100
  color: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress, color }) => {
  const animatedWidth = useRef(new Animated.Value(progress)).current;

  useEffect(() => {
    // Animate the bar width when the progress prop changes
    Animated.timing(animatedWidth, {
      toValue: progress,
      duration: 1000, // Matches the 1-second interval of the timer
      useNativeDriver: false, // width animation is not supported by native driver
    }).start();
  }, [progress]);

  const widthInterpolate = animatedWidth.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.track}>
      <Animated.View style={[styles.bar, { width: widthInterpolate, backgroundColor: color }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  track: {
    height: 12,
    width: '100%',
    backgroundColor: colors.border,
    borderRadius: 6,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    borderRadius: 6,
  },
});