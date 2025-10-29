
import { View, StyleSheet } from 'react-native';
import Tile from './Tile';
import { colors } from '../../theme/color1';


const GameBoard = ({ board }) => {
  return (
    <View style={styles.board}>
      {board.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((value, colIndex) => (
            <Tile key={colIndex} value={value} />
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  board: {
    backgroundColor: colors.border,
    borderRadius: 5,
    padding: 5,
  },
  row: {
    flexDirection: 'row',
  },
});

export default GameBoard;