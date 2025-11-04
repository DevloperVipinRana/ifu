import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import GamesScreen from './src/screens/GamesScreen';
import GameInfoScreen from './src/screens/GameInfoScreen';
import SnakeGame from './src/components/games/SnakeGame';
import WordGuess from './src/components/games/WordGuess';
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import EditProfileScreen from './src/screens/EditProfileScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import DailyGoalsScreen from './src/screens/DailyGoalsScreen';
import WeeklyGoalsScreen from './src/screens/WeeklyGoalsScreen';
import OtpVerificationScreen from './src/screens/OtpVerificationScreen';
import HomeScreen from './src/screens/Dashboard/HomeScreen';
import RandomActivitySelector from './src/screens/Activity/RandomActivitySelector';
// import AchievementsScreen from './src/screens/Goals/AchievementsScreen';
import NotToDoScreen from './src/screens/Goals/NotToDoScreen';
import BottomTabNavigator from './src/navigation/BottomTabNavigator';
import ReflectionScreen from './src/screens/Activity/ReflectionScreen';
import FocusModePlayer from './src/screens/Activity/FocusModePlayer';
import SimonStartScreen from './src/components/games/SimonStartScreen';
import SimonSaysScreen from './src/components/games/SimonSaysScreen';
import ActivityListScreen from './src/screens/Activity/ActivityListScreen';
import ActivityPlayerScreen from './src/screens/Activity/ActivityPlayerScreen';
import MemoryBloomScreen from './src/components/games/MemoryBloomScreen';
import twozeroGameScreen from './src/components/games/twozeroGameScreen';
import PraiseFeedScreen from './src/screens/PraiseFeedScreen';
import CreatePostScreen from './src/screens/CreatePostScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import FeedbackScreen from './src/components/common/FeedbackScreen';
import DashboardScreen from './src/screens/Dashboard/DashboardScreen';
import IcompletedScreen from './src/screens/Goals/IcompletedScreen';
import LogAchievementScreen from './src/screens/Goals/LogAchievementScreen';
import { UserPosts } from './src/components/common/UserPosts';

export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  GamesScreen: undefined;
  GameInfo: { game: { title: string; illustration: string; image: any } };
  SnakeGame: undefined;
  WordGuess: undefined;
  EditProfileScreen: {
    currentUser?: {
      bio?: string;
      interests?: string[];
      goals?: string[];
      occupation?: string;
      ageGroup?: string;
      address?: string;
    };
  };
  ProfileScreen: undefined;
  DailyGoalsScreen: undefined;
  WeeklyGoalsScreen: undefined;
  OtpVerificationScreen: {
    name: string;
    email: string;
    password: string;
    zipCode: string;
    gender: string;
  };
  HomeScreen: undefined;
  RandomActivitySelector: undefined;
  AchievementsScreen: undefined;
  NotToDoScreen: undefined;
  BottomTabNavigator: undefined;
  ReflectionScreen: {
    title: string;
    question?: string;
    placeholder?: string;
    headerImage?: string;
  };
  FocusModePlayer: {
    title: string;
    description?: string;
    lottieSource?: any;
    gradient: string[];
    duration?: number;
  };
  SimonStartScreen: undefined;
  SimonSaysScreen: undefined;
  ActivityListScreen: undefined;
  ActivityPlayerScreen: undefined;
  MemoryBloomScreen: undefined;
  twozeroGameScreen: undefined;
  PraiseFeedScreen: undefined;
  CreatePostScreen: undefined;
  OnboardingScreen: undefined;
  Feedback: { activityTitle: string };
  DashboardScreen: undefined;
  IcompletedScreen: undefined;
  LogAchievement: undefined;
  UserPosts: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="OnboardingScreen"
          screenOptions={{ 
            headerShown: false,
            animation: 'slide_from_right',
            animationDuration: 300,
            contentStyle: { backgroundColor: '#f0e6ff' },
            gestureEnabled: true,
            gestureDirection: 'horizontal'
          }}
        >
          <Stack.Screen 
            name="OnboardingScreen" 
            component={OnboardingScreen}
            options={{
              animation: 'fade',
              animationDuration: 500,
            }}
          />
          <Stack.Screen 
            name="Login" 
            component={LoginScreen}
            options={{
              animation: 'slide_from_right',
              animationDuration: 300,
            }}
          />

          <Stack.Screen name="BottomTabNavigator" component={BottomTabNavigator} />
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen name="GamesScreen" component={GamesScreen} />
          <Stack.Screen name="GameInfo" component={GameInfoScreen} />
          <Stack.Screen name="SnakeGame" component={SnakeGame} />
          <Stack.Screen name="WordGuess" component={WordGuess} />
          <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
          <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
          <Stack.Screen name="DailyGoalsScreen" component={DailyGoalsScreen} />
          <Stack.Screen name="WeeklyGoalsScreen" component={WeeklyGoalsScreen} />
          <Stack.Screen name="OtpVerificationScreen" component={OtpVerificationScreen} />
          <Stack.Screen name="HomeScreen" component={HomeScreen} />
          <Stack.Screen name="RandomActivitySelector" component={RandomActivitySelector} />
          {/* <Stack.Screen name="AchievementsScreen" component={AchievementsScreen} /> */}
          <Stack.Screen name="NotToDoScreen" component={NotToDoScreen} />
          <Stack.Screen name="ReflectionScreen" component={ReflectionScreen} />
          <Stack.Screen name="FocusModePlayer" component={FocusModePlayer} />
          <Stack.Screen name="SimonStartScreen" component={SimonStartScreen} />
          <Stack.Screen name="SimonSaysScreen" component={SimonSaysScreen} />
          <Stack.Screen name="ActivityListScreen" component={ActivityListScreen} />
          <Stack.Screen name="ActivityPlayerScreen" component={ActivityPlayerScreen} />
          <Stack.Screen name="MemoryBloomScreen" component={MemoryBloomScreen} />
          <Stack.Screen name="twozeroGameScreen" component={twozeroGameScreen} />
          <Stack.Screen name="PraiseFeedScreen" component={PraiseFeedScreen} />
          <Stack.Screen name="CreatePostScreen" component={CreatePostScreen} />
          <Stack.Screen name="Feedback" component={FeedbackScreen} />
          <Stack.Screen name="DashboardScreen" component={DashboardScreen} />
          <Stack.Screen name="IcompletedScreen" component={IcompletedScreen} />
          <Stack.Screen name="LogAchievement" component={LogAchievementScreen} />
          <Stack.Screen name="UserPosts" component={UserPosts} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

