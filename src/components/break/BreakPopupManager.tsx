// src/components/break/BreakPopupManager.tsx
import React, { useEffect, useState, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useNavigation, NavigationState } from '@react-navigation/native';
import BreakPopup from './BreakPopup';
import { getRandomBreakActivity, resetTimer } from '../../services/breakPopupService';

const EXCLUDED_SCREENS = [
  'EditProfileScreen', 
  'CreatePostScreen', 
  'Login', 
  'Signup', 
  'OnboardingScreen', 
  'OtpVerificationScreen',
  // Add activity/game screens to excluded list
  'RandomActivitySelector',
  'ActivityListScreen',
  'ActivityPlayerScreen',
  'SnakeGame',
  'WordGuess',
  'SimonStartScreen',
  'SimonSaysScreen',
  'MemoryBloomScreen',
  'twozeroGameScreen',
  'GamesScreen',
  'GameInfo',
  'FocusModePlayer',
  'ReflectionScreen',
];

// const INTERVAL_MS = 5 * 60 * 1000; // 5 minutes
const INTERVAL_MS = 30 * 1000; // 5 seconds for testing

interface BreakPopupManagerProps {
  navigationState?: NavigationState;
}

const BreakPopupManager: React.FC<BreakPopupManagerProps> = ({ navigationState }) => {
  const [visible, setVisible] = useState(false);
  const [activity, setActivity] = useState<any>(null);
  const navigation = useNavigation();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const appState = useRef(AppState.currentState);
  const isActivityInProgress = useRef(false); // Track if user is in an activity

  // Get current route name from navigation state
  const getCurrentRouteName = (state: NavigationState | undefined): string | null => {
    if (!state) return null;
    const route = state.routes[state.index];
    
    if (route.state) {
      return getCurrentRouteName(route.state as NavigationState);
    }
    
    return route.name;
  };

  const currentRouteName = getCurrentRouteName(navigationState);

  const clearTimer = () => {
    if (timerRef.current) {
      console.log('🧹 Clearing timer');
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const startTimer = () => {
    clearTimer();

    console.log('🕐 Starting timer for screen:', currentRouteName);

    timerRef.current = setTimeout(() => {
      console.log('⏰ Timer fired! Current screen:', currentRouteName);
      
      // Double-check screen and activity status before showing popup
      if (currentRouteName && 
          !EXCLUDED_SCREENS.includes(currentRouteName) && 
          !isActivityInProgress.current &&
          !visible) {
        console.log('✅ Showing popup for screen:', currentRouteName);
        
        // Fetch activity asynchronously
        getRandomBreakActivity().then((selectedActivity) => {
          console.log('🎯 Selected activity:', selectedActivity);
          setActivity(selectedActivity);
          setVisible(true);
        }).catch((error) => {
          console.error('❌ Error getting activity:', error);
        });
      } else {
        console.log('❌ Conditions not met, not showing popup');
        console.log('  - Screen excluded:', EXCLUDED_SCREENS.includes(currentRouteName || ''));
        console.log('  - Activity in progress:', isActivityInProgress.current);
        console.log('  - Already visible:', visible);
      }
    }, INTERVAL_MS);
  };

  const handleClose = () => {
    console.log('🚪 Closing popup and starting activity');
    setVisible(false);
    isActivityInProgress.current = true; // Mark activity as in progress
    resetTimer();
    // Don't start timer here - wait for user to return from activity
  };

  // Monitor route changes
  useEffect(() => {
    console.log('🔄 Route changed to:', currentRouteName);
    
    const isExcluded = currentRouteName && EXCLUDED_SCREENS.includes(currentRouteName);
    
    // If we're on an activity/game screen, mark as in progress
    if (isExcluded && currentRouteName !== 'Login' && 
        currentRouteName !== 'Signup' && 
        currentRouteName !== 'OnboardingScreen' &&
        currentRouteName !== 'EditProfileScreen' &&
        currentRouteName !== 'CreatePostScreen' &&
        currentRouteName !== 'OtpVerificationScreen') {
      console.log('🎮 User is in activity/game');
      isActivityInProgress.current = true;
      clearTimer();
      return;
    }
    
    // If we're back on a normal screen and activity was in progress, restart timer
    if (!isExcluded && isActivityInProgress.current) {
      console.log('✅ User returned from activity, restarting timer');
      isActivityInProgress.current = false;
      startTimer();
      return;
    }
    
    // Start timer for allowed screens (if not in activity and popup not visible)
    if (!isExcluded && !isActivityInProgress.current && !visible) {
      console.log('✅ Starting timer for allowed screen:', currentRouteName);
      startTimer();
    } else if (isExcluded) {
      console.log('⚠️ Excluded screen, clearing timer:', currentRouteName);
      clearTimer();
    }

    return () => {
      clearTimer();
    };
  }, [currentRouteName]); // Only depend on currentRouteName

  // Handle app state changes (background/foreground)
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        console.log('📱 App came to foreground');
        // Only restart timer if not in activity and not on excluded screen
        if (currentRouteName && 
            !EXCLUDED_SCREENS.includes(currentRouteName) &&
            !isActivityInProgress.current &&
            !visible) {
          startTimer();
        }
      } else if (nextAppState.match(/inactive|background/)) {
        console.log('📱 App went to background');
        clearTimer();
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [currentRouteName, visible]);

  return (
    <BreakPopup
      visible={visible}
      activity={activity}
      onClose={handleClose}
      navigation={navigation}
    />
  );
};

export default BreakPopupManager;