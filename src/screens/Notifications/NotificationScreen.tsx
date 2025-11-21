import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Text,
  RefreshControl,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenTitle, Body } from '../../components/common/StyledText';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../theme/color';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '@env';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

interface Notification {
  _id: string;
  sender: {
    _id: string;
    name: string;
    profileImage?: string;
  };
  type: 'like' | 'comment' | 'share';
  post: {
    _id: string;
    text?: string;
  };
  text: string;
  read: boolean;
  createdAt: string;
}

const NotificationItem = ({
  notification,
  onPress
}: {
  notification: Notification;
  onPress: () => void;
}) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'like':
        return 'heart';
      case 'comment':
        return 'chatbubble';
      case 'share':
        return 'arrow-redo';
      default:
        return 'notifications';
    }
  };

  const getColor = () => {
    switch (notification.type) {
      case 'like':
        return colors.gradient.passion[0];
      case 'comment':
        return colors.gradient.cool[0];
      case 'share':
        return '#10B981'; // Green for share
      default:
        return colors.text.secondary;
    }
  };

  const getTimeAgo = (date: string) => {
    const now = new Date();
    const notifDate = new Date(date);
    const seconds = Math.floor((now.getTime() - notifDate.getTime()) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return notifDate.toLocaleDateString();
  };

  return (
    <TouchableOpacity
      style={[
        styles.itemContainer,
        !notification.read && styles.unreadItem
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: `${getColor()}20` }]}>
        <Icon name={getIcon()} size={24} color={getColor()} />
      </View>
      <View style={styles.textContainer}>
        <Body style={styles.notificationText}>{notification.text}</Body>
        <Body style={styles.timeText}>{getTimeAgo(notification.createdAt)}</Body>
      </View>
      {!notification.read && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );
};

const NotificationsScreen = () => {
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotifications = async (isRefresh = false) => {
    try {
      if (!isRefresh) setLoading(true);

      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'Please login again');
        return;
      }

      const response = await fetch(`${BASE_URL}/api/notifications`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }

      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      if (!isRefresh) {
        Alert.alert('Error', 'Failed to load notifications');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchNotifications();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotifications(true);
  };

  const handleNotificationPress = async (notification: Notification) => {
    try {
      // Mark as read
      if (!notification.read) {
        const token = await AsyncStorage.getItem('token');
        await fetch(`${BASE_URL}/api/notifications/${notification._id}/read`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Update local state
        setNotifications(prev =>
          prev.map(n =>
            n._id === notification._id ? { ...n, read: true } : n
          )
        );
      }

      // Navigate based on notification type
      if (notification.type === 'share') {
        // For share notifications, navigate to feed with the specific post
        navigation.navigate('PraiseFeedScreen' as never, {
          scrollToPostId: notification.post._id
        } as never);
      } else {
        // For like and comment, navigate to UserPosts
        navigation.navigate('UserPosts' as never, {
          scrollToPostId: notification.post._id
        } as never);
      }
    } catch (error) {
      console.error('Error handling notification press:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      await fetch(`${BASE_URL}/api/notifications/read-all`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setNotifications(prev =>
        prev.map(n => ({ ...n, read: true }))
      );
    } catch (error) {
      console.error('Error marking all as read:', error);
      Alert.alert('Error', 'Failed to mark notifications as read');
    }
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Icon name="notifications-off-outline" size={80} color={colors.text.secondary} />
      <Text style={styles.emptyTitle}>No Notifications</Text>
      <Text style={styles.emptySubtitle}>
        You're all caught up! We'll notify you when something new happens.
      </Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ScreenTitle style={styles.pageTitle}>Notifications</ScreenTitle>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.gradient.passion[0]} />
        </View>
      </SafeAreaView>
    );
  }

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <ScreenTitle style={styles.pageTitle}>Notifications</ScreenTitle>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={markAllAsRead} style={styles.markAllButton}>
            <Text style={styles.markAllText}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>
      
      <FlatList
        data={notifications}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <NotificationItem
            notification={item}
            onPress={() => handleNotificationPress(item)}
          />
        )}
        contentContainerStyle={[
          styles.list,
          notifications.length === 0 && styles.emptyList
        ]}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.gradient.passion[0]]}
            tintColor={colors.gradient.passion[0]}
          />
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.background.primary 
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  pageTitle: { 
    paddingHorizontal: 0,
    marginVertical: 10 
  },
  markAllButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  markAllText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: colors.gradient.passion[0],
  },
  list: { 
    paddingHorizontal: 20 
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  itemContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 16,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  unreadItem: {
    backgroundColor: `${colors.gradient.passion[0]}05`,
    borderLeftWidth: 3,
    borderLeftColor: colors.gradient.passion[0],
  },
  iconContainer: { 
    width: 50, 
    height: 50, 
    borderRadius: 25, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 15 
  },
  textContainer: { 
    flex: 1 
  },
  notificationText: {
    fontSize: 15,
    lineHeight: 20,
    color: colors.text.primary,
  },
  timeText: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 4,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.gradient.passion[0],
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 22,
    fontFamily: 'Inter-Bold',
    color: colors.text.primary,
    marginTop: 20,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 40,
  },
});

export default NotificationsScreen;

