// mobile/src/screens/ActivityPlayerScreen.tsx

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, StatusBar, Text, SafeAreaView, Image, Alert, ScrollView, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '@env';
import ProgressBar from '../../components/common/ProgressBar';

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

const ActivityPlayerScreen = ({ route, navigation }: any) => {
  const { activityData } = route.params || {};
  const {
    title = 'Mindful Activity',
    description = 'Take a moment to focus.',
    duration = 300,
    category = 'Focus>Mindfulness>Breathing',
    instructions = [
      'Follow the steps below',
      'Take your time',
      'Focus on the present moment'
    ],
  } = activityData || {};

  const [seconds, setSeconds] = useState(duration);
  const [isComplete, setIsComplete] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
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

  // Auto-rotate images
  useEffect(() => {
    if (images.length > 1 && !isPaused && !isComplete) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 4000); // Change every 4 seconds

      return () => clearInterval(interval);
    }
  }, [images, isPaused, isComplete]);

  // Timer logic
  useEffect(() => {
    if (isPaused || isComplete) return;

    if (seconds === 0) {
      setIsComplete(true);
      return;
    }

    const timer = setInterval(() => {
      setSeconds((prev: number) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds, isComplete, isPaused]);

  const handlePauseResume = () => {
    setIsPaused(!isPaused);
  };

  const handleFinish = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        console.error('❌ No token found');
        Alert.alert('Error', 'Authentication token not found');
        return;
      }

      const response = await fetch(`${BASE_URL}/api/five-min-activities/log`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          activityKey: title.toLowerCase().replace(/\s+/g, "_"),
          title: title,
          category: category,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      Alert.alert("Saved!", "Your activity has been saved.", [
        { text: "OK", onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error("Error logging activity:", error);
      Alert.alert("Error", "Failed to save activity. Please try again.", [
        { text: "OK", onPress: () => navigation.goBack() }
      ]);
    }
  };

  const formattedTime = `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;
  const progressValue = ((duration - seconds) / duration) * 100;

  // Activity Complete Screen
  if (isComplete) {
    return (
      <LinearGradient colors={['#1A202C', '#2D3748']} style={styles.container}>
        <StatusBar barStyle="light-content" />
        <SafeAreaView style={styles.safeArea}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
            <Icon name="x" size={32} color="white" />
          </TouchableOpacity>

          <View style={styles.content}>
            <View style={styles.completionIcon}>
              <Icon name="check" size={60} color="#1A202C" />
            </View>
            <Text style={styles.title}>Activity Complete!</Text>
            <Text style={styles.description}>You took a moment for yourself. Well done.</Text>

            <TouchableOpacity style={styles.finishButton} onPress={handleFinish}>
              <Text style={styles.finishButtonText}>FINISH</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  // Activity In Progress Screen
  return (
    <LinearGradient colors={['#1A202C', '#2D3748']} style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea}>
        {/* Header with controls */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
            <Icon name="x" size={28} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handlePauseResume} style={styles.headerButton}>
            <Icon 
              name={isPaused ? "play" : "pause"} 
              size={28} 
              color="white" 
            />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          {/* Timer Section */}
          <View style={styles.timerSection}>
            <Text style={styles.timerLabel}>Time Remaining</Text>
            <Text style={styles.timer}>{formattedTime}</Text>
            <View style={styles.progressContainer}>
              <View style={[styles.progressBar, { width: `${progressValue}%` }]} />
            </View>
            {isPaused && (
              <Text style={styles.pausedText}>⏸️ Paused</Text>
            )}
          </View>

          {/* Title and Description */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.categoryBadge}>
              {category.split('>').join(' • ')}
            </Text>
            <Text style={styles.description}>{description}</Text>
          </View>

          {/* Images Carousel */}
          {!loadingImages && images.length > 0 && (
            <View style={styles.imageSection}>
              <View style={styles.imageWrapper}>
                <Image 
                  source={{ uri: images[currentImageIndex] }} 
                  style={styles.activityImage}
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

          {/* Instructions/Steps */}
          {instructions && instructions.length > 0 && (
            <View style={styles.stepsSection}>
              <View style={styles.stepsHeader}>
                <Icon name="list" size={22} color="#34D399" />
                <Text style={styles.stepsTitle}>Follow These Steps</Text>
              </View>
              {instructions.map((instruction, index) => (
                <View key={index} style={styles.stepItem}>
                  <View style={styles.stepNumber}>
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
  safeArea: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    marginTop: 20,
  },
  headerButton: {
    padding: 8,
  },
  closeButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 10,
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  
  // Timer Section
  timerSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  timerLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  timer: {
    color: 'white',
    fontSize: 56,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  progressContainer: {
    width: '100%',
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#34D399',
    borderRadius: 3,
  },
  pausedText: {
    color: '#FCD34D',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
  },

  // Title Section
  titleSection: {
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  categoryBadge: {
    color: '#34D399',
    fontSize: 12,
    fontWeight: '600',
    backgroundColor: 'rgba(52, 211, 153, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 12,
  },
  description: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },

  // Image Section
  imageSection: {
    marginBottom: 20,
  },
  imageWrapper: {
    borderRadius: 20,
    overflow: 'hidden',
    height: 250,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  activityImage: {
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
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  activeDot: {
    backgroundColor: 'white',
    width: 24,
  },

  // Steps Section
  stepsSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  stepsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 10,
  },
  stepsTitle: {
    color: 'white',
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
    color: '#1A202C',
    fontSize: 14,
    fontWeight: 'bold',
  },
  stepText: {
    flex: 1,
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 15,
    lineHeight: 22,
  },

  // Completion Screen
  completionIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#34D399',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  finishButton: {
    marginTop: 40,
    backgroundColor: '#34D399',
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    width: '100%',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  finishButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});

export default ActivityPlayerScreen;





// // src/screens/ActivityPlayerScreen.jsx
// // 5 min activity file
// import React, { useState, useEffect, useRef } from 'react';
// import { View, StyleSheet, TouchableOpacity, StatusBar, Text, SafeAreaView, Image, Alert } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';
// import Icon from 'react-native-vector-icons/Feather';
// import LottieView from 'lottie-react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { BASE_URL } from '@env';
// // Import our new reusable component
// import ProgressBar from '../../components/common/ProgressBar';


// //importing the component

// import CreativeInputScreen from '../../components/common/CreativeInputScreen';

// const ActivityPlayerScreen = ({ route, navigation }: any) => {
//   // Get activity details from navigation parameters
//   const { activityData } = route.params || {};
//   const {
//     title = 'Mindful Minute',
//     description = 'Take a moment to find your center.',
//     duration = 60,
//     lottieSource = require('../../assets/animation/activityAnimation.json'),
//     speed = 1, // Add default speed
//     style = {},
//     type,// Add default style
//   } = activityData || {};

//   const [seconds, setSeconds] = useState(duration);
//   const [isComplete, setIsComplete] = useState(false);
//   const lottieRef = useRef<any>(null);
//   const [isInputPhaseComplete, setIsInputPhaseComplete] = useState(false);


//   useEffect(() => {
//     if (type !== 'Creative') {
//       setIsInputPhaseComplete(true); // If not creative, skip the input phase immediately
//     }
//   }, [type]);
//   console.log(activityData);

//   useEffect(() => {
//     // Start the main animation when the component loads
//     if (!isComplete) {
//       lottieRef.current?.play();
//     }

//     if (seconds === 0) {
//       if (!isComplete) setIsComplete(true);
//       lottieRef.current?.pause(); // Pause the animation when complete
//       return;
//     }

//     const timer = setInterval(() => {
//       setSeconds((prev: number) => prev - 1);
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [seconds, isComplete]);
//   const handleFinish = async () => {
//     try {
//       const token = await AsyncStorage.getItem("token"); // stored at login

//       await fetch(`${BASE_URL}/api/five-min-activities/log`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           activityKey: title.toLowerCase().replace(/\s+/g, "_"),  // e.g. "5m_breathing"
//           title: title,      // e.g. "Box Breathing"
//         }),
//       });

//       Alert.alert("Saved!", "Your activity has been saved.", [
//                 { text: "OK", onPress: () => navigation.goBack() }
//               ]);
//         navigation.goBack();
//     } catch (error) {
//       console.error("Error logging activity:", error);
//       Alert.alert("Error", "Failed to save activity. Please try again.", [
//         { text: "OK", onPress: () => navigation.goBack() }
//       ]);
//     }
//   };

//   const formattedTime = `0${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;

//   const handleInputSubmit = (userInput: string) => {
//     console.log(`User's creative input: ${userInput}`);
//     setIsComplete(true); // Go to the completion screen
//   };

//   return (
//     <LinearGradient colors={['#1A202C', '#2D3748']} style={styles.container}>
//       <StatusBar barStyle="light-content" />
//       <SafeAreaView style={styles.safeArea}>
//         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
//           <Icon name="x" size={32} color="white" />
//         </TouchableOpacity>

//         {/* --- Conditional Rendering Logic --- */}
//         {type === 'Creative' && !isInputPhaseComplete ? (
//           // --- Creative Input View ---
//           <CreativeInputScreen
//             title={title}
//             onSubmit={handleInputSubmit}
//             ProgressBarComponent={ProgressBar} // Pass the component itself
//             duration={duration}               // Pass the timer data
//             seconds={seconds}                 // Pass the timer data
//             formattedTime={formattedTime}
//             description={description}
//                  // Pass the timer data
//           />
//         ) : isComplete ? (
//           // --- Completion View ---
//           <View style={styles.content}>
//             <View style={styles.completionIcon}>
//               <Icon name="check" size={60} color="#1A202C" />
//             </View>
//             <Text style={styles.title}>Activity Complete!</Text>
//             <Text style={styles.description}>You took a moment for yourself. Well done.</Text>

//             <TouchableOpacity style={styles.finishButton} onPress={handleFinish}>
//               <Text style={styles.finishButtonText}>FINISH</Text>
//             </TouchableOpacity>
//           </View>
//         ) : (
//           // --- Activity In Progress View (Timer & Lottie) ---
//           <View style={styles.content}>
//               <LottieView
//                 ref={lottieRef}
//                 source={lottieSource}
//                 loop
//                 speed={speed}
//                 style={[styles.lottie, style]}
//               />
//               <Text style={styles.title}>{title}</Text>
//               <Text style={styles.description}>{description}</Text>
//               <ProgressBar 
//                 duration={duration} 
//                 timeLeft={seconds} 
//                 formattedTime={formattedTime} 
//               />
//           </View>
//         )}
//       </SafeAreaView>
//     </LinearGradient>
//   );
// };

// // --- STYLES ---
// const styles = StyleSheet.create({
//   container: { flex: 1 },
//   safeArea: { flex: 1, justifyContent: 'center', alignItems: 'center' },
//   closeButton: { position: 'absolute', top: 60, right: 20, zIndex: 10 },
//   content: { alignItems: 'center', paddingHorizontal: 30, width: '100%' },
//   activityImage: {
//     width: 250,
//     height: 250,
//     borderRadius: 25,
//     marginBottom: 20,
//   },
//   lottie: {
//     width: 280,
//     height: 280,
//     marginBottom: 20,
//   },
//   userInputContainer: {
//     width: '100%',
//     height: 280, // Same height as the Lottie view for consistency
//     backgroundColor: 'rgba(255, 255, 255, 0.1)',
//     borderRadius: 15,
//     padding: 20,
//     marginBottom: 20,
//     justifyContent: 'center',
//   },
//   userInputText: {
//     color: 'white',
//     fontSize: 18,
//     lineHeight: 26,
//   },
//   title: {
//     color: 'white',
//     fontSize: 28,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 10,
//   },
//   description: {
//     color: 'rgba(255, 255, 255, 0.7)',
//     fontSize: 16,
//     textAlign: 'center',
//   },
//   finishButton: {
//     marginTop: 40,
//     backgroundColor: '#34D399',
//     paddingVertical: 18,
//     borderRadius: 30,
//     alignItems: 'center',
//     width: '100%',
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 5,
//     elevation: 5,
//   },
//   finishButtonText: {
//     color: 'white',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   completionIcon: {
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//     backgroundColor: '#34D399',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 30,
//   }
// });

// export default ActivityPlayerScreen;
