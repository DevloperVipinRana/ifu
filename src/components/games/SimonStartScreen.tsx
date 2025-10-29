import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';

const GameStartScreen = ({ navigation }) => {
  return (
    <LinearGradient
      colors={['#f0e6ff', '#d8e2ff', '#e0f7ff']}
      style={styles.container}>
      <SafeAreaView style={styles.content}>
        <Icon name="target" size={80} color="#374151" />
        <Text style={styles.title}>Simon Says</Text>
        <Text style={styles.instructions}>
          Repeat the pattern of lights and sounds.
        </Text>
        <View style={styles.levelContainer}>
    <TouchableOpacity
        style={styles.levelButton}
        onPress={() => navigation.navigate('SimonSaysScreen', { level: 'beginner' })}
    >
        <Text style={styles.levelButtonText}>Beginner (4)</Text>
    </TouchableOpacity>
    <TouchableOpacity
        style={styles.levelButton}
        onPress={() => navigation.navigate('SimonSaysScreen', { level: 'intermediate' })}
    >
        <Text style={styles.levelButtonText}>Intermediate (6)</Text>
    </TouchableOpacity>
    <TouchableOpacity
        style={styles.levelButton}
        onPress={() => navigation.navigate('SimonSaysScreen', { level: 'expert' })}
    >
        <Text style={styles.levelButtonText}>Expert (8)</Text>
    </TouchableOpacity>
</View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 20,
  },
  instructions: {
    fontSize: 18,
    color: '#4B5563',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 50,
  },
  playButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 8,
  },
  playButtonText: {
    color: 'white',
    fontSize: 22,
    fontWeight: '600',
  },
  levelContainer: {
    marginTop: 40,
    width: '100%',
    alignItems: 'center',
},
levelButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 15,
    width: '80%',
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 8,
},
levelButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
},
});

export default GameStartScreen;