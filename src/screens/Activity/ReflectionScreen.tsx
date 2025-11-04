// mobile/src/screens/Activity/ReflectionScreen.tsx

import React, { useState } from 'react';
import { View, StyleSheet, Text, TextInput, Alert, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, ImageBackground, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../App';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Use LOCAL_IP or fallback for emulator
// const LOCAL_IP = '192.168.6.197'; // <-- Replace with your PC's local IP
// const BASE_URL = `http://${LOCAL_IP}:5000`; // backend server URL
import { ScreenTitle, Body } from '../../components/common/StyledText';
import { GradientButton } from '../../components/interactive/GradientButton';
import { colors } from '../../theme/color';
import LinearGradient from 'react-native-linear-gradient';
import { BASE_URL } from '@env';
const ReflectionScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  
  const { 
    title = 'Daily Reflection', 
    question = 'What is one thing that went well today?',
    placeholder = 'Describe a small win, a positive interaction, or something you learned...',
    // You can pass a specific image URL per activity in ActivitySelectionScreen
    headerImage = 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1948&auto=format&fit=crop'
  } = route.params as any || {};

  const [response, setResponse] = useState('');

  // const handleSubmit = async () => {
  //   if (response.trim().length < 5) {
  //     Alert.alert('Please elaborate', 'Take a moment to write a thoughtful response.');
  //     return;
  //   }

  //   try {
  //     const token = await AsyncStorage.getItem('token');
  //     const reflectionData = {
  //       activityKey: title.toLowerCase().replace(/\s+/g, "_"),
  //       title,
  //       response,
  //     };
      
  //     console.log('🚀 ReflectionScreen: Sending reflection data:', reflectionData);
  //     console.log('🚀 ReflectionScreen: BASE_URL:', BASE_URL);
  //     console.log('🚀 ReflectionScreen: Token:', token ? 'Present' : 'Missing');
      
  //     const fetchResponse = await fetch(`${BASE_URL}/api/activities/complete`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //       body: JSON.stringify(reflectionData),
  //     });
      
  //     if (!fetchResponse.ok) {
  //       throw new Error(`HTTP error! status: ${fetchResponse.status}`);
  //     }
      
  //     const result = await fetchResponse.json();
  //     console.log('✅ ReflectionScreen: Reflection saved successfully:', result);
      
  //     // Navigate to FeedbackScreen instead of going back
  //     navigation.navigate('Feedback', { activityTitle: title });
      
  //   } catch (err) {
  //     console.error('❌ ReflectionScreen: Error saving reflection:', err);
  //     Alert.alert('Error', 'Could not save reflection. Please try again.');
  //   }
  // };

  const handleSubmit = async () => {
  if (response.trim().length < 5) {
    Alert.alert('Please elaborate', 'Take a moment to write a thoughtful response.');
    return;
  }

  try {
    const token = await AsyncStorage.getItem('token');
    
    // Check if token exists
    if (!token) {
      console.error('❌ ReflectionScreen: No token found');
      Alert.alert('Authentication Error', 'Please log in again.');
      navigation.navigate('Login'); // or your login screen name
      return;
    }

    const reflectionData = {
      activityKey: title.toLowerCase().replace(/\s+/g, "_"),
      title,
      response,
    };
    
    console.log('🚀 ReflectionScreen: Sending reflection data:', reflectionData);
    console.log('🚀 ReflectionScreen: BASE_URL:', BASE_URL);
    console.log('🚀 ReflectionScreen: Full URL:', `${BASE_URL}/api/activities/complete`);
    
    const fetchResponse = await fetch(`${BASE_URL}/api/activities/complete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(reflectionData),
    });
    
    console.log('📡 ReflectionScreen: Response status:', fetchResponse.status);
    console.log('📡 ReflectionScreen: Response headers:', fetchResponse.headers);
    
    // Get response text first to see what we received
    const responseText = await fetchResponse.text();
    console.log('📡 ReflectionScreen: Response body:', responseText);
    
    if (!fetchResponse.ok) {
      console.error('❌ ReflectionScreen: HTTP error:', fetchResponse.status, responseText);
      throw new Error(`HTTP error! status: ${fetchResponse.status}, body: ${responseText}`);
    }
    
    // Parse the response
    const result = JSON.parse(responseText);
    console.log('✅ ReflectionScreen: Reflection saved successfully:', result);
    
    // Navigate to FeedbackScreen
    navigation.navigate('Feedback', { activityTitle: title });
    
  } catch (err) {
    console.error('❌ ReflectionScreen: Error saving reflection:', err);
    console.error('❌ ReflectionScreen: Error details:', {
      message: err.message,
      name: err.name,
      stack: err.stack
    });
    
    // More descriptive error message
    if (err.message.includes('Network request failed')) {
      Alert.alert('Network Error', 'Cannot connect to server. Please check your connection and BASE_URL configuration.');
    } else if (err.message.includes('401')) {
      Alert.alert('Authentication Error', 'Session expired. Please log in again.');
    } else {
      Alert.alert('Error', `Could not save reflection: ${err.message}`);
    }
  }
};


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <ImageBackground source={{ uri: headerImage }} style={styles.header}>
                <LinearGradient colors={['rgba(0,0,0,0.6)', 'transparent']} style={styles.headerScrim}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
                        <Icon name="close" size={32} color="white" />
                    </TouchableOpacity>
                    <ScreenTitle style={styles.title}>{title}</ScreenTitle>
                </LinearGradient>
            </ImageBackground>

            <View style={styles.content}>
                <Body style={styles.questionText}>{question}</Body>
                <TextInput
                style={styles.input}
                placeholder={placeholder}
                placeholderTextColor={colors.text.secondary}
                multiline={true}
                value={response}
                onChangeText={setResponse}
                autoFocus={true}
                />
            </View>
        </ScrollView>
        <View style={styles.buttonContainer}>
            <GradientButton title="SAVE REFLECTION" onPress={handleSubmit} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' }, // Changed to white for a journal feel
  header: {
    height: 200,
    justifyContent: 'center',
    backgroundColor: '#ccc', // Fallback color
  },
  headerScrim: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
  },
  closeButton: {
      position: 'absolute',
      top: 15,
      left: 15,
      padding: 5,
  },
  title: {
      color: 'white',
      textAlign: 'center',
      textShadowColor: 'rgba(0, 0, 0, 0.5)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 5,
  },
  content: {
      flex: 1,
      padding: 25,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      marginTop: -20, // Pulls the content area up to overlap the header image
      backgroundColor: 'white',
  },
  questionText: {
      fontSize: 22,
      fontFamily: 'Inter-SemiBold',
      lineHeight: 32,
      marginBottom: 20,
      color: colors.text.primary,
  },
  input: {
      flex: 1,
      fontFamily: 'Inter-Regular',
      fontSize: 18,
      color: colors.text.primary,
      textAlignVertical: 'top',
      lineHeight: 28,
  },
  buttonContainer: {
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderColor: colors.border,
  },
});

export default ReflectionScreen;