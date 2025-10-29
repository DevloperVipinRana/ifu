// src/components/StatsGrid.tsx

import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather'; // Feather icons for the cards

type HabitCardProps = {
  icon: string;
  title: string;
  subtitle: string;
  color: string;
  onPress?: () => void;
};

type StatsGridProps = {
  weeklyCompletedCount: number;
  weeklyInProgressCount: number; // goals with 0 < progress < 100
  weeklyTotalCount: number;
  todayCompleted: number;
  todayIncomplete: number;
  todayTotal: number;
};

// --- Reusable Sub-Component for the individual cards ---
const HabitCard = ({ icon, title, subtitle, color, onPress = () => {} }: HabitCardProps) => (
  <TouchableOpacity onPress={onPress} style={[styles.habitCard, { backgroundColor: color }]}>
    <Icon name={icon} size={24} color="#374151" />
    <Text style={styles.habitCardTitle}>{title}</Text>
    <Text style={styles.habitCardSubtitle}>{subtitle}</Text>
  </TouchableOpacity>
);

// --- The Main Component for the Entire 4-Card Grid ---
const StatsGrid = ({
  weeklyCompletedCount,
  weeklyInProgressCount,
  weeklyTotalCount,
  todayCompleted,
  todayIncomplete,
  todayTotal,
}: StatsGridProps) => {
  const navigation = useNavigation();

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Your Stats</Text>
      <View style={styles.habitGridContainer}>
        {/* Left Column */}
        <View style={styles.column}>
          <HabitCard
            icon="check-circle"
            title="Completed"
            subtitle={`${weeklyCompletedCount} wk + ${todayCompleted} today`}
            color="#E0F2F1"
          />
          <HabitCard
            icon="alert-circle"
            title="Uncompleted"
            subtitle={`${weeklyInProgressCount} wk + ${todayIncomplete} today`}
            color="#FFFBEB"
          />
        </View>

        {/* Right Column */}
        <View style={styles.column}>
          <HabitCard
            icon="loader"
            title="In Progress"
            subtitle={`${weeklyInProgressCount} goals`}
            color="#E0F7FA"
          />
          <HabitCard
            icon="list"
            title="Total Tasks"
            subtitle={`${weeklyTotalCount} wk + ${todayTotal} today`}
            color="#EDE9FE"
          />
        </View>
      </View>
    </View>
  );
};

// --- Styles specific to this component ---
const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: 'Inter-Bold',
    color: '#2D3748',
    marginLeft: 20,
    marginBottom: 15,
  },
  habitGridContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  column: {
    width: '48%',
  },
  habitCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  habitCardTitle: {
    marginTop: 15,
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  habitCardSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
});

export default StatsGrid;