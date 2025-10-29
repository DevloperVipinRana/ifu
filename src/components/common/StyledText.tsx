// mobile/src/components/common/StyledText.tsx

import React from 'react';
import { Text, StyleSheet, TextProps } from 'react-native';
import { colors } from '../../theme/color.ts'; // <-- Using your central color theme

// A base component to share common styles
const BaseText: React.FC<TextProps> = ({ style, ...props }) => {
  return <Text style={[styles.base, style]} {...props} />;
};

// Create a component for each text style in your new theme
export const ScreenTitle: React.FC<TextProps> = ({ style, ...props }) => {
  return <BaseText style={[styles.screenTitle, style]} {...props} />;
};

export const CardHeader: React.FC<TextProps> = ({ style, ...props }) => {
  return <BaseText style={[styles.cardHeader, style]} {...props} />;
};

export const Body: React.FC<TextProps> = ({ style, ...props }) => {
  return <BaseText style={[styles.body, style]} {...props} />;
};

export const ButtonText: React.FC<TextProps> = ({ style, ...props }) => {
  return <BaseText style={[styles.buttonText, style]} {...props} />;
};

const styles = StyleSheet.create({
  // Base style for all text
  base: {
    fontFamily: 'Inter-Regular', // <-- Using Inter as the default
    color: colors.text.primary,
  },
  // Specific styles from your new UDS
  screenTitle: {
    fontFamily: 'Inter-Bold', // <-- Using Inter
    fontSize: 28,
  },
  cardHeader: {
    fontFamily: 'Inter-SemiBold', // <-- Using Inter
    fontSize: 18,
  },
  body: {
    fontFamily: 'Inter-Regular', // <-- Using Inter
    fontSize: 16,
    lineHeight: 24, 
    color: colors.text.secondary,
  },
  buttonText: {
    fontFamily: 'Inter-Medium', // <-- Using Inter
    fontSize: 15,
    color: colors.text.onGradient,
  },
});