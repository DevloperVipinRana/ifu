// src/screens/ActivityPlayerScreen.jsx
// 5 min activity file
import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, StatusBar, Text, SafeAreaView, Image, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import LottieView from 'lottie-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '@env';
// Import our new reusable component
import ProgressBar from '../../components/common/ProgressBar';


//importing the component

import CreativeInputScreen from '../../components/common/CreativeInputScreen';

const ActivityPlayerScreen = ({ route, navigation }: any) => {
  // Get activity details from navigation parameters
  const { activityData } = route.params || {};
  const {
    title = 'Mindful Minute',
    description = 'Take a moment to find your center.',
    duration = 60,
    lottieSource = require('../../assets/animation/activityAnimation.json'),
    speed = 1, // Add default speed
    style = {},
    type,// Add default style
  } = activityData || {};

  const [seconds, setSeconds] = useState(duration);
  const [isComplete, setIsComplete] = useState(false);
  const lottieRef = useRef<any>(null);
  const [isInputPhaseComplete, setIsInputPhaseComplete] = useState(false);


  useEffect(() => {
    if (type !== 'Creative') {
      setIsInputPhaseComplete(true); // If not creative, skip the input phase immediately
    }
  }, [type]);
  console.log(activityData);

  useEffect(() => {
    // Start the main animation when the component loads
    if (!isComplete) {
      lottieRef.current?.play();
    }

    if (seconds === 0) {
      if (!isComplete) setIsComplete(true);
      lottieRef.current?.pause(); // Pause the animation when complete
      return;
    }

    const timer = setInterval(() => {
      setSeconds((prev: number) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds, isComplete]);
  const handleFinish = async () => {
    try {
      const token = await AsyncStorage.getItem("token"); // stored at login

      await fetch(`${BASE_URL}/api/five-min-activities/log`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          activityKey: title.toLowerCase().replace(/\s+/g, "_"),  // e.g. "5m_breathing"
          title: title,      // e.g. "Box Breathing"
        }),
      });

      Alert.alert("Saved!", "Your activity has been saved.", [
                { text: "OK", onPress: () => navigation.goBack() }
              ]);
        navigation.goBack();
    } catch (error) {
      console.error("Error logging activity:", error);
      Alert.alert("Error", "Failed to save activity. Please try again.", [
        { text: "OK", onPress: () => navigation.goBack() }
      ]);
    }
  };

  const formattedTime = `0${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;

  const handleInputSubmit = (userInput: string) => {
    console.log(`User's creative input: ${userInput}`);
    setIsComplete(true); // Go to the completion screen
  };

  return (
    <LinearGradient colors={['#1A202C', '#2D3748']} style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
          <Icon name="x" size={32} color="white" />
        </TouchableOpacity>

        {/* --- Conditional Rendering Logic --- */}
        {type === 'Creative' && !isInputPhaseComplete ? (
          // --- Creative Input View ---
          <CreativeInputScreen
            title={title}
            onSubmit={handleInputSubmit}
            ProgressBarComponent={ProgressBar} // Pass the component itself
            duration={duration}               // Pass the timer data
            seconds={seconds}                 // Pass the timer data
            formattedTime={formattedTime}
            description={description}
                 // Pass the timer data
          />
        ) : isComplete ? (
          // --- Completion View ---
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
        ) : (
          // --- Activity In Progress View (Timer & Lottie) ---
          <View style={styles.content}>
              <LottieView
                ref={lottieRef}
                source={lottieSource}
                loop
                speed={speed}
                style={[styles.lottie, style]}
              />
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.description}>{description}</Text>
              <ProgressBar 
                duration={duration} 
                timeLeft={seconds} 
                formattedTime={formattedTime} 
              />
          </View>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
};

// --- STYLES ---
const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  closeButton: { position: 'absolute', top: 60, right: 20, zIndex: 10 },
  content: { alignItems: 'center', paddingHorizontal: 30, width: '100%' },
  activityImage: {
    width: 250,
    height: 250,
    borderRadius: 25,
    marginBottom: 20,
  },
  lottie: {
    width: 280,
    height: 280,
    marginBottom: 20,
  },
  userInputContainer: {
    width: '100%',
    height: 280, // Same height as the Lottie view for consistency
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    justifyContent: 'center',
  },
  userInputText: {
    color: 'white',
    fontSize: 18,
    lineHeight: 26,
  },
  title: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 16,
    textAlign: 'center',
  },
  finishButton: {
    marginTop: 40,
    backgroundColor: '#34D399',
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    width: '100%',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  finishButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  completionIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#34D399',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  }
});

export default ActivityPlayerScreen;





// // src/screens/ActivityPlayerScreen.jsx

// import React, { useState, useEffect ,useRef} from 'react';
// import { View, StyleSheet, TouchableOpacity, StatusBar, Text, SafeAreaView, Image, Alert } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';
// import Icon from 'react-native-vector-icons/Feather';
// import LottieView from 'lottie-react-native';
// // Import our new reusable component
// // import ProgressBar from '../components/ProgressBar';
// import ProgressBar from '../../components/common/ProgressBar1';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { BASE_URL } from '@env';

// const ActivityPlayerScreen = ({ route, navigation }: any) => {
//   // Get activity details from navigation parameters
//   const { activityData } = route.params || {};
//   const {
//     title = 'Mindful Minute',
//     description = 'Take a moment to find your center.',
//     duration = 60,
//     lottieSource = require('../../assets/animation/activityAnimation.json'), // Add a default
//     speed = 1, // Add default speed
//     style = {}, // Add default style
// } = activityData || {};

//   const [seconds, setSeconds] = useState(duration);
//   const [isComplete, setIsComplete] = useState(false);
//   const lottieRef = useRef<any>(null);

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
// }, [seconds, isComplete]);


// const handleFinish = async () => {
//   try {
//     const token = await AsyncStorage.getItem("token"); // stored at login

//     await fetch(`${BASE_URL}/api/five-min-activities/log`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({
//         activityKey: title.toLowerCase().replace(/\s+/g, "_"),  // e.g. "5m_breathing"
//         title: activityData.title,      // e.g. "Box Breathing"
//       }),
//     });

//     Alert.alert("Saved!", "Your activity has been saved.", [
//               { text: "OK", onPress: () => navigation.goBack() }
//             ]);
//   } catch (error) {
//     console.error("Error logging activity:", error);
//   }
// };




//   // const handleFinish = () => {
//   //   console.log(`Activity "${title}" completed.`);
//   //   navigation.goBack();
//   // };

//   const formattedTime = `0${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;

//   return (
//     <LinearGradient colors={['#1A202C', '#2D3748']} style={styles.container}>
//       <StatusBar barStyle="light-content" />
//       <SafeAreaView style={styles.safeArea}>
//         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
//           <Icon name="x" size={32} color="white" />
//         </TouchableOpacity>
        
//         {isComplete ? (
//           // --- Completion View ---
//           <View style={styles.content}>
//               <View style={styles.completionIcon}>
//                 <Icon name="check" size={60} color="#1A202C" />
//               </View>
//               <Text style={styles.title}>Activity Complete!</Text>
//               <Text style={styles.description}>You took a moment for yourself. Well done.</Text>
              
//               <TouchableOpacity style={styles.finishButton} onPress={handleFinish}>
//                 <Text style={styles.finishButtonText}>FINISH</Text>
//               </TouchableOpacity>
//           </View>
//         ) : (
//           // --- Activity In Progress View ---
//           <View style={styles.content}>
//               <LottieView
//     ref={lottieRef}
//     source={lottieSource}
//     loop
//     speed={speed}
//     style={[styles.lottie, style]} // Use the lottie style
// />
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
// },
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