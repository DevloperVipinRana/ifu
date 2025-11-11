import React from 'react';
import { SafeAreaView, StyleSheet, Text, View, Image, Pressable, ScrollView, Alert  } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { RootStackParamList } from '../../App';
import LinearGradient from 'react-native-linear-gradient';

type Props = NativeStackScreenProps<RootStackParamList, 'GameInfo'>;

const GameInfoScreen = ({ route, navigation }: Props) => {
  const { game } = route.params; // data passed from GamesScreen

  return (
    <LinearGradient colors={['#f0e6ff', '#d8e2ff', '#e0f7ff']}
            style={styles.backgroundGradient}>
              <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <Text style={styles.title}>{game.title}</Text>
        <Text style={styles.illustration}>{game.illustration}</Text>

        {/* Game Image */}
        <Image source={game.image} style={styles.gameImage} resizeMode="cover" />

        {/* Game Description */}
        <Text style={styles.description}>
          This is a fun and engaging game called "{game.title}". It's designed to improve your skills, 
          boost your mind, and help you relax while having fun. Track your progress and enjoy the 
          challenge!
        </Text>

        <Pressable
  onPress={() => {
    if (game.title === "Snake game") {
      navigation.navigate("SnakeGame");
    } else if (game.title === "Word guess") {
      navigation.navigate("WordGuess");
    } else if (game.title === "Simon says") {
      navigation.navigate("SimonStartScreen");
    } else if (game.title === "Memory Bloom") {
      navigation.navigate("MemoryBloomScreen");
    } else if (game.title === "2048") {
      navigation.navigate("twozeroGameScreen");
    } else {
      Alert.alert(`Starting ${game.title}... (Coming Soon 🚀)`);
    }
  }}
  style={{ borderRadius: 30, overflow: 'hidden' }} // important for rounded gradient
>
  <LinearGradient
    colors={['#7209e1ff', '#46a5dcff']} // light gradient (purple → blue)
    style={styles.playButton}
  >
    <Text style={styles.playButtonText}>Play Now</Text>
  </LinearGradient>
</Pressable>


<Pressable
  onPress={() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('GamesScreen');
    }
  }}
  style={{ borderRadius: 30, overflow: 'hidden', marginTop: 20 }}
>
  <LinearGradient
    colors={['#4adeefff', '#517eb2ff']} // light gradient (cyan → blue)
    style={styles.backButton}
  >
    <Text style={styles.backButtonText}>Back to Games</Text>
  </LinearGradient>
</Pressable>

      </ScrollView>
    </SafeAreaView>
            </LinearGradient>
    
  );
};

const styles = StyleSheet.create({
  backgroundGradient: { flex: 1 },
  container: { flex: 1 },
  scrollContainer: { padding: 20, alignItems: 'center' },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 10, textAlign: 'center', color: '#333' },
  illustration: { fontSize: 50, marginBottom: 20, fontWeight: '600', color: '#333' },
  gameImage: { width: '100%', height: 200, borderRadius: 20, marginBottom: 20 },
  description: { fontSize: 16, textAlign: 'center', color: '#333', marginBottom: 30, fontWeight: '800' },
  playButton: {
  paddingVertical: 15,
  paddingHorizontal: 40,
  borderRadius: 30,
  alignItems: 'center',
},
playButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },

backButton: {
  paddingVertical: 12,
  paddingHorizontal: 30,
  borderRadius: 30,
  alignItems: 'center',
},
backButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },

});

export default GameInfoScreen;
