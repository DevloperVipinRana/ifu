import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Text, FlatList, Alert, TouchableOpacity, Image, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';

import { ScreenTitle } from '../../components/common/StyledText';
import { colors } from '../../theme/color';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '@env';
import { RootStackParamList } from '../../../App';

// Define the Achievement interface
interface Achievement {
  _id: string;
  userId: string;
  achievementText: string;
  image: string | null;
  createdAt: string;
  updatedAt: string;
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'IcompletedScreen'>;

const ICompletedScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const fetchAchievements = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      
      if (!token) {
        Alert.alert('Error', 'Authentication token not found. Please login again.');
        return;
      }

      const response = await fetch(`${BASE_URL}/api/icompleted/my`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (response.ok) {
        setAchievements(data);
      } else {
        console.error('Fetch error:', data);
        Alert.alert('Error', data.message || 'Could not fetch achievements.');
      }
    } catch (err) {
      console.error('Network error:', err);
      Alert.alert('Error', 'Could not load achievements. Please check your connection.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  // Refresh when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchAchievements();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchAchievements();
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  };

  const renderAchievement = ({ item }: { item: Achievement }) => (
    <View style={styles.achievementCard}>
      <View style={styles.cardHeader}>
        <View style={styles.checkIconContainer}>
          <Icon name="checkmark-circle" size={24} color={colors?.primary || '#8B5CF6'} />
        </View>
        <Text style={styles.dateText}>{formatDate(item.createdAt)}</Text>
      </View>
      
      <Text style={styles.achievementText}>{item.achievementText}</Text>
      
      {item.image && (
        <Image 
          source={{ uri: `${BASE_URL}${item.image}` }} 
          style={styles.achievementImage}
          resizeMode="cover"
        />
      )}
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Icon name="trophy-outline" size={80} color="#D1D5DB" />
      <Text style={styles.emptyTitle}>No Achievements Yet</Text>
      <Text style={styles.emptySubtitle}>Start logging your wins and track your progress!</Text>
      <TouchableOpacity 
        style={styles.emptyButton}
        onPress={() => navigation.navigate('LogAchievement')}
      >
        <Text style={styles.emptyButtonText}>Log Your First Achievement</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <ScreenTitle style={styles.title}>I Completed</ScreenTitle>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors?.primary || '#8B5CF6'} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <ScreenTitle style={styles.title}>I Completed</ScreenTitle>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigation.navigate('LogAchievement')}
        >
          <Icon name="add-circle" size={32} color={colors?.primary || '#8B5CF6'} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={achievements}
        renderItem={renderAchievement}
        keyExtractor={(item) => item._id}
        contentContainerStyle={achievements.length === 0 ? styles.emptyListContainer : styles.listContainer}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors?.primary || '#8B5CF6']} />
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: 'white' 
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors?.border || '#E5E7EB',
  },
  title: { 
    fontSize: 28,
    flex: 1,
  },
  addButton: {
    padding: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  emptyListContainer: {
    flexGrow: 1,
  },
  achievementCard: {
    backgroundColor: colors?.background?.secondary || '#F9FAFB',
    borderRadius: 15,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors?.border || '#E5E7EB',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkIconContainer: {
    marginRight: 8,
  },
  dateText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors?.text?.secondary || '#6B7280',
  },
  achievementText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: colors?.text?.primary || '#111827',
    lineHeight: 24,
    marginBottom: 12,
  },
  achievementImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginTop: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: colors?.text?.primary || '#111827',
    marginTop: 20,
    marginBottom: 10,
  },
  emptySubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: colors?.text?.secondary || '#6B7280',
    textAlign: 'center',
    marginBottom: 30,
  },
  emptyButton: {
    backgroundColor: colors?.primary || '#8B5CF6',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 25,
  },
  emptyButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: 'white',
  },
});

export default ICompletedScreen;