import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenTitle, CardHeader, Body } from '../../components/common/StyledText';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../theme/color';

const mockNotifications = [
  { id: '1', icon: 'heart', text: 'Jane gave you praise for your 5k run!', time: '15m ago', color: colors.gradient.passion[0] },
  { id: '2', icon: 'alarm', text: 'Reminder: Time for your evening reflection.', time: '1h ago', color: colors.gradient.cool[0] },
  { id: '3', icon: 'trophy', text: 'New Badge Unlocked: 7-Day Streak!', time: 'Yesterday', color: colors.gradient.warm[0] },
];

const NotificationItem = ({ icon, text, time, color }: any) => (
  <View style={styles.itemContainer}>
    <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
      <Icon name={icon} size={24} color={color} />
    </View>
    <View style={styles.textContainer}>
      <Body style={{ fontSize: 16 }}>{text}</Body>
      <Body style={{ fontSize: 12, color: colors.text.secondary, marginTop: 4 }}>{time}</Body>
    </View>
  </View>
);

const NotificationsScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScreenTitle style={styles.pageTitle}>Notifications</ScreenTitle>
      <FlatList
        data={mockNotifications}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <NotificationItem {...item} />}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background.primary },
  pageTitle: { paddingHorizontal: 20, marginVertical: 10 },
  list: { paddingHorizontal: 20 },
  itemContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  iconContainer: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  textContainer: { flex: 1 },
});

export default NotificationsScreen;