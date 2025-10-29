import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  ImageBackground,
  Modal,
  Pressable,
} from 'react-native';
import { ScreenTitle, Body } from '../../components/common/StyledText';
import { colors } from '../../theme/color1.js';
import Icon from 'react-native-vector-icons/Ionicons';
import CheckmarkIcon from '../../components/dashboard/CheckmarkIcon.tsx';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import StatsGrid from '../../components/dashboard/StatsGrid.tsx';
import FeaturedCarousel from '../../components/dashboard/FeaturedCarousel.tsx';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { BASE_URL } from '@env';

type GradientColors = string[];

type WeekDayProgress = 'empty' | 'complete' | 'incomplete';

type WeekDayStatus = {
  dayOfWeek: string;
  date: number;
  isToday: boolean;
  progress: WeekDayProgress;
};

type DynamicHeaderProps = { 
  onMenuPress: () => void; 
  userName: string;
};

type ToolButtonProps = {
  iconName: string;
  gradient: GradientColors;
  label: string;
  onPress: () => void;
};

type ProgressCardProps = {
  completed: number;
  total: number;
  loading: boolean;
  error: boolean;
};

type RecentWin = { _id: string; image?: string; achievementText: string };

type RecentWinsSectionProps = { wins: RecentWin[]; loading: boolean; error: boolean };

const menuItems = [
  {
    id: '1',
    title: 'DAILY QUESTS',
    shortTitle: 'DAILY',
    iconName: 'arrow-up-outline',
    gradient: colors.gradient.warm,
    feature: 'DailyGoalsScreen',
  },
  {
    id: '2',
    title: 'QUICK BLISS',
    shortTitle: 'ACTIVITY',
    iconName: 'flower-outline',
    gradient: colors.gradient.passion,
    feature: 'RandomActivitySelector',
  },
  {
    id: '3',
    title: 'WEEKLY EPIC',
    shortTitle: 'WEEKLY',
    iconName: 'barbell-outline',
    gradient: colors.gradient.cool,
    feature: 'WeeklyGoalsScreen',
  },
  {
    id: '4',
    title: 'HALL OF FAME',
    shortTitle: '5-MINTASK',
    iconName: 'book-outline',
    gradient: ['#A9C9FF', '#FFBBEC'],
    feature: 'ActivityListScreen',
  },
  {
    id: '5',
    title: 'LOG A WIN',
    shortTitle: 'I-COMPLETED',
    iconName: 'add-circle-outline',
    gradient: ['#76E4F2', '#A9C9FF'],
    feature: 'IcompletedScreen',
  },
  {
    id: '6',
    title: 'FORBIDDEN LIST',
    shortTitle: 'NOT-TO-DO',
    iconName: 'close-circle-outline',
    gradient: ['#C1F1D4', '#76E4F2'],
    feature: 'NotToDoScreen',
  },
];

// --- API Service ---
const fetchDailyGoals = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      throw new Error('No auth token found');
    }

    const response = await fetch(`${BASE_URL}/api/dailygoals`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch daily goals');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching daily goals:', error);
    throw error;
  }
};

const fetchUserProfile = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      throw new Error('No auth token found');
    }

    const response = await fetch(`${BASE_URL}/api/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user profile');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

const fetchRecentWins = async () => {
  
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      throw new Error('No auth token found');
    }

    const response = await fetch(`${BASE_URL}/api/icompleted/my`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch recent wins');
    }

    const data = await response.json();
    // Return only the last 3 wins
    return data.slice(0, 3);
  } catch (error) {
    console.error('Error fetching recent wins:', error);
    throw error;
  }
};

const fetchWeeklyGoalsStatus = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    console.log('token=', token);
    if (!token) {
      throw new Error('No auth token found');
    }

    const response = await fetch(`${BASE_URL}/api/dailygoals/weekly/status`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch weekly goals status');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching weekly goals status:', error);
    throw error;
  }
};

type WeeklyGoal = { _id: string; progress: number; completed: boolean };

const fetchWeeklyGoals = async (): Promise<WeeklyGoal[]> => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      throw new Error('No auth token found');
    }

    const response = await fetch(`${BASE_URL}/api/weekly-goals`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch weekly goals');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching weekly goals:', error);
    return [];
  }
};

// --- REUSABLE SUB-COMPONENTS ---

const DynamicHeader = ({ onMenuPress, userName }: DynamicHeaderProps) => {
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hours = new Date().getHours();
    const displayName = userName ? userName.toUpperCase() : 'THERE';
    
    if (hours < 12) setGreeting(`Good Morning, ${displayName}! ☀️`);
    else if (hours < 18) setGreeting(`Good Afternoon, ${displayName}! 🌤️`);
    else setGreeting(`Good Evening, ${displayName}! 🌙`);
  }, [userName]);

  return (
    <View style={styles.header}>
      <View>
        <ScreenTitle style={styles.headerTitle}>IFU</ScreenTitle>
        <Body style={styles.greeting}>{greeting}</Body>
      </View>
      <TouchableOpacity onPress={onMenuPress} style={styles.menuButton}>
        <Icon name="menu-outline" size={40} color={colors.text.primary} />
      </TouchableOpacity>
    </View>
  );
};

const ToolButton = ({ iconName, gradient, label, onPress }: ToolButtonProps) => (
  <TouchableOpacity onPress={onPress} style={styles.toolButtonContainer}>
    <LinearGradient colors={gradient} style={styles.toolButton}>
      <Icon name={iconName} size={28} color="white" />
    </LinearGradient>
    <Text style={styles.toolButtonText}>{label}</Text>
  </TouchableOpacity>
);

const ProgressCard = ({ completed, total, loading, error }: ProgressCardProps) => {
  const progressPercent = total > 0 ? (completed / total) * 100 : 0;
  
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>Today's Progress</Text>
        {loading ? (
          <ActivityIndicator size="small" color={colors.text.secondary} />
        ) : error ? (
          <Text style={styles.errorText}>Failed to load</Text>
        ) : (
          <Text style={styles.progressFraction}>
            {completed} / {total} Completed
          </Text>
        )}
      </View>
      <View style={styles.progressBarBackground}>
        <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
      </View>
      {total === 0 && !loading && !error && (
        <Text style={styles.noGoalsText}>No daily goals set for today</Text>
      )}
    </View>
  );
};

const truncateText = (text: string, wordLimit = 2) => {
  const words = text.trim().split(/\s+/);
  if (words.length <= wordLimit) return text;
  return words.slice(0, wordLimit).join(' ') + '...';
};

const RecentWinsSection = ({ wins, loading, error }: RecentWinsSectionProps) => {
  if (loading) {
    return (
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Recent Wins</Text>
        <View style={styles.winsLoadingContainer}>
          <ActivityIndicator size="small" color={colors.text.secondary} />
        </View>
      </View>
    );
  }

  if (error || wins.length === 0) {
    return (
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Recent Wins</Text>
        <View style={styles.winsLoadingContainer}>
          <Text style={styles.noWinsText}>
            {error ? 'Failed to load wins' : 'No wins yet. Log your first win!'}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Recent Wins</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 10 }}
      >
        {wins.map((win: RecentWin) => (
          <View key={win._id} style={styles.winCard}>
            {win.image ? (
              <ImageBackground
                source={{ uri: `${BASE_URL}${win.image}` }}
                style={styles.winCardBackground}
                imageStyle={styles.winCardBackgroundImage}
              >
                <View style={styles.winCardOverlay}>
                  <Text style={styles.winCardText}>
                    {truncateText(win.achievementText)}
                  </Text>
                </View>
              </ImageBackground>
            ) : (
              <View style={styles.winCardNoImage}>
                <Text style={styles.winCardTextNoImage}>
                  {truncateText(win.achievementText)}
                </Text>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

// --- MAIN HomeScreen COMPONENT ---

const HomeScreen = () => {
  const navigation = useNavigation();
  const [dailyProgress, setDailyProgress] = useState({ completed: 0, total: 0 });
  const [userName, setUserName] = useState('');
  const [recentWins, setRecentWins] = useState<RecentWin[]>([]);
  const [weekData, setWeekData] = useState<WeekDayStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [winsLoading, setWinsLoading] = useState(true);
  const [winsError, setWinsError] = useState(false);
  const [weekLoading, setWeekLoading] = useState(true);
  const [weeklyGoals, setWeeklyGoals] = useState<WeeklyGoal[]>([]);
  const [menuVisible, setMenuVisible] = useState(false);

  const loadDailyGoals = async () => {
    try {
      setLoading(true);
      setError(false);
      const goals = await fetchDailyGoals();
      
      const completedGoals = goals.filter((goal: { completed: boolean }) => goal.completed).length;
      const totalGoals = goals.length;
      
      setDailyProgress({
        completed: completedGoals,
        total: totalGoals,
      });
    } catch (err) {
      console.error('Error loading daily goals:', err);
      setError(true);
      setDailyProgress({ completed: 0, total: 0 });
    } finally {
      setLoading(false);
    }
  };

  const loadUserProfile = async () => {
    try {
      const userData = await fetchUserProfile();
      setUserName(userData.name || 'User');
    } catch (err) {
      console.error('Error loading user profile:', err);
      setUserName('User');
    }
  };

  const loadRecentWins = async () => {
    try {
      setWinsLoading(true);
      setWinsError(false);
      const wins = await fetchRecentWins();
      setRecentWins(wins);
    } catch (err) {
      console.error('Error loading recent wins:', err);
      setWinsError(true);
      setRecentWins([]);
    } finally {
      setWinsLoading(false);
    }
  };

  const loadWeeklyGoalsStatus = async () => {
    try {
      setWeekLoading(true);
      const weeklyStatus = await fetchWeeklyGoalsStatus();
      
      const today = new Date();
      const currentDay = today.getDay();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - (currentDay === 0 ? 6 : currentDay - 1));

      const formattedWeekData = [];
      for (let i = 0; i < 7; i++) {
        const day = new Date(startOfWeek);
        day.setDate(startOfWeek.getDate() + i);
        // Build local YYYY-MM-DD to match backend
        const yyyy = day.getFullYear();
        const mm = String(day.getMonth() + 1).padStart(2, '0');
        const dd = String(day.getDate()).padStart(2, '0');
        const dateStr = `${yyyy}-${mm}-${dd}`;
        
        const isToday = day.getFullYear() === today.getFullYear() &&
          day.getMonth() === today.getMonth() &&
          day.getDate() === today.getDate();

        const dayStatus = weeklyStatus.find((d: { date: string; totalGoals: number; completedGoals: number }) => d.date === dateStr);
        
        let progress: WeekDayProgress = 'empty';
        if (dayStatus) {
          if (dayStatus.totalGoals === 0) {
            progress = 'empty';
          } else if (dayStatus.completedGoals === dayStatus.totalGoals) {
            progress = 'complete';
          } else {
            progress = 'incomplete';
          }
        }

        formattedWeekData.push({
          dayOfWeek: day.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
          date: day.getDate(),
          isToday: isToday,
          progress: progress,
        });
      }
      
      setWeekData(formattedWeekData);
    } catch (err) {
      console.error('Error loading weekly goals status:', err);
      // Fallback to empty week data
      const today = new Date();
      const currentDay = today.getDay();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - (currentDay === 0 ? 6 : currentDay - 1));

      const fallbackData: WeekDayStatus[] = [];
      for (let i = 0; i < 7; i++) {
        const day = new Date(startOfWeek);
        day.setDate(startOfWeek.getDate() + i);
        const isToday = day.getFullYear() === today.getFullYear() &&
          day.getMonth() === today.getMonth() &&
          day.getDate() === today.getDate();

        fallbackData.push({
          dayOfWeek: day.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
          date: day.getDate(),
          isToday: isToday,
          progress: 'empty',
        });
      }
      setWeekData(fallbackData);
    } finally {
      setWeekLoading(false);
    }
  };

  const loadWeeklyGoals = async () => {
    const goals = await fetchWeeklyGoals();
    setWeeklyGoals(goals);
  };

  // Load data when component mounts
  useEffect(() => {
    loadDailyGoals();
    loadUserProfile();
    loadRecentWins();
    loadWeeklyGoalsStatus();
    loadWeeklyGoals();
  }, []);

  // Reload data when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadDailyGoals();
      loadUserProfile();
      loadRecentWins();
      loadWeeklyGoalsStatus();
      loadWeeklyGoals();
    }, [])
  );

  const handlePress = (feature: string) => {
    console.log('Navigate to:', feature);
    if (feature) navigation.navigate(feature as never);
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      setMenuVisible(false);
      navigation.navigate('Login' as never);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleMenuItemPress = (screen: string) => {
    setMenuVisible(false);
    if (screen === 'Logout') {
      handleLogout();
    } else {
      handlePress(screen);
    }
  };

  return (
    <LinearGradient colors={['#F7F8FF', '#EAF2FF']} style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContentContainer}>

          <DynamicHeader onMenuPress={() => setMenuVisible(true)} userName={userName} />

          <FeaturedCarousel/>

          <ProgressCard 
            completed={dailyProgress.completed} 
            total={dailyProgress.total}
            loading={loading}
            error={error}
          />

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Your Tools</Text>
            <View style={styles.toolsGridContainer}>
              {menuItems.map(item => (
                <ToolButton
                  key={item.id}
                  label={item.shortTitle}
                  iconName={item.iconName}
                  gradient={item.gradient}
                  onPress={() => handlePress(item.feature)}
                />
              ))}
            </View>
          </View>

          <RecentWinsSection 
            wins={recentWins} 
            loading={winsLoading} 
            error={winsError} 
          />

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Weekly Progress</Text>
            {weekLoading ? (
              <View style={styles.weekLoadingContainer}>
                <ActivityIndicator size="small" color={colors.text.secondary} />
              </View>
            ) : (
              <View style={styles.calendarContainer}>
                {weekData.map((day, index) => (
                  <View key={index} style={[styles.dayContainer, day.isToday && styles.todayContainer]}>
                    <Text style={[styles.dayOfWeekText, day.isToday && styles.todayText]}>
                      {day.dayOfWeek}
                    </Text>
                    <Text style={[styles.dateText, day.isToday && styles.todayText]}>
                      {day.date}
                    </Text>
                    <View style={styles.progressRing}>
                      {day.progress === 'complete' && (
                        <CheckmarkIcon size={24} color="#34D399" />
                      )}
                      {day.progress === 'incomplete' && (
                        <Icon name="close" size={20} color="#EF4444" />
                      )}
                      {day.progress === 'empty' && null}
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>

          <StatsGrid
            weeklyCompletedCount={weeklyGoals.filter(g => g.completed).length}
            weeklyInProgressCount={weeklyGoals.filter(g => g.progress > 0 && g.progress < 100 && !g.completed).length}
            weeklyTotalCount={weeklyGoals.length}
            todayCompleted={dailyProgress.completed}
            todayIncomplete={Math.max(dailyProgress.total - dailyProgress.completed, 0)}
            todayTotal={dailyProgress.total}
          />

        </ScrollView>
      </SafeAreaView>

      {/* Hamburger Menu Modal */}
      <Modal
        visible={menuVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable 
          style={styles.modalOverlay} 
          onPress={() => setMenuVisible(false)}
        >
          <View style={styles.menuContainer}>
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => handleMenuItemPress('Profile')}
            >
              <Icon name="person-outline" size={24} color={colors.text.primary} />
              <Text style={styles.menuItemText}>Profile</Text>
            </TouchableOpacity>

            <View style={styles.menuDivider} />

            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => handleMenuItemPress('UserPosts')}
            >
              <Icon name="trophy-outline" size={24} color={colors.text.primary} />
              <Text style={styles.menuItemText}>Your Posts</Text>
            </TouchableOpacity>

            <View style={styles.menuDivider} />

            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => handleMenuItemPress('Logout')}
            >
              <Icon name="log-out-outline" size={24} color="#EF4444" />
              <Text style={[styles.menuItemText, { color: '#EF4444' }]}>Logout</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </LinearGradient>
  );
};

// --- STYLES ---

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 2,
  },
  headerTitle: {
    color: colors.text.primary,
    fontSize: 34,
    fontFamily: 'Inter-Bold',
  },
  greeting: {
    color: colors.text.secondary,
    fontSize: 16,
    marginTop: 4,
    marginLeft: 90,
  },
  menuButton: {
    padding: 4,
  },
  sectionContainer: {
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: 'Inter-Bold',
    color: colors.text.primary,
    marginLeft: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 20,
    marginTop: 30,
    elevation: 4,
    shadowColor: '#C0D7FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 22,
    fontFamily: 'Inter-Bold',
    color: colors.text.primary,
  },
  progressFraction: {
    color: colors.text.secondary,
    fontFamily: 'Inter-Medium',
  },
  errorText: {
    color: '#EF4444',
    fontFamily: 'Inter-Medium',
    fontSize: 12,
  },
  noGoalsText: {
    color: colors.text.secondary,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  progressBarBackground: {
    height: 10,
    backgroundColor: '#F0F4FF',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#76E4F2',
    borderRadius: 5,
  },
  toolsGridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    paddingTop: 15,
    justifyContent: 'space-between',
    marginBottom: -30,
  },
  toolButtonContainer: {
    alignItems: 'center',
    width: '30%',
    marginBottom: 20,
  },
  toolButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  toolButtonText: {
    marginTop: 8,
    color: colors.text.secondary,
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
  },
  winsLoadingContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    alignItems: 'center',
  },
  noWinsText: {
    fontFamily: 'Inter-Regular',
    color: colors.text.secondary,
    fontSize: 14,
  },
  winCard: {
    borderRadius: 15,
    marginRight: 15,
    minWidth: 140,
    height: 110,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#C0D7FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  winCardBackground: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  winCardBackgroundImage: {
    borderRadius: 15,
  },
  winCardOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    padding: 12,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  winCardText: {
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    fontSize: 14,
  },
  winCardNoImage: {
    backgroundColor: '#E0F2FE',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    borderRadius: 15,
  },
  winCardTextNoImage: {
    fontFamily: 'Inter-Bold',
    color: colors.text.primary,
    fontSize: 14,
    textAlign: 'center',
  },
  weekLoadingContainer: {
    paddingHorizontal: 20,
    paddingTop: 15,
    alignItems: 'center',
  },
  calendarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 15,
  },
  dayContainer: {
    alignItems: 'center',
    padding: 8,
    borderRadius: 15,
    width: 48,
  },
  todayContainer: {
    backgroundColor: '#E0F2FE',
  },
  dayOfWeekText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 4,
  },
  todayText: {
    color: '#0284C7',
  },
  progressRing: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    marginTop: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 70,
    paddingRight: 20,
  },
  menuContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 8,
    minWidth: 200,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  menuItemText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: colors.text.primary,
    marginLeft: 16,
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 12,
  },
});

export default HomeScreen;




// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   StyleSheet,
//   SafeAreaView,
//   StatusBar,
//   ScrollView,
//   TouchableOpacity,
//   Text,
//   ActivityIndicator,
//   ImageBackground,
// } from 'react-native';
// import { ScreenTitle, Body } from '../../components/common/StyledText';
// import { colors } from '../../theme/color1.js';
// import Icon from 'react-native-vector-icons/Ionicons';
// import CheckmarkIcon from '../../components/dashboard/CheckmarkIcon.tsx';
// import { useNavigation, useFocusEffect } from '@react-navigation/native';
// import LinearGradient from 'react-native-linear-gradient';
// import StatsGrid from '../../components/dashboard/StatsGrid.tsx';
// import FeaturedCarousel from '../../components/dashboard/FeaturedCarousel.tsx';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// import { BASE_URL } from '@env';

// type GradientColors = string[];

// type WeekDayProgress = 'empty' | 'complete' | 'incomplete';

// type WeekDayStatus = {
//   dayOfWeek: string;
//   date: number;
//   isToday: boolean;
//   progress: WeekDayProgress;
// };

// type DynamicHeaderProps = { onProfilePress: () => void; userName: string };

// type ToolButtonProps = {
//   iconName: string;
//   gradient: GradientColors;
//   label: string;
//   onPress: () => void;
// };

// type ProgressCardProps = {
//   completed: number;
//   total: number;
//   loading: boolean;
//   error: boolean;
// };

// type RecentWin = { _id: string; image?: string; achievementText: string };

// type RecentWinsSectionProps = { wins: RecentWin[]; loading: boolean; error: boolean };

// const menuItems = [
//   {
//     id: '1',
//     title: 'DAILY QUESTS',
//     shortTitle: 'DAILY',
//     iconName: 'arrow-up-outline',
//     gradient: colors.gradient.warm,
//     feature: 'DailyGoalsScreen',
//   },
//   {
//     id: '2',
//     title: 'QUICK BLISS',
//     shortTitle: 'ACTIVITY',
//     iconName: 'flower-outline',
//     gradient: colors.gradient.passion,
//     feature: 'RandomActivitySelector',
//   },
//   {
//     id: '3',
//     title: 'WEEKLY EPIC',
//     shortTitle: 'WEEKLY',
//     iconName: 'barbell-outline',
//     gradient: colors.gradient.cool,
//     feature: 'WeeklyGoalsScreen',
//   },
//   {
//     id: '4',
//     title: 'HALL OF FAME',
//     shortTitle: '5-MINTASK',
//     iconName: 'book-outline',
//     gradient: ['#A9C9FF', '#FFBBEC'],
//     feature: 'ActivityListScreen',
//   },
//   {
//     id: '5',
//     title: 'LOG A WIN',
//     shortTitle: 'I-COMPLETED',
//     iconName: 'add-circle-outline',
//     gradient: ['#76E4F2', '#A9C9FF'],
//     feature: 'IcompletedScreen',
//   },
//   {
//     id: '6',
//     title: 'FORBIDDEN LIST',
//     shortTitle: 'NOT-TO-DO',
//     iconName: 'close-circle-outline',
//     gradient: ['#C1F1D4', '#76E4F2'],
//     feature: 'NotToDoScreen',
//   },
// ];

// // --- API Service ---
// const fetchDailyGoals = async () => {
//   try {
//     const token = await AsyncStorage.getItem('token');
//     if (!token) {
//       throw new Error('No auth token found');
//     }

//     const response = await fetch(`${BASE_URL}/api/dailyGoals`, {
//       method: 'GET',
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'application/json',
//       },
//     });

//     if (!response.ok) {
//       throw new Error('Failed to fetch daily goals');
//     }

//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error('Error fetching daily goals:', error);
//     throw error;
//   }
// };

// const fetchUserProfile = async () => {
//   try {
//     const token = await AsyncStorage.getItem('token');
//     if (!token) {
//       throw new Error('No auth token found');
//     }

//     const response = await fetch(`${BASE_URL}/api/auth/me`, {
//       method: 'GET',
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'application/json',
//       },
//     });

//     if (!response.ok) {
//       throw new Error('Failed to fetch user profile');
//     }

//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error('Error fetching user profile:', error);
//     throw error;
//   }
// };

// const fetchRecentWins = async () => {
  
//   try {
//     const token = await AsyncStorage.getItem('token');
//     if (!token) {
//       throw new Error('No auth token found');
//     }

//     const response = await fetch(`${BASE_URL}/api/icompleted/my`, {
//       method: 'GET',
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'application/json',
//       },
//     });

//     if (!response.ok) {
//       throw new Error('Failed to fetch recent wins');
//     }

//     const data = await response.json();
//     // Return only the last 3 wins
//     return data.slice(0, 3);
//   } catch (error) {
//     console.error('Error fetching recent wins:', error);
//     throw error;
//   }
// };

// const fetchWeeklyGoalsStatus = async () => {
//   try {
//     const token = await AsyncStorage.getItem('token');
//     console.log('token=', token);
//     if (!token) {
//       throw new Error('No auth token found');
//     }

//     const response = await fetch(`${BASE_URL}/api/dailyGoals/weekly/status`, {
//       method: 'GET',
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'application/json',
//       },
//     });

//     if (!response.ok) {
//       throw new Error('Failed to fetch weekly goals status');
//     }

//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error('Error fetching weekly goals status:', error);
//     throw error;
//   }
// };

// type WeeklyGoal = { _id: string; progress: number; completed: boolean };

// const fetchWeeklyGoals = async (): Promise<WeeklyGoal[]> => {
//   try {
//     const token = await AsyncStorage.getItem('token');
//     if (!token) {
//       throw new Error('No auth token found');
//     }

//     const response = await fetch(`${BASE_URL}/api/weekly-goals`, {
//       method: 'GET',
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'application/json',
//       },
//     });

//     if (!response.ok) {
//       throw new Error('Failed to fetch weekly goals');
//     }

//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error('Error fetching weekly goals:', error);
//     return [];
//   }
// };

// // --- REUSABLE SUB-COMPONENTS ---

// const DynamicHeader = ({ onProfilePress, userName }: DynamicHeaderProps) => {
//   const [greeting, setGreeting] = useState('');

//   useEffect(() => {
//     const hours = new Date().getHours();
//     const displayName = userName ? userName.toUpperCase() : 'THERE';
    
//     if (hours < 12) setGreeting(`Good Morning, ${displayName}! ☀️`);
//     else if (hours < 18) setGreeting(`Good Afternoon, ${displayName}! 🌤️`);
//     else setGreeting(`Good Evening, ${displayName}! 🌙`);
//   }, [userName]);

//   return (
//     <View style={styles.header}>
//       <View>
//         <ScreenTitle style={styles.headerTitle}>IFU</ScreenTitle>
//         <Body style={styles.greeting}>{greeting}</Body>
//       </View>
//       <TouchableOpacity onPress={onProfilePress}>
//         <Icon name="person-circle-outline" size={40} color={colors.text.primary} />
//       </TouchableOpacity>
//     </View>
//   );
// };

// const ToolButton = ({ iconName, gradient, label, onPress }: ToolButtonProps) => (
//   <TouchableOpacity onPress={onPress} style={styles.toolButtonContainer}>
//     <LinearGradient colors={gradient} style={styles.toolButton}>
//       <Icon name={iconName} size={28} color="white" />
//     </LinearGradient>
//     <Text style={styles.toolButtonText}>{label}</Text>
//   </TouchableOpacity>
// );

// const ProgressCard = ({ completed, total, loading, error }: ProgressCardProps) => {
//   const progressPercent = total > 0 ? (completed / total) * 100 : 0;
  
//   return (
//     <View style={styles.card}>
//       <View style={styles.cardHeader}>
//         <Text style={styles.cardTitle}>Today's Progress</Text>
//         {loading ? (
//           <ActivityIndicator size="small" color={colors.text.secondary} />
//         ) : error ? (
//           <Text style={styles.errorText}>Failed to load</Text>
//         ) : (
//           <Text style={styles.progressFraction}>
//             {completed} / {total} Completed
//           </Text>
//         )}
//       </View>
//       <View style={styles.progressBarBackground}>
//         <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
//       </View>
//       {total === 0 && !loading && !error && (
//         <Text style={styles.noGoalsText}>No daily goals set for today</Text>
//       )}
//     </View>
//   );
// };

// const truncateText = (text: string, wordLimit = 2) => {
//   const words = text.trim().split(/\s+/);
//   if (words.length <= wordLimit) return text;
//   return words.slice(0, wordLimit).join(' ') + '...';
// };

// const RecentWinsSection = ({ wins, loading, error }: RecentWinsSectionProps) => {
//   if (loading) {
//     return (
//       <View style={styles.sectionContainer}>
//         <Text style={styles.sectionTitle}>Recent Wins</Text>
//         <View style={styles.winsLoadingContainer}>
//           <ActivityIndicator size="small" color={colors.text.secondary} />
//         </View>
//       </View>
//     );
//   }

//   if (error || wins.length === 0) {
//     return (
//       <View style={styles.sectionContainer}>
//         <Text style={styles.sectionTitle}>Recent Wins</Text>
//         <View style={styles.winsLoadingContainer}>
//           <Text style={styles.noWinsText}>
//             {error ? 'Failed to load wins' : 'No wins yet. Log your first win!'}
//           </Text>
//         </View>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.sectionContainer}>
//       <Text style={styles.sectionTitle}>Recent Wins</Text>
//       <ScrollView
//         horizontal
//         showsHorizontalScrollIndicator={false}
//         contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 10 }}
//       >
//         {wins.map((win: RecentWin) => (
//           <View key={win._id} style={styles.winCard}>
//             {win.image ? (
//               <ImageBackground
//                 source={{ uri: `${BASE_URL}${win.image}` }}
//                 style={styles.winCardBackground}
//                 imageStyle={styles.winCardBackgroundImage}
//               >
//                 <View style={styles.winCardOverlay}>
//                   <Text style={styles.winCardText}>
//                     {truncateText(win.achievementText)}
//                   </Text>
//                 </View>
//               </ImageBackground>
//             ) : (
//               <View style={styles.winCardNoImage}>
//                 <Text style={styles.winCardTextNoImage}>
//                   {truncateText(win.achievementText)}
//                 </Text>
//               </View>
//             )}
//           </View>
//         ))}
//       </ScrollView>
//     </View>
//   );
// };

// // --- MAIN HomeScreen COMPONENT ---

// const HomeScreen = () => {
//   const navigation = useNavigation();
//   const [dailyProgress, setDailyProgress] = useState({ completed: 0, total: 0 });
//   const [userName, setUserName] = useState('');
//   const [recentWins, setRecentWins] = useState<RecentWin[]>([]);
//   const [weekData, setWeekData] = useState<WeekDayStatus[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(false);
//   const [winsLoading, setWinsLoading] = useState(true);
//   const [winsError, setWinsError] = useState(false);
//   const [weekLoading, setWeekLoading] = useState(true);
//   const [weeklyGoals, setWeeklyGoals] = useState<WeeklyGoal[]>([]);

//   const loadDailyGoals = async () => {
//     try {
//       setLoading(true);
//       setError(false);
//       const goals = await fetchDailyGoals();
      
//       const completedGoals = goals.filter((goal: { completed: boolean }) => goal.completed).length;
//       const totalGoals = goals.length;
      
//       setDailyProgress({
//         completed: completedGoals,
//         total: totalGoals,
//       });
//     } catch (err) {
//       console.error('Error loading daily goals:', err);
//       setError(true);
//       setDailyProgress({ completed: 0, total: 0 });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const loadUserProfile = async () => {
//     try {
//       const userData = await fetchUserProfile();
//       setUserName(userData.name || 'User');
//     } catch (err) {
//       console.error('Error loading user profile:', err);
//       setUserName('User');
//     }
//   };

//   const loadRecentWins = async () => {
//     try {
//       setWinsLoading(true);
//       setWinsError(false);
//       const wins = await fetchRecentWins();
//       setRecentWins(wins);
//     } catch (err) {
//       console.error('Error loading recent wins:', err);
//       setWinsError(true);
//       setRecentWins([]);
//     } finally {
//       setWinsLoading(false);
//     }
//   };

//   const loadWeeklyGoalsStatus = async () => {
//     try {
//       setWeekLoading(true);
//       const weeklyStatus = await fetchWeeklyGoalsStatus();
      
//       const today = new Date();
//       const currentDay = today.getDay();
//       const startOfWeek = new Date(today);
//       startOfWeek.setDate(today.getDate() - (currentDay === 0 ? 6 : currentDay - 1));

//       const formattedWeekData = [];
//       for (let i = 0; i < 7; i++) {
//         const day = new Date(startOfWeek);
//         day.setDate(startOfWeek.getDate() + i);
//         // Build local YYYY-MM-DD to match backend
//         const yyyy = day.getFullYear();
//         const mm = String(day.getMonth() + 1).padStart(2, '0');
//         const dd = String(day.getDate()).padStart(2, '0');
//         const dateStr = `${yyyy}-${mm}-${dd}`;
        
//         const isToday = day.getFullYear() === today.getFullYear() &&
//           day.getMonth() === today.getMonth() &&
//           day.getDate() === today.getDate();

//         const dayStatus = weeklyStatus.find((d: { date: string; totalGoals: number; completedGoals: number }) => d.date === dateStr);
        
//         let progress: WeekDayProgress = 'empty';
//         if (dayStatus) {
//           if (dayStatus.totalGoals === 0) {
//             progress = 'empty';
//           } else if (dayStatus.completedGoals === dayStatus.totalGoals) {
//             progress = 'complete';
//           } else {
//             progress = 'incomplete';
//           }
//         }

//         formattedWeekData.push({
//           dayOfWeek: day.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
//           date: day.getDate(),
//           isToday: isToday,
//           progress: progress,
//         });
//       }
      
//       setWeekData(formattedWeekData);
//     } catch (err) {
//       console.error('Error loading weekly goals status:', err);
//       // Fallback to empty week data
//       const today = new Date();
//       const currentDay = today.getDay();
//       const startOfWeek = new Date(today);
//       startOfWeek.setDate(today.getDate() - (currentDay === 0 ? 6 : currentDay - 1));

//       const fallbackData: WeekDayStatus[] = [];
//       for (let i = 0; i < 7; i++) {
//         const day = new Date(startOfWeek);
//         day.setDate(startOfWeek.getDate() + i);
//         const isToday = day.getFullYear() === today.getFullYear() &&
//           day.getMonth() === today.getMonth() &&
//           day.getDate() === today.getDate();

//         fallbackData.push({
//           dayOfWeek: day.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
//           date: day.getDate(),
//           isToday: isToday,
//           progress: 'empty',
//         });
//       }
//       setWeekData(fallbackData);
//     } finally {
//       setWeekLoading(false);
//     }
//   };

//   const loadWeeklyGoals = async () => {
//     const goals = await fetchWeeklyGoals();
//     setWeeklyGoals(goals);
//   };

//   // Load data when component mounts
//   useEffect(() => {
//     loadDailyGoals();
//     loadUserProfile();
//     loadRecentWins();
//     loadWeeklyGoalsStatus();
//     loadWeeklyGoals();
//   }, []);

//   // Reload data when screen comes into focus
//   useFocusEffect(
//     React.useCallback(() => {
//       loadDailyGoals();
//       loadUserProfile();
//       loadRecentWins();
//       loadWeeklyGoalsStatus();
//       loadWeeklyGoals();
//     }, [])
//   );

//   const handlePress = (feature: string) => {
//     console.log('Navigate to:', feature);
//     if (feature) navigation.navigate(feature as never);
//   };

//   return (
//     <LinearGradient colors={['#F7F8FF', '#EAF2FF']} style={styles.container}>
//       <StatusBar barStyle="dark-content" />
//       <SafeAreaView style={styles.safeArea}>
//         <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContentContainer}>

//           <DynamicHeader onProfilePress={() => handlePress('Profile')} userName={userName} />

//           <FeaturedCarousel/>

//           <ProgressCard 
//             completed={dailyProgress.completed} 
//             total={dailyProgress.total}
//             loading={loading}
//             error={error}
//           />

//           <View style={styles.sectionContainer}>
//             <Text style={styles.sectionTitle}>Your Tools</Text>
//             <View style={styles.toolsGridContainer}>
//               {menuItems.map(item => (
//                 <ToolButton
//                   key={item.id}
//                   label={item.shortTitle}
//                   iconName={item.iconName}
//                   gradient={item.gradient}
//                   onPress={() => handlePress(item.feature)}
//                 />
//               ))}
//             </View>
//           </View>

//           <RecentWinsSection 
//             wins={recentWins} 
//             loading={winsLoading} 
//             error={winsError} 
//           />

//           <View style={styles.sectionContainer}>
//             <Text style={styles.sectionTitle}>Weekly Progress</Text>
//             {weekLoading ? (
//               <View style={styles.weekLoadingContainer}>
//                 <ActivityIndicator size="small" color={colors.text.secondary} />
//               </View>
//             ) : (
//               <View style={styles.calendarContainer}>
//                 {weekData.map((day, index) => (
//                   <View key={index} style={[styles.dayContainer, day.isToday && styles.todayContainer]}>
//                     <Text style={[styles.dayOfWeekText, day.isToday && styles.todayText]}>
//                       {day.dayOfWeek}
//                     </Text>
//                     <Text style={[styles.dateText, day.isToday && styles.todayText]}>
//                       {day.date}
//                     </Text>
//                     <View style={styles.progressRing}>
//                       {day.progress === 'complete' && (
//                         <CheckmarkIcon size={24} color="#34D399" />
//                       )}
//                       {day.progress === 'incomplete' && (
//                         <Icon name="close" size={20} color="#EF4444" />
//                       )}
//                       {day.progress === 'empty' && null}
//                     </View>
//                   </View>
//                 ))}
//               </View>
//             )}
//           </View>

//           <StatsGrid
//             weeklyCompletedCount={weeklyGoals.filter(g => g.completed).length}
//             weeklyInProgressCount={weeklyGoals.filter(g => g.progress > 0 && g.progress < 100 && !g.completed).length}
//             weeklyTotalCount={weeklyGoals.length}
//             todayCompleted={dailyProgress.completed}
//             todayIncomplete={Math.max(dailyProgress.total - dailyProgress.completed, 0)}
//             todayTotal={dailyProgress.total}
//           />

//         </ScrollView>
//       </SafeAreaView>
//     </LinearGradient>
//   );
// };

// // --- STYLES ---

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   safeArea: {
//     flex: 1,
//   },
//   scrollContentContainer: {
//     paddingBottom: 40,
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//     paddingTop: 20,
//     paddingBottom: 2,
//   },
//   headerTitle: {
//     color: colors.text.primary,
//     fontSize: 34,
//     fontFamily: 'Inter-Bold',
//   },
//   greeting: {
//     color: colors.text.secondary,
//     fontSize: 16,
//     marginTop: 4,
//     marginLeft: 90,
//   },
//   sectionContainer: {
//     marginTop: 30,
//   },
//   sectionTitle: {
//     fontSize: 22,
//     fontFamily: 'Inter-Bold',
//     color: colors.text.primary,
//     marginLeft: 20,
//   },
//   card: {
//     backgroundColor: 'white',
//     borderRadius: 20,
//     padding: 20,
//     marginHorizontal: 20,
//     marginTop: 30,
//     elevation: 4,
//     shadowColor: '#C0D7FF',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.5,
//     shadowRadius: 10,
//   },
//   cardHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 15,
//   },
//   cardTitle: {
//     fontSize: 22,
//     fontFamily: 'Inter-Bold',
//     color: colors.text.primary,
//   },
//   progressFraction: {
//     color: colors.text.secondary,
//     fontFamily: 'Inter-Medium',
//   },
//   errorText: {
//     color: '#EF4444',
//     fontFamily: 'Inter-Medium',
//     fontSize: 12,
//   },
//   noGoalsText: {
//     color: colors.text.secondary,
//     fontFamily: 'Inter-Regular',
//     fontSize: 14,
//     marginTop: 8,
//     textAlign: 'center',
//   },
//   progressBarBackground: {
//     height: 10,
//     backgroundColor: '#F0F4FF',
//     borderRadius: 5,
//     overflow: 'hidden',
//   },
//   progressBarFill: {
//     height: '100%',
//     backgroundColor: '#76E4F2',
//     borderRadius: 5,
//   },
//   toolsGridContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     paddingHorizontal: 20,
//     paddingTop: 15,
//     justifyContent: 'space-between',
//     marginBottom: -30,
//   },
//   toolButtonContainer: {
//     alignItems: 'center',
//     width: '30%',
//     marginBottom: 20,
//   },
//   toolButton: {
//     width: 64,
//     height: 64,
//     borderRadius: 32,
//     justifyContent: 'center',
//     alignItems: 'center',
//     elevation: 4,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   toolButtonText: {
//     marginTop: 8,
//     color: colors.text.secondary,
//     fontSize: 12,
//     fontFamily: 'Inter-Medium',
//     textAlign: 'center',
//   },
//   winsLoadingContainer: {
//     paddingHorizontal: 20,
//     paddingTop: 10,
//     alignItems: 'center',
//   },
//   noWinsText: {
//     fontFamily: 'Inter-Regular',
//     color: colors.text.secondary,
//     fontSize: 14,
//   },
//   winCard: {
//     borderRadius: 15,
//     marginRight: 15,
//     minWidth: 140,
//     height: 110,
//     overflow: 'hidden',
//     elevation: 2,
//     shadowColor: '#C0D7FF',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 5,
//   },
//   winCardBackground: {
//     width: '100%',
//     height: '100%',
//     justifyContent: 'flex-end',
//   },
//   winCardBackgroundImage: {
//     borderRadius: 15,
//   },
//   winCardOverlay: {
//     backgroundColor: 'rgba(0, 0, 0, 0.4)',
//     padding: 12,
//     borderBottomLeftRadius: 15,
//     borderBottomRightRadius: 15,
//   },
//   winCardText: {
//     fontFamily: 'Inter-Bold',
//     color: '#FFFFFF',
//     fontSize: 14,
//   },
//   winCardNoImage: {
//     backgroundColor: '#E0F2FE',
//     width: '100%',
//     height: '100%',
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 12,
//     borderRadius: 15,
//   },
//   winCardTextNoImage: {
//     fontFamily: 'Inter-Bold',
//     color: colors.text.primary,
//     fontSize: 14,
//     textAlign: 'center',
//   },
//   weekLoadingContainer: {
//     paddingHorizontal: 20,
//     paddingTop: 15,
//     alignItems: 'center',
//   },
//   calendarContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingHorizontal: 20,
//     marginTop: 15,
//   },
//   dayContainer: {
//     alignItems: 'center',
//     padding: 8,
//     borderRadius: 15,
//     width: 48,
//   },
//   todayContainer: {
//     backgroundColor: '#E0F2FE',
//   },
//   dayOfWeekText: {
//     fontSize: 12,
//     fontWeight: '500',
//     color: '#6B7280',
//   },
//   dateText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#1F2937',
//     marginTop: 4,
//   },
//   todayText: {
//     color: '#0284C7',
//   },
//   progressRing: {
//     width: 24,
//     height: 24,
//     borderRadius: 12,
//     borderWidth: 2,
//     borderColor: '#E5E7EB',
//     marginTop: 8,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });

// export default HomeScreen;