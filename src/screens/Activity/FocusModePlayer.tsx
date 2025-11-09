// mobile/src/screens/Activity/FocusModePlayer.tsx

import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, StatusBar, Text, Alert, Image, Dimensions, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../App';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '@env'; 

import { ScreenTitle, Body } from '../../components/common/StyledText';
import { GradientButton } from '../../components/interactive/GradientButton';
import { ProgressBar } from '../../components/common/ProgressBar1';
import { colors } from '../../theme/color';

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

const FocusModePlayer = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  
  const { 
    title = 'Mindful Minute', 
    description = 'Take a moment to focus on your breath and find your center.',
    gradient = colors.gradient.cool,
    duration = 60,
    category = 'Mindfulness>Breathing>Deep Breathing',
    instructions = [
      'Find a comfortable position',
      'Close your eyes gently',
      'Focus on your breath',
      'Let thoughts pass without judgment'
    ]
  } = route.params as any || {};

  const [seconds, setSeconds] = useState(duration);
  const [isComplete, setIsComplete] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [autoStartCountdown, setAutoStartCountdown] = useState(20);
  const [images, setImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loadingImages, setLoadingImages] = useState(true);

  // Fetch images from database
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          console.error('❌ No token found for image fetch');
          setLoadingImages(false);
          return;
        }

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
          
          const convertedImages = imageData.images.map((img: any) => 
            convertGoogleDriveLink(img.image_url)
          );
          
          if (convertedImages.length > 0) {
            setImages(convertedImages);
          } else {
            console.warn('⚠️ No images returned from API');
          }
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

  // Auto-start countdown when on instructions screen
  useEffect(() => {
    if (showInstructions && autoStartCountdown > 0) {
      const timer = setTimeout(() => {
        setAutoStartCountdown(autoStartCountdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (showInstructions && autoStartCountdown === 0) {
      // Auto-start the activity
      handleStartActivity();
    }
  }, [autoStartCountdown, showInstructions]);

  // Auto-rotate images during activity
  useEffect(() => {
    if (images.length > 1 && !isPaused && !isComplete && !showInstructions) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 4000); // Change every 4 seconds

      return () => clearInterval(interval);
    }
  }, [images, isPaused, isComplete, showInstructions]);

  // Timer logic
  useEffect(() => {
    if (showInstructions || isPaused || isComplete) return;
    
    if (seconds <= 0) {
      setIsComplete(true);
      return;
    }

    const timer = setInterval(() => {
      setSeconds((prev: number) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds, isComplete, isPaused, showInstructions]);

  const handleStartActivity = () => {
    setShowInstructions(false);
  };

  const handlePauseResume = () => {
    setIsPaused(!isPaused);
  };

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
        category,
      };
      
      console.log('🚀 FocusModePlayer: Sending activity data:', activityData);
      
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
      
      navigation.navigate('Feedback', { activityTitle: title });
    } catch (err) {
      console.error('❌ FocusModePlayer: Error saving activity:', err);
      Alert.alert('Error', 'Could not save activity. Please try again.');
    }
  };

  const progressValue = ((duration - seconds) / duration) * 100;
  const formattedTime = `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;

  // Instructions Screen with Auto-Start Countdown
  if (showInstructions) {
    return (
      <LinearGradient colors={[gradient[0] + '30', '#FFFFFF']} style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon name="close" size={28} color={colors.text.primary} />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* Image Preview */}
            {!loadingImages && images.length > 0 && (
              <View style={styles.previewImageContainer}>
                <Image 
                  source={{ uri: images[0] }} 
                  style={styles.previewImage}
                  resizeMode="cover"
                />
                <LinearGradient 
                  colors={['transparent', 'rgba(255,255,255,0.9)']} 
                  style={styles.imageGradient}
                />
              </View>
            )}

            <View style={styles.instructionsContent}>
              <ScreenTitle style={styles.title}>{title}</ScreenTitle>
              <Text style={styles.categoryText}>
                {category.split('>').join(' • ')}
              </Text>
              <Text style={styles.durationBadge}>⏱️ {duration} seconds</Text>
              
              <Body style={styles.description}>{description}</Body>

              {/* Instructions */}
              {instructions && instructions.length > 0 && (
                <View style={styles.instructionsBox}>
                  <View style={styles.instructionsHeader}>
                    <Icon name="list-outline" size={20} color={gradient[1]} />
                    <Text style={styles.instructionsTitle}>Steps to Follow</Text>
                  </View>
                  {instructions.map((instruction, index) => (
                    <View key={index} style={styles.instructionItem}>
                      <View style={[styles.instructionNumber, { backgroundColor: gradient[1] }]}>
                        <Text style={styles.instructionNumberText}>{index + 1}</Text>
                      </View>
                      <Text style={styles.instructionText}>{instruction}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </ScrollView>

          <View style={styles.buttonContainer}>
            <GradientButton 
              title={autoStartCountdown > 0 ? `START ACTIVITY (Auto-starts in ${autoStartCountdown}s)` : "STARTING..."} 
              onPress={handleStartActivity} 
              gradient={gradient}
            />
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  // Activity Complete Screen
  if (isComplete) {
    return (
      <LinearGradient colors={[gradient[0] + '30', '#FFFFFF']} style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon name="close" size={28} color={colors.text.primary} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.completeContent}>
            <View style={styles.checkmarkContainer}>
              <Icon name="checkmark-circle" size={120} color={gradient[1]} />
            </View>
            <ScreenTitle style={styles.title}>Activity Complete!</ScreenTitle>
            <Body style={styles.description}>You took a moment for yourself. Well done.</Body>
            <GradientButton 
              title="FINISH" 
              onPress={handleComplete} 
              style={{ marginTop: 40 }} 
              gradient={gradient} 
            />
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  // Active Activity Screen - WITH IMAGES AND STEPS
  return (
    <LinearGradient colors={[gradient[0] + '30', '#FFFFFF']} style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header with controls */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="close" size={28} color={colors.text.primary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handlePauseResume}>
            <Icon 
              name={isPaused ? "play" : "pause"} 
              size={28} 
              color={colors.text.primary} 
            />
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.activityScrollView} contentContainerStyle={styles.activityContent}>
          {/* Timer Display */}
          <View style={styles.timerSection}>
            <Text style={styles.timerLabel}>Time Remaining</Text>
            <Text style={styles.timer}>{formattedTime}</Text>
            <ProgressBar progress={progressValue} color={gradient[1]} />
          </View>

          {/* Title and Description */}
          <View style={styles.titleSection}>
            <ScreenTitle style={styles.activeTitle}>{title}</ScreenTitle>
            <Body style={styles.activeDescription}>{description}</Body>
          </View>

          {/* Images Carousel */}
          {!loadingImages && images.length > 0 && (
            <View style={styles.imageCarouselSection}>
              <View style={styles.carouselImageWrapper}>
                <Image 
                  source={{ uri: images[currentImageIndex] }} 
                  style={styles.carouselImage}
                  resizeMode="cover"
                />
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
              </View>
            </View>
          )}

          {/* Steps/Instructions During Activity */}
          {instructions && instructions.length > 0 && (
            <View style={styles.stepsSection}>
              <View style={styles.stepsHeader}>
                <Icon name="checkbox-outline" size={22} color={gradient[1]} />
                <Text style={styles.stepsTitle}>Follow These Steps</Text>
              </View>
              {instructions.map((instruction, index) => (
                <View key={index} style={styles.stepItem}>
                  <View style={[styles.stepNumber, { backgroundColor: gradient[1] }]}>
                    <Text style={styles.stepNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.stepText}>{instruction}</Text>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  scrollContent: {
    flexGrow: 1,
  },
  previewImageContainer: {
    height: 200,
    width: '100%',
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  imageGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  instructionsContent: {
    padding: 25,
  },
  title: { 
    textAlign: 'center', 
    marginBottom: 8 
  },
  categoryText: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: 8,
  },
  durationBadge: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: colors.primary,
    textAlign: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'center',
    marginBottom: 20,
  },
  description: { 
    textAlign: 'center',
    marginBottom: 24,
  },
  instructionsBox: {
    backgroundColor: '#f8f9ff',
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
  buttonContainer: {
    padding: 20,
  },
  completeContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  checkmarkContainer: {
    marginBottom: 30,
  },
  
  // ACTIVE ACTIVITY SCREEN STYLES
  activityScrollView: {
    flex: 1,
  },
  activityContent: {
    padding: 20,
  },
  timerSection: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  timerLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: 8,
  },
  timer: {
    fontFamily: 'Inter-Bold',
    fontSize: 48,
    textAlign: 'center',
    marginBottom: 15,
    color: colors.text.primary,
  },
  titleSection: {
    marginBottom: 20,
  },
  activeTitle: {
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 24,
  },
  activeDescription: {
    textAlign: 'center',
    color: colors.text.secondary,
    fontSize: 16,
  },
  imageCarouselSection: {
    marginBottom: 20,
  },
  carouselImageWrapper: {
    borderRadius: 16,
    overflow: 'hidden',
    height: 250,
    backgroundColor: '#f0f0f0',
  },
  carouselImage: {
    width: '100%',
    height: '100%',
  },
  dotsContainer: {
    position: 'absolute',
    bottom: 15,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  activeDot: {
    backgroundColor: 'white',
    width: 24,
  },
  stepsSection: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  stepsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  stepsTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.text.primary,
  },
  stepItem: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  stepNumberText: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    color: 'white',
  },
  stepText: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    lineHeight: 22,
    color: colors.text.primary,
  },
});

export default FocusModePlayer;

