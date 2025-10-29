 import React, { useState , useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AnimatedLoginBackground from '../components/common/AnimatedLoginBackground';
import { BlurView } from '@react-native-community/blur';
import { useIsFocused } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '@env';
import { RootStackParamList } from '../../App';
 
type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

const LoginScreen = ({ navigation }: { navigation: LoginScreenNavigationProp }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const isFocused = useIsFocused();

  const [isNavigating, setIsNavigating] = useState(false);
  const [isScreenReady, setIsScreenReady] = useState(false);
 
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setIsNavigating(false);
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
 
const handleNavigateToSignup = () => {
  if (isNavigating) return;
  setIsNavigating(true);
  
  // Immediate navigation without delay
  navigation.navigate('Signup');
};
  
  const handleLogin = async () => {
    console.log('BASE_URL=', BASE_URL);
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }
  
    const userData = {
      email,
      password
    }
    try {
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        throw new Error(result.message || 'Login failed');
      }
  
      console.log('Login Success:', result);
      Alert.alert('Success', 'Welcome Back');
      
      await AsyncStorage.setItem('token', result.token);
      await AsyncStorage.setItem('userId', result.user.id); // Use 'id' not '_id'
  
      if (result.user.profileCompleted) {
        navigation.navigate("BottomTabNavigator");
      } else {
        navigation.navigate("EditProfileScreen", { currentUser: result.user });
      }
  
    } catch (error) {
      console.error('Login Error:', error);
      Alert.alert('Login Failed', error instanceof Error ? error.message : 'An unexpected error occurred');
    }
  };
  


  // Show loading screen if not ready
  if (!isScreenReady) {
    return (
      <View style={[styles.fullScreenContainer, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#66a6ff" />
      </View>
    );
  }

  return (
    <View style={styles.fullScreenContainer}>
      {/* The animated background is now a true background */}
      <AnimatedLoginBackground isFocused={isFocused}/>
 
      {/* The gradient is now an overlay on top of the animation */}
      <LinearGradient
        colors={['#f0e6ff', '#d8e2ff', '#e0f7ff']}
         // Use a new overlay style
      />
 
      <StatusBar barStyle="dark-content" />
 
      {/* The main content is now the top-most layer */}
      <SafeAreaView style={styles.container}>
    {/* The cardContainer is now the glass background */}
    <View style={styles.cardContainer}>
        <BlurView
            style={styles.absolute}
            blurType="light"
            blurAmount={10}
        />
        {/* All content goes inside a single container on top of the blur */}
        <View style={styles.cardContent}>
            <Image
                source={require('../assets/images/logo.webp')}
                style={styles.logo}
            />
            <Text style={styles.logoText}>IFU</Text>
           
            <Text style={styles.tagline}>THE ONLY LIMIT IS YOU.</Text>
 
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={text => setEmail(text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry
                    value={password}
                    onChangeText={text => setPassword(text)}
                />
            </View>
 
            <View style={styles.buttonContainer}>
                 <TouchableOpacity style={styles.buttonWrapper} onPress={handleLogin}>
                <LinearGradient
                  colors={['#89f7fe', '#66a6ff']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.gradientButton}>
                  <Text style={styles.buttonText}>LOGIN</Text>
                </LinearGradient>
              </TouchableOpacity>
 
              <TouchableOpacity
                style={styles.buttonWrapper}
                onPress={handleNavigateToSignup}
              >
                <LinearGradient
                  colors={['#ffc3a0', '#ff7e5f']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.gradientButton}>
                  <Text style={styles.buttonText}>SIGNUP</Text>
                </LinearGradient>
              </TouchableOpacity>
 
            </View>
        </View>
    </View>
</SafeAreaView>
{isNavigating && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#ff7e5f" />
        </View>
      )}
    </View>
  );
};
 
const styles = StyleSheet.create({
 
 
  cardContent: {
    backgroundColor: 'transparent', // CRITICAL: Content must have a transparent background
    padding: 35,
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
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
    paddingVertical: 15,
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#111827',
    marginBottom: 15,
    // Subtle shadow for inputs
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 15,
  },
  buttonWrapper: {
    flex: 1, // Each button takes up half the space
    marginHorizontal: 5,
  },
  gradientButton: {
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: 'center',
    // Shadow for buttons
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
  fullScreenContainer: {
    flex: 1,
    backgroundColor: '#f0e6ff', // A base background color
  },
 
  // Change backgroundGradient to an overlay
 cardContainer: {
    width: '90%',
    borderRadius: 25,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
},
 
  // This is the new style for the BlurView itself
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
 
  // Make the main container's background transparent
  container: {
    flex: 1,
    justifyContent: 'center', // This does the vertical centering
    alignItems: 'center',    // This does the horizontal centering
    backgroundColor: 'transparent',
},
 
});
 
export default LoginScreen;