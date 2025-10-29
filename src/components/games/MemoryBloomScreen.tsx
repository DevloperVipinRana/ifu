// mobile/src/screens/Games/MemoryBloomScreen.tsx

import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, FlatList, Text, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// import { createMemoryBoard, Card } from '../../utils/gameUtils';
import { createMemoryBoard, Card } from './MemoryBloomUtils';
// import { MemoryCard } from '../../components/Games/MemoryCard';
import { MemoryCard } from './MemoryCard';
import { ScreenTitle, Body } from '../../components/common/StyledText';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

const MEMORIZE_DURATION = 5;

type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';
const PAIRS: Record<Difficulty, number> = {
  EASY: 4,
  MEDIUM: 6,
  HARD: 8,
};

const MemoryBloomScreen = () => {
  const navigation = useNavigation();
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [gameState, setGameState] = useState<'SELECTING' | 'MEMORIZE' | 'PLAY' | 'WON'>('SELECTING');
  const [countdown, setCountdown] = useState(MEMORIZE_DURATION);
  const timeout = useRef<NodeJS.Timeout | null>(null);

  /**
   * Transitions the game back to the difficulty selection screen. This is a simple state change.
   */
  const returnToSelection = () => {
    setGameState('SELECTING');
  };

  /**
   * Resets all game data and starts a new game with the chosen difficulty.
   * This is the single source of truth for starting a new round.
   */
  const startGame = (difficulty: Difficulty) => {
    const numPairs = PAIRS[difficulty]; // This line is restored and correct
    setCards(createMemoryBoard(numPairs));
    setFlippedIndices([]);
    setMoves(0);
    setCountdown(MEMORIZE_DURATION);
    setGameState('MEMORIZE'); // Transition to the next state
  };

  // Handles the "Memorize" phase countdown.
  useEffect(() => {
    if (gameState !== 'MEMORIZE') {
      return;
    }
    if (countdown === 0) {
      setGameState('PLAY');
      return;
    }
    const timerId = setInterval(() => {
      setCountdown(c => c - 1);
    }, 1000);
    return () => clearInterval(timerId);
  }, [gameState, countdown]);

  // Handles checking for matches when two cards are flipped.
  useEffect(() => {
    if (flippedIndices.length === 2) {
      const [firstIndex, secondIndex] = flippedIndices;
      if (cards[firstIndex].iconName === cards[secondIndex].iconName) {
        setCards(currentCards =>
          currentCards.map(card =>
            card.iconName === cards[firstIndex].iconName ? { ...card, isMatched: true } : card
          )
        );
        setFlippedIndices([]);
      } else {
        timeout.current = setTimeout(() => {
          setFlippedIndices([]);
        }, 1000);
      }
    }
    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    };
  }, [flippedIndices, cards]);

  // Checks for the win condition and shows the alert.
  useEffect(() => {
    // Only check for a win if we are in the 'PLAY' state and the board is not empty.
    if (gameState === 'PLAY' && cards.length > 0 && cards.every(card => card.isMatched)) {
      setGameState('WON'); // Mark the game as won
      Alert.alert(
        "Congratulations!",
        `You completed the game in ${moves} moves.`,
        [{ text: "Play Again", onPress: returnToSelection }], // On press, simply go back to selection
        { cancelable: false }
      );
    }
  }, [cards, gameState, moves]);

  // Handles user pressing a card.
  const handleCardPress = (index: number) => {
    if (gameState !== 'PLAY' || flippedIndices.length === 2 || cards[index].isMatched || flippedIndices.includes(index)) {
      return;
    }
    setFlippedIndices(prev => [...prev, index]);
    if (flippedIndices.length === 1) {
      setMoves(m => m + 1);
    }
  };

  // --- RENDER LOGIC ---

  // State-driven rendering: if the state is 'SELECTING', show the difficulty menu.
  if (gameState === 'SELECTING') {
    return (
      <LinearGradient colors={['#F8F9FA', '#EBF4FF']} style={styles.container}>
        <SafeAreaView style={styles.flexContainer}>
          <View style={styles.difficultyContainer}>
            <View style={styles.difficultyHeader}>
              <ScreenTitle style={styles.difficultyTitle}>Memory Bloom</ScreenTitle>
              <Body style={styles.difficultySubtitle}>Choose your challenge</Body>
            </View>
            <TouchableOpacity style={styles.difficultyCard} activeOpacity={0.8} onPress={() => startGame('EASY')}>
              <LinearGradient colors={['#68D391', '#38A169']} style={styles.difficultyGradient}>
                <Icon name="leaf-outline" size={32} color="white" />
                <View style={styles.difficultyTextContainer}>
                  <Text style={styles.difficultyCardTitle}>Easy</Text>
                  <Text style={styles.difficultyCardSubtitle}>4 Pairs</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity style={styles.difficultyCard} activeOpacity={0.8} onPress={() => startGame('MEDIUM')}>
              <LinearGradient colors={['#63B3ED', '#3182CE']} style={styles.difficultyGradient}>
                <Icon name="bonfire-outline" size={32} color="white" />
                <View style={styles.difficultyTextContainer}>
                  <Text style={styles.difficultyCardTitle}>Medium</Text>
                  <Text style={styles.difficultyCardSubtitle}>6 Pairs</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity style={styles.difficultyCard} activeOpacity={0.8} onPress={() => startGame('HARD')}>
              <LinearGradient colors={['#F6AD55', '#ED8936']} style={styles.difficultyGradient}>
                <Icon name="rocket-outline" size={32} color="white" />
                <View style={styles.difficultyTextContainer}>
                  <Text style={styles.difficultyCardTitle}>Hard</Text>
                  <Text style={styles.difficultyCardSubtitle}>8 Pairs</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  // For all other states ('MEMORIZE', 'PLAY', 'WON'), show the game board.
  return (
    <SafeAreaView style={styles.gameContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Icon name="arrow-back" size={24} color="#4A5568" /></TouchableOpacity>
        <ScreenTitle>Memory Bloom</ScreenTitle>
        <TouchableOpacity onPress={returnToSelection}><Icon name="refresh" size={24} color="#4A5568" /></TouchableOpacity>
      </View>
      <Body style={styles.movesText}>Moves: {moves}</Body>
      <FlatList
        data={cards}
        keyExtractor={item => item.id}
        numColumns={4}
        renderItem={({ item, index }) => (
          <MemoryCard
            iconName={item.iconName}
            isFlipped={gameState === 'MEMORIZE' || flippedIndices.includes(index) || item.isMatched}
            isMatched={item.isMatched}
            onPress={() => handleCardPress(index)}
            disabled={gameState !== 'PLAY'}
          />
        )}
        contentContainerStyle={styles.board}
      />
      {gameState === 'MEMORIZE' && (
        <View style={styles.overlay}>
          <Text style={styles.overlayText}>Memorize!</Text>
          <Text style={styles.countdownText}>{countdown}</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  flexContainer: { flex: 1 },
  gameContainer: { flex: 1, backgroundColor: '#F8F9FA' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  movesText: {
    textAlign: 'center',
    fontSize: 18,
    marginBottom: 10,
    color: '#4A5568',
  },
  board: {
    padding: 10,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  countdownText: {
    fontSize: 32,
    fontWeight: '600',
    color: 'white',
    marginTop: 10,
  },
  difficultyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  difficultyHeader: {
    alignItems: 'center',
    marginBottom: 60,
  },
  difficultyTitle: {
    fontSize: 42,
    color: '#2D3748',
    marginBottom: 8,
  },
  difficultySubtitle: {
    fontSize: 18,
    color: '#718096',
  },
  difficultyCard: {
    width: '90%',
    height: 100,
    marginBottom: 25,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10,
  },
  difficultyGradient: {
    flex: 1,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 25,
  },
  difficultyTextContainer: {
    marginLeft: 20,
  },
  difficultyCardTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  difficultyCardSubtitle: {
    color: 'white',
    fontSize: 16,
    opacity: 0.8,
  },
});

export default MemoryBloomScreen;