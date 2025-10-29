// mobile/src/components/interactive/GradientButton.tsx

import React from 'react';
import { TouchableOpacity, StyleSheet, TouchableOpacityProps } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../../theme/color.ts';
import { ButtonText } from '../common/StyledText.tsx'; // <-- We are using our StyledText!

interface GradientButtonProps extends TouchableOpacityProps {
  title: string;
  // We can pass different gradients, but let's default to one from our theme
  gradient?: string[]; 
}

export const GradientButton: React.FC<GradientButtonProps> = ({ 
  title, 
  onPress, 
  style,
  gradient = colors.gradient.passion, // Default to the pink/purple gradient
  ...props 
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.container, style]} {...props}>
      <LinearGradient
        colors={gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <ButtonText>{title}</ButtonText>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    // Defines the shadow for iOS
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // Defines the shadow for Android
    elevation: 5,
    borderRadius: 15, // Important for shadow to respect the shape
  },
  gradient: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
});