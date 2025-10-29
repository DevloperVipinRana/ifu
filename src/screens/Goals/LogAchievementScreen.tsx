import React, { useState } from 'react';
import { View, StyleSheet, Text, TextInput, Alert, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { launchImageLibrary } from 'react-native-image-picker';

import { ScreenTitle } from '../../components/common/StyledText';
import { GradientButton } from '../../components/interactive/GradientButton';
import { colors } from '../../theme/color';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '@env';

const LogAchievementScreen = () => {
  const navigation = useNavigation();
  const [achievementText, setAchievementText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleSelectImage = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
        Alert.alert('Error', 'Could not select image. Please check permissions.');
      } else if (response.assets && response.assets[0].uri) {
        setSelectedImage(response.assets[0].uri);
      }
    });
  };


  const handlePostAchievement = async () => {
  if (achievementText.trim().length < 3) {
    Alert.alert('Describe Your Win!', 'Please write a short description.');
    return;
  }

  try {
    const token = await AsyncStorage.getItem('token'); // assuming you store JWT here
    const formData = new FormData();
    formData.append('achievementText', achievementText);

    if (selectedImage) {
      formData.append('image', {
        uri: selectedImage,
        type: 'image/jpeg',
        name: `achievement_${Date.now()}.jpg`,
      });
    }

    const response = await fetch(`${BASE_URL}/api/icompleted`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();
    if (response.ok) {
      Alert.alert('Achievement Logged!', 'Congratulations!', [
        { text: 'Awesome!', onPress: () => navigation.goBack() },
      ]);
      setAchievementText('');
      setSelectedImage(null);
    } else {
      Alert.alert('Error', data.message || 'Something went wrong.');
    }
  } catch (err) {
    console.error(err);
    Alert.alert('Error', 'Could not post your achievement.');
  }
};


  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Icon name="close" size={28} color={colors.text.primary} />
            </TouchableOpacity>
            <ScreenTitle style={styles.title}>Log Your Achievement</ScreenTitle>
            <View style={{width: 28}} /> 
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
            <TextInput
                style={styles.input}
                placeholder="What did you accomplish today?"
                placeholderTextColor={colors.text.secondary}
                multiline={true}
                value={achievementText}
                onChangeText={setAchievementText}
                autoFocus={true}
            />
            
            {selectedImage ? (
                <View style={styles.imagePreviewContainer}>
                    <Image source={{ uri: selectedImage }} style={styles.imagePreview} />
                    <TouchableOpacity style={styles.removeImageButton} onPress={() => setSelectedImage(null)}>
                        <Icon name="close-circle" size={32} color={colors.system.warning} />
                    </TouchableOpacity>
                </View>
            ) : (
                <TouchableOpacity style={styles.addImageButton} onPress={handleSelectImage}>
                    <Icon name="camera-outline" size={32} color={colors.text.secondary} />
                    <Text style={styles.addImageText}>Add a Photo</Text>
                </TouchableOpacity>
            )}
        </ScrollView>
        
        <View style={styles.buttonContainer}>
            <GradientButton title="POST ACHIEVEMENT" onPress={handlePostAchievement} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
  title: { fontSize: 20 },
  scrollContent: {
      paddingHorizontal: 20,
      paddingBottom: 20,
  },
  input: {
      fontFamily: 'Inter-Regular',
      fontSize: 24,
      color: colors.text.primary,
      minHeight: 150,
      textAlignVertical: 'top',
      lineHeight: 34,
      paddingTop: 20,
  },
  addImageButton: {
      height: 150,
      borderRadius: 15,
      borderWidth: 2,
      borderColor: colors.border,
      borderStyle: 'dashed',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 20,
  },
  addImageText: {
      fontFamily: 'Inter-SemiBold',
      color: colors.text.secondary,
      marginTop: 10,
  },
  imagePreviewContainer: {
      marginTop: 20,
      alignItems: 'center',
  },
  imagePreview: {
      width: '100%',
      height: 250,
      borderRadius: 15,
  },
  removeImageButton: {
      position: 'absolute',
      top: -10,
      right: -10,
      backgroundColor: 'white',
      borderRadius: 16,
  },
  buttonContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderColor: colors.border,
  },
});

export default LogAchievementScreen;