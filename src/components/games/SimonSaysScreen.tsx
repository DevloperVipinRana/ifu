// mobile/src/screens/Game/GameScreen.tsx

import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import GameButton from '../interactive/SimonSaysButton';
import Sound from 'react-native-sound';

// --- Game Constants ---
const LEVEL_CONFIG = {
  beginner: {
    colors: ['#22c55e', '#ef4444', '#f59e0b', '#3b82fd'], // Green, Red, Yellow, Blue
    soundFiles: ['sound1.mp3', 'sound2.mp3', 'sound3.wav', 'sound4.mp3'],
  },
  intermediate: {
    colors: ['#22c55e', '#ef4444', '#f59e0b', '#3b82fd', '#8b5cf6', '#ec4899'], // + Purple, Pink
    soundFiles: ['sound1.mp3', 'sound2.mp3', 'sound3.wav', 'sound4.mp3', 'sound1.mp3', 'sound2.mp3'],
  },
  expert: {
    colors: ['#22c55e', '#ef4444', '#f59e0b', '#3b82fd', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'], // + Teal, Orange
    soundFiles: ['sound1.mp3','sound2.mp3','sound3.wav','sound4.mp3','sound1.wav','sound2.mp3','sound3.wav','sound4.mp3'],
  },
};

const gameOverSoundFile = 'gameover.mp3';

const GameScreen = ({ navigation, route }) => {
  const { level } = route.params;
  const config = LEVEL_CONFIG[level];

  const [sounds, setSounds] = useState<Sound[]>([]);
  const [gameOverSound, setGameOverSound] = useState<Sound | null>(null);
  const [soundsLoaded, setSoundsLoaded] = useState(false);

  const [sequence, setSequence] = useState<number[]>([]);
  const [playerSequence, setPlayerSequence] = useState<number[]>([]);
  const [activeButton, setActiveButton] = useState<number | null>(null);
  const [isPlayerTurn, setIsPlayerTurn] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);

  // --- Preload sounds ---
  useEffect(() => {
    const preloadSounds = async () => {
      const loadedSounds: Sound[] = config.soundFiles.map(
        file => new Sound(file, Sound.MAIN_BUNDLE, (error) => {
          if (error) console.error('Sound load error:', error, file);
        })
      );
      const loadedGameOver = new Sound(gameOverSoundFile, Sound.MAIN_BUNDLE, (err) => {
        if (err) console.error('GameOver sound error:', err);
      });
      setSounds(loadedSounds);
      setGameOverSound(loadedGameOver);
      setSoundsLoaded(true);
    };
    preloadSounds();
  }, []);

  // --- Start game ---
  useEffect(() => {
    if (soundsLoaded) startGame();
  }, [soundsLoaded]);

  const startGame = () => {
    setSequence([]);
    setPlayerSequence([]);
    setScore(0);
    setIsGameOver(false);
    setIsPlayerTurn(false);
    setTimeout(() => nextRound([]), 500);
  };

  const nextRound = (currentSequence: number[]) => {
    const newColorIndex = Math.floor(Math.random() * config.colors.length);
    const newSequence = [...currentSequence, newColorIndex];
    setSequence(newSequence);
    setPlayerSequence([]);
    playSequence(newSequence);
  };

  const playSequence = async (seq: number[]) => {
    setIsPlayerTurn(false);
    for (const idx of seq) {
      setActiveButton(idx);
      await playSound(idx);
      await delay(600);
      setActiveButton(null);
      await delay(200);
    }
    setIsPlayerTurn(true);
  };

  const playSound = (idx: number) => {
    return new Promise<void>((resolve) => {
      const sound = sounds[idx];
      if (!sound) return resolve();
      sound.play((success) => resolve());
    });
  };

  const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

  const handlePlayerPress = async (idx: number) => {
    if (!isPlayerTurn || isGameOver) return;
    setPlayerSequence(prev => [...prev, idx]);
    await playSound(idx);

    const curIdx = playerSequence.length;
    if (idx !== sequence[curIdx]) {
      gameOverSound?.play();
      setIsGameOver(true);
      Alert.alert('Game Over!', `Your score is ${score}`);
      return;
    }

    if (playerSequence.length + 1 === sequence.length) {
      setScore(prev => prev + 1);
      setTimeout(() => nextRound(sequence), 800);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.scoreText}>Score: {score}</Text>
      </View>

      {isGameOver ? (
        <View style={styles.gameOverContainer}>
          <Text style={styles.gameOverText}>Game Over</Text>
          <TouchableOpacity style={styles.gameOverButton} onPress={startGame}>
            <Text style={styles.buttonText}>Play Again</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.gameOverButton} onPress={() => navigation.goBack()}>
            <Text style={styles.buttonText}>Quit</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.gameBoard}>
          <View style={styles.buttonContainer}>
            {config.colors.map((color, index) => (
              <GameButton
                key={index}
                color={color}
                onPress={() => handlePlayerPress(index)}
                isActive={activeButton === index}
                disabled={!isPlayerTurn}
              />
            ))}
          </View>
          <View style={styles.footer}>
            <Text style={styles.turnText}>
              {isPlayerTurn ? "Your Turn" : "Watch Closely..."}
            </Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1F2937' },
  header: { height: '15%', justifyContent: 'center', alignItems: 'center' },
  scoreText: { fontSize: 32, fontWeight: 'bold', color: 'white' },
  gameBoard: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  buttonContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', width: '100%' },
  footer: { height: '15%', justifyContent: 'center', alignItems: 'center' },
  turnText: { fontSize: 24, color: 'white', fontStyle: 'italic' },
  gameOverContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  gameOverText: { fontSize: 48, fontWeight: 'bold', color: '#ef4444', marginBottom: 30 },
  gameOverButton: { backgroundColor: '#3B82F6', paddingVertical: 12, paddingHorizontal: 40, borderRadius: 25, margin: 10 },
  buttonText: { color: 'white', fontSize: 18, fontWeight: '600' },
});

export default GameScreen;




// import React, { useState, useEffect } from 'react';
// import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
// // import GameButton from '../components/GameButton';
// import GameButton from '../interactive/SimonSaysButton';
// import Sound from 'react-native-sound';

// // --- Game Constants ---
// // REPLACE the old COLORS and SOUNDS constants with this config object
// const LEVEL_CONFIG = {
//   beginner: {
//     colors: ['#22c55e', '#ef4444', '#f59e0b', '#3b82fd'], // Green, Red, Yellow, Blue
//     sounds: [
//       new Sound('sound1.mp3', Sound.MAIN_BUNDLE),
//       new Sound('sound2.mp3', Sound.MAIN_BUNDLE),
//       new Sound('sound3.wav', Sound.MAIN_BUNDLE),
//       new Sound('sound4.mp3', Sound.MAIN_BUNDLE),
//     ],
//   },
//   intermediate: {
//     colors: ['#22c55e', '#ef4444', '#f59e0b', '#3b82fd', '#8b5cf6', '#ec4899'], // + Purple, Pink
//     sounds: [
//       new Sound('sound1.mp3', Sound.MAIN_BUNDLE),
//       new Sound('sound2.mp3', Sound.MAIN_BUNDLE),
//       new Sound('sound3.wav', Sound.MAIN_BUNDLE),
//       new Sound('sound4.mp3', Sound.MAIN_BUNDLE),
//       new Sound('sound1.mp3', Sound.MAIN_BUNDLE), // Reusing sounds, replace with new ones
//       new Sound('sound2.mp3', Sound.MAIN_BUNDLE),
//     ],
//   },
//   expert: {
//     colors: ['#22c55e', '#ef4444', '#f59e0b', '#3b82fd', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'], // + Teal, Orange
//     sounds: [
//       new Sound('sound1.mp3', Sound.MAIN_BUNDLE),
//       new Sound('sound2.mp3', Sound.MAIN_BUNDLE),
//       new Sound('sound3.wav', Sound.MAIN_BUNDLE),
//       new Sound('sound4.mp3', Sound.MAIN_BUNDLE),
//       new Sound('sound1.wav', Sound.MAIN_BUNDLE),
//       new Sound('sound2.mp3', Sound.MAIN_BUNDLE),
//       new Sound('sound3.wav', Sound.MAIN_BUNDLE),
//       new Sound('sound4.mp3', Sound.MAIN_BUNDLE),
//     ],
//   },
// };

// const gameOverSound = new Sound('gameover.mp3', Sound.MAIN_BUNDLE);

// const GameScreen = ({ navigation, route }) => {
//   const { level } = route.params; // Get the chosen level
//   const config = LEVEL_CONFIG[level];



//   const [sequence, setSequence] = useState([]);
//   const [playerSequence, setPlayerSequence] = useState([]);
//   const [activeButton, setActiveButton] = useState(null); // Which button is currently lit
//   const [isPlayerTurn, setIsPlayerTurn] = useState(false);
//   const [isGameOver, setIsGameOver] = useState(false);
//   const [score, setScore] = useState(0);

//   // --- Game Logic ---
//   const startGame = () => {
//     setSequence([]);
//     setPlayerSequence([]);
//     setScore(0);
//     setIsGameOver(false);
//     setIsPlayerTurn(false);
//     // Use a timeout to give the user a moment before the first round
//     setTimeout(() => nextRound([]), 1000);
//   };

//   const nextRound = (currentSequence) => {
//     const newColorIndex = Math.floor(Math.random() * config.colors.length);
//     const newSequence = [...currentSequence, newColorIndex];
//     setSequence(newSequence);
//     setPlayerSequence([]);
//     playSequence(newSequence);
//   };

//  const playSequence = async (seq) => {
//     console.log("--- Starting Computer's Turn ---");
//     console.log("Sequence to play:", seq);
//     setIsPlayerTurn(false);

//     for (const colorIndex of seq) {
//         console.log(`Pausing before showing color index: ${colorIndex}`);
//         await new Promise(resolve => setTimeout(resolve, 300));

//         console.log(`Activating button for color index: ${colorIndex}`);
//         setActiveButton(colorIndex);

//         try {
//             console.log(`Attempting to play sound for index: ${colorIndex}`);
//             // Check if the sound object exists and is loaded
//             if (config.sounds[colorIndex] && config.sounds[colorIndex].isLoaded()) {
//                 config.sounds[colorIndex].play((success) => {
//                     if (!success) {
//                         console.error(`Failed to play sound for index: ${colorIndex}`);
//                     }
//                 });
//             } else {
//                 console.error(`Sound for index ${colorIndex} is not loaded or does not exist.`);
//             }
//         } catch (error) {
//             console.error(`An error occurred while trying to play sound for index ${colorIndex}:`, error);
//         }

//         console.log(`Pausing while button is active for index: ${colorIndex}`);
//         await new Promise(resolve => setTimeout(resolve, 600));
        
//         console.log(`Deactivating button for index: ${colorIndex}`);
//         setActiveButton(null);
//     }

//     console.log("--- Computer's Turn Finished ---");
//     setIsPlayerTurn(true); // This is the line we're trying to reach
// };
//   const handlePlayerPress = (colorIndex) => {
//     // This check now correctly prevents presses even after game over
//     if (!isPlayerTurn || isGameOver) return;

//     const newPlayerSequence = [...playerSequence, colorIndex];
//     setPlayerSequence(newPlayerSequence);

//     // THE FIX IS HERE: Use the config object to get the correct sounds
//     config.sounds[colorIndex].play();

//     // Check if the player's move was correct
//     if (newPlayerSequence[newPlayerSequence.length - 1] !== sequence[newPlayerSequence.length - 1]) {
//       gameOverSound.play();
//       setIsGameOver(true);
//       Alert.alert('Game Over!', `Your score is ${score}`);
//       return;
//     }

//     // If the player has completed the sequence
//     if (newPlayerSequence.length === sequence.length) {
//       setScore(score + 1);
//       setTimeout(() => nextRound(sequence), 1000);
//     }
// };
//   // --- useEffect Hooks ---
//   useEffect(() => {
//     // Start the game when the component mounts
//     startGame();
//   }, []);

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.scoreText}>Score: {score}</Text>
//       </View>
//       {isGameOver ? (
//     // If game is over, this container takes up the main space
//     <View style={styles.gameOverContainer}>
//         <Text style={styles.gameOverText}>Game Over</Text>
//         <TouchableOpacity style={styles.gameOverButton} onPress={startGame}>
//             <Text style={styles.buttonText}>Play Again</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.gameOverButton} onPress={() => navigation.goBack()}>
//             <Text style={styles.buttonText}>Quit</Text>
//         </TouchableOpacity>
//     </View>
// ) : (
//     // Otherwise, the gameBoard container takes up the main space
//     <View style={styles.gameBoard}>
//         <View style={styles.buttonContainer}>
//             {config.colors.map((color, index) => (
//                 <GameButton
//                     key={index}
//                     color={color}
//                     onPress={() => handlePlayerPress(index)}
//                     isActive={activeButton === index}
//                     disabled={!isPlayerTurn}
//                 />
//             ))}
//         </View>
//     </View>
// )}
      
//       <View style={styles.footer}>
//         {!isGameOver && (
//           <Text style={styles.turnText}>
//             {isPlayerTurn ? "Your Turn" : "Watch Closely..."}
//           </Text>
//         )}
//       </View>
//     </SafeAreaView>
//   );
// };


// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#1F2937', // Dark background for the game
//   },
//   header: {
//     height: '15%',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   scoreText: {
//     fontSize: 32,
//     fontWeight: 'bold',
//     color: 'white',
//   },
//   gameBoard: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   row: {
//     flexDirection: 'row',
//   },
//   footer: {
//     height: '15%',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap', // This is the magic property for creating grids
//     justifyContent: 'center',
//     alignItems: 'center',
//     width: '100%',
// },
//   turnText: {
//     fontSize: 24,
//     color: 'white',
//     fontStyle: 'italic',
//   },
//   gameOverContainer: {
//      flex: 1, // Make it take up the available space
//     justifyContent: 'center', // Center content vertically
//     alignItems: 'center',
//   },
//   gameOverText: {
//     fontSize: 48,
//     fontWeight: 'bold',
//     color: '#ef4444',
//     marginBottom: 30,
//   },
//  gameOverButton: {
//     backgroundColor: '#3B82F6',
//     paddingVertical: 12,
//     paddingHorizontal: 40,
//     borderRadius: 25,
//     margin: 10,
// },
//   buttonText: {
//     color: 'white',
//     fontSize: 18,
//     fontWeight: '600',
//   },
// });

// export default GameScreen;