// src/screens/EditProfileScreen.tsx
import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Image,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { launchImageLibrary } from 'react-native-image-picker';
import { BASE_URL } from '@env';
 
// type Props = NativeStackScreenProps<RootStackParamList, 'EditProfileScreen'>;
 
const EditProfileScreen = ({ route, navigation }: Props) => {
  const isEditMode = route.params?.currentUser;
  const currentUser = route.params?.currentUser || {};
 
  // State for multi-step form
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 7;
 
  // Existing state variables
  const [name, setName] = useState(currentUser.name || '');
  const [bio, setBio] = useState(currentUser.bio || '');
  const [interests, setInterests] = useState(currentUser.interests || []);
  const [goals, setGoals] = useState(currentUser.goals || []);
  const [occupation, setOccupation] = useState(currentUser.occupation || '');
  const [ageGroup, setAgeGroup] = useState(currentUser.ageGroup || '');
  const [address, setAddress] = useState(currentUser.address || '');
  const [newGoal, setNewGoal] = useState('');
  const [hobbies, setHobbies] = useState(currentUser.hobbies || '');
  const [musicTaste, setMusicTaste] = useState(currentUser.musicTaste || '');
  const [phoneUsage, setPhoneUsage] = useState(currentUser.phoneUsage || '');
  const [favMusician, setFavMusician] = useState(currentUser.favMusician || '');
  const [favSports, setFavSports] = useState(currentUser.favSports || '');
  const [indoorTime, setIndoorTime] = useState(currentUser.indoorTime || '');
  const [outdoorTime, setOutdoorTime] = useState(currentUser.outdoorTime || '');
  const [favWork, setFavWork] = useState(currentUser.favWork || '');
  const [favPlace, setFavPlace] = useState(currentUser.favPlace || '');
  const [personality, setPersonality] = useState(currentUser.personality || '');
  const [movieGenre, setMovieGenre] = useState(currentUser.movieGenre || '');
  const [likesToTravel, setLikesToTravel] = useState<boolean | undefined>(currentUser.likesToTravel);
  const [profileImage, setProfileImage] = useState(currentUser.profileImage || null);
 
  const predefinedInterests = [
    'Music', 'Sports', 'Games', 'Anime', 'Fitness', 'Yoga', 'Meditation',
    'Art', 'Tech', 'Travel', 'Cooking', 'Reading', 'Gaming', 'Photography'
  ];
 
  const handlePickImage = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.didCancel) return;
      if (response.errorCode) {
        Alert.alert('Error', response.errorMessage || 'Image picker error');
        return;
      }
      if (response.assets && response.assets.length > 0) {
        setProfileImage(response.assets[0].uri);
      }
    });
  };
 
  const handleAddGoal = () => {
    if (newGoal && !goals.includes(newGoal)) setGoals([...goals, newGoal]);
    setNewGoal('');
  };
 
  const handleRemoveGoal = (goal: string) => setGoals(goals.filter((g) => g !== goal));
 
  // const handleSave = async () => {
  //   try {
  //     const token = await AsyncStorage.getItem('token');
  //     if (!token) {
  //       Alert.alert('Error', 'No token found. Please login again.');
  //       navigation.navigate('Login');
  //       return;
  //     }
 
  //     const formData = new FormData();
  //     formData.append('name', name);
  //     formData.append('bio', bio);
  //     formData.append('occupation', occupation);
  //     formData.append('ageGroup', ageGroup);
  //     formData.append('address', address);
  //     formData.append('hobbies', hobbies);
  //     formData.append('musicTaste', musicTaste);
  //     formData.append('favMusician', favMusician);
  //     formData.append('favSports', favSports);
  //     formData.append('indoorTime', indoorTime);
  //     formData.append('outdoorTime', outdoorTime);
  //     formData.append('favWork', favWork);
  //     formData.append('favPlace', favPlace);
  //     formData.append('personality', personality);
  //     formData.append('movieGenre', movieGenre);
 
  //     if (likesToTravel !== null && likesToTravel !== undefined) {
  //       formData.append('likesToTravel', likesToTravel ? 'true' : 'false');
  //     }
 
  //     formData.append('profileCompleted', 'true');
 
  //     interests.forEach((i) => formData.append('interests[]', i));
  //     goals.forEach((g) => formData.append('goals[]', g));
 
  //     if (profileImage && !profileImage.startsWith('http')) {
  //       formData.append('profileImage', {
  //         uri: profileImage,
  //         type: 'image/jpeg',
  //         name: 'profile.jpg',
  //       });
  //     }
      
  //     const response = await fetch(`${BASE_URL}/api/auth/profile`, {
  //       method: 'PUT',
  //       headers: { Authorization: `Bearer ${token}` },
  //       body: formData,
  //     });
 
  //     const data = await response.json();
  //     if (!response.ok) throw new Error(data.message || 'Failed to update profile');
 
  //     Alert.alert('Success', 'Profile updated successfully!');
  //     navigation.navigate('BottomTabNavigator');
  //   } catch (error) {
  //     console.error(error);
  //     Alert.alert('Error', error instanceof Error ? error.message : 'Something went wrong');
  //   }
  // };
 
  const handleSave = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      Alert.alert('Error', 'No token found. Please login again.');
      navigation.navigate('Login');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('bio', bio);
    formData.append('occupation', occupation);
    formData.append('age_group', ageGroup);
    formData.append('address', address);
    formData.append('hobbies', hobbies);
    formData.append('music_taste', musicTaste);
    formData.append('phone_usage', phoneUsage); // ✅ Added this
    formData.append('fav_musician', favMusician);
    formData.append('fav_sports', favSports);
    formData.append('indoor_time', indoorTime);
    formData.append('outdoor_time', outdoorTime);
    formData.append('fav_work', favWork);
    formData.append('fav_place', favPlace);
    formData.append('personality', personality);
    formData.append('movie_genre', movieGenre);

    if (likesToTravel !== null && likesToTravel !== undefined) {
      formData.append('likes_to_travel', likesToTravel ? '1' : '0');
    }

    formData.append('profile_completed', '1'); // ✅ Changed to '1'

    // ✅ Send arrays as JSON strings
    formData.append('interests', JSON.stringify(interests));
    formData.append('goals', JSON.stringify(goals));

    if (profileImage && !profileImage.startsWith('http')) {
      formData.append('profile_image', {
        uri: profileImage,
        type: 'image/jpeg',
        name: 'profile.jpg',
      } as any);
    }
    
    console.log('Sending profile update...'); // Debug log

    const response = await fetch(`${BASE_URL}/api/auth/profile`, {
      method: 'PUT',
      headers: { 
        Authorization: `Bearer ${token}`,
        // Don't set Content-Type header - let fetch set it automatically for FormData
      },
      body: formData,
    });

    const data = await response.json();
    console.log('Profile update response:', data); // Debug log
    
    if (!response.ok) throw new Error(data.message || 'Failed to update profile');

    Alert.alert('Success', 'Profile updated successfully!');
    navigation.navigate('BottomTabNavigator');
  } catch (error) {
    console.error('Profile update error:', error);
    Alert.alert('Error', error instanceof Error ? error.message : 'Something went wrong');
  }
};



  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };
 
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
 
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>What are your interests?</Text>
            <View style={styles.interestsGrid}>
              {predefinedInterests.map((interest) => {
                const isSelected = interests.includes(interest);
                return (
                  <TouchableOpacity
                    key={interest}
                    style={[styles.interestChip, isSelected && styles.interestChipSelected]}
                    onPress={() => {
                      if (isSelected) {
                        setInterests(interests.filter((i) => i !== interest));
                      } else {
                        setInterests([...interests, interest]);
                      }
                    }}
                  >
                    <Text style={[styles.interestChipText, isSelected && styles.interestChipTextSelected]}>{interest}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        );
      case 2:
        return (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Tell us about yourself</Text>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              placeholder="What's your name?"
              value={name}
              onChangeText={setName}
            />
            <Text style={styles.label}>About Me</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="What are you passionate about?"
              value={bio}
              onChangeText={setBio}
              multiline
            />
            <Text style={styles.label}>Occupation</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Student, Designer"
              value={occupation}
              onChangeText={setOccupation}
            />
          </View>
        );
      case 3:
        return (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Leisure and Fun</Text>
            <Text style={styles.label}>Hobbies</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="What are your hobbies?"
              value={hobbies}
              onChangeText={setHobbies}
              multiline
            />
            <Text style={styles.label}>Music Taste</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Pop, Rock"
              value={musicTaste}
              onChangeText={setMusicTaste}
            />
            <Text style={styles.label}>Favorite Musician</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Ed Sheeran"
              value={favMusician}
              onChangeText={setFavMusician}
            />
          </View>
        );
      case 4:
        return (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Daily Habits</Text>
            <Text style={styles.label}>Daily Phone Usage (Hours)</Text>
            <TextInput style={styles.input} value={phoneUsage} onChangeText={setPhoneUsage} placeholder="e.g., 3-4 hours" />
            <Text style={styles.label}>Indoor Activity Time (Hours)</Text>
            <TextInput style={styles.input} value={indoorTime} onChangeText={setIndoorTime} placeholder="e.g., 1-2 hours" />
            <Text style={styles.label}>Outdoor Activity Time (Hours)</Text>
            <TextInput style={styles.input} value={outdoorTime} onChangeText={setOutdoorTime} placeholder="e.g., 2-3 hours" />
          </View>
        );
      case 5:
        return (
            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Personality & Preferences</Text>
                <Text style={styles.label}>Personality Type</Text>
                <TextInput style={styles.input} value={personality} onChangeText={setPersonality} placeholder="e.g., Introvert" />
 
                <Text style={styles.label}>Favorite Movie Genre</Text>
                <TextInput style={styles.input} value={movieGenre} onChangeText={setMovieGenre} placeholder="e.g., Sci-Fi" />
                <Text style={styles.label}>Likes to Travel?</Text>
                <View style={styles.choiceContainer}>
                    <TouchableOpacity style={styles.choiceItem} onPress={() => setLikesToTravel(true)}>
                        <Icon name={likesToTravel === true ? 'check-circle' : 'circle'} size={24} color={likesToTravel === true ? '#3B82F6' : '#9CA3AF'} />
                        <Text style={styles.choiceItemText}>Yes</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.choiceItem} onPress={() => setLikesToTravel(false)}>
                        <Icon name={likesToTravel === false ? 'check-circle' : 'circle'} size={24} color={likesToTravel === false ? '#3B82F6' : '#9CA3AF'} />
                        <Text style={styles.choiceItemText}>No</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
      case 6:
        return (
            <View style={styles.card}>
                <Text style={styles.sectionTitle}>What are your goals?</Text>
                {goals.map((goal) => (
                    <View key={goal} style={styles.goalItem}>
                        <Text style={styles.goalText}>{goal}</Text>
                        <TouchableOpacity onPress={() => handleRemoveGoal(goal)}>
                            <Icon name="trash-2" size={18} color="#EF4444" />
                        </TouchableOpacity>
                    </View>
                ))}
                <View style={styles.addInputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Add a new goal..."
                        value={newGoal}
                        onChangeText={setNewGoal}
                    />
                    <TouchableOpacity style={styles.addButton} onPress={handleAddGoal}>
                        <Icon name="plus" size={20} color="white" />
                    </TouchableOpacity>
                </View>
            </View>
        );
      case 7:
        return (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Profile Picture</Text>
            <View style={styles.profileImageContainer}>
              <Image
                source={
                  profileImage
                    ? profileImage.startsWith('http')
                      ? { uri: profileImage }
                      : { uri: profileImage }
                    : require('../assets/images/default_profile.jpg')
                }
                style={styles.profileImage}
              />
              <TouchableOpacity style={styles.changePhotoButton} onPress={handlePickImage}>
                <Text style={styles.changePhotoText}>Change Photo</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      default:
        return null;
    }
  };
 
  return (
    <LinearGradient colors={['#f0e6ff', '#d8e2ff', '#e0f7ff']} style={styles.backgroundGradient}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{isEditMode ? 'Edit Profile' : 'Tell Us About Yourself'}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('BottomTabNavigator')}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>
 
        <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${(currentStep / totalSteps) * 100}%` }]} />
        </View>
 
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {renderStepContent()}
 
          {/* ================================================= */}
          {/* CHANGE 1: NAVIGATION BUTTONS MOVED HERE           */}
          {/* ================================================= */}
          <View style={styles.navigationButtons}>
            {currentStep > 1 && (
              <TouchableOpacity style={styles.navButton} onPress={prevStep}>
                <Text style={styles.navButtonText}>Back</Text>
              </TouchableOpacity>
            )}
            {currentStep < totalSteps ? (
              <TouchableOpacity style={[styles.navButton, styles.nextButton]} onPress={nextStep}>
                <Text style={[styles.navButtonText, styles.nextButtonText]}>Next</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={[styles.navButton, styles.nextButton]} onPress={handleSave}>
                <Text style={[styles.navButtonText, styles.nextButtonText]}>{isEditMode ? 'Save' : 'Finish'}</Text>
              </TouchableOpacity>
            )}
          </View>
 
        </ScrollView>
 
      </SafeAreaView>
    </LinearGradient>
  );
};
 
const styles = StyleSheet.create({
    backgroundGradient: { flex: 1 },
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 10,
        paddingBottom: 10,
    },
    headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#1F2937' },
    skipText: { fontSize: 16, color: '#6B7280' },
    progressBarContainer: {
        height: 8,
        backgroundColor: '#E5E7EB',
        marginHorizontal: 20,
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: 10,
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#3B82F6',
        borderRadius: 4,
    },
    scrollContent: { paddingBottom: 30 }, // Reduced paddingBottom
    card: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        marginHorizontal: 20,
        marginTop: 20,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    sectionTitle: { fontSize: 18, fontWeight: '600', color: '#1F2937', marginBottom: 15 },
    label: { fontSize: 15, fontWeight: '500', color: '#374151', marginTop: 10, marginBottom: 5 },
    input: {
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
        paddingHorizontal: 15,
        paddingVertical: 12,
        fontSize: 16,
        color: '#111827',
        marginBottom: 10,
    },
    textArea: { height: 100, textAlignVertical: 'top' },
    interestsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    interestChip: {
        backgroundColor: '#E5E7EB',
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        margin: 5,
    },
    interestChipSelected: {
        backgroundColor: '#3B82F6',
    },
    interestChipText: {
        color: '#374151',
        fontWeight: '500',
    },
    interestChipTextSelected: {
        color: 'white',
    },
    choiceContainer: { flexDirection: 'row', marginTop: 8 },
    choiceItem: { flexDirection: 'row', alignItems: 'center', marginRight: 30 },
    choiceItemText: { fontSize: 16, marginLeft: 8, color: '#374151' },
    goalItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
    goalText: { fontSize: 15, color: '#374151' },
    addInputContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
    addButton: { backgroundColor: '#3B82F6', padding: 12, borderRadius: 15, marginLeft: 10 },
    profileImageContainer: { alignItems: 'center', marginTop: 20 },
    profileImage: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#E5E7EB' },
    changePhotoButton: { marginTop: 15, paddingHorizontal: 20, paddingVertical: 8, backgroundColor: '#3B82F6', borderRadius: 20 },
    changePhotoText: { color: 'white', fontWeight: '600', fontSize: 16 },
    // ================================================= */}
    // CHANGE 2: STYLE OBJECT MODIFIED HERE               */}
    // ================================================= */}
    navigationButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginTop: 30, // Added margin to create space from the card
    },
    navButton: {
        backgroundColor: '#E5E7EB',
        paddingVertical: 15,
        borderRadius: 25,
        alignItems: 'center',
        width: '48%',
    },
    nextButton: {
        backgroundColor: '#3B82F6',
    },
    navButtonText: {
        color: '#1F2937',
        fontSize: 16,
        fontWeight: 'bold',
    },
    nextButtonText: {
        color: 'white',
    },
});
 
export default EditProfileScreen;
