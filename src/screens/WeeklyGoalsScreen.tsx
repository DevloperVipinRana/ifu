import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TextInput, Alert, Text, Platform, KeyboardAvoidingView, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import { ScreenTitle, CardHeader } from '../components/common/StyledText';
import { colors } from '../theme/color';
import { GradientButton } from '../components/interactive/GradientButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '@env';

const PROGRESS_STEPS = [0, 25, 50, 75, 100];

// Feedback Modal Component
const FeedbackModal = ({ visible, onClose, onSubmit, currentProgress, color }: any) => {
  const [feedback, setFeedback] = useState('');

  const handleSubmit = () => {
    if (feedback.trim() === '') {
      Alert.alert('Required', 'Please share what you accomplished!');
      return;
    }
    onSubmit(feedback);
    setFeedback('');
  };

  const handleClose = () => {
    setFeedback('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Progress Update</Text>
          <Text style={styles.modalSubtitle}>
            Updating to {currentProgress}% - Share what you've accomplished!
          </Text>
          
          <TextInput
            style={styles.feedbackInput}
            placeholder="e.g., Completed 3 workout sessions this week..."
            placeholderTextColor={colors.text.secondary}
            multiline
            numberOfLines={4}
            value={feedback}
            onChangeText={setFeedback}
            autoFocus
          />

          <View style={styles.modalButtons}>
            <TouchableOpacity 
              style={[styles.modalButton, styles.cancelButton]} 
              onPress={handleClose}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.modalButton, styles.submitButton, { backgroundColor: color }]} 
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>Save Progress</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Segmented Progress Tracker
const SegmentedProgressTracker = ({ progress, onProgressChange, color, goalData }: any) => {
  return (
    <View style={styles.trackerContainer}>
      {PROGRESS_STEPS.map((step, index) => {
        const isActive = progress >= step;
        return (
          <TouchableOpacity 
            key={step} 
            style={[
                styles.segment, 
                index === 0 && styles.firstSegment,
                index === PROGRESS_STEPS.length - 1 && styles.lastSegment,
                { backgroundColor: isActive ? color : colors.border }
            ]} 
            onPress={() => {
              console.log('Segment pressed:', step, 'Current:', progress, 'Goal ID:', goalData._id);
              onProgressChange(step);
            }} 
          />
        );
      })}
    </View>
  );
};

// Weekly Goal Card
const WeeklyGoalCard = ({ title, placeholder, value, onChangeText, progress, onProgressChange, gradient, goalData }: any) => {
  const isCompleted = progress === 100;

  return (
    <View style={[styles.card, isCompleted && styles.completedCard]}>
      <View style={styles.cardHeader}>
        <CardHeader style={styles.cardTitle}>{title}</CardHeader>
        <Text style={[styles.progressText, { color: gradient[0] }]}>{progress}%</Text>
      </View>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={colors.text.secondary}
        multiline
        value={value}
        onChangeText={onChangeText}
      />
      <SegmentedProgressTracker 
        progress={progress}
        onProgressChange={onProgressChange}
        color={gradient[0]}
        goalData={goalData}
      />
    </View>
  );
};

const WeeklyGoalsScreen = () => {
  const navigation = useNavigation();
  const [goal1, setGoal1] = useState({ _id: '', text: '', progress: 0 });
  const [goal2, setGoal2] = useState({ _id: '', text: '', progress: 0 });
  const [goal3, setGoal3] = useState({ _id: '', text: '', progress: 0 });
  const [pendingFeedbacks, setPendingFeedbacks] = useState<string[]>(['', '', '']);
  
  // Feedback modal state
  const [feedbackModal, setFeedbackModal] = useState({
    visible: false,
    goalIndex: null as number | null,
    goalId: '',
    currentProgress: 0,
    newProgress: 0,
    color: colors.gradient.cool[0]
  });

  const getToken = async () => {
    return await AsyncStorage.getItem('token');
  };

  // Fetch this week's goals from backend
  const fetchGoals = async () => {
    try {
      const token = await getToken();
      
      const res = await fetch(`${BASE_URL}/api/weekly-goals`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.length > 0) {
        setGoal1(data[0] || { _id: '', text: '', progress: 0 });
        setGoal2(data[1] || { _id: '', text: '', progress: 0 });
        setGoal3(data[2] || { _id: '', text: '', progress: 0 });
      }
    } catch (err) {
      console.log(err);
      Alert.alert('Error', 'Failed to fetch weekly goals.');
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  // Handle progress change with feedback
  const handleProgressChange = (goalIndex: number, newProgress: number, color: string) => {
    const goals = [goal1, goal2, goal3];
    const currentGoal = goals[goalIndex];
    
    console.log('handleProgressChange called:', {
      goalIndex,
      newProgress,
      currentProgress: currentGoal.progress,
      goalId: currentGoal._id,
      hasId: !!currentGoal._id
    });

    // If no goal text exists, just update progress
    if (!currentGoal.text || currentGoal.text.trim() === '') {
      updateGoalProgress(goalIndex, newProgress);
      return;
    }

    // If clicking the same progress, do nothing
    if (newProgress === currentGoal.progress) {
      return;
    }

    // If progress is decreasing, just update without feedback
    if (newProgress < currentGoal.progress) {
      updateGoalProgress(goalIndex, newProgress);
      if (currentGoal._id) {
        saveProgressToBackend(currentGoal._id, newProgress, '');
      }
      return;
    }

    // Progress is INCREASING - show feedback modal
    console.log('Opening feedback modal');
    setFeedbackModal({
      visible: true,
      goalIndex,
      goalId: currentGoal._id,
      currentProgress: currentGoal.progress,
      newProgress,
      color
    });
  };

  // Update goal progress locally
  const updateGoalProgress = (goalIndex: number, newProgress: number) => {
    if (goalIndex === 0) {
      setGoal1(g => ({ ...g, progress: newProgress }));
    } else if (goalIndex === 1) {
      setGoal2(g => ({ ...g, progress: newProgress }));
    } else if (goalIndex === 2) {
      setGoal3(g => ({ ...g, progress: newProgress }));
    }
  };

  // Save progress to backend
  const saveProgressToBackend = async (goalId: string, progress: number, feedback: string) => {
    try {
      const token = await getToken();
      const res = await fetch(`${BASE_URL}/api/weekly-goals/${goalId}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          progress,
          feedback: feedback.trim() !== '' ? feedback : undefined
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update progress');
      
      return data;
    } catch (err: any) {
      console.log('Error saving progress:', err);
      throw err;
    }
  };

  // Submit feedback and save
  const handleFeedbackSubmit = async (feedback: string) => {
    try {
      const { goalIndex, goalId, newProgress } = feedbackModal;
      if (goalIndex === null) return;

      // Update local state immediately
      updateGoalProgress(goalIndex, newProgress);

      // If goal has an ID, save to backend
      if (goalId) {
        await saveProgressToBackend(goalId, newProgress, feedback);
        // Alert.alert('Success', 'Progress updated with your feedback!');
      } else {
        // Store feedback locally to send after the goal is created on save
        setPendingFeedbacks((prev) => {
          const copy = [...prev];
          copy[goalIndex] = feedback;
          return copy;
        });
        // Alert.alert('Progress Updated', 'This feedback will be saved when you tap Save Progress.');
      }

      // Close modal
      setFeedbackModal({ ...feedbackModal, visible: false });
      
    } catch (err: any) {
      console.log('Error updating progress:', err);
      Alert.alert('Error', err.message || 'Failed to update progress.');
    }
  };

  // Handle modal close without saving
  const handleFeedbackCancel = () => {
    setFeedbackModal({ ...feedbackModal, visible: false });
  };

  const handleSaveChanges = async () => {
    try {
      const token = await getToken();
      const goalsToSave = [goal1, goal2, goal3];

      for (let i = 0; i < goalsToSave.length; i++) {
        const goal = goalsToSave[i];
        if (!goal.text || goal.text.trim() === '') continue;

        let res;
        if (!goal._id) {
          // Create new goal
          res = await fetch(`${BASE_URL}/api/weekly-goals`, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ text: goal.text, progress: goal.progress })
          });
          const created = await res.json();
          if (!res.ok) throw new Error(created.error || 'Failed to save goal');

          // If there was pending feedback for this new goal, send it now
          const pending = pendingFeedbacks[i];
          if ((pending && pending.trim() !== '') || goal.progress !== 0) {
            const patchRes = await fetch(`${BASE_URL}/api/weekly-goals/${created._id}`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                progress: goal.progress,
                feedback: pending && pending.trim() !== '' ? pending : undefined,
              })
            });
            const patchData = await patchRes.json();
            if (!patchRes.ok) throw new Error(patchData.error || 'Failed to save feedback');
          }
        } else {
          // Update existing goal (text only, progress is handled separately)
          res = await fetch(`${BASE_URL}/api/weekly-goals/${goal._id}`, {
            method: 'PATCH',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ text: goal.text })
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || 'Failed to save goal');
        }
      }

      Alert.alert('Goals Saved!', 'Your weekly progress has been updated.', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
      
      // Clear any pending feedbacks that were persisted
      setPendingFeedbacks(['', '', '']);
      fetchGoals();
    } catch (err: any) {
      console.log('Error saving goals:', err);
      Alert.alert('Error', err.message || 'Failed to save goals.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.headerContainer}>
            <LottieView source={require('../assets/lottie/Target.json')} autoPlay loop style={styles.lottie} />
            <ScreenTitle style={styles.pageTitle}>This Week's Focus</ScreenTitle>
            <Text style={styles.subtitle}>Set three main objectives and track your progress.</Text>
          </View>
          
          <WeeklyGoalCard 
            title="Objective 1"
            placeholder="e.g., Complete the fitness challenge"
            value={goal1.text}
            onChangeText={(text: string) => setGoal1(g => ({ ...g, text }))}
            progress={goal1.progress}
            onProgressChange={(progress: number) => handleProgressChange(0, progress, colors.gradient.cool[0])}
            gradient={colors.gradient.cool}
            goalData={goal1}
          />
          <WeeklyGoalCard 
            title="Objective 2"
            placeholder="e.g., Read 'Atomic Habits'"
            value={goal2.text}
            onChangeText={(text: string) => setGoal2(g => ({ ...g, text }))}
            progress={goal2.progress}
            onProgressChange={(progress: number) => handleProgressChange(1, progress, colors.gradient.warm[0])}
            gradient={colors.gradient.warm}
            goalData={goal2}
          />
          <WeeklyGoalCard 
            title="Objective 3"
            placeholder="e.g., Dedicate time to a personal project"
            value={goal3.text}
            onChangeText={(text: string) => setGoal3(g => ({ ...g, text }))}
            progress={goal3.progress}
            onProgressChange={(progress: number) => handleProgressChange(2, progress, colors.gradient.passion[0])}
            gradient={colors.gradient.passion}
            goalData={goal3}
          />
        </ScrollView>

        <View style={styles.saveButtonContainer}>
          <GradientButton title="SAVE PROGRESS" onPress={handleSaveChanges} />
        </View>
      </KeyboardAvoidingView>

      <FeedbackModal
        visible={feedbackModal.visible}
        onClose={handleFeedbackCancel}
        onSubmit={handleFeedbackSubmit}
        currentProgress={feedbackModal.newProgress}
        color={feedbackModal.color}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background.primary },
  scrollContent: { paddingBottom: 20 },
  headerContainer: { alignItems: 'center', padding: 20 },
  lottie: { width: 120, height: 120, marginBottom: -10 },
  pageTitle: { textAlign: 'center', marginBottom: 5 },
  subtitle: { fontFamily: 'Inter-Regular', fontSize: 16, textAlign: 'center', color: colors.text.secondary, marginBottom: 10 },
  card: { backgroundColor: 'white', borderRadius: 20, padding: 20, marginHorizontal: 20, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 5 },
  completedCard: { backgroundColor: '#F0FFF4', borderColor: colors.gradient.success[0], borderWidth: 1 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  cardTitle: {},
  progressText: { fontFamily: 'Inter-Bold', fontSize: 18 },
  input: { fontFamily: 'Inter-Regular', fontSize: 16, color: colors.text.primary, minHeight: 50, textAlignVertical: 'top', borderBottomWidth: 1, borderColor: colors.border, marginBottom: 15, paddingBottom: 10 },
  saveButtonContainer: { padding: 20, borderTopWidth: 1, borderColor: colors.border, backgroundColor: 'rgba(255, 255, 255, 0.8)'},
  trackerContainer: { flexDirection: 'row', height: 20, width: '100%' },
  segment: { flex: 1, marginHorizontal: 2, borderRadius: 10 },
  firstSegment: { marginLeft: 0 },
  lastSegment: { marginRight: 0 },
  
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  modalTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 22,
    color: colors.text.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 20,
    textAlign: 'center',
  },
  feedbackInput: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: colors.text.primary,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 12,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: colors.border,
  },
  cancelButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.text.secondary,
  },
  submitButton: {
    // backgroundColor set dynamically
  },
  submitButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: 'white',
  },
});

export default WeeklyGoalsScreen;

