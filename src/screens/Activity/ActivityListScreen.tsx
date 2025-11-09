// mobile/src/screens/ActivityListScreen.tsx

import React, { useState, useRef, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  Easing,
  Dimensions,
  ScrollView,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '@env';

import { ACTIVITIES } from '../../components/common/activities';
import { colors } from '../../theme/color1';

// --- Constants ---
const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_HORIZONTAL_MARGIN = 20;
const CARD_WIDTH = SCREEN_WIDTH - (CARD_HORIZONTAL_MARGIN * 2);
const CARD_HEIGHT = 150;
const CARD_MARGIN_BOTTOM = 20;
const ITEM_HEIGHT = CARD_HEIGHT + CARD_MARGIN_BOTTOM;
const AUTO_START_DURATION = 20; // 20 seconds

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

// --- Reusable Components ---
const ActivityCard = ({ activity, style }: any) => (
  <Animated.View style={style}>
    <LinearGradient colors={activity.gradient} style={styles.card}>
      <Icon name={activity.icon} size={40} color="white" />
      <Text style={styles.cardTitle}>{activity.title}</Text>
      <Text style={styles.cardDescription}>{activity.description}</Text>
      <Text style={styles.categoryBadge}>
        {activity.category.split('>').join(' • ')}
      </Text>
    </LinearGradient>
  </Animated.View>
);

const ActivityListScreen = ({ navigation }: any) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<any>(null);
  const [images, setImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [countdown, setCountdown] = useState(AUTO_START_DURATION);
  const [loadingImages, setLoadingImages] = useState(false);
  
  const spinValue = useRef(new Animated.Value(0)).current;
  const resultValue = useRef(new Animated.Value(0)).current;
  const animationRef = useRef<any>(null);
  const countdownTimerRef = useRef<any>(null);
  const imageRotationRef = useRef<any>(null);

  // --- User interests (filter by main category only) ---
  const userInterests = ['Yoga', 'Workout', 'Creative', 'Focus', 'Finance', 'Productivity'];

  // Filter activities by main category
  let filteredActivities = ACTIVITIES.filter(activity => {
    const mainCategory = activity.type;
    return userInterests.includes(mainCategory);
  });

  if (filteredActivities.length === 0) {
    filteredActivities = ACTIVITIES;
  }

  console.log(`📚 Filtered activities: ${filteredActivities.length}`);

  // Create extended list for seamless loop
  const extendedActivities = [
    ...filteredActivities, ...filteredActivities, 
    ...filteredActivities, ...filteredActivities, 
    ...filteredActivities, ...filteredActivities, 
    ...filteredActivities, ...filteredActivities, 
    ...filteredActivities
  ];

  const listHeight = filteredActivities.length * ITEM_HEIGHT;
  const loopDuration = filteredActivities.length <= 3 ? 2500 : 1500;

  // Fetch images when activity is selected
  useEffect(() => {
    const fetchImages = async () => {
      if (!selectedActivity) return;
      
      try {
        setLoadingImages(true);
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          console.error('❌ No token found for image fetch');
          setLoadingImages(false);
          return;
        }

        const categoryParts = selectedActivity.category.split('>').map((part: string) => part.trim());
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
  }, [selectedActivity]);

  // Auto-rotate images
  useEffect(() => {
    if (images.length > 1 && showResult) {
      imageRotationRef.current = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 4000);

      return () => {
        if (imageRotationRef.current) {
          clearInterval(imageRotationRef.current);
        }
      };
    }
  }, [images, showResult]);

  // Countdown timer
  useEffect(() => {
    if (showResult && countdown > 0) {
      countdownTimerRef.current = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (showResult && countdown === 0) {
      // Auto-navigate when countdown reaches 0
      handleNavigate();
    }

    return () => {
      if (countdownTimerRef.current) {
        clearTimeout(countdownTimerRef.current);
      }
    };
  }, [showResult, countdown]);

  // Animate result card in
  useEffect(() => {
    if (showResult) {
      Animated.timing(resultValue, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    }
  }, [showResult]);

  useEffect(() => {
    handleSpin();
  }, []);

  const handleSpin = () => {
    if (isAnimating) return;

    // Setup
    setIsAnimating(true);
    setShowResult(false);
    setCountdown(AUTO_START_DURATION);
    setImages([]);
    setCurrentImageIndex(0);
    resultValue.setValue(0);
    spinValue.setValue(-listHeight * 2);

    // Pick winner
    const winner = filteredActivities[Math.floor(Math.random() * filteredActivities.length)];
    
    console.log(`🎯 Selected: ${winner.title}`);
    console.log(`📁 Category: ${winner.category}`);

    // Start spinning animation
    animationRef.current = Animated.loop(
      Animated.timing(spinValue, {
        toValue: -listHeight * 3,
        duration: loopDuration,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    animationRef.current.start();

    // Stop and show result
    setTimeout(() => {
      animationRef.current?.stop();
      setSelectedActivity(winner);
      setShowResult(true);
      setIsAnimating(false);
    }, 3000);
  };

  const handleNavigate = () => {
    if (selectedActivity) {
      // Clear all timers
      if (countdownTimerRef.current) {
        clearTimeout(countdownTimerRef.current);
      }
      if (imageRotationRef.current) {
        clearInterval(imageRotationRef.current);
      }

      console.log('🚀 Navigating with data:', {
        ...selectedActivity.params,
        category: selectedActivity.category
      });

      navigation.navigate(selectedActivity.screen, {
        activityData: {
          ...selectedActivity.params,
          category: selectedActivity.category,
        }
      });
    }
  };

  // Animation Styles
  const resultCardStyle = {
    opacity: resultValue,
    transform: [
      {
        scale: resultValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0.8, 1],
        })
      }
    ]
  };

  const progressPercentage = ((AUTO_START_DURATION - countdown) / AUTO_START_DURATION) * 100;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={28} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Choose an Activity</Text>
      </View>
      
      {!showResult ? (
        <View style={styles.animationContainer}>
          <Animated.View style={{ transform: [{ translateY: spinValue }] }}>
            {extendedActivities.map((activity, index) => (
              <View style={styles.cardWrapper} key={`${activity.key}-${index}`}>
                <ActivityCard activity={activity} />
              </View>
            ))}
          </Animated.View>
        </View>
      ) : (
        <ScrollView style={styles.resultScrollView} contentContainerStyle={styles.resultContent}>
          {/* Background Image */}
          {images.length > 0 && (
            <View style={styles.imageContainer}>
              <Image 
                source={{ uri: images[currentImageIndex] }} 
                style={styles.backgroundImage}
                resizeMode="cover"
              />
              <LinearGradient
                colors={['transparent', 'rgba(26, 32, 44, 0.8)', 'rgba(26, 32, 44, 0.95)']}
                style={styles.imageOverlay}
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
          )}

          {/* Activity Card */}
          {selectedActivity && (
            <Animated.View style={[styles.resultCardContainer, resultCardStyle]}>
              <LinearGradient colors={selectedActivity.gradient} style={styles.resultCard}>
                <Icon name={selectedActivity.icon} size={50} color="white" />
                <Text style={styles.resultCardTitle}>{selectedActivity.title}</Text>
                <Text style={styles.resultCardDescription}>{selectedActivity.description}</Text>
                <Text style={styles.resultCategoryBadge}>
                  {selectedActivity.category.split('>').join(' • ')}
                </Text>
              </LinearGradient>
            </Animated.View>
          )}

          {/* Steps Section */}
          {selectedActivity && selectedActivity.params.instructions && (
            <View style={styles.stepsSection}>
              <View style={styles.stepsHeader}>
                <Icon name="list" size={22} color={colors.text.primary} />
                <Text style={styles.stepsTitle}>Follow These Steps</Text>
              </View>
              {selectedActivity.params.instructions.map((instruction: string, index: number) => (
                <View key={index} style={styles.stepItem}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.stepText}>{instruction}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Duration Info */}
          <View style={styles.durationInfo}>
            <Icon name="clock" size={18} color={colors.text.secondary} />
            <Text style={styles.durationText}>
              Duration: {Math.floor(selectedActivity?.params.duration / 60)} minutes
            </Text>
          </View>
        </ScrollView>
      )}

      {/* Button Container with Timer */}
      {showResult && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            onPress={handleNavigate} 
            style={styles.goButton}
            activeOpacity={0.8}
          >
            <Text style={styles.goButtonText}>Let's Go!</Text>
            <Text style={styles.countdownText}>Auto-starting in {countdown}s</Text>
          </TouchableOpacity>
          
          {/* Progress bar */}
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBarFill, { width: `${progressPercentage}%` }]} />
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.background.primary, 
  },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingBottom: 10,
    paddingTop: 20,
    marginTop: 20,
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  animationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  cardWrapper: {
    height: ITEM_HEIGHT,
    width: SCREEN_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: CARD_HORIZONTAL_MARGIN,
  },
  card: {
    borderRadius: 20,
    padding: 25,
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    justifyContent: 'center',
  },
  cardTitle: {
    color: colors.text.onGradient,
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 15,
  },
  cardDescription: {
    color: 'rgba(255, 255, 255, 0.9)', 
    marginTop: 5,
    fontSize: 14,
  },
  categoryBadge: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 11,
    marginTop: 8,
    fontWeight: '600',
  },
  
  // Result View Styles
  resultScrollView: {
    flex: 1,
  },
  resultContent: {
    paddingBottom: 20,
  },
  imageContainer: {
    width: SCREEN_WIDTH,
    height: 300,
    position: 'relative',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
  },
  dotsContainer: {
    position: 'absolute',
    bottom: 20,
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
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  activeDot: {
    backgroundColor: 'white',
    width: 24,
  },
  resultCardContainer: {
    paddingHorizontal: 20,
    marginTop: -80,
  },
  resultCard: {
    borderRadius: 20,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
    alignItems: 'center',
  },
  resultCardTitle: {
    color: colors.text.onGradient,
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 15,
    textAlign: 'center',
  },
  resultCardDescription: {
    color: 'rgba(255, 255, 255, 0.9)', 
    marginTop: 8,
    fontSize: 15,
    textAlign: 'center',
  },
  resultCategoryBadge: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 12,
    marginTop: 12,
    fontWeight: '600',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },

  // Steps Section
  stepsSection: {
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  stepsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 10,
  },
  stepsTitle: {
    color: colors.text.primary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  stepItem: {
    flexDirection: 'row',
    marginBottom: 14,
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#34D399',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  stepNumberText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  stepText: {
    flex: 1,
    color: colors.text.secondary,
    fontSize: 15,
    lineHeight: 22,
  },

  // Duration Info
  durationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    gap: 8,
  },
  durationText: {
    color: colors.text.secondary,
    fontSize: 14,
    fontWeight: '600',
  },

  // Button Container
  buttonContainer: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  goButton: {
    backgroundColor: '#34C759',
    paddingVertical: 18,
    alignItems: 'center',
    borderRadius: 15,
    shadowColor: '#34C759',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  goButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  countdownText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 13,
    marginTop: 4,
    fontWeight: '600',
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: 'rgba(52, 199, 89, 0.2)',
    borderRadius: 2,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#34C759',
    borderRadius: 2,
  },
});

export default ActivityListScreen;






// // 5 min activity file
// import React, { useState, useRef, useEffect } from 'react';
// import {
//   SafeAreaView,
//   StyleSheet,
//   Text,
//   View,
//   TouchableOpacity,
//   Animated,
//   Easing,
//   Dimensions,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/Feather';
// import LinearGradient from 'react-native-linear-gradient';

// import { ACTIVITIES } from '../../components/common/activities';
// import {colors} from '../../theme/color1'

// // --- Constants ---
// const SCREEN_WIDTH = Dimensions.get('window').width;
// const CARD_HORIZONTAL_MARGIN = 20;
// const CARD_WIDTH = SCREEN_WIDTH - (CARD_HORIZONTAL_MARGIN * 2);
// const CARD_HEIGHT = 150;
// const CARD_MARGIN_BOTTOM = 20;
// const ITEM_HEIGHT = CARD_HEIGHT + CARD_MARGIN_BOTTOM;

// // --- Reusable Components ---
// const ActivityCard = ({ activity, style }) => (
//     <Animated.View style={style}>
//         <LinearGradient colors={activity.gradient} style={styles.card}>
//             <Icon name={activity.icon} size={40} color="white" />
//             <Text style={styles.cardTitle}>{activity.title}</Text>
//             <Text style={styles.cardDescription}>{activity.description}</Text>
//         </LinearGradient>
//     </Animated.View>
// );

// const ActivityListScreen = ({ navigation }) => {
//   const [isAnimating, setIsAnimating] = useState(false);
//   const [showResult, setShowResult] = useState(false);
//   const [selectedActivity, setSelectedActivity] = useState(null);
  
//   const spinValue = useRef(new Animated.Value(0)).current;
//   const resultValue = useRef(new Animated.Value(0)).current;
//   const animationRef = useRef(null);

//   // --- Hardcoded user interest for filtering ---
//   const user = ['Productivity'];

//   let filteredActivities = ACTIVITIES.filter(activity => user.includes(activity.type));
//   if (filteredActivities.length === 0) {
//       filteredActivities = ACTIVITIES;
//   }

//   // --- THE KEY FIX FOR THE WHITE SCREEN ---
//   // We create a much larger buffer of activities. Using 5 copies ensures that
//   // even if the filtered list has only 1 or 2 items, the total height of the
//   // animated content is far greater than the screen height, eliminating any gaps.
//   const extendedActivities = [
//       ...filteredActivities, ...filteredActivities, 
//       ...filteredActivities, ...filteredActivities, 
//       ...filteredActivities,...filteredActivities,...filteredActivities,...filteredActivities,...filteredActivities
//     ];
//   const listHeight = filteredActivities.length * ITEM_HEIGHT;
//   const loopDuration = filteredActivities.length <= 3 ? 2500 : 1500; // Slower for small lists

//   // Animate result card in
//   useEffect(() => {
//       if (showResult) {
//           Animated.timing(resultValue, {
//               toValue: 1,
//               duration: 400,
//               useNativeDriver: true,
//           }).start();
//       }
//   }, [showResult]);
//   useEffect(() => {
//     handleSpin();
//   }, []);

//   const handleSpin = () => {
//     if (isAnimating) return;

//     // --- 1. SETUP ---
//     setIsAnimating(true);
//     setShowResult(false);
//     resultValue.setValue(0);
//     // Position the list at the start of the THIRD (middle) block.
//     // This gives us two full blocks of content above and two below.
//     spinValue.setValue(-listHeight * 2);

//     // --- 2. PICK A WINNER (SECRETLY) ---
//     const winner = filteredActivities[Math.floor(Math.random() * filteredActivities.length)];
    
    
    
//     // --- 3. START THE SEAMLESS SPINNING ANIMATION ---
//     animationRef.current = Animated.loop(
//       Animated.timing(spinValue, {
//         toValue: -listHeight * 3, // Animate to the end of the third block
//         duration: loopDuration,
//         easing: Easing.linear,
//         useNativeDriver: true,
//       })
//     );
//     animationRef.current.start();

//     // --- 4. AFTER A DELAY, STOP THE SPIN AND SHOW THE RESULT ---
//     setTimeout(() => {
//         animationRef.current?.stop();
//         setSelectedActivity(winner);
//         setShowResult(true);
//         setIsAnimating(false);
//     }, 3000); // Let it spin for 3 seconds
//   };
//   console.log(selectedActivity);

//   const handleNavigate = () => {
//     if (selectedActivity) {
//      navigation.navigate(selectedActivity.screen, { activityData: { ...selectedActivity.params, type: selectedActivity.type } });
//     }
//   };

//   // --- Animation Styles ---
//   const resultCardStyle = {
//       opacity: resultValue,
//       transform: [
//           {
//               scale: resultValue.interpolate({
//                   inputRange: [0, 1],
//                   outputRange: [0.8, 1],
//               })
//           }
//       ]
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
//             <Icon name="arrow-left" size={28} color={colors.text.primary} />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Choose an Activity</Text>
//       </View>
      
//       <View style={styles.animationContainer}>
//         {/* We use a simple conditional render now */}
//         {!showResult ? (
//             <Animated.View style={{ transform: [{ translateY: spinValue }] }}>
//                 {extendedActivities.map((activity, index) => (
//                     <View style={styles.cardWrapper} key={`${activity.key}-${index}`}>
//                         <ActivityCard activity={activity} />
//                     </View>
//                 ))}
//             </Animated.View>
//         ) : (
//             selectedActivity && (
//                 <ActivityCard activity={selectedActivity} style={resultCardStyle} />
//             )
//         )}
//       </View>

//        <View style={styles.buttonContainer}>
//           {selectedActivity && (
//             <TouchableOpacity onPress={handleNavigate} style={[styles.actionButton, styles.goButton]}>
//                 <Text style={styles.actionButtonText}>Let's Go!</Text>
//             </TouchableOpacity>
//           )}
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//     container: { 
//       flex: 1, 
//       backgroundColor: colors.background.primary, 
//     },
//     header: { 
//       flexDirection: 'row', 
//       alignItems: 'center', 
//       paddingHorizontal: 20, 
//       paddingBottom: 10,
//       paddingTop: 20,
//       marginTop: 20,
//     },
//     animationContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         overflow: 'hidden',
//     },
//     cardWrapper: {
//         height: ITEM_HEIGHT,
//         width: SCREEN_WIDTH,
//         alignItems: 'center',
//         justifyContent: 'center',
//         paddingHorizontal: CARD_HORIZONTAL_MARGIN,
//       },
//     card: {
//       borderRadius: 20,
//       padding: 25,
//       width: CARD_WIDTH,
//       height: CARD_HEIGHT,
//       shadowColor: '#000',
//       shadowOffset: { width: 0, height: 4 },
//       shadowOpacity: 0.05,
//       shadowRadius: 10,
//       elevation: 5,
//       justifyContent: 'center',
//     },
//     cardTitle: {
//       color: colors.text.onGradient,
//       fontSize: 20,
//       fontWeight: 'bold',
//       marginTop: 15,
//     },
//     cardDescription: {
//       color: 'rgba(255, 255, 255, 0.9)', 
//       marginTop: 5,
//       fontSize: 14,
//     },
//     buttonContainer: {
//         paddingVertical: 20,
//         paddingHorizontal: 20,
//         alignItems: 'center',
//     },
//     actionButton: {
//         backgroundColor: '#007AFF',
//         paddingVertical: 18,
//         width: '100%',
//         alignItems: 'center',
//         borderRadius: 15,
//     },
//     goButton: {
//         backgroundColor: '#34C759',
//     },
//     actionButtonText: {
//       color: 'white',
//       fontSize: 18,
//       fontWeight: 'bold',
//     },
//   });

// export default ActivityListScreen;
