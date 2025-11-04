// mobile/src/screens/Auth/OtpVerificationScreen.tsx

import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Text, TextInput, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { ScreenTitle, Body } from '../components/common/StyledText';
import { GradientButton } from '../components/interactive/GradientButton';
import { colors } from '../theme/color';
import { RouteProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define params type
type OtpVerificationParams = {
  OtpVerificationScreen: {
    name: string;
    email: string;
    password: string;
    zipCode: string;
    gender: string;
  };
};


const OTP_LENGTH = 4;
// const LOCAL_IP = '192.168.6.197';
// const BASE_URL = `http://${LOCAL_IP}:5000`;
import { BASE_URL } from '@env';

const OtpVerificationScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [otp, setOtp] = useState<string[]>(new Array(OTP_LENGTH).fill(''));
  const [resendCooldown, setResendCooldown] = useState(30);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    if (resendCooldown === 0) return;
    const timer = setInterval(() => setResendCooldown(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleOtpChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    if (text && index < OTP_LENGTH - 1) inputRefs.current[index + 1]?.focus();
  };

  const handleBackspace = (event: any, index: number) => {
    if (event.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

// const handleVerifyOtp = async () => {
//   const enteredOtp = otp.join('');
//   if (enteredOtp.length !== OTP_LENGTH) {
//     Alert.alert('Incomplete Code', 'Please enter the full OTP code.');
//     return;
//   }

//   try {
//     // ✅ Explicitly ensure code is sent as a string
//     const verifyResponse = await fetch(`${BASE_URL}/api/auth/verify-otp`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ 
//         email: String(route.params.email), 
//         code: String(enteredOtp) // Explicitly convert to string
//       }),
//     });

//     const verifyResult = await verifyResponse.json();
//     if (!verifyResponse.ok) throw new Error(verifyResult.message || 'OTP verification failed');

//     const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

//     const { name, email, password, zipCode, gender } = route.params;
//     const signupResponse = await fetch(`${BASE_URL}/api/auth/signup`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ 
//         name: String(name), 
//         email: String(email), 
//         password: String(password), 
//         zip_code: String(zipCode), // Note: backend expects zip_code
//         gender: String(gender), 
//         timezone: userTimeZone 
//       }),
//     });

//     const signupResult = await signupResponse.json();
//     if (!signupResponse.ok) throw new Error(signupResult.message || 'User creation failed');

//     await AsyncStorage.setItem('token', signupResult.token);
//     await AsyncStorage.setItem('user', JSON.stringify(signupResult.user));
//     await AsyncStorage.setItem('userId', String(signupResult.user.id)); // Ensure string

//     Alert.alert('Success', 'Your account has been created!', [
//       { text: 'OK', onPress: () => navigation.reset({ index: 0, routes: [{ name: 'EditProfileScreen' }] }) },
//     ]);
//   } catch (err: any) {
//     console.error('Verification error:', err); // Add logging
//     Alert.alert('Error', err.message);
//   }
// };
const handleVerifyOtp = async () => {
  const enteredOtp = otp.join('');
  if (enteredOtp.length !== OTP_LENGTH) {
    Alert.alert('Incomplete Code', 'Please enter the full OTP code.');
    return;
  }

  try {
    // ✅ Step 1: Verify OTP first
    const verifyResponse = await fetch(`${BASE_URL}/api/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        email: String(route.params.email), 
        code: String(enteredOtp) 
      }),
    });

    const verifyResult = await verifyResponse.json();
    
    // ✅ If OTP verification fails, stop here
    if (!verifyResponse.ok) {
      throw new Error(verifyResult.message || 'OTP verification failed');
    }

    // ✅ Step 2: Only create user after successful OTP verification
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const { name, email, password, zipCode, gender } = route.params;
    
    const signupResponse = await fetch(`${BASE_URL}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        name: String(name), 
        email: String(email), 
        password: String(password), 
        zip_code: String(zipCode), 
        gender: String(gender), 
        timezone: userTimeZone 
      }),
    });

    const signupResult = await signupResponse.json();
    
    // ✅ If signup fails, show error
    if (!signupResponse.ok) {
      throw new Error(signupResult.message || 'User creation failed');
    }

    // ✅ Store authentication data
    await AsyncStorage.setItem('token', signupResult.token);
    await AsyncStorage.setItem('user', JSON.stringify(signupResult.user));
    await AsyncStorage.setItem('userId', String(signupResult.user.id));

    Alert.alert('Success', 'Your account has been created!', [
      { 
        text: 'OK', 
        onPress: () => navigation.reset({ 
          index: 0, 
          routes: [{ name: 'EditProfileScreen' }] 
        }) 
      },
    ]);
  } catch (err: any) {
    console.error('Verification/Signup error:', err);
    Alert.alert('Error', err.message || 'Something went wrong');
  }
};

  const handleResendCode = async () => {
  if (resendCooldown > 0) return;
  try {
    await fetch(`${BASE_URL}/api/auth/request-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: route.params.email }),
    });
    setResendCooldown(30);
    Alert.alert('OTP Sent', 'A new OTP has been sent to your email.');
  } catch (err) {
    Alert.alert('Error', 'Failed to resend OTP.');
  }
};


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Icon name="shield-checkmark-outline" size={80} color={colors.gradient.cool[0]} />
        </View>

        <ScreenTitle style={styles.title}>Verification Code</ScreenTitle>
        <Body style={styles.subtitle}>
          Please enter the 4-digit code sent to your email address.
        </Body>

        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={ref => (inputRefs.current[index] = ref)}
              style={styles.otpInput}
              keyboardType="number-pad"
              maxLength={1}
              onChangeText={text => handleOtpChange(text, index)}
              onKeyPress={event => handleBackspace(event, index)}
              value={digit}
            />
          ))}
        </View>

        <GradientButton title="VERIFY" onPress={handleVerifyOtp} />

        <View style={styles.resendContainer}>
          <Body>Didn't receive the code? </Body>
          <TouchableOpacity onPress={handleResendCode} disabled={resendCooldown > 0}>
            <Text style={[styles.resendText, resendCooldown > 0 && styles.resendDisabled]}>
              {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background.primary },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E0F7FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  title: { textAlign: 'center', marginBottom: 10 },
  subtitle: { textAlign: 'center', marginBottom: 40, color: colors.text.secondary, paddingHorizontal: 20 },
  otpContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '80%', marginBottom: 40 },
  otpInput: {
    width: 60,
    height: 60,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 15,
    textAlign: 'center',
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: colors.text.primary,
    backgroundColor: 'white',
  },
  resendContainer: { flexDirection: 'row', marginTop: 30 },
  resendText: {
    fontFamily: 'Inter-SemiBold',
    color: colors.gradient.cool[0],
    textDecorationLine: 'underline',
  },
  resendDisabled: { color: colors.text.secondary, textDecorationLine: 'none' },
});

export default OtpVerificationScreen;

