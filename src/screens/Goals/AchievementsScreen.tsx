import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenTitle, CardHeader, Body } from '../../components/common/StyledText';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../theme/color';

const mockAchievements = [
  { id: '1', icon: 'walk', text: 'Achieved 10,000 steps!', date: 'Today, 8:45 AM' },
  { id: '2', icon: 'book', text: 'Finished "The Creative Act"', date: 'Yesterday, 9:22 PM' },
  { id: '3', icon: 'leaf', text: 'Completed a 7-day meditation streak', date: 'Yesterday, 7:30 AM' },
  { id: '4', icon: 'trophy', text: 'Completed your first weekly goal', date: '3 days ago' },
];

const AchievementItem = ({ icon, text, date }: any) => (
  <View style={styles.itemContainer}>
    <View style={styles.iconContainer}>
      <Icon name={icon} size={24} color={colors.gradient.success[0]} />
    </View>
    <View style={styles.textContainer}>
      <CardHeader style={styles.itemText}>{text}</CardHeader>
      <Body style={styles.itemDate}>{date}</Body>
    </View>
  </View>
);

const AchievementsScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScreenTitle style={styles.pageTitle}>Achievements</ScreenTitle>
      <FlatList
        data={mockAchievements}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <AchievementItem {...item} />}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background.primary },
  pageTitle: { paddingHorizontal: 20, marginVertical: 10 },
  list: { paddingHorizontal: 20 },
  itemContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E8F5E9', // Light green
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  textContainer: { flex: 1 },
  itemText: { fontSize: 16 },
  itemDate: { fontSize: 12, color: colors.text.secondary },
});

export default AchievementsScreen;