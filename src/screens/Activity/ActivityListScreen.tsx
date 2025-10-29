// 5 min activity file
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
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';

import { ACTIVITIES } from '../../components/common/activities';
import {colors} from '../../theme/color1'

// --- Constants ---
const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_HORIZONTAL_MARGIN = 20;
const CARD_WIDTH = SCREEN_WIDTH - (CARD_HORIZONTAL_MARGIN * 2);
const CARD_HEIGHT = 150;
const CARD_MARGIN_BOTTOM = 20;
const ITEM_HEIGHT = CARD_HEIGHT + CARD_MARGIN_BOTTOM;

// --- Reusable Components ---
const ActivityCard = ({ activity, style }) => (
    <Animated.View style={style}>
        <LinearGradient colors={activity.gradient} style={styles.card}>
            <Icon name={activity.icon} size={40} color="white" />
            <Text style={styles.cardTitle}>{activity.title}</Text>
            <Text style={styles.cardDescription}>{activity.description}</Text>
        </LinearGradient>
    </Animated.View>
);

const ActivityListScreen = ({ navigation }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  
  const spinValue = useRef(new Animated.Value(0)).current;
  const resultValue = useRef(new Animated.Value(0)).current;
  const animationRef = useRef(null);

  // --- Hardcoded user interest for filtering ---
  const user = ['Productivity'];

  let filteredActivities = ACTIVITIES.filter(activity => user.includes(activity.type));
  if (filteredActivities.length === 0) {
      filteredActivities = ACTIVITIES;
  }

  // --- THE KEY FIX FOR THE WHITE SCREEN ---
  // We create a much larger buffer of activities. Using 5 copies ensures that
  // even if the filtered list has only 1 or 2 items, the total height of the
  // animated content is far greater than the screen height, eliminating any gaps.
  const extendedActivities = [
      ...filteredActivities, ...filteredActivities, 
      ...filteredActivities, ...filteredActivities, 
      ...filteredActivities,...filteredActivities,...filteredActivities,...filteredActivities,...filteredActivities
    ];
  const listHeight = filteredActivities.length * ITEM_HEIGHT;
  const loopDuration = filteredActivities.length <= 3 ? 2500 : 1500; // Slower for small lists

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

    // --- 1. SETUP ---
    setIsAnimating(true);
    setShowResult(false);
    resultValue.setValue(0);
    // Position the list at the start of the THIRD (middle) block.
    // This gives us two full blocks of content above and two below.
    spinValue.setValue(-listHeight * 2);

    // --- 2. PICK A WINNER (SECRETLY) ---
    const winner = filteredActivities[Math.floor(Math.random() * filteredActivities.length)];
    
    
    
    // --- 3. START THE SEAMLESS SPINNING ANIMATION ---
    animationRef.current = Animated.loop(
      Animated.timing(spinValue, {
        toValue: -listHeight * 3, // Animate to the end of the third block
        duration: loopDuration,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    animationRef.current.start();

    // --- 4. AFTER A DELAY, STOP THE SPIN AND SHOW THE RESULT ---
    setTimeout(() => {
        animationRef.current?.stop();
        setSelectedActivity(winner);
        setShowResult(true);
        setIsAnimating(false);
    }, 3000); // Let it spin for 3 seconds
  };
  console.log(selectedActivity);

  const handleNavigate = () => {
    if (selectedActivity) {
     navigation.navigate(selectedActivity.screen, { activityData: { ...selectedActivity.params, type: selectedActivity.type } });
    }
  };

  // --- Animation Styles ---
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-left" size={28} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Choose an Activity</Text>
      </View>
      
      <View style={styles.animationContainer}>
        {/* We use a simple conditional render now */}
        {!showResult ? (
            <Animated.View style={{ transform: [{ translateY: spinValue }] }}>
                {extendedActivities.map((activity, index) => (
                    <View style={styles.cardWrapper} key={`${activity.key}-${index}`}>
                        <ActivityCard activity={activity} />
                    </View>
                ))}
            </Animated.View>
        ) : (
            selectedActivity && (
                <ActivityCard activity={selectedActivity} style={resultCardStyle} />
            )
        )}
      </View>

       <View style={styles.buttonContainer}>
          {selectedActivity && (
            <TouchableOpacity onPress={handleNavigate} style={[styles.actionButton, styles.goButton]}>
                <Text style={styles.actionButtonText}>Let's Go!</Text>
            </TouchableOpacity>
          )}
      </View>
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
      shadowOpacity: 0.05,
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
    buttonContainer: {
        paddingVertical: 20,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    actionButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 18,
        width: '100%',
        alignItems: 'center',
        borderRadius: 15,
    },
    goButton: {
        backgroundColor: '#34C759',
    },
    actionButtonText: {
      color: 'white',
      fontSize: 18,
      fontWeight: 'bold',
    },
  });

export default ActivityListScreen;





// import React from 'react';
// import {
//   SafeAreaView,
//   StyleSheet,
//   Text,
//   View,
//   TouchableOpacity,
//   ScrollView,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/Feather';
// import LinearGradient from 'react-native-linear-gradient';

// // import { ACTIVITIES } from '../data/activities.js';
// import { ACTIVITIES } from '../../components/common/activities';
// import { colors } from '../../theme/color.ts';

// // Reusable card component, defined locally or imported
// const ActivityCard = ({ activity, onPress }) => (
//     <TouchableOpacity onPress={() => onPress(activity.screen, activity.params)}>
//         <LinearGradient colors={activity.gradient} style={styles.card}>
//             <Icon name={activity.icon} size={40} color="white" />
//             <Text style={styles.cardTitle}>{activity.title}</Text>
//             <Text style={styles.cardDescription}>{activity.description}</Text>
//         </LinearGradient>
//     </TouchableOpacity>
// );

// const ActivityListScreen = ({ navigation }) => {

//   const handleSelectActivity = (screen, params) => {
//     navigation.navigate(screen, { activityData: params });
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
//             <Icon name="arrow-left" size={28} color={colors.text.primary} />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Choose an Activity</Text>
//       </View>
//        <ScrollView contentContainerStyle={styles.list}>
//             {ACTIVITIES.map(activity => (
//                 <ActivityCard 
//                     key={activity.key} 
//                     activity={activity} 
//                     onPress={handleSelectActivity} 
//                 />
//             ))}
//         </ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: { 
//     flex: 1, 
//     backgroundColor: colors.background.primary, // Use theme color
//   },
//   header: { 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     paddingHorizontal: 20, 
//     paddingBottom: 10,
//     paddingTop: 20,
//     marginTop: 20,
//   },
//   backButton: {
//       marginRight: 15,
//   },
//   headerTitle: {
//       fontSize: 22,
//       fontWeight: 'bold',
//       color: colors.text.primary, // Use theme color
//   },
//   list: { 
//     padding: 20,
//   },
//   card: {
//     borderRadius: 20,
//     padding: 25,
//     marginBottom: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.05, // Subtle shadow
//     shadowRadius: 10,
//     elevation: 5,
//   },
//   cardTitle: {
//     color: colors.text.onGradient, // Use theme color
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginTop: 15,
//   },
//   cardDescription: {
//     color: 'rgba(255, 255, 255, 0.9)', // Slightly transparent white
//     marginTop: 5,
//     fontSize: 14,
//   },
// });

// export default ActivityListScreen;