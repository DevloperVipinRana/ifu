import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  StatusBar,
  Alert,
  Modal,
  ScrollView,
  Platform,
  ActivityIndicator,
} from 'react-native';
// REMOVED: No longer need LinearGradient for the background
// import LinearGradient from 'react-native-linear-gradient';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AnimatedLoginBackground from '../components/common/AnimatedLoginBackground';
import { BlurView } from '@react-native-community/blur';
import LinearGradient from 'react-native-linear-gradient'; // Keep for buttons
import { useEffect } from 'react';
import { RootStackParamList } from '../../App';
import { BASE_URL } from '@env'; 


type SignupScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Signup'>;

const SignupScreen = () => {
  const navigation = useNavigation<SignupScreenNavigationProp>();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [gender, setGender] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const isFocused = useIsFocused();
 
  const [isLoading, setIsLoading] = useState(false);
  const [isScreenReady, setIsScreenReady] = useState(false);
 
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setIsLoading(false);
      setIsScreenReady(true);
    });
    return unsubscribe;
  }, [navigation]);

  // Ensure screen is ready when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsScreenReady(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);
 
// --- NEW: Handler for navigating to the Login screen ---
const handleNavigateToLogin = () => {
  if (isLoading) return;
  setIsLoading(true);
  
  // Immediate navigation without delay
  navigation.navigate('Login');
};
 
  const handleSelectGender = (selectedGender: string) => {
    setGender(selectedGender);
    setModalVisible(false);
  };
 
  
  const handleSignUp = async () => {
    if (!name || !email || !password || !gender) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    if (password.length < 5) {
      Alert.alert("Weak Password", "Password must be at least 5 characters long.");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/auth/request-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Something went wrong');

      console.log('OTP sent:', result);
      Alert.alert('OTP Sent', `Check your email (${email}) for the verification code.`);

      navigation.navigate('OtpVerificationScreen', { name, email, password, zipCode, gender });

    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Sign Up Failed', error instanceof Error ? error.message : 'An unexpected error occurred');
    }
  };

  // Show loading screen if not ready
  if (!isScreenReady) {
    return (
      <View style={[styles.fullScreenContainer, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#ff7e5f" />
      </View>
    );
  }

  return (
    <View style={styles.fullScreenContainer}>
      <StatusBar barStyle="dark-content" />
 
      {/* Layer 1: The animated background. zIndex: -1 places it behind everything. */}
      <AnimatedLoginBackground isFocused={isFocused}/>
 
      {/* Layer 2: The scrollable form content. It has a transparent background. */}
      <SafeAreaView style={styles.contentContainer}>
        <ScrollView
          contentContainerStyle={styles.scrollContentContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.cardContainer}>
            <BlurView
              style={styles.absolute}
              blurType="light"
              blurAmount={10}
            />
            <View style={styles.cardContent}>
              <Image
                source={require('../assets/images/logo.webp')}
                style={styles.logo}
              />
              <Text style={styles.logoText}>IFU</Text>
             
              <Text style={styles.tagline}>JOIN THE COMMUNITY.</Text>
 
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Full Name"
                  placeholderTextColor="#9CA3AF"
                  value={name}
                  onChangeText={setName}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />
                <TextInput
                  style={styles.input}
                  placeholder="ZIP Code"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                  value={zipCode}
                  onChangeText={setZipCode}
                />
                <TouchableOpacity
                  style={styles.genderInput}
                  onPress={() => setModalVisible(true)}>
                  <Text style={gender ? styles.inputText : styles.placeholderText}>
                    {gender || 'Gender'}
                  </Text>
                </TouchableOpacity>
              </View>
 
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.buttonWrapper}
                  onPress={handleSignUp}
                >
                  <LinearGradient
                    colors={['#ffc3a0', '#ff7e5f']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.gradientButton}>
                    <Text style={styles.buttonText}>SIGN UP</Text>
                  </LinearGradient>
                </TouchableOpacity>
 
                <TouchableOpacity
                  style={styles.buttonWrapper}
                  onPress={handleNavigateToLogin}
                >
                  <LinearGradient
                    colors={['#89f7fe', '#66a6ff']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.gradientButton}>
                    <Text style={styles.buttonText}>LOGIN</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
 
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalCenteredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Select Gender</Text>
            {['Male', 'Female', 'Other'].map(option => (
              <TouchableOpacity
                key={option}
                style={styles.modalOption}
                onPress={() => handleSelectGender(option)}>
                <Text style={styles.modalOptionText}>{option}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={[styles.modalOption, { borderBottomWidth: 0 }]}
              onPress={() => setModalVisible(false)}>
              <Text style={[styles.modalOptionText, { color: 'red' }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
       {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#ff7e5f" />
        </View>
      )}
 
    </View>
  );
};
 
const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    // This background color will be visible behind the animation
    backgroundColor: '#f0e6ff',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: 'transparent', // The form container must be transparent
  },
  scrollContentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingOverlay: {
  ...StyleSheet.absoluteFillObject,
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
},
  cardContainer: {
    width: '90%',
    borderRadius: 25,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  cardContent: {
    backgroundColor: 'transparent',
    padding: 35,
    alignItems: 'center',
  },
  logo: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  logoText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 10,
  },
  tagline: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 30,
    letterSpacing: 1,
  },
  inputContainer: {
    width: '100%',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    paddingVertical: Platform.OS === 'ios' ? 15 : 12,
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#111827',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  genderInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    paddingVertical: Platform.OS === 'ios' ? 15 : 12,
    paddingHorizontal: 20,
    marginBottom: 15,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
    minHeight: 50,
  },
  placeholderText: {
    color: '#9CA3AF',
    fontSize: 16,
  },
  inputText: {
    color: '#111827',
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 15,
  },
  buttonWrapper: {
    flex: 1,
    marginHorizontal: 5,
  },
  gradientButton: {
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalCenteredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    width: '80%',
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1F2937',
  },
  modalOption: {
    width: '100%',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    alignItems: 'center',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#374151',
  },
});
 
export default SignupScreen;
