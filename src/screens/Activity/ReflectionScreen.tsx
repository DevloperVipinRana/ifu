// mobile/src/screens/Activity/ReflectionScreen.tsx

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TextInput, Alert, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Image, Dimensions, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../App';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScreenTitle, Body } from '../../components/common/StyledText';
import { GradientButton } from '../../components/interactive/GradientButton';
import { colors } from '../../theme/color';
import LinearGradient from 'react-native-linear-gradient';
import { BASE_URL } from '@env';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Helper function to convert Google Drive links
const convertGoogleDriveLink = (url: string): string => {
  if (url.includes('drive.google.com')) {
    const fileIdMatch = url.match(/[-\w]{25,}/);
    if (fileIdMatch) {
      return `https://drive.google.com/uc?export=view&id=${fileIdMatch[0]}`;
    }
  }
  return url;
};

const ReflectionScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  
  const { 
    title = 'Daily Reflection', 
    question = 'What is one thing that went well today?',
    placeholder = 'Describe a small win, a positive interaction, or something you learned...',
    category = 'Mindfulness>Reflection>Gratitude',
    instructions = [
      'Take a moment to reflect',
      'Write honestly and openly',
      'No answer is too small'
    ]
  } = route.params as any || {};

  const [response, setResponse] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loadingImages, setLoadingImages] = useState(true);
  
  // Timer states
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds = 1 minute
  const [timerActive, setTimerActive] = useState(true);
  const [timerComplete, setTimerComplete] = useState(false);

  // Fetch images from database based on category
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          console.error('❌ No token found for image fetch');
          setLoadingImages(false);
          return;
        }

        // Split category into parts
        const categoryParts = category.split('>').map((part: string) => part.trim());
        
        console.log('🖼️ Fetching images for category:', categoryParts);

        const imageResponse = await fetch(`${BASE_URL}/api/images/by-category`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ categories: categoryParts }),
        });

        if (imageResponse.ok) {
          const imageData = await imageResponse.json();
          console.log('✅ Images fetched:', imageData);
          
          // Convert Google Drive links and set images
          const convertedImages = imageData.images.map((img: any) => 
            convertGoogleDriveLink(img.image_url)
          );
          
          setImages(convertedImages);
        } else {
          console.warn('⚠️ No images found for this category');
        }
      } catch (err) {
        console.error('❌ Error fetching images:', err);
      } finally {
        setLoadingImages(false);
      }
    };

    fetchImages();
  }, [category]);

  // Auto-rotate images
  useEffect(() => {
    if (images.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 4000); // Change image every 4 seconds

      return () => clearInterval(interval);
    }
  }, [images]);

  // Timer countdown
  useEffect(() => {
    if (timerActive && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !timerComplete) {
      setTimerComplete(true);
      setTimerActive(false);
    }
  }, [timerActive, timeLeft, timerComplete]);

  const toggleTimer = () => {
    if (timeLeft > 0) {
      setTimerActive(!timerActive);
    } else {
      // Reset timer
      setTimeLeft(60);
      setTimerActive(true);
      setTimerComplete(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async () => {
    if (response.trim().length < 5) {
      Alert.alert('Please elaborate', 'Take a moment to write a thoughtful response.');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');
      
      if (!token) {
        console.error('❌ ReflectionScreen: No token found');
        Alert.alert('Authentication Error', 'Please log in again.');
        navigation.navigate('Login');
        return;
      }

      const reflectionData = {
        activityKey: title.toLowerCase().replace(/\s+/g, "_"),
        title,
        response,
        category,
      };
      
      console.log('🚀 ReflectionScreen: Sending reflection data:', reflectionData);
      
      const fetchResponse = await fetch(`${BASE_URL}/api/activities/complete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(reflectionData),
      });
      
      console.log('📡 ReflectionScreen: Response status:', fetchResponse.status);
      
      const responseText = await fetchResponse.text();
      console.log('📡 ReflectionScreen: Response body:', responseText);
      
      if (!fetchResponse.ok) {
        console.error('❌ ReflectionScreen: HTTP error:', fetchResponse.status, responseText);
        throw new Error(`HTTP error! status: ${fetchResponse.status}`);
      }
      
      const result = JSON.parse(responseText);
      console.log('✅ ReflectionScreen: Reflection saved successfully:', result);
      
      navigation.navigate('Feedback', { activityTitle: title });
      
    } catch (err) {
      console.error('❌ ReflectionScreen: Error saving reflection:', err);
      
      if (err.message.includes('Network request failed')) {
        Alert.alert('Network Error', 'Cannot connect to server. Please check your connection.');
      } else if (err.message.includes('401')) {
        Alert.alert('Authentication Error', 'Session expired. Please log in again.');
      } else {
        Alert.alert('Error', `Could not save reflection: ${err.message}`);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          {/* Header with Image Carousel */}
          <View style={styles.imageCarouselContainer}>
            {loadingImages ? (
              <View style={styles.imagePlaceholder}>
                <Text style={styles.placeholderText}>Loading images...</Text>
              </View>
            ) : images.length > 0 ? (
              <>
                <Image 
                  source={{ uri: images[currentImageIndex] }} 
                  style={styles.carouselImage}
                  resizeMode="cover"
                />
                <LinearGradient 
                  colors={['rgba(0,0,0,0.7)', 'transparent', 'rgba(0,0,0,0.4)']} 
                  style={styles.imageOverlay}
                >
                  <TouchableOpacity 
                    onPress={() => navigation.goBack()} 
                    style={styles.closeButton}
                  >
                    <Icon name="close" size={32} color="white" />
                  </TouchableOpacity>
                  
                  <View style={styles.headerContent}>
                    <ScreenTitle style={styles.title}>{title}</ScreenTitle>
                    <Text style={styles.categoryText}>
                      {category.split('>').join(' • ')}
                    </Text>
                  </View>

                  {/* Image dots indicator */}
                  {images.length > 1 && (
                    <View style={styles.dotsContainer}>
                      {images.map((_, index) => (
                        <View
                          key={index}
                          style={[
                            styles.dot,
                            index === currentImageIndex && styles.activeDot
                          ]}
                        />
                      ))}
                    </View>
                  )}
                </LinearGradient>
              </>
            ) : (
              <LinearGradient 
                colors={['#667eea', '#764ba2']} 
                style={styles.gradientHeader}
              >
                <TouchableOpacity 
                  onPress={() => navigation.goBack()} 
                  style={styles.closeButton}
                >
                  <Icon name="close" size={32} color="white" />
                </TouchableOpacity>
                <ScreenTitle style={styles.title}>{title}</ScreenTitle>
                <Text style={styles.categoryText}>
                  {category.split('>').join(' • ')}
                </Text>
              </LinearGradient>
            )}
          </View>

          {/* Timer Section */}
          <View style={styles.timerContainer}>
            <View style={styles.timerContent}>
              <Icon 
                name={timerComplete ? "checkmark-circle" : "time-outline"} 
                size={24} 
                color={timerComplete ? "#10b981" : colors.primary} 
              />
              <View style={styles.timerTextContainer}>
                <Text style={styles.timerLabel}>
                  {timerComplete ? "Reflection Time Complete!" : "Take a moment to reflect"}
                </Text>
                <Text style={[
                  styles.timerDisplay,
                  timerComplete && styles.timerComplete
                ]}>
                  {formatTime(timeLeft)}
                </Text>
              </View>
              <TouchableOpacity onPress={toggleTimer} style={styles.timerButton}>
                <Icon 
                  name={timeLeft === 0 ? "refresh" : timerActive ? "pause" : "play"} 
                  size={24} 
                  color={colors.primary} 
                />
              </TouchableOpacity>
            </View>
            <View style={styles.timerProgressContainer}>
              <View 
                style={[
                  styles.timerProgress, 
                  { width: `${((60 - timeLeft) / 60) * 100}%` }
                ]} 
              />
            </View>
          </View>

          {/* Instructions Section */}
          {instructions && instructions.length > 0 && (
            <View style={styles.instructionsContainer}>
              <View style={styles.instructionsHeader}>
                <Icon name="list-outline" size={20} color={colors.primary} />
                <Text style={styles.instructionsTitle}>How to complete this activity</Text>
              </View>
              {instructions.map((instruction, index) => (
                <View key={index} style={styles.instructionItem}>
                  <View style={styles.instructionNumber}>
                    <Text style={styles.instructionNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.instructionText}>{instruction}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Question and Input */}
          <View style={styles.content}>
            <Body style={styles.questionText}>{question}</Body>
            <TextInput
              style={styles.input}
              placeholder={placeholder}
              placeholderTextColor={colors.text.secondary}
              multiline={true}
              value={response}
              onChangeText={setResponse}
              autoFocus={false}
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
  container: { 
    flex: 1, 
    backgroundColor: 'white' 
  },
  imageCarouselContainer: {
    height: 280,
    width: '100%',
    backgroundColor: '#f0f0f0',
  },
  carouselImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
  },
  placeholderText: {
    fontFamily: 'Inter-Regular',
    color: '#888',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    padding: 20,
  },
  gradientHeader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  closeButton: {
    alignSelf: 'flex-start',
    padding: 5,
  },
  headerContent: {
    alignItems: 'center',
  },
  title: {
    color: 'white',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 8,
    marginBottom: 8,
  },
  categoryText: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingBottom: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  activeDot: {
    backgroundColor: 'white',
    width: 24,
  },
  // Timer styles
  timerContainer: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  timerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  timerTextContainer: {
    flex: 1,
  },
  timerLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  timerDisplay: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: colors.primary,
  },
  timerComplete: {
    color: '#10b981',
  },
  timerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerProgressContainer: {
    height: 4,
    backgroundColor: '#f0f0f0',
  },
  timerProgress: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  // Instructions styles
  instructionsContainer: {
    backgroundColor: '#f8f9ff',
    marginHorizontal: 20,
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e7ff',
  },
  instructionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  instructionsTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    color: colors.text.primary,
  },
  instructionItem: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'flex-start',
  },
  instructionNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  instructionNumberText: {
    fontFamily: 'Inter-Bold',
    fontSize: 12,
    color: 'white',
  },
  instructionText: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    lineHeight: 20,
    color: colors.text.secondary,
  },
  content: {
    flex: 1,
    padding: 25,
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
    minHeight: 150,
  },
  buttonContainer: {
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderColor: colors.border,
  },
});

export default ReflectionScreen;

