import React, { useState } from 'react';
import {
  View, StyleSheet, Text, TextInput, Alert,
  TouchableOpacity, KeyboardAvoidingView, Platform,
  ScrollView, Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { launchImageLibrary } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScreenTitle } from '../components/common/StyledText';
import { GradientButton } from '../components/interactive/GradientButton';
import { colors } from '../theme/color';
import { BASE_URL } from '@env';

const recommendedHashtags = [
  '#Motivation',
  '#Success',
  '#SelfGrowth',
  '#Fitness',
  '#Mindset',
];

const CreatePostScreen = () => {
  const navigation = useNavigation();
  const [postText, setPostText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedHashtags, setSelectedHashtags] = useState<string[]>([]);

  const handleSelectImage = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.7 }, (response) => {
      if (response.didCancel) return;
      if (response.errorCode) {
        Alert.alert('Error', 'Could not select image. Please check permissions.');
      } else if (response.assets && response.assets[0].uri) {
        setSelectedImage(response.assets[0].uri);
      }
    });
  };

  // ✅ Toggle hashtag + update post text to show it visually
  const toggleHashtag = (tag: string) => {
    setSelectedHashtags(prev => {
      let updated;
      if (prev.includes(tag)) {
        // remove hashtag
        updated = prev.filter(t => t !== tag);
        // remove from text as well
        setPostText(text => text.replace(new RegExp(`\\s*${tag}\\b`, 'gi'), '').trim());
      } else {
        // add hashtag
        updated = [...prev, tag];
        // append to text (with spacing)
        setPostText(text => text.trim() + (text.trim() ? ' ' : '') + tag);
      }
      return updated;
    });
  };

  const extractHashtagsFromText = (text: string) => {
    const tags = text.match(/#\w+/g);
    return tags ? Array.from(new Set(tags)) : [];
  };

  const handlePost = async () => {
    if (postText.trim().length < 5) {
      Alert.alert('Share a little more!', 'Please write a short note.');
      return;
    }

    const textTags = extractHashtagsFromText(postText);
    const allHashtags = Array.from(new Set([...selectedHashtags, ...textTags]));

    const formData = new FormData();
    formData.append('text', postText);
    formData.append('hashtags', JSON.stringify(allHashtags));

    if (selectedImage) {
      formData.append('image', {
        uri: selectedImage,
        type: 'image/jpeg',
        name: 'post.jpg',
      } as any);
    }

    try {
      const saved_token = await AsyncStorage.getItem('token');

      const token = 'Bearer ' + saved_token;
      const response = await fetch(`${BASE_URL}/api/posts`, {
        method: 'POST',
        headers: { Authorization: token },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert('Posted!', 'Your success has been shared.');
        navigation.goBack();
      } else {
        Alert.alert('Error', data.message || 'Failed to post');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Something went wrong.');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.header}>
          <ScreenTitle style={styles.title}>Share Your Win</ScreenTitle>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="close" size={28} color={colors.text.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <TextInput
            style={styles.input}
            placeholder="What's a recent success or positive moment you'd like to share?"
            placeholderTextColor={colors.text.secondary}
            multiline
            value={postText}
            onChangeText={setPostText}
            autoFocus
            maxLength={280}
          />

          {selectedImage && (
            <View style={styles.imagePreviewContainer}>
              <Image source={{ uri: selectedImage }} style={styles.imagePreview} />
              <TouchableOpacity
                style={styles.removeImageButton}
                onPress={() => setSelectedImage(null)}>
                <Icon name="close-circle" size={32} color={colors.system.warning} />
              </TouchableOpacity>
            </View>
          )}

          <Text style={styles.sectionTitle}>Recommended Hashtags</Text>
          <View style={styles.hashtagContainer}>
            {recommendedHashtags.map((tag) => (
              <TouchableOpacity
                key={tag}
                style={[
                  styles.hashtagButton,
                  selectedHashtags.includes(tag) && styles.hashtagSelected,
                ]}
                onPress={() => toggleHashtag(tag)}
              >
                <Text
                  style={[
                    styles.hashtagText,
                    selectedHashtags.includes(tag) && styles.hashtagTextSelected,
                  ]}
                >
                  {tag}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.characterCount}>{280 - postText.length}</Text>
        </ScrollView>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.footerActionButton} onPress={handleSelectImage}>
            <Icon name="camera-outline" size={28} color={colors.text.secondary} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <GradientButton title="SHARE" onPress={handlePost} gradient={colors.gradient.passion} />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: colors.border, marginTop: 20 },
  title: { fontSize: 20 },
  scrollContent: { padding: 20 },
  input: { flex: 1, fontFamily: 'Inter-Regular', fontSize: 18, color: colors.text.primary, textAlignVertical: 'top', lineHeight: 28 },
  characterCount: { fontFamily: 'Inter-Regular', color: colors.text.secondary, textAlign: 'right', marginTop: 10 },
  buttonContainer: { padding: 20, borderTopWidth: 1, borderColor: colors.border, flexDirection: 'row', alignItems: 'center' },
  footerActionButton: { paddingRight: 20 },
  imagePreviewContainer: { marginTop: 20, alignItems: 'center' },
  imagePreview: { width: '100%', height: 200, borderRadius: 15 },
  removeImageButton: { position: 'absolute', top: -10, right: -10, backgroundColor: 'white', borderRadius: 16 },
  sectionTitle: { marginTop: 20, fontFamily: 'Inter-SemiBold', color: colors.text.primary, fontSize: 16 },
  hashtagContainer: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 },
  hashtagButton: { paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: colors.border, borderRadius: 20, marginRight: 8, marginBottom: 8 },
  hashtagSelected: { backgroundColor: colors.gradient.passion[0], borderColor: colors.gradient.passion[0] },
  hashtagText: { color: colors.text.secondary },
  hashtagTextSelected: { color: 'white' },
});

export default CreatePostScreen;