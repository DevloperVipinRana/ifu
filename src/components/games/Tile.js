import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/color1';

const Tile = ({ value }) => {
  const getTileStyle = (val) => {
    switch (val) {
      case 2: return styles.tile2;
      case 4: return styles.tile4;
      case 8: return styles.tile8;
      case 16: return styles.tile16;
      case 32: return styles.tile32;
      case 64: return styles.tile64;
      case 128: return styles.tile128;
      case 256: return styles.tile256;
      case 512: return styles.tile512;
      case 1024: return styles.tile1024;
      case 2048: return styles.tile2048;
      default: return styles.emptyTile;
    }
  };

  const getTextStyle = (val) => {
    if (val >= 8) {
      return { color: colors.text.onGradient };
    }
    return { color: colors.text.primary };
  };

  return (
    <View style={[styles.tile, getTileStyle(value)]}>
      {value > 0 && <Text style={[styles.tileText, getTextStyle(value)]}>{value}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  tile: {
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    margin: 5,
  },
  tileText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  emptyTile: {
    backgroundColor: colors.background.primary,
  },
  tile2: { backgroundColor: '#EEE4DA' },
  tile4: { backgroundColor: '#EDE0C8' },
  tile8: { backgroundColor: '#F2B179' },
  tile16: { backgroundColor: '#F59563' },
  tile32: { backgroundColor: '#F67C5F' },
  tile64: { backgroundColor: '#F65E3B' },
  tile128: { backgroundColor: '#EDCF72' },
  tile256: { backgroundColor: '#EDCC61' },
  tile512: { backgroundColor: '#EDC850' },
  tile1024: { backgroundColor: '#EDC53F' },
  tile2048: { backgroundColor: '#EDC22E' },
});

export default Tile;