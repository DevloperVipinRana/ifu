import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Button, Modal, TouchableOpacity } from 'react-native';
import { GestureHandlerRootView, PanGestureHandler, State } from 'react-native-gesture-handler';
import GameBoard from './twozeroGameBoard';
import { colors } from '../../theme/color1';
import { initialBoard, moveUp, moveDown, moveLeft, moveRight, addRandomTile, isGameOver } from './logic.js';

const GameScreen1 = () => {
    const [board, setBoard] = useState(initialBoard());
    const [isGameOverModalVisible, setGameOverModalVisible] = useState(false);
    const [gameState, setGameState] = useState('ready');

    useEffect(() => {

        if (gameState !== 'playing') return;


        if (isGameOver(board)) {
            setGameOverModalVisible(true);
        }
    }, [board,gameState]);

    const handleSwipe = ({ nativeEvent }) => {
        if (nativeEvent.state === State.END) {
            const { translationX, translationY } = nativeEvent;
            let newBoard;
            if (Math.abs(translationX) > Math.abs(translationY)) {
                if (translationX > 0) {
                    newBoard = moveRight(board);
                } else {
                    newBoard = moveLeft(board);
                }
            } else {
                if (translationY > 0) {
                    newBoard = moveDown(board);
                } else {
                    newBoard = moveUp(board);
                }
            }

            if (JSON.stringify(newBoard) !== JSON.stringify(board)) {
                setBoard(addRandomTile(newBoard));
            }
        }
    };

    const handlePlay = () => {
  setGameState('playing');
  setBoard(initialBoard()); // Start with a fresh board
};

const restartGame = () => {
  setGameOverModalVisible(false);
  setGameState('playing');
  setBoard(initialBoard());
};
    return (
  <GestureHandlerRootView style={{ flex: 1 }}>
    <View style={styles.container}>
      <Text style={styles.title}>2048</Text>
      <PanGestureHandler
        onHandlerStateChange={handleSwipe}
        enabled={gameState === 'playing'} // Gestures are only enabled when playing
      >
        <View>
          <GameBoard board={board} />
        </View>
      </PanGestureHandler>

      {/* Conditional Button Rendering */}
      <View style={styles.buttonContainer}>
        {gameState === 'ready' && (
          <TouchableOpacity style={styles.playButton} onPress={handlePlay}>
            <Text style={styles.buttonText}>Play</Text>
          </TouchableOpacity>
        )}

        {gameState === 'playing' && (
          <TouchableOpacity style={styles.retryButton} onPress={restartGame}>
            <Text style={styles.buttonText}>Retry</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Game Over Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isGameOverModalVisible}
        onRequestClose={() => setGameOverModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Game Over!</Text>
            <TouchableOpacity
              style={{ ...styles.openButton, backgroundColor: colors.system.success }}
              onPress={restartGame}
            >
              <Text style={styles.textStyle}>Retry</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  </GestureHandlerRootView>
);
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 48,
        fontWeight: 'bold',
        color: colors.text.primary,
        marginBottom: 20,
    },
    buttonContainer: {
        marginTop: 30,
    },
    // Modal Styles
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    openButton: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text.primary,
    },
    buttonContainer: {
    // This is the requested margin-top
    marginTop: 30,
    height: 50, // Give the container a fixed height to prevent layout shifts
  },
  playButton: {
    backgroundColor: colors.system.success, // Green color for Play
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  retryButton: {
    backgroundColor: colors.system.warning, // Red color for Retry
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default GameScreen1;