// WordGuess.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";

const ALPHABETS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const WordGuess = ({ navigation }: any) => {
  const [word, setWord] = useState<string>(""); // Word from API
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [wrongGuesses, setWrongGuesses] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const MAX_WRONG = 15;

  // Fetch random word
  const fetchWord = async () => {
    try {
      setLoading(true);
      const randomLength = Math.floor(Math.random() * 3) + 3; // gives 3,4,5
    const res = await fetch(
      `https://random-word-api.herokuapp.com/word?number=1&length=${randomLength}`
    );
      const data = await res.json();
      const newWord = data[0].toUpperCase();

      setWord(newWord);
      setGuessedLetters([]);
      setWrongGuesses(0);

      // Reveal one random letter
      const randomLetter = newWord[Math.floor(Math.random() * newWord.length)];
      setGuessedLetters([randomLetter]);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching word:", error);
      Alert.alert("Error", "Could not fetch word. Please try again.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWord();
  }, []);

  // Check win/lose
  useEffect(() => {
    if (!word || loading) return;

    if (word.split("").every((letter) => guessedLetters.includes(letter))) {
      setTimeout(() => {
        Alert.alert("🎉 You Win!", `The word was: ${word}`, [
          { text: "Play Again", onPress: fetchWord },
        ]);
      }, 100);
    } else if (wrongGuesses >= MAX_WRONG) {
      setTimeout(() => {
        Alert.alert("💀 You Lose!", `The word was: ${word}`, [
          { text: "Try Again", onPress: fetchWord },
        ]);
      }, 100);
    }
  }, [guessedLetters, wrongGuesses, word, loading]);

  const handleGuess = (letter: string) => {
    if (guessedLetters.includes(letter)) return;
    setGuessedLetters((prev) => [...prev, letter]);

    if (!word.includes(letter)) {
      setWrongGuesses((prev) => prev + 1);
    }
  };

  const renderWord = () => {
    return word
      .split("")
      .map((letter) => (guessedLetters.includes(letter) ? letter : "_"))
      .join(" ");
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#333" />
        <Text style={styles.info}>Fetching a word...</Text>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={['#f0e6ff', '#d8e2ff', '#e0f7ff']}
      style={styles.container}
    >
      <Text style={styles.title}>🔤 Word Guess Game</Text>
      <Text style={styles.word}>{renderWord()}</Text>
      <Text style={styles.info}>Hint: The word starts with "{word[0]}"</Text>
      <Text style={styles.info}>
        Wrong guesses: {wrongGuesses} / {MAX_WRONG}
      </Text>

      {/* Alphabet Buttons */}
      <View style={styles.alphabetGrid}>
        {ALPHABETS.map((letter) => (
          <Pressable
            key={letter}
            style={[
              styles.letterButton,
              guessedLetters.includes(letter) && styles.disabledButton,
            ]}
            onPress={() => handleGuess(letter)}
            disabled={guessedLetters.includes(letter)}
          >
            <Text style={styles.letterText}>{letter}</Text>
          </Pressable>
        ))}
      </View>

      {/* Back Button */}
      <Pressable
        onPress={() => navigation.goBack()}
        style={{ marginTop: 30, width: "60%" }}
      >
        <LinearGradient
          colors={['#4adeefff', '#517eb2ff']}
          style={styles.backButton}
        >
          <Text style={styles.backText}> Back to Games</Text>
        </LinearGradient>
      </Pressable>
    </LinearGradient>
  );
};

export default WordGuess;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "900",
    marginVertical: 20,
    color: "#333",
  },
  word: {
    fontSize: 32,
    letterSpacing: 4,
    marginVertical: 20,
    color: "#333",
  },
  info: {
    fontSize: 16,
    marginBottom: 10,
    color: "#333",
    fontWeight: "600",
  },
  alphabetGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 20,
  },
  letterButton: {
    width: 40,
    height: 40,
    backgroundColor: "#5b7ae0ff",
    margin: 4,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
  },
  letterText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  backButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  backText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
