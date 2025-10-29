import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

// Import your main screen components
import HomeScreen from '../screens/Dashboard/HomeScreen';
import GameListScreen from '../screens/GamesScreen';
import NotificationsScreen from '../screens/Notifications/NotificationScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { colors } from '../theme/color';

import PraiseFeedScreen from '../screens/PraiseFeedScreen';
import DashboardScreen from '../screens/Dashboard/DashboardScreen';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false, // We hide headers here because each stack will have its own
        tabBarShowLabel: false,
        tabBarStyle: {
            backgroundColor: 'white',
            borderTopWidth: 1,
            height: 80,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          size = focused ? 30 : 26;
          color = focused ? colors.text.primary : colors.icon;

          if (route.name === 'HomeTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'GamesTab') {
            iconName = focused ? 'game-controller' : 'game-controller-outline';
          } else if (route.name === 'NotificationsTab') {
            iconName = focused ? 'notifications' : 'notifications-outline';
          } else if (route.name === 'DashboardTab') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'FeedTab') {
            iconName = focused ? 'newspaper' : 'newspaper-outline'; // <-- feed icon
          }

          return <Icon name={iconName as string} size={size} color={color} />;
        },
      })}
    >
      {/* <Tab.Screen name="HomeTab" component={HomeScreen} /> */}
      <Tab.Screen name="HomeTab" component={PraiseFeedScreen} />
      <Tab.Screen name="GamesTab" component={GameListScreen} />
      <Tab.Screen name="NotificationsTab" component={NotificationsScreen} />
      {/* <Tab.Screen name="ProfileTab" component={ProfileScreen} /> */}
      <Tab.Screen name="DashboardTab" component={DashboardScreen} />
      {/* <Tab.Screen name="FeedTab" component={HomeScreen} /> */}
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;