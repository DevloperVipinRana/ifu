import React, { useState, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '@env';

// Import your main screen components
import HomeScreen from '../screens/Dashboard/HomeScreen';
import GameListScreen from '../screens/GamesScreen';
import NotificationsScreen from '../screens/Notifications/NotificationScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { colors } from '../theme/color';

import PraiseFeedScreen from '../screens/PraiseFeedScreen';
import DashboardScreen from '../screens/Dashboard/DashboardScreen';

const Tab = createBottomTabNavigator();

const NotificationBadge = ({ count }: { count: number }) => {
  if (count === 0) return null;
  
  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>
        {count > 99 ? '99+' : count}
      </Text>
    </View>
  );
};

const BottomTabNavigator = () => {
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnreadCount = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${BASE_URL}/api/notifications/unread-count`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUnreadCount(data.count);
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  useEffect(() => {
    // Fetch initially
    fetchUnreadCount();

    // Poll every 30 seconds for updates
    const interval = setInterval(fetchUnreadCount, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
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
            
            // Return icon with badge for notifications
            return (
              <View>
                <Icon name={iconName} size={size} color={color} />
                <NotificationBadge count={unreadCount} />
              </View>
            );
          } else if (route.name === 'DashboardTab') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'FeedTab') {
            iconName = focused ? 'newspaper' : 'newspaper-outline';
          }

          return <Icon name={iconName as string} size={size} color={color} />;
        },
      })}
      listeners={{
        // Refresh unread count when navigating to any tab
        tabPress: () => {
          fetchUnreadCount();
        },
      }}
    >
      <Tab.Screen name="HomeTab" component={PraiseFeedScreen} />
      <Tab.Screen name="GamesTab" component={GameListScreen} />
      <Tab.Screen 
        name="NotificationsTab" 
        component={NotificationsScreen}
        listeners={{
          // Clear badge when user views notifications
          focus: () => {
            setTimeout(fetchUnreadCount, 500); // Refresh after a short delay
          },
        }}
      />
      <Tab.Screen name="DashboardTab" component={DashboardScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    right: -8,
    top: -4,
    backgroundColor: colors.gradient.passion[0],
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: 'white',
  },
  badgeText: {
    color: 'white',
    fontSize: 11,
    fontFamily: 'Inter-Bold',
  },
});

export default BottomTabNavigator;
