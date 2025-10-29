// mobile/src/screens/Dashboard/HomeScreen.tsx (Complete Version)
// Probably this file will be removed
import React from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar, FlatList, TouchableOpacity } from 'react-native';
import { ScreenTitle, Body } from '../../components/common/StyledText';
import { GridButton } from '../../components/interactive/GridButton';
import { colors } from '../../theme/color.ts';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

// Mock data mapping your features to the UI
const menuItems = [
  { id: '1', title: 'DAILY GOALS', iconName: 'arrow-up-outline', gradient: colors.gradient.warm, feature: 'DailyGoalsScreen' },
  { id: '2', title: '1-MIN ACTIVITY', iconName: 'flower-outline', gradient: colors.gradient.passion, feature: 'ActivitySelectionScreen' },
  { id: '3', title: 'WEEKLY GOALS', iconName: 'barbell-outline', gradient: colors.gradient.cool, feature: 'WeeklyGoalsScreen' },
  { id: '4', title: 'ACHIEVEMENTS', iconName: 'book-outline', gradient: ['#A9C9FF', '#FFBBEC'], feature: 'AchievementsScreen' },
  { id: '5', title: '5 MIN ACTIVITY', iconName: 'timer-outline', gradient: ['#76E4F2', '#A9C9FF'], feature: 'ActivityListScreen' },
  { id: '6', title: 'NOT-TO-DO LIST', iconName: 'close-circle-outline', gradient: ['#C1F1D4', '#76E4F2'], feature: 'NotToDoScreen' },
];

const HomeScreen = () => {
  const navigation = useNavigation();

const handlePress = (feature: string) => {
    console.log('Navigate to:', feature);
    if (feature) {
      navigation.navigate(feature as never); // The "as never" is a small TypeScript trick
    }
};

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      {/* Faked background, can be replaced with an image or more complex view */}
      <View style={styles.backgroundOverlay} />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.contentContainer}>
          {/* 1. HEADER */}
          <View style={styles.header}>
            <ScreenTitle style={styles.headerTitle}>IFU</ScreenTitle>
            <TouchableOpacity onPress={() => handlePress('Profile')}>
              <Icon name="person-circle-outline" size={36} color={colors.text.primary} />
            </TouchableOpacity>
          </View>
          <Body style={styles.greeting}>HELLO, MARK! ☀️</Body>

          {/* 2. GRID of buttons */}
          <FlatList
            data={menuItems}
            keyExtractor={(item) => item.id}
            numColumns={2}
            renderItem={({ item }) => (
              <GridButton
                title={item.title}
                iconName={item.iconName}
                gradient={item.gradient}
                onPress={() => handlePress(item.feature)}
              />
            )}
            contentContainerStyle={styles.grid}
          />
        </View>
      </SafeAreaView>
      {/* 3. BOTTOM TAB BAR (Placeholder) */}
      <View style={styles.tabBarPlaceholder} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  backgroundOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: '#F4F7FF', // Light background
  },
  safeArea: { flex: 1 },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  headerTitle: {
    textAlign: 'center',
    color: colors.text.primary,
    fontSize: 32,
    fontFamily: 'Inter-Bold',
  },
  greeting: {
    textAlign: 'center',
    color: colors.text.secondary,
    marginBottom: 20,
  },
  grid: {
    paddingTop: 10,
  },
  tabBarPlaceholder: {
    height: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderTopWidth: 1,
    borderColor: '#EFEFEF'
  }
});

export default HomeScreen;