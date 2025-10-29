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
      formData.append('ageGroup', ageGroup);
      formData.append('address', address);
      formData.append('hobbies', hobbies);
      formData.append('musicTaste', musicTaste);
      formData.append('favMusician', favMusician);
      formData.append('favSports', favSports);
      formData.append('indoorTime', indoorTime);
      formData.append('outdoorTime', outdoorTime);
      formData.append('favWork', favWork);
      formData.append('favPlace', favPlace);
      formData.append('personality', personality);
      formData.append('movieGenre', movieGenre);
 
      if (likesToTravel !== null && likesToTravel !== undefined) {
        formData.append('likesToTravel', likesToTravel ? 'true' : 'false');
      }
 
      formData.append('profileCompleted', 'true');
 
      interests.forEach((i) => formData.append('interests[]', i));
      goals.forEach((g) => formData.append('goals[]', g));
 
      if (profileImage && !profileImage.startsWith('http')) {
        formData.append('profileImage', {
          uri: profileImage,
          type: 'image/jpeg',
          name: 'profile.jpg',
        });
      }
      
      const response = await fetch(`${BASE_URL}/api/auth/profile`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
 
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to update profile');
 
      Alert.alert('Success', 'Profile updated successfully!');
      navigation.navigate('BottomTabNavigator');
    } catch (error) {
      console.error(error);
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




// // src/screens/EditProfileScreen.jsx
// import React, { useState } from 'react';
// import {
//   SafeAreaView,
//   StyleSheet,
//   Text,
//   View,
//   StatusBar,
//   TouchableOpacity,
//   ScrollView,
//   TextInput,
//   Alert,
//   Image,
//   Platform,
// } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';
// import Icon from 'react-native-vector-icons/Feather';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { NativeStackScreenProps } from '@react-navigation/native-stack';
// import { RootStackParamList } from '../../App';
// import Selectionmodal from '../components/common/Selectionmodal';
// import { launchImageLibrary } from 'react-native-image-picker';
// import { BASE_URL } from '@env';

// type Props = NativeStackScreenProps<RootStackParamList, 'EditProfileScreen'>;

// const EditProfileScreen = ({ route, navigation }: Props) => {
//   const isEditMode = route.params?.currentUser;
//   const currentUser = route.params?.currentUser || {};

//   const [bio, setBio] = useState(currentUser.bio || '');
//   const [interests, setInterests] = useState(currentUser.interests || []);
//   const [goals, setGoals] = useState(currentUser.goals || []);
//   const [occupation, setOccupation] = useState(currentUser.occupation || '');
//   const [ageGroup, setAgeGroup] = useState(currentUser.ageGroup || '');
//   const [address, setAddress] = useState(currentUser.address || '');
//   const [newInterest, setNewInterest] = useState('');
//   const [newGoal, setNewGoal] = useState('');
//   const [hobbies, setHobbies] = useState(currentUser.hobbies || '');
//   const [musicTaste, setMusicTaste] = useState(currentUser.musicTaste || '');
//   const [phoneUsage, setPhoneUsage] = useState(currentUser.phoneUsage || '');
//   const [favMusician, setFavMusician] = useState(currentUser.favMusician || '');
//   const [favSports, setFavSports] = useState(currentUser.favSports || '');
//   const [indoorTime, setIndoorTime] = useState(currentUser.indoorTime || '');
//   const [outdoorTime, setOutdoorTime] = useState(currentUser.outdoorTime || '');
//   const [favWork, setFavWork] = useState(currentUser.favWork || '');
//   const [favPlace, setFavPlace] = useState(currentUser.favPlace || '');
//   const [personality, setPersonality] = useState(currentUser.personality || '');
//   const [movieGenre, setMovieGenre] = useState(currentUser.movieGenre || '');
//   // const [likesToTravel, setLikesToTravel] = useState(currentUser.likesToTravel ?? null);
//   const [likesToTravel, setLikesToTravel] = useState<boolean | undefined>(currentUser.likesToTravel);


//   const [modalVisible, setModalVisible] = useState(false);
//   const [modalData, setModalData] = useState({ title: '', options: [], onSelect: () => {} });

//   const [profileImage, setProfileImage] = useState(currentUser.profileImage || null);
//   const [interestsDropdownVisible, setInterestsDropdownVisible] = useState(false);

//   const handlePickImage = () => {
//     launchImageLibrary({ mediaType: 'photo' }, (response) => {
//       if (response.didCancel) return;
//       if (response.errorCode) {
//         Alert.alert('Error', response.errorMessage || 'Image picker error');
//         return;
//       }
//       if (response.assets && response.assets.length > 0) {
//         setProfileImage(response.assets[0].uri);
//       }
//     });
//   };

//   const handleAddInterest = () => {
//     if (newInterest && !interests.includes(newInterest)) setInterests([...interests, newInterest]);
//     setNewInterest('');
//   };

//   const handleRemoveInterest = (interest: string) =>
//     setInterests(interests.filter((i) => i !== interest));

//   const handleAddGoal = () => {
//     if (newGoal && !goals.includes(newGoal)) setGoals([...goals, newGoal]);
//     setNewGoal('');
//   };

//   const handleRemoveGoal = (goal: string) => setGoals(goals.filter((g) => g !== goal));

//   const openModal = (title, options, onSelect) => {
//     setModalData({ title, options, onSelect });
//     setModalVisible(true);
//   };

//   const handleSave = async () => {
//     try {
//       const token = await AsyncStorage.getItem('token');
//       if (!token) {
//         Alert.alert('Error', 'No token found. Please login again.');
//         navigation.navigate('Login');
//         return;
//       }

//       const formData = new FormData();
//       formData.append('bio', bio);
//       formData.append('occupation', occupation);
//       formData.append('ageGroup', ageGroup);
//       formData.append('address', address);
//       formData.append('hobbies', hobbies);
//       formData.append('musicTaste', musicTaste);
//       formData.append('favMusician', favMusician);
//       formData.append('favSports', favSports);
//       formData.append('indoorTime', indoorTime);
//       formData.append('outdoorTime', outdoorTime);
//       formData.append('favWork', favWork);
//       formData.append('favPlace', favPlace);
//       formData.append('personality', personality);
//       formData.append('movieGenre', movieGenre);
//       // formData.append('likesToTravel', likesToTravel);
//       if (likesToTravel !== null && likesToTravel !== undefined) {
//   formData.append('likesToTravel', likesToTravel ? 'true' : 'false');
// }

//       formData.append('profileCompleted', 'true');

//       interests.forEach((i) => formData.append('interests[]', i));
//       goals.forEach((g) => formData.append('goals[]', g));

//       if (profileImage && !profileImage.startsWith('http')) {
//         formData.append('profileImage', {
//           uri: profileImage,
//           type: 'image/jpeg',
//           name: 'profile.jpg',
//         });
//       }

//       const response = await fetch(`${BASE_URL}/api/auth/profile`, {
//         method: 'PUT',
//         headers: { Authorization: `Bearer ${token}` },
//         body: formData,
//       });

//       const data = await response.json();
//       if (!response.ok) throw new Error(data.message || 'Failed to update profile');

//       Alert.alert('Success', 'Profile updated successfully!');
//       navigation.navigate('BottomTabNavigator');
//     } catch (error) {
//       console.error(error);
//       Alert.alert('Error', error instanceof Error ? error.message : 'Something went wrong');
//     }
//   };

//   return (
//     <LinearGradient colors={['#f0e6ff', '#d8e2ff', '#e0f7ff']} style={styles.backgroundGradient}>
//       <StatusBar barStyle="dark-content" />
//       <SafeAreaView style={styles.container}>
//         {/* Header */}
//         <View style={styles.header}>
//           {isEditMode ? (
//             <TouchableOpacity onPress={() => navigation.goBack()}>
//               <Icon name="x" size={26} color="#374151" />
//             </TouchableOpacity>
//           ) : (
//             <TouchableOpacity onPress={() => navigation.navigate('BottomTabNavigator')}>
//               <Text style={styles.skipText}>Skip</Text>
//             </TouchableOpacity>
//           )}

//           <Text style={styles.headerTitle}>{isEditMode ? 'Edit Profile' : 'Tell Us About Yourself'}</Text>

//           <TouchableOpacity onPress={handleSave}>
//             <Text style={styles.saveText}>{isEditMode ? 'Save' : 'Continue'}</Text>
//           </TouchableOpacity>
//         </View>

//         <ScrollView contentContainerStyle={styles.scrollContent}>
//           {/* Profile Image */}
//           <View style={styles.profileImageContainer}>
//             <Image
//               source={
//                 profileImage
//                   ? profileImage.startsWith('http')
//                     ? { uri: `${BASE_URL}${profileImage}` }
//                     : { uri: profileImage }
//                   : require('../assets/images/default_profile.jpg')
//               }
//               style={styles.profileImage}
//             />
//             <TouchableOpacity style={styles.changePhotoButton} onPress={handlePickImage}>
//               <Text style={styles.changePhotoText}>Change Photo</Text>
//             </TouchableOpacity>
//           </View>

//           {/* About Me & Occupation & Age & Address */}
//           <View style={styles.card}>
//             <Text style={styles.label}>About Me</Text>
//             <TextInput
//               style={[styles.input, styles.textArea]}
//               placeholder="What are you passionate about?"
//               value={bio}
//               onChangeText={setBio}
//               multiline
//             />

//             <Text style={styles.label}>Occupation</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="e.g., Student, Designer"
//               value={occupation}
//               onChangeText={setOccupation}
//             />

//             <Text style={styles.label}>Age Group</Text>
//             <TouchableOpacity
//               style={styles.input}
//               onPress={() =>
//                 openModal(
//                   'Select Age Group',
//                   ['Under 18', '18-24', '25-34', '35-44', '45-54', '55+'],
//                   setAgeGroup
//                 )
//               }
//             >
//               <Text style={ageGroup ? styles.inputText : styles.placeholderText}>
//                 {ageGroup || 'Select your age group'}
//               </Text>
//             </TouchableOpacity>

//             <Text style={styles.label}>Address (Optional)</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="e.g., San Francisco, CA"
//               value={address}
//               onChangeText={setAddress}
//             />
            
//             {/* Interests */}
//             <View style={{ marginTop: 20 }}>
//   <TouchableOpacity
//     style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
//     onPress={() => setInterestsDropdownVisible(!interestsDropdownVisible)}
//   >
//     <Text style={styles.sectionTitle}>My Interests</Text>
//     <Icon name={interestsDropdownVisible ? 'chevron-up' : 'chevron-down'} size={20} />
//   </TouchableOpacity>

//   {/* Selected tags preview */}
//   <ScrollView
//     horizontal
//     showsHorizontalScrollIndicator={false}
//     contentContainerStyle={{ paddingVertical: 8 }}
//   >
//     {interests.map((i) => (
//       <View key={i} style={styles.tag}>
//         <Text style={styles.tagText}>{i}</Text>
//         <TouchableOpacity onPress={() => handleRemoveInterest(i)}>
//           <Icon name="x" size={14} color="#0284C7" style={{ marginLeft: 6 }} />
//         </TouchableOpacity>
//       </View>
//     ))}
//   </ScrollView>

//   {interestsDropdownVisible && (
//     <View style={{ marginTop: -10 }}>
//       <ScrollView
//         style={{
//           height: 150, // ✅ Fixed height instead of maxHeight
//           borderWidth: 1,
//           borderColor: '#E5E7EB',
//           borderRadius: 10,
//           padding: 5,
//         }}
//         nestedScrollEnabled={true} // ✅ Enable inner scroll
//       >
//         {[
//           'Fitness',
//           'Yoga',
//           'Meditation',
//           'Art',
//           'Music',
//           'Tech',
//           'Sports',
//           'Travel',
//           'Cooking',
//           'Reading',
//           'Gaming',
//           'Photography',
//         ].map((option) => {
//           const selected = interests.includes(option);
//           return (
//             <TouchableOpacity
//               key={option}
//               style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 6 }}
//               onPress={() =>
//                 selected
//                   ? setInterests(interests.filter((i) => i !== option))
//                   : setInterests([...interests, option])
//               }
//             >
//               <Icon
//                 name={selected ? 'check-square' : 'square'}
//                 size={18}
//                 color={selected ? '#3B82F6' : '#9CA3AF'}
//               />
//               <Text style={{ marginLeft: 8 }}>{option}</Text>
//             </TouchableOpacity>
//           );
//         })}
//       </ScrollView>

//       {/* Custom interest input */}
//       <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
//         <TextInput
//           style={[styles.input, { flex: 1, marginRight: 8 }]}
//           placeholder="Add custom interest..."
//           value={newInterest}
//           onChangeText={setNewInterest}
//         />
//         <TouchableOpacity onPress={handleAddInterest}>
//           <Icon name="plus-circle" size={24} color="#3B82F6" />
//         </TouchableOpacity>
//       </View>
//     </View>
//   )}
// </View>


//             {/* Goals */}
//             <View style={{ marginTop: 0 }}>
//               <Text style={styles.sectionTitle}>Main Goals</Text>
//               {goals.map((goal) => (
//                 <View key={goal} style={styles.goalItem}>
//                   <Text style={styles.goalText}>{goal}</Text>
//                   <TouchableOpacity onPress={() => handleRemoveGoal(goal)}>
//                     <Icon name="trash-2" size={18} color="#EF4444" />
//                   </TouchableOpacity>
//                 </View>
//               ))}

//               <View style={styles.addInputContainer}>
//                 <TextInput
//                   style={styles.input}
//                   placeholder="Add a new goal..."
//                   value={newGoal}
//                   onChangeText={setNewGoal}
//                 />
//                 <TouchableOpacity style={styles.addButton} onPress={handleAddGoal}>
//                   <Icon name="plus" size={20} color="white" />
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </View>

//           {/* Personal Details & Personality */}
//           <View style={styles.card}>
//             <Text style={styles.sectionTitle}>Personal Details</Text>

//             <Text style={styles.label}>Hobbies</Text>
//             <TextInput
//               style={[styles.input, styles.textArea]}
//               placeholder="What are your hobbies?"
//               value={hobbies}
//               onChangeText={setHobbies}
//               multiline
//             />

//             <Text style={styles.label}>Music Taste</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="e.g., Pop, Rock"
//               value={musicTaste}
//               onChangeText={setMusicTaste}
//             />

//             <Text style={styles.label}>Favorite Musician</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="e.g., Ed Sheeran"
//               value={favMusician}
//               onChangeText={setFavMusician}
//             />

//             <Text style={styles.label}>Favorite Sports</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="e.g., Football"
//               value={favSports}
//               onChangeText={setFavSports}
//             />

//             <Text style={styles.label}>Favorite Work to Do</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="e.g., Coding"
//               value={favWork}
//               onChangeText={setFavWork}
//             />

//             <Text style={styles.label}>Favorite Place</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="e.g., New York"
//               value={favPlace}
//               onChangeText={setFavPlace}
//             />

//             <Text style={styles.label}>Daily Phone Usage (Hours)</Text>
//             <TouchableOpacity
//               style={styles.input}
//               onPress={() =>
//                 openModal('Select Phone Usage', ['1-2', '2-3', '3-4', '4-5', '5-6', '6+'], setPhoneUsage)
//               }
//             >
//               <Text style={phoneUsage ? styles.inputText : styles.placeholderText}>
//                 {phoneUsage || 'Select usage hours'}
//               </Text>
//             </TouchableOpacity>

//             <Text style={styles.label}>Indoor Activity Time (Hours)</Text>
//             <TouchableOpacity
//               style={styles.input}
//               onPress={() =>
//                 openModal('Select Indoor Time', ['0-1', '1-2', '2-4', '4+'], setIndoorTime)
//               }
//             >
//               <Text style={indoorTime ? styles.inputText : styles.placeholderText}>
//                 {indoorTime || 'Select activity hours'}
//               </Text>
//             </TouchableOpacity>

//             <Text style={styles.label}>Outdoor Activity Time (Hours)</Text>
//             <TouchableOpacity
//               style={styles.input}
//               onPress={() =>
//                 openModal('Select Outdoor Time', ['0-1', '1-2', '2-4', '4+'], setOutdoorTime)
//               }
//             >
//               <Text style={outdoorTime ? styles.inputText : styles.placeholderText}>
//                 {outdoorTime || 'Select activity hours'}
//               </Text>
//             </TouchableOpacity>
//           </View>

//           {/* Personality */}
//           <View style={styles.card}>
//             <Text style={styles.label}>Personality Type</Text>
//             <TouchableOpacity
//               style={styles.input}
//               onPress={() =>
//                 openModal('Select Personality Type', ['Introvert', 'Extrovert'], setPersonality)
//               }
//             >
//               <Text style={personality ? styles.inputText : styles.placeholderText}>
//                 {personality || 'Select a type'}
//               </Text>
//             </TouchableOpacity>

//             <Text style={styles.label}>Favorite Movie Genre</Text>
//             <TouchableOpacity
//               style={styles.input}
//               onPress={() =>
//                 openModal(
//                   'Select Movie Genre',
//                   ['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Romance'],
//                   setMovieGenre
//                 )
//               }
//             >
//               <Text style={movieGenre ? styles.inputText : styles.placeholderText}>
//                 {movieGenre || 'Select a genre'}
//               </Text>
//             </TouchableOpacity>

//             <Text style={styles.label}>Likes to Travel?</Text>
//             <View style={styles.choiceContainer}>
//               <TouchableOpacity style={styles.choiceItem} onPress={() => setLikesToTravel(true)}>
//                 <Icon
//                   name={likesToTravel === true ? 'check-circle' : 'circle'}
//                   size={24}
//                   color={likesToTravel === true ? '#3B82F6' : '#9CA3AF'}
//                 />
//                 <Text style={styles.choiceItemText}>Yes</Text>
//               </TouchableOpacity>

//               <TouchableOpacity style={styles.choiceItem} onPress={() => setLikesToTravel(false)}>
//                 <Icon
//                   name={likesToTravel === false ? 'check-circle' : 'circle'}
//                   size={24}
//                   color={likesToTravel === false ? '#3B82F6' : '#9CA3AF'}
//                 />
//                 <Text style={styles.choiceItemText}>No</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </ScrollView>

//         <Selectionmodal
//           visible={modalVisible}
//           title={modalData.title}
//           options={modalData.options}
//           onSelect={(selection) => {
//             modalData.onSelect(selection);
//             setModalVisible(false);
//           }}
//           onClose={() => setModalVisible(false)}
//         />
//       </SafeAreaView>
//     </LinearGradient>
//   );
// };

// const styles = StyleSheet.create({
//   backgroundGradient: { flex: 1 },
//   container: { flex: 1, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//   },
//   headerTitle: { fontSize: 20, fontWeight: '600', color: '#1F2937' },
//   saveText: { fontSize: 16, fontWeight: 'bold', color: '#3B82F6' },
//   skipText: { fontSize: 16, color: '#6B7280' },
//   scrollContent: { paddingBottom: 30 },

//   card: {
//     backgroundColor: 'white',
//     borderRadius: 20,
//     padding: 20,
//     marginHorizontal: 20,
//     marginTop: 20,
//     elevation: 5,
//   },
//   sectionTitle: { fontSize: 16, fontWeight: '600', color: '#1F2937', marginBottom: 8 },
//   label: { fontSize: 15, fontWeight: '500', color: '#374151', marginTop: 10, marginBottom: 5 },
//   input: {
//     flex: 1,
//     backgroundColor: '#F3F4F6',
//     borderRadius: 12,
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     fontSize: 15,
//     color: '#111827',
//     marginBottom: 8,
//   },
//   textArea: { height: 100, textAlignVertical: 'top' },
//   tag: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#E0F2FE',
//     borderRadius: 15,
//     paddingVertical: 6,
//     paddingHorizontal: 12,
//     marginRight: 8,
//     marginBottom: 8,
//   },
//   tagText: { color: '#0284C7', fontSize: 12, fontWeight: '500' },
//   addInputContainer: { flexDirection: 'row', alignItems: 'center' },
//   addButton: { backgroundColor: '#3B82F6', padding: 12, borderRadius: 15, marginLeft: 10 },
//   goalItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
//   goalText: { fontSize: 15, color: '#374151' },
//   placeholderText: { color: '#9CA3AF', fontSize: 15 },
//   inputText: { color: '#111827', fontSize: 15 },

//   profileImageContainer: { alignItems: 'center', marginTop: 20 },
//   profileImage: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#E5E7EB' },
//   changePhotoButton: { marginTop: 8, paddingHorizontal: 15, paddingVertical: 6, backgroundColor: '#3B82F6', borderRadius: 20 },
//   changePhotoText: { color: 'white', fontWeight: '600' },

//   choiceContainer: { flexDirection: 'row', marginTop: 8 },
//   choiceItem: { flexDirection: 'row', alignItems: 'center', marginRight: 30 },
//   choiceItemText: { fontSize: 16, marginLeft: 8, color: '#374151' },
// });

// export default EditProfileScreen;
