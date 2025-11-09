// mobile/src/screens/Activity/RandomActivitySelector.tsx

import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../App';
import { ACTIVITY_LIBRARY, Activity } from '../../data/activityLibrary';

// USER INTERESTS - Now just the main categories
const USER_INTERESTS = ['Mindfulness', 'Productivity', 'Growth', 'Finance', 'Social', 'Fitness', 'Creativity'];

const RandomActivitySelector = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    // Filter activities by checking if the MAIN category (first part) matches user interests
    const relevantActivities = ACTIVITY_LIBRARY.filter(activity => {
      // Extract the main category from "Mindfulness>Breathing>Deep Breathing"
      const mainCategory = activity.category.split('>')[0];
      return USER_INTERESTS.includes(mainCategory);
    });

    console.log(`📚 Total activities in library: ${ACTIVITY_LIBRARY.length}`);
    console.log(`✅ Filtered activities matching user interests: ${relevantActivities.length}`);

    // Handle case where no activities match
    if (relevantActivities.length === 0) {
      console.warn("⚠️ No activities found for user interests. Picking from the full library.");
      const randomIndex = Math.floor(Math.random() * ACTIVITY_LIBRARY.length);
      const chosenActivity = ACTIVITY_LIBRARY[randomIndex];
      
      console.log(`🎲 Random fallback activity: ${chosenActivity.params.title}`);
      console.log(`📁 Category: ${chosenActivity.category}`);
      
      if (chosenActivity.type === 'reflection') {
        navigation.replace('ReflectionScreen', {
          ...chosenActivity.params,
          category: chosenActivity.category // IMPORTANT: Pass the full category
        });
      } else {
        navigation.replace('FocusModePlayer', {
          ...chosenActivity.params,
          category: chosenActivity.category // IMPORTANT: Pass the full category
        });
      }
      return;
    }

    // Pick a random activity from the filtered list
    const randomIndex = Math.floor(Math.random() * relevantActivities.length);
    const chosenActivity = relevantActivities[randomIndex];

    console.log(`🎯 Selected activity: ${chosenActivity.params.title}`);
    console.log(`📁 Full category: ${chosenActivity.category}`);
    console.log(`🏷️ Type: ${chosenActivity.type}`);

    // Navigate to the appropriate screen with ALL params including category
    if (chosenActivity.type === 'reflection') {
      navigation.replace('ReflectionScreen', {
        ...chosenActivity.params,
        category: chosenActivity.category // CRITICAL: Must pass category explicitly
      });
    } else {
      navigation.replace('FocusModePlayer', {
        ...chosenActivity.params,
        category: chosenActivity.category // CRITICAL: Must pass category explicitly
      });
    }
    
  }, [navigation]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  );
};

export default RandomActivitySelector;
