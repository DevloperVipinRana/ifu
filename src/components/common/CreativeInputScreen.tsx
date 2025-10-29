import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Platform, Keyboard, ScrollView, SafeAreaView } from 'react-native';
import LottieView from 'lottie-react-native';

const CreativeInputScreen = ({ title, onSubmit, ProgressBarComponent, duration, seconds, formattedTime ,description}) => {
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const lottieRef = useRef(null);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);


  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      (e) => {
        setKeyboardVisible(true);
        setKeyboardHeight(e.endCoordinates.height);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
        setKeyboardHeight(0);
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  useEffect(() => {
    if (isSubmitting) {
      lottieRef.current?.play();
      const timer = setTimeout(() => {
        onSubmit(text);
        setIsSubmitting(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isSubmitting, onSubmit, text]);

  const handleSubmit = () => {
    if (isSubmitting || !text.trim()) return;
    setIsSubmitting(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* --- Fixed Header: Always visible --- */}
      <View style={styles.header}>
        {isKeyboardVisible ? (
          <View style={styles.compactProgressBar}>
            <ProgressBarComponent
              duration={duration}
              timeLeft={seconds}
              formattedTime={formattedTime}
            />
          </View>
        ) : (
          <>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>{description}</Text>
          </>
        )}
      </View>

      {/* --- Content Area: Adjusts based on keyboard --- */}
      <View 
        style={[
          styles.contentArea,
          isKeyboardVisible && { marginBottom: keyboardHeight }
        ]}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Input Container */}
          <View style={styles.inputContainer}>
            <TextInput
              style={[
                styles.input,
                isKeyboardVisible && styles.inputCompact
              ]}
              multiline
              placeholder="Let your thoughts flow..."
              placeholderTextColor="rgba(255, 255, 255, 0.4)"
              onChangeText={setText}
              value={text}
              textAlignVertical="top"
            />
          </View>

          {/* Footer with submit button */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[
                styles.submitButton,
                (!text.trim() || isSubmitting) && styles.disabledButton
              ]}
              onPress={handleSubmit}
              disabled={!text.trim() || isSubmitting}
            >
              {isSubmitting ? (
                <LottieView
                  ref={lottieRef}
                  source={require('../../assets/animation/Meditaion.json')}
                  loop={false}
                  style={styles.lottie}
                />
              ) : (
                <Text style={styles.submitButtonText}>SUBMIT</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 30,
  },
  header: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 15,
    zIndex: 10,
  },
  compactProgressBar: {
    width: '100%',
    transform: [{ scale: 0.8 }],
  },
  title: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 16,
    textAlign: 'center',
  },
  contentArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  inputContainer: {
    flex: 1,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    minHeight: 150,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 20,
    color: 'white',
    fontSize: 16,
  },
  inputCompact: {
    minHeight: 100,
    maxHeight: 150,
  },
  footer: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: 20,
  },
  submitButton: {
    backgroundColor: '#34D399',
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  disabledButton: {
    backgroundColor: '#555',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  lottie: {
    height: 120,
  },
});

export default CreativeInputScreen;