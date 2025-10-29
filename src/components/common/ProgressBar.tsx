//5 min activity progress bar
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import * as Progress from 'react-native-progress';

const ProgressBar = ({ duration, timeLeft, formattedTime }) => {
  const progress = 1 - (timeLeft / duration);

  return (
    <View style={styles.container}>
      <Text style={styles.timerText}>{formattedTime}</Text>
      <Progress.Bar
        progress={progress}
        width={null} // Fills the container
        height={12}
        color={'#34D399'} // A nice success green
        unfilledColor={'rgba(255, 255, 255, 0.2)'}
        borderWidth={0}
        style={styles.progressBar}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    marginTop: 30,
  },
  timerText: {
    color: 'white',
    fontSize: 64,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 15,
  },
  progressBar: {
    borderRadius: 6,
    width: '100%',
  },
});

export default ProgressBar;