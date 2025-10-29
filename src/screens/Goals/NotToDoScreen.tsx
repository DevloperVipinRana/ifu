// mobile/src/screens/Goals/NotToDoScreen.tsx

import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, TextInput, Alert, Text, Platform, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LottieView from 'lottie-react-native';
import { ScreenTitle, CardHeader } from '../../components/common/StyledText';
import { colors } from '../../theme/color';
import { GradientButton } from '../../components/interactive/GradientButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '@env';

// A reusable component for each "Not-To-Do" input card
const NotToDoInput = ({ title, placeholder, value, onChangeText }: any) => (
  <View style={styles.card}>
    <CardHeader style={styles.cardTitle}>{title}</CardHeader>
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      placeholderTextColor={colors.text.secondary}
      multiline={true}
      value={value}
      onChangeText={onChangeText}
    />
  </View>
);

const NotToDoScreen = () => {
  const [habit1, setHabit1] = useState('');
  const [habit2, setHabit2] = useState('');
  const [habit3, setHabit3] = useState('');

  useEffect(() => {
    const fetchHabits = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        
        const res = await fetch(`${BASE_URL}/api/not-to-do/recent`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok && data.habits) {
          // Show up to 3 most recent habits
          const recent = data.habits.slice(0, 3);
          setHabit1(recent[0]?.habit || '');
          setHabit2(recent[1]?.habit || '');
          setHabit3(recent[2]?.habit || '');
        }
      } catch (err) {
        console.error('Error fetching habits:', err);
      }
    };
    fetchHabits();
  }, []);

  const handleSaveChanges = async () => {
  const habits = [habit1, habit2, habit3].filter(h => h.trim() !== "");

  if (habits.length === 0) {
    Alert.alert("No Habits", "Please add at least one habit.");
    return;
  }

  try {
    const token = await AsyncStorage.getItem("token");

    const res = await fetch(`${BASE_URL}/api/not-to-do`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ habits }),
    });

    const data = await res.json();
    if (res.ok) {
      Alert.alert("Habits Saved", "Your Not-To-Do list has been updated.");
      setHabit1(""); setHabit2(""); setHabit3("");
    } else {
      Alert.alert("Error", data.message || "Something went wrong");
    }
  } catch (err) {
    console.error(err);
    Alert.alert("Error", "Unable to save habits");
  }
};


  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.headerContainer}>
            <LottieView
              source={require('../../assets/lottie/no-symbol.json')} // Find a "no", "stop", or "block" Lottie file
              autoPlay
              loop={false}
              style={styles.lottie}
            />
            <ScreenTitle style={styles.pageTitle}>Not-To-Do List</ScreenTitle>
            <Text style={styles.subtitle}>What will you avoid to improve your focus and well-being?</Text>
          </View>
          
          <NotToDoInput 
            title="Habit to Avoid #1"
            placeholder="e.g., Checking social media in the morning"
            value={habit1}
            onChangeText={setHabit1}
          />
          <NotToDoInput 
            title="Habit to Avoid #2"
            placeholder="e.g., Eating sugary snacks after 8 PM"
            value={habit2}
            onChangeText={setHabit2}
          />
          <NotToDoInput 
            title="Habit to Avoid #3"
            placeholder="e.g., Hitting the snooze button"
            value={habit3}
            onChangeText={setHabit3}
          />
        </ScrollView>
        
        <View style={styles.saveButtonContainer}>
          <GradientButton title="SAVE HABITS" onPress={handleSaveChanges} gradient={colors.gradient.passion} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.background.primary 
  },
  scrollContent: { 
    padding: 20 
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  lottie: {
    width: 100,
    height: 100,
  },
  pageTitle: { 
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 10 
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    textAlign: 'center',
    color: colors.text.secondary,
    marginBottom: 10,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  cardTitle: {
    marginBottom: 10,
    color: colors.system.warning, // Using the warning color for a thematic link
  },
  input: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: colors.text.primary,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  saveButtonContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderColor: colors.border,
    backgroundColor: 'white',
  },
});

export default NotToDoScreen;