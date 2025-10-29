import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  StatusBar,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker';
import { BASE_URL } from '@env';

const StatCard = ({ icon, count, title, color }) => (
  <View style={styles.statCard}>
    <View style={[styles.iconContainer, { backgroundColor: color }]}>
      <Icon name={icon} size={24} color="white" />
    </View>
    <Text style={styles.statCardCount}>{count}</Text>
    <Text style={styles.statCardTitle}>{title}</Text>
  </View>
);

const ProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    bio: '',
    interests: [],
    goals: [],
    profileImage: '',
  });

  const [profileImage, setProfileImage] = useState('');

  const pickImage = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.didCancel) return;
      if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
        return;
      }
      const uri = response.assets[0].uri;
      setProfileImage(uri);
    });
  };

  const handleSave = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token) return Alert.alert('Error', 'Login required');

    const formData = new FormData();
    formData.append('bio', user.bio);
    formData.append('interests', JSON.stringify(user.interests));
    formData.append('goals', JSON.stringify(user.goals));

    if (profileImage && !profileImage.startsWith('http')) {
      formData.append('profileImage', {
        uri: profileImage,
        type: 'image/jpeg',
        name: 'profile.jpg',
      });
    }

    try {
      const response = await fetch(`${BASE_URL}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Profile update failed');

      Alert.alert('Success', 'Profile updated!');
      setProfileImage(data.profileImage);
      setUser((prev) => ({ ...prev, profileImage: data.profileImage }));
    } catch (err) {
      console.error(err);
      Alert.alert('Error', err.message);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) return navigation.navigate('Login');

      const response = await fetch(`${BASE_URL}/api/auth/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to fetch user data');

      setUser(data);
      if (data.profileImage) setProfileImage(data.profileImage);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', err.message || 'Something went wrong');
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  return (
    <LinearGradient colors={['#f0e6ff', '#d8e2ff', '#e0f7ff']} style={styles.backgroundGradient}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Profile</Text>
          </View>

          {/* User Info */}
          <View style={styles.userInfoSection}>
            {/* Relative container so edit button is clickable */}
            <View style={{ position: 'relative' }}>
              <Image
                source={profileImage ? { uri: profileImage } : require('../assets/images/profile.webp')}
                style={styles.avatar}
              />
              <TouchableOpacity onPress={pickImage} style={styles.editIconContainer}>
                <Icon name="edit-2" size={16} color="white" />
              </TouchableOpacity>
            </View>
            <Text style={styles.userName}>{user.name || 'User Name'}</Text>
            <Text style={styles.userEmail}>{user.email || 'user@example.com'}</Text>
          </View>

          {/* About Me */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>About Me</Text>
            <Text style={styles.bioText}>{user.bio || 'No bio yet.'}</Text>
          </View>

          {/* Interests */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>My Interests</Text>
            <View style={styles.tagContainer}>
              {user.interests.length > 0 ? (
                user.interests.map((interest, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{interest}</Text>
                  </View>
                ))
              ) : (
                <Text style={{ color: '#9CA3AF' }}>No interests added yet</Text>
              )}
            </View>
          </View>

          {/* Goals */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Main Goals</Text>
            {user.goals.length > 0 ? (
              user.goals.map((goal, index) => (
                <View key={index} style={styles.goalItem}>
                  <Icon name="radio" size={20} color="#3B82F6" />
                  <Text style={styles.goalText}>{goal}</Text>
                </View>
              ))
            ) : (
              <Text style={{ color: '#9CA3AF' }}>No goals added yet</Text>
            )}
          </View>

          {/* Stat Cards */}
          <View style={styles.cardsContainer}>
            <StatCard icon="check-circle" count={8} title="Completed" color="#34D399" />
            <StatCard icon="loader" count={2} title="In Progress" color="#60A5FA" />
            <StatCard icon="alert-circle" count={4} title="Uncompleted" color="#FBBF24" />
            <StatCard icon="list" count={14} title="Total Tasks" color="#A78BFA" />
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  backgroundGradient: { flex: 1 },
  container: { flex: 1 },
  scrollContent: { paddingBottom: 30 },
  header: { padding: 20, alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '600', color: '#374151' },
  userInfoSection: { alignItems: 'center', padding: 20 },
  avatar: { width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: 'white' },
  userName: { marginTop: 15, fontSize: 24, fontWeight: 'bold', color: '#1F2937' },
  userEmail: { marginTop: 5, fontSize: 14, color: '#6B7280' },
  sectionContainer: {
    width: '90%',
    alignSelf: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginTop: 20,
  },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#1F2937', marginBottom: 10 },
  bioText: { fontSize: 14, color: '#6B7280', lineHeight: 20 },
  tagContainer: { flexDirection: 'row', flexWrap: 'wrap' },
  tag: { backgroundColor: '#E0F2FE', borderRadius: 15, paddingVertical: 6, paddingHorizontal: 12, marginRight: 8, marginBottom: 8 },
  tagText: { color: '#0284C7', fontSize: 12, fontWeight: '500' },
  goalItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  goalText: { marginLeft: 10, fontSize: 15, color: '#374151' },
  cardsContainer: { marginTop: 15, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', paddingHorizontal: 10 },
  statCard: { width: '46%', backgroundColor: 'white', borderRadius: 20, padding: 15, alignItems: 'flex-start', marginBottom: 15 },
  iconContainer: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  statCardCount: { fontSize: 28, fontWeight: 'bold', color: '#1F2937' },
  statCardTitle: { fontSize: 14, color: '#6B7280', marginTop: 2 },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#3B82F6',
    padding: 8,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: 'white',
  },
});

export default ProfileScreen;
