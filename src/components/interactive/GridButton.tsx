// mobile/src/components/interactive/GridButton.tsx

import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons'; // Example icon library
import { Body } from '../common/StyledText';
import { colors } from '../../theme/color';

interface GridButtonProps {
  title: string;
  iconName: string;
  gradient: string[];
  onPress: () => void;
}

export const GridButton: React.FC<GridButtonProps> = ({ title, iconName, gradient, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <LinearGradient colors={gradient} style={styles.gradient}>
        <Icon name={iconName} size={40} color={colors.text.onGradient} />
        <Body style={styles.title}>{title}</Body>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 8,
    aspectRatio: 1, // Makes the button a perfect square
    borderRadius: 20,
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  gradient: {
    flex: 1,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  title: {
    color: colors.text.onGradient,
    fontFamily: 'Inter-SemiBold',
    marginTop: 10,
    textAlign: 'center',
    fontSize: 14,
  },
});