import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, Pressable, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { RootStackParamList } from '../../../App';
import LinearGradient from 'react-native-linear-gradient';

type Props = NativeStackScreenProps<RootStackParamList, 'SnakeGame'>;

const GRID_SIZE = 15;
const CELL_SIZE = 20;
const INITIAL_SNAKE = [{ x: 2, y: 2 }];
const INITIAL_FOOD = { x: 5, y: 5 };

const SnakeGame = ({ navigation }: Props) => {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState(INITIAL_FOOD);
  const [direction, setDirection] = useState<{ x: number; y: number } | null>(null); // ✅ null = paused
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const moveInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!isGameOver && direction) {
      moveInterval.current = setInterval(moveSnake, 200);
      return () => clearInterval(moveInterval.current!);
    }
  }, [snake, direction, isGameOver]);

  const moveSnake = () => {
    if (!direction) return; // ✅ don’t move if paused

    const newHead = {
      x: snake[0].x + direction.x,
      y: snake[0].y + direction.y,
    };

    // Check collision
    if (
      newHead.x < 0 ||
      newHead.y < 0 ||
      newHead.x >= GRID_SIZE ||
      newHead.y >= GRID_SIZE ||
      snake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)
    ) {
      setIsGameOver(true);

      if (score > bestScore) {
        setBestScore(score);
      }

      Alert.alert(
        'Game Over',
        `Score: ${score}\nBest: ${Math.max(score, bestScore)}`,
        [
          { text: 'Restart', onPress: resetGame },
          { text: 'Back to Games', onPress: () => navigation.goBack() },
        ]
      );
      return;
    }

    let newSnake = [newHead, ...snake];

    // Check food collision
    if (newHead.x === food.x && newHead.y === food.y) {
      setFood({
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      });
      setScore(score + 1);
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  };

  const changeDirection = (x: number, y: number) => {
    // ✅ Start moving on first arrow press
    if (!direction) {
      setDirection({ x, y });
      return;
    }

    // Prevent reversing directly
    if (
      snake.length > 1 &&
      snake[0].x + x === snake[1].x &&
      snake[0].y + y === snake[1].y
    ) {
      return;
    }
    setDirection({ x, y });
  };

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood(INITIAL_FOOD);
    setDirection(null); // ✅ reset to paused
    setIsGameOver(false);
    setScore(0);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🐍 Snake Game</Text>
      <Text style={styles.score}>Score: {score}</Text>
      <Text style={styles.bestScore}>Best: {bestScore}</Text>

      <View
        style={{
          width: GRID_SIZE * CELL_SIZE,
          height: GRID_SIZE * CELL_SIZE,
          backgroundColor: '#2c2c3e',
          flexDirection: 'row',
          flexWrap: 'wrap',
          borderRadius: 15,
          overflow: 'hidden',
        }}
      >
        {[...Array(GRID_SIZE * GRID_SIZE)].map((_, index) => {
          const x = index % GRID_SIZE;
          const y = Math.floor(index / GRID_SIZE);
          const isSnake = snake.some(
            (segment) => segment.x === x && segment.y === y
          );
          const isFood = food.x === x && food.y === y;
          return (
            <View
              key={index}
              style={{
                width: CELL_SIZE,
                height: CELL_SIZE,
                backgroundColor: isSnake
                  ? '#00e676'
                  : isFood
                  ? '#ff3d00'
                  : '#2c2c3e',
                borderWidth: 0.3,
                borderRadius: isSnake ? CELL_SIZE / 2 : 4,
                borderColor: '#444',
              }}
            />
          );
        })}
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <Pressable style={styles.btn} onPress={() => changeDirection(0, -1)}>
          <Text style={styles.btnText}>↑</Text>
        </Pressable>
        <View style={{ flexDirection: 'row' }}>
          <Pressable style={styles.btn} onPress={() => changeDirection(-1, 0)}>
            <Text style={styles.btnText}>←</Text>
          </Pressable>
          <Pressable style={styles.btn} onPress={() => changeDirection(1, 0)}>
            <Text style={styles.btnText}>→</Text>
          </Pressable>
        </View>
        <Pressable style={styles.btn} onPress={() => changeDirection(0, 1)}>
          <Text style={styles.btnText}>↓</Text>
        </Pressable>
      </View>


{/* Restart Button */}
<Pressable style={{ borderRadius: 20, overflow: 'hidden', marginTop: 20 }} onPress={resetGame}>
  <LinearGradient
    colors={['#7209e1ff', '#9c71ddff']} // dark red gradient
    style={styles.resetBtn}
  >
    <Text style={styles.resetText}>Restart</Text>
  </LinearGradient>
</Pressable>

{/* Back to Games Button */}
<Pressable style={{ borderRadius: 20, overflow: 'hidden', marginTop: 10 }} onPress={() => navigation.goBack()}>
  <LinearGradient
    colors={['#4adeefff', '#517eb2ff']} // dark blue gradient
    style={styles.backBtn}
  >
    <Text style={styles.backText}>Back to Games</Text>
  </LinearGradient>
</Pressable>

    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: '#a4a4faff',
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 10,
    color: '#ffeb3b',
  },
  score: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  bestScore: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffeb3b',
    marginBottom: 15,
  },
  controls: { 
    marginTop: 20, 
    alignItems: 'center' 
  },
  btn: {
    margin: 10,
    backgroundColor: '#8e24aa',
    padding: 15,
    borderRadius: 10,
  },
  btnText: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#fff' 
  },
  resetBtn: {
  padding: 12,
  borderRadius: 20,
  alignItems: 'center',
},
resetText: { 
  color: '#fff', 
  fontWeight: 'bold', 
  fontSize: 16,
},

backBtn: {
  padding: 12,
  borderRadius: 20,
  alignItems: 'center',
},
backText: { 
  color: '#fff', 
  fontWeight: 'bold', 
  fontSize: 16,
},

});

export default SnakeGame;
