// src/components/break/BreakPopup.tsx
import React, { useEffect, useState, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { BlurView } from '@react-native-community/blur';

const { width } = Dimensions.get('window');

interface BreakPopupProps {
  visible: boolean;
  activity: {
    type: 'activity-1min' | 'activity-5min' | 'game';
    title: string;
    screen: string;
    images: any[];
  } | null;
  onClose: () => void;
  navigation: any;
}

const BreakPopup: React.FC<BreakPopupProps> = ({
  visible,
  activity,
  onClose,
  navigation,
}) => {
  const [countdown, setCountdown] = useState(5);
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const imageAnim = useRef(new Animated.Value(0)).current;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);
  const imageTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (visible && activity) {
      console.log('🎬 Popup becoming visible with activity:', activity.title);
      setCountdown(5);
      setCurrentImageIndex(0);
      
      // Scale animation for popup
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }).start();

      // Image animation loop (only if images exist)
      if (activity.images && activity.images.length > 1) {
        imageTimerRef.current = setInterval(() => {
          if (!activity || !activity.images || activity.images.length === 0) return;
          
          Animated.sequence([
            Animated.timing(imageAnim, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(imageAnim, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }),
          ]).start(() => {
            if (activity && activity.images && activity.images.length > 0) {
              setCurrentImageIndex((prev) => (prev + 1) % activity.images.length);
            }
          });
        }, 1000);
      }

      // Countdown timer
      countdownTimerRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            handleRedirect();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        if (countdownTimerRef.current) {
          clearInterval(countdownTimerRef.current);
          countdownTimerRef.current = null;
        }
        if (imageTimerRef.current) {
          clearInterval(imageTimerRef.current);
          imageTimerRef.current = null;
        }
      };
    } else {
      // Reset animations when not visible
      scaleAnim.setValue(0);
      imageAnim.setValue(0);
      
      // Clear timers
      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current);
        countdownTimerRef.current = null;
      }
      if (imageTimerRef.current) {
        clearInterval(imageTimerRef.current);
        imageTimerRef.current = null;
      }
    }
  }, [visible, activity]);

  const handleRedirect = () => {
    if (!activity) return;
    
    console.log('🚀 Redirecting to:', activity.screen);
    
    // Clear timers
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
    if (imageTimerRef.current) {
      clearInterval(imageTimerRef.current);
      imageTimerRef.current = null;
    }
    
    onClose();
    
    // Small delay before navigation
    setTimeout(() => {
      navigation.navigate(activity.screen);
    }, 300);
  };

  const getTitle = () => {
    if (!activity) return 'Time for a break!';
    switch (activity.type) {
      case 'activity-1min':
        return 'How about a quick 1-minute activity? 🌟';
      case 'activity-5min':
        return 'Take a quick 5-minute activity break? 🧘';
      case 'game':
        return "Let's play a game! 🎮";
      default:
        return 'Time for a break!';
    }
  };

  // Don't render if not visible or no activity
  if (!visible || !activity) return null;

  const imageScale = imageAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.1],
  });

  const imageOpacity = imageAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0.7, 1],
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
    >
      <View style={styles.container}>
        <BlurView
          style={styles.blurView}
          blurType="dark"
          blurAmount={10}
          reducedTransparencyFallbackColor="rgba(0,0,0,0.8)"
        />
        
        <Animated.View
          style={[
            styles.popup,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Image Section */}
          {activity.images && activity.images.length > 0 && (
            <View style={styles.imageContainer}>
              <Animated.Image
                source={activity.images[currentImageIndex]}
                style={[
                  styles.image,
                  {
                    transform: [{ scale: imageScale }],
                    opacity: imageOpacity,
                  },
                ]}
                resizeMode="cover"
              />
              <View style={styles.imageOverlay} />
            </View>
          )}

          {/* Content Section */}
          <View style={styles.content}>
            <Text style={styles.title}>{getTitle()}</Text>
            
            <View style={styles.countdownContainer}>
              <Text style={styles.countdownText}>
                Redirecting in
              </Text>
              <View style={styles.countdownCircle}>
                <Text style={styles.countdownNumber}>{countdown}</Text>
              </View>
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blurView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  popup: {
    width: width * 0.85,
    backgroundColor: '#fff',
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  imageContainer: {
    width: '100%',
    height: 200,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  content: {
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 30,
  },
  countdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  countdownText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  countdownCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#8b5cf6',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  countdownNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
  },
  skipButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  skipButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#666',
  },
});

export default BreakPopup;