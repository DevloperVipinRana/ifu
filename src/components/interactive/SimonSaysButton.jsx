import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';

const GameButton = ({ color, onPress, isActive, disabled }) => { // 1. Add 'disabled'
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled} // 2. Pass it to TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: color },
        isActive ? styles.activeButton : styles.inactiveButton,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  button: {
    width: 150,
    height: 150,
    borderRadius: 75, // Makes it a circle
    margin: 10,
    borderWidth: 5,
    borderColor: 'white',
  },
  activeButton: {
    opacity: 1.0,
  },
  inactiveButton: {
    opacity: 0.6,
  },
});

export default GameButton;