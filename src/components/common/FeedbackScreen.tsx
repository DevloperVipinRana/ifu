// mobile/src/screens/Activity/FeedbackScreen.tsx

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TextInput, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Use LOCAL_IP or fallback for emulator
// const LOCAL_IP = '192.168.6.197'; // <-- Replace with your PC's local IP
// const BASE_URL = `http://${LOCAL_IP}:5000`; // backend server URL
import { BASE_URL } from '@env';
import { ScreenTitle, Body } from '../../components/common/StyledText';
import { GradientButton } from '../../components/interactive/GradientButton';
import { colors } from '../../theme/color';

type FeedbackType = 'emoji' | 'text' | 'none';

const EMOJI_OPTIONS = [
    { emoji: '😊', label: 'Energized' },
    { emoji: '😌', label: 'Calm' },
    { emoji: '😐', label: 'Neutral' },
    { emoji: '🥱', label: 'Tired' },
]

const FeedbackScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { activityTitle = "the activity" } = route.params as any || {};

  // Randomly determine the feedback type when the screen loads
  const [feedbackType] = useState<FeedbackType>(() => {
    const rand = Math.random();
    if (rand < 0.45) return 'emoji'; // 45% chance for emoji
    if (rand < 0.80) return 'text';  // 35% chance for text
    return 'none';                  // 20% chance for no feedback
  });

  const [textResponse, setTextResponse] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);

  // If no feedback is needed, save activity and go back after a short delay
  useEffect(() => {
    if (feedbackType === 'none') {
      const saveFeedback = async () => {
        try {
          const token = await AsyncStorage.getItem('token');
          const feedbackPayload = {
            activityKey: activityTitle.toLowerCase().replace(/\s+/g, "_"),
            title: activityTitle,
            feedback: { type: 'none', value: '' },
          };
          
          console.log('🚀 FeedbackScreen (none): Sending feedback data:', feedbackPayload);
          console.log('🚀 FeedbackScreen (none): BASE_URL:', BASE_URL);
          console.log('🚀 FeedbackScreen (none): Token:', token ? 'Present' : 'Missing');
          
          const response = await fetch(`${BASE_URL}/api/activities/update-feedback`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(feedbackPayload),
          });
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const result = await response.json();
          console.log('✅ FeedbackScreen (none): Feedback saved successfully:', result);
        } catch (err) {
          console.error('❌ FeedbackScreen (none): Error saving feedback:', err);
        }
      };

      saveFeedback();
      
      const timer = setTimeout(() => {
        // Find the correct screen to go back to (skip the FocusModePlayer)
        navigation.goBack();
      }, 1500); // Show the message for 1.5 seconds
      return () => clearTimeout(timer);
    }
  }, [feedbackType, navigation, activityTitle]);

  const handleSubmit = async () => {
    let feedbackData = {};
    if (feedbackType === 'emoji') {
        if (!selectedEmoji) {
            Alert.alert('Please select an option');
            return;
        }
        const selectedOption = EMOJI_OPTIONS.find(option => option.label === selectedEmoji);
        feedbackData = { 
          type: 'emoji', 
          value: selectedEmoji,
          emoji: selectedOption?.emoji,
          label: selectedEmoji
        };
    } else if (feedbackType === 'text') {
        if (textResponse.trim().length === 0) {
            Alert.alert('Please write a short note');
            return;
        }
        feedbackData = { type: 'text', value: textResponse };
    } else {
        feedbackData = { type: 'none', value: '' };
    }
    
    try {
      const token = await AsyncStorage.getItem('token');
      const feedbackPayload = {
        activityKey: activityTitle.toLowerCase().replace(/\s+/g, "_"),
        title: activityTitle,
        feedback: feedbackData,
      };
      
      console.log('🚀 FeedbackScreen: Sending feedback data:', feedbackPayload);
      console.log('🚀 FeedbackScreen: BASE_URL:', BASE_URL);
      console.log('🚀 FeedbackScreen: Token:', token ? 'Present' : 'Missing');
      
      // Update the existing activity with feedback data
      const response = await fetch(`${BASE_URL}/api/activities/update-feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(feedbackPayload),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('✅ FeedbackScreen: Feedback saved successfully:', result);
      
      // Navigate back to the previous screen
      navigation.goBack();
      navigation.goBack();
    } catch (err) {
      console.error('❌ FeedbackScreen: Error saving feedback:', err);
      Alert.alert('Error', 'Could not save feedback. Please try again.');
    }
  };
  
  const renderContent = () => {
    switch(feedbackType) {
        case 'emoji':
            return (
                <>
                    <ScreenTitle style={styles.title}>How do you feel now?</ScreenTitle>
                    <View style={styles.emojiContainer}>
                        {EMOJI_OPTIONS.map(({emoji, label}) => (
                            <TouchableOpacity key={emoji} style={[styles.emojiButton, selectedEmoji === label && styles.emojiSelected]} onPress={() => setSelectedEmoji(label)}>
                                <Text style={styles.emoji}>{emoji}</Text>
                                <Text style={styles.emojiLabel}>{label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </>
            );
        case 'text':
            return (
                <>
                    <ScreenTitle style={styles.title}>What did you notice?</ScreenTitle>
                    <Body style={styles.subtitle}>Any thoughts or sensations during the activity?</Body>
                    <TextInput 
                        style={styles.input}
                        placeholder="e.g., 'My shoulders felt tight,' or 'I felt my mind start to calm down...'"
                        multiline
                        value={textResponse}
                        onChangeText={setTextResponse}
                    />
                </>
            );
        case 'none':
            return (
                <>
                    <Icon name="checkmark-circle-outline" size={80} color={colors.gradient.success[0]}/>
                    <ScreenTitle style={[styles.title, {marginTop: 20}]}>Great work!</ScreenTitle>
                </>
            );
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {renderContent()}
      </View>
      {feedbackType !== 'none' && (
        <View style={styles.buttonContainer}>
            <GradientButton title="SUBMIT FEEDBACK" onPress={handleSubmit} />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background.primary },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { textAlign: 'center', marginBottom: 15 },
  subtitle: { textAlign: 'center', marginBottom: 30, color: colors.text.secondary },
  // Emoji styles
  emojiContainer: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginTop: 20 },
  emojiButton: { alignItems: 'center', padding: 10, borderRadius: 15 },
  emojiSelected: { backgroundColor: colors.gradient.cool[0] + '20' }, // Add a light background tint for selection
  emoji: { fontSize: 48 },
  emojiLabel: { marginTop: 8, fontFamily: 'Inter-SemiBold', color: colors.text.primary },
  // Text input styles
  input: {
    height: 150,
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    textAlignVertical: 'top',
    marginTop: 20,
    borderWidth: 1,
    borderColor: colors.border
  },
  buttonContainer: { padding: 20, borderTopWidth: 1, borderColor: colors.border, backgroundColor: 'white' },
});

export default FeedbackScreen;