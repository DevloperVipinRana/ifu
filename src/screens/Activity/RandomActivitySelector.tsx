// mobile/src/screens/Activity/RandomActivitySelector.tsx (1 min activities file)

import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native'; // We can show a loader for a split second
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../App';
import { ACTIVITY_LIBRARY, Activity } from '../../data/activityLibrary';

// SIMULATED USER DATA (this could be passed as a route param or fetched from a global state)
const USER_INTERESTS: Activity['category'][] = ['Mindfulness', 'Productivity', 'Growth','Finance','Social','Fitness','Creativity'];

const RandomActivitySelector = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    useEffect(() => {
        // --- ALL THE LOGIC IS NOW HERE ---

        // 1. Filter the library based on user interests
        const relevantActivities = ACTIVITY_LIBRARY.filter(activity => 
            USER_INTERESTS.includes(activity.category)
        );

        // Handle case where no activities match
        if (relevantActivities.length === 0) {
            // In a real app, you'd navigate back with an error. For now, we'll pick from the full library.
            console.warn("No activities found for user interests. Picking from the full library.");
            const randomIndex = Math.floor(Math.random() * ACTIVITY_LIBRARY.length);
            const chosenActivity = ACTIVITY_LIBRARY[randomIndex];
            if (chosenActivity.type === 'reflection') {
                navigation.replace('ReflectionScreen', chosenActivity.params);
            } else {
                navigation.replace('FocusModePlayer', chosenActivity.params);
            }
            return;
        }

        // 2. Pick a random activity from the filtered list
        const randomIndex = Math.floor(Math.random() * relevantActivities.length);
        const chosenActivity = relevantActivities[randomIndex];

        // 3. Determine the screen to navigate to and replace the current screen
        if (chosenActivity.type === 'reflection') {
            console.log(`[Randomizer] Navigating to '${chosenActivity.params.title}' on screen 'ReflectionScreen'`);
            navigation.replace('ReflectionScreen', chosenActivity.params);
        } else {
            console.log(`[Randomizer] Navigating to '${chosenActivity.params.title}' on screen 'FocusModePlayer'`);
            navigation.replace('FocusModePlayer', chosenActivity.params);
        }
        
    }, [navigation]); // The effect runs once when the component mounts

    // This component renders nothing, or a quick loader. Its only job is to navigate.
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator />
        </View>
    );
};

export default RandomActivitySelector;