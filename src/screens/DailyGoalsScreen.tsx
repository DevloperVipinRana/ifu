import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import LottieView from 'lottie-react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '@env';

import { colors } from '../theme/color';
import { ScreenTitle, Body } from '../components/common/StyledText';
import { GradientButton } from '../components/interactive/GradientButton';

const API_URL = `${BASE_URL}/api/dailygoals`;

interface DailyGoal {
  _id: string;
  text: string;
  completed: boolean;
  date: string;
}

const GOAL_SUGGESTIONS = [
  'Drink 8 glasses of water',
  'Go for a 20-minute walk',
  'Meditate for 10 minutes',
  'Write down 3 things you\'re grateful for',
  'Read one chapter of a book',
  'Stretch for 10 minutes after waking up',
  'Plan top 3 priorities for tomorrow',
  'Spend 30 minutes screen-free before bed',
];

const DailyGoalsScreen = () => {
  const [dailyGoals, setDailyGoals] = useState<DailyGoal[]>([]);
  const [newDailyGoal, setNewDailyGoal] = useState('');

  // Get token from AsyncStorage
  const getAuthHeaders = async () => {
    const token = await AsyncStorage.getItem('token');
    return { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
  };

  useEffect(() => {
    fetchDailyGoals();
  }, []);

  const fetchDailyGoals = async () => {
    try {
      const headers = await getAuthHeaders();
      
      const res = await fetch(API_URL, { headers });
      const data: DailyGoal[] = await res.json();

      if (!Array.isArray(data)) {
        console.error("Unexpected response:", data);
        setDailyGoals([]);
        return;
      }

      setDailyGoals(data); // Already filtered by backend
    } catch (err) {
      console.error("Fetch daily goals error:", err);
    }
  };

  const handleAddDailyGoal = async () => {
    
    if (!newDailyGoal.trim()) {
      Alert.alert("Empty Daily Goal", "Please enter a description.");
      return;
    }
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(API_URL, {
        method: "POST",
        headers,
        body: JSON.stringify({ text: newDailyGoal.trim() }),
      });
      const data: DailyGoal = await res.json();
      setDailyGoals([data, ...dailyGoals]);
      setNewDailyGoal("");
    } catch (err) {
      console.error("Add daily goal error:", err);
    }
  };

  const handleToggleComplete = async (id: string) => {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_URL}/${id}/toggle`, { method: "PATCH", headers });
      const updated = await res.json();
      setDailyGoals(dailyGoals.map(goal => goal._id === id ? updated : goal));
    } catch (err) {
      console.error("Toggle complete error:", err);
    }
  };

  const handleDeleteDailyGoal = async (id: string) => {
    try {
      const headers = await getAuthHeaders();
      await fetch(`${API_URL}/${id}`, { method: "DELETE", headers });
      setDailyGoals(dailyGoals.filter(goal => goal._id !== id));
    } catch (err) {
      console.error("Delete daily goal error:", err);
    }
  };

  const renderRightActions = (id: string) => (
    <TouchableOpacity onPress={() => handleDeleteDailyGoal(id)} style={styles.deleteBox}>
      <Icon name="trash-outline" size={24} color="white" />
    </TouchableOpacity>
  );

  const renderItem = ({ item }: { item: DailyGoal }) => (
    <Swipeable renderRightActions={() => renderRightActions(item._id)}>
      <View style={styles.dailyGoalItem}>
        <TouchableOpacity
          onPress={() => handleToggleComplete(item._id)}
          style={[styles.checkbox, item.completed && styles.checkedCircle]}
        >
          {item.completed && (
            <LottieView
              source={require('../assets/lottie/checkmark.json')}
              autoPlay
              loop={false}
              style={{ width: 40, height: 40 }}
            />
          )}
        </TouchableOpacity>
        <Text style={[styles.dailyGoalText, item.completed && styles.completedText]}>
          {item.text}
        </Text>
      </View>
    </Swipeable>
  );

  return (
    <LinearGradient colors={['#E0F7FA', '#FFFFFF']} style={{ flex: 1 }}>
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <ScreenTitle style={styles.pageTitle}>Today's Daily Goals</ScreenTitle>

        <FlatList
          data={dailyGoals}
          renderItem={renderItem}
          keyExtractor={item => item._id}
          style={styles.list}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Body style={styles.emptyText}>No daily goals yet. Add one!</Body>
            </View>
          }
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
        >
          <View style={styles.inputSection}>
            <View>
              <Text style={styles.suggestionsTitle}>Suggestions</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {GOAL_SUGGESTIONS.map((suggestion, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.suggestionChip}
                    onPress={() => setNewDailyGoal(suggestion)}
                  >
                    <Text style={styles.suggestionText}>{suggestion}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Or create your own goal..."
                value={newDailyGoal}
                onChangeText={setNewDailyGoal}
                onSubmitEditing={handleAddDailyGoal}
              />
              <GradientButton title="ADD" onPress={handleAddDailyGoal} gradient={colors.gradient.cool} />
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  pageTitle: { paddingHorizontal: 20, marginVertical: 10, textAlign: 'center' },
  list: { paddingHorizontal: 20 },
  dailyGoalItem: {
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  checkbox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  checkedCircle: {
    backgroundColor: colors.gradient.cool[1] || "#007AFF",
    borderColor: colors.gradient.cool[1] || "#007AFF",
  },
  dailyGoalText: { flex: 1, fontSize: 16, color: colors.text.primary, fontFamily: 'Inter-Medium' },
  completedText: { textDecorationLine: 'line-through', color: colors.text.secondary },
  inputSection: {
    paddingTop: 10,
    borderTopWidth: 1,
    borderColor: colors.border,
    backgroundColor: 'white',
  },
  inputContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  input: {
    height: 50,
    backgroundColor: colors.background.primary,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 10,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  deleteBox: {
    backgroundColor: colors.system.warning,
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    borderRadius: 15,
    height: '100%',
    marginBottom: 10,
  },
  emptyContainer: { marginTop: 50, alignItems: 'center' },
  emptyText: { fontSize: 16, color: colors.text.secondary },
  suggestionsTitle: {
    fontFamily: 'Inter-SemiBold',
    color: colors.text.secondary,
    fontSize: 14,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  suggestionChip: {
    backgroundColor: colors.background.primary,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginLeft: 20,
    marginBottom: 10,
  },
  suggestionText: { fontFamily: 'Inter-Medium', color: colors.text.primary },
});

export default DailyGoalsScreen;


