// mobile/src/screens/Activity/FocusModePlayer.tsx

import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, StatusBar, Text, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../App';
import LottieView from 'lottie-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Use LOCAL_IP or fallback for emulator
import { BASE_URL } from '@env'; 

import { ScreenTitle, Body } from '../../components/common/StyledText';
import { GradientButton } from '../../components/interactive/GradientButton';
import { ProgressBar } from '../../components/common/ProgressBar1';
import { colors } from '../../theme/color';

const FocusModePlayer = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  
  const { 
    title = 'Mindful Minute', 
    description = 'Take a moment to focus on your breath and find your center.',
    lottieSource = require('../../assets/lottie/breathing.json'),
    gradient = colors.gradient.cool,
    duration = 60
  } = route.params as any || {};

  const [seconds, setSeconds] = useState(duration);
  const [isComplete, setIsComplete] = useState(false);
  const lottieRef = useRef<LottieView>(null);

  useEffect(() => {
    // Start animation on mount
    if (!isComplete) {
      lottieRef.current?.play();
    }
    
    if (seconds <= 0) {
      setIsComplete(true);
      lottieRef.current?.reset(); // Use reset to stop the animation cleanly
      return;
    }

    const timer = setInterval(() => {
      setSeconds((prev: number) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds, isComplete]);
  
  // const handleComplete = async () => {
  //   try {
  //     const token = await AsyncStorage.getItem('token');
  //     const activityData = {
  //       activityKey: title.toLowerCase().replace(/\s+/g, "_"),
  //       title,
  //     };
      
  //     console.log('🚀 FocusModePlayer: Sending activity data:', activityData);
  //     console.log('🚀 FocusModePlayer: BASE_URL:', BASE_URL);
  //     console.log('🚀 FocusModePlayer: Token:', token ? 'Present' : 'Missing');
      
  //     // Save activity completion to backend
  //     const response = await fetch(`${BASE_URL}/api/activities/complete`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //       body: JSON.stringify(activityData),
  //     });
      
  //     if (!response.ok) {
  //       throw new Error(`HTTP error! status: ${response.status}`);
  //     }
      
  //     const result = await response.json();
  //     console.log('✅ FocusModePlayer: Activity saved successfully:', result);
      
  //     // Navigate to the FeedbackScreen, passing the activity's title for context.
  //     navigation.navigate('Feedback', { activityTitle: title });
  //   } catch (err) {
  //     console.error('❌ FocusModePlayer: Error saving activity:', err);
  //     // Still navigate to feedback screen even if save fails
  //     navigation.navigate('Feedback', { activityTitle: title });
  //   }
  // };

  // Calculate progress from 0 to 100
  
  const handleComplete = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    
    if (!token) {
      console.error('❌ No token found');
      Alert.alert('Error', 'Authentication token not found');
      return;
    }

    const activityData = {
      activityKey: title.toLowerCase().replace(/\s+/g, "_"),
      title,
    };
    
    console.log('🚀 FocusModePlayer: Sending activity data:', activityData);
    console.log('🚀 FocusModePlayer: BASE_URL:', BASE_URL);
    
    const response = await fetch(`${BASE_URL}/api/activities/complete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(activityData),
    });
    
    console.log('📡 Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error response body:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    console.log('✅ FocusModePlayer: Activity saved successfully:', result);
    
    // Navigate to the FeedbackScreen
    navigation.navigate('Feedback', { activityTitle: title });
  } catch (err) {
    console.error('❌ FocusModePlayer: Error saving activity:', err);
    Alert.alert('Error', 'Could not save activity. Please try again.');
    // Only navigate on success, or ask user if they want to continue
  }
};



  const progressValue = ((duration - seconds) / duration) * 100;
  // Format the time to display as MM:SS
  const formattedTime = `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;

  return (
    <LinearGradient colors={[gradient[0] + '30', '#FFFFFF']} style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={{flex: 1}}>
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Icon name="close" size={28} color={colors.text.primary} />
            </TouchableOpacity>
        </View>
        
        {isComplete ? (
          // --- Completion View ---
          <View style={styles.content}>
            <LottieView
                source={require('../../assets/lottie/checkmark.json')}
                autoPlay
                loop={false}
                style={styles.lottie}
            />
            <ScreenTitle style={styles.title}>Activity Complete!</ScreenTitle>
            <Body style={styles.description}>You took a moment for yourself. Well done.</Body>
            <GradientButton title="FINISH" onPress={handleComplete} style={{marginTop: 40}} gradient={gradient} />
          </View>
        ) : (
          // --- Activity In Progress View ---
          <View style={styles.content}>
            <View style={styles.mainContent}>
                <ScreenTitle style={styles.title}>{title}</ScreenTitle>
                <Body style={styles.description}>{description}</Body>
                <LottieView
                    ref={lottieRef}
                    source={lottieSource}
                    autoPlay
                    loop
                    style={styles.lottie}
                />
            </View>
            <View style={styles.footer}>
                <Text style={styles.timer}>{formattedTime}</Text>
                <ProgressBar progress={progressValue} color={gradient[1]} />
            </View>
          </View>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'flex-end', padding: 20 },
  content: { flex: 1, justifyContent: 'space-between', paddingBottom: 20 },
  mainContent: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 30 },
  lottie: { width: 250, height: 250, marginTop: 20 },
  title: { textAlign: 'center', marginBottom: 10 },
  description: { textAlign: 'center' },
  footer: { paddingHorizontal: 40 },
  timer: {
    fontFamily: 'Inter-Bold',
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 15,
    color: colors.text.primary,
  }
});

export default FocusModePlayer;
