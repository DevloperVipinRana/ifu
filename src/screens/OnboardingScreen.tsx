import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Text, Animated, Dimensions, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/Ionicons';
import HapticFeedback from 'react-native-haptic-feedback';

import { ScreenTitle, Body } from '../components/common/StyledText';
import { GradientButton } from '../components/interactive/GradientButton';

type OnboardingScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'OnboardingScreen'>;

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const OnboardingScreen = () => {
  const navigation = useNavigation<OnboardingScreenNavigationProp>();
  const [currentPage, setCurrentPage] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeOut = useRef(new Animated.Value(1)).current;

  // Auto-advance to next page after 4 seconds
  useEffect(() => {
    if (currentPage < 2) {
      const timer = setTimeout(() => {
        goToNextPage();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [currentPage]);

  const goToNextPage = () => {
    if (currentPage < 2) {
      HapticFeedback.trigger('impactLight');
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      
      Animated.spring(slideAnim, {
        toValue: -nextPage * SCREEN_WIDTH,
        useNativeDriver: true,
        tension: 65,
        friction: 10,
      }).start();
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 0) {
      HapticFeedback.trigger('impactLight');
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);
      
      Animated.spring(slideAnim, {
        toValue: -prevPage * SCREEN_WIDTH,
        useNativeDriver: true,
        tension: 65,
        friction: 10,
      }).start();
    }
  };

  const handleStart = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    slideAnim.stopAnimation();

    Animated.timing(fadeOut, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    });
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeOut }]}>
      <Video
        source={require('../components/common/onboarding.mp4')}
        style={StyleSheet.absoluteFill}
        muted={true}
        repeat={true}
        resizeMode="cover"
        rate={0.7}
        paused={false}
        playInBackground={false}
        playWhenInactive={false}
        ignoreSilentSwitch="ignore"
        bufferConfig={{
          minBufferMs: 15000,
          maxBufferMs: 50000,
          bufferForPlaybackMs: 2500,
          bufferForPlaybackAfterRebufferMs: 5000
        }}
        progressUpdateInterval={250}
      />
      <View style={styles.scrim} />
      
      <SafeAreaView style={styles.content}>
        <Animated.View 
          style={[
            styles.pagesContainer,
            { transform: [{ translateX: slideAnim }] }
          ]}
        >
          {/* Page 1: Quote */}
          <View style={[styles.page, styles.centerContent]}>
            <Animated.View style={styles.pageContent}>
              <Icon name="sparkles" size={60} color="white" style={styles.pageIcon} />
              <Text style={styles.quote}>
                "The secret of getting ahead is getting started."
              </Text>
              <Text style={styles.quoteAuthor}>— Mark Twain</Text>
            </Animated.View>
          </View>

          {/* Page 2: Features */}
          <View style={[styles.page, styles.centerContent]}>
            <Animated.View style={styles.pageContent}>
              <View style={styles.pointContainer}>
                <View style={styles.iconCircle}>
                  <Icon name="leaf-outline" size={32} color="white" />
                </View>
                <Body style={styles.pointText}>Build positive habits with micro-actions.</Body>
              </View>
              <View style={styles.pointContainer}>
                <View style={styles.iconCircle}>
                  <Icon name="trophy-outline" size={32} color="white" />
                </View>
                <Body style={styles.pointText}>Celebrate your wins, big and small.</Body>
              </View>
              <View style={styles.pointContainer}>
                <View style={styles.iconCircle}>
                  <Icon name="people-outline" size={32} color="white" />
                </View>
                <Body style={styles.pointText}>Join a supportive community on the same path.</Body>
              </View>
            </Animated.View>
          </View>

          {/* Page 3: Call to Action */}
          <View style={[styles.page, styles.ctaPage]}>
            <Animated.View style={styles.ctaContent}>
              <Icon name="rocket-outline" size={80} color="white" style={styles.pageIcon} />
              <ScreenTitle style={styles.title}>Your Future Self is Waiting.</ScreenTitle>
              <Body style={styles.subtitle}>Take the first step towards becoming who you want to be.</Body>
              <GradientButton title="START YOUR JOURNEY" onPress={handleStart} />
            </Animated.View>
          </View>
        </Animated.View>

        {/* Navigation Dots */}
        <View style={styles.dotsContainer}>
          {[0, 1, 2].map((index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                setCurrentPage(index);
                Animated.spring(slideAnim, {
                  toValue: -index * SCREEN_WIDTH,
                  useNativeDriver: true,
                  tension: 65,
                  friction: 10,
                }).start();
              }}
            >
              <View style={[
                styles.dot,
                currentPage === index && styles.dotActive
              ]} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Navigation Arrows */}
        {currentPage > 0 && (
          <TouchableOpacity style={styles.arrowLeft} onPress={goToPreviousPage}>
            <Icon name="chevron-back" size={30} color="white" />
          </TouchableOpacity>
        )}
        
        {currentPage < 2 && (
          <TouchableOpacity style={styles.arrowRight} onPress={goToNextPage}>
            <Icon name="chevron-forward" size={30} color="white" />
          </TouchableOpacity>
        )}

        {/* Skip Button */}
        {currentPage < 2 && (
          <TouchableOpacity style={styles.skipButton} onPress={handleStart}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        )}
      </SafeAreaView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#000' 
  },
  scrim: { 
    ...StyleSheet.absoluteFillObject, 
    backgroundColor: 'rgba(0, 0, 0, 0.5)' 
  },
  content: { 
    flex: 1 
  },
  pagesContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  page: {
    width: SCREEN_WIDTH,
    paddingHorizontal: 30,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  ctaPage: {
    justifyContent: 'flex-end',
    paddingBottom: 60,
  },
  pageContent: {
    width: '100%',
    alignItems: 'center',
  },
  ctaContent: {
    width: '100%',
    alignItems: 'center',
  },
  pageIcon: {
    marginBottom: 30,
  },
  quote: { 
    fontFamily: 'Inter-Bold', 
    fontSize: 32, 
    color: 'white', 
    textAlign: 'center',
    lineHeight: 44,
  },
  quoteAuthor: {
    fontFamily: 'Inter-Regular',
    fontSize: 18,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 20,
    fontStyle: 'italic',
  },
  title: { 
    color: 'white', 
    textAlign: 'center', 
    marginBottom: 15,
    fontSize: 36,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 40,
    lineHeight: 24,
  },
  pointContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginVertical: 20,
    width: '100%',
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  pointText: { 
    color: 'white', 
    fontSize: 18, 
    marginLeft: 20, 
    flex: 1,
    lineHeight: 26,
  },
  dotsContainer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: 6,
  },
  dotActive: {
    width: 24,
    backgroundColor: 'white',
  },
  arrowLeft: {
    position: 'absolute',
    left: 20,
    // top: '50%',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    bottom: 60,
  },
  arrowRight: {
    position: 'absolute',
    right: 20,
    // top: '50%',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    bottom: 60,
  },
  skipButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  skipText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
});

export default OnboardingScreen;




// import React, { useState, useRef, useEffect } from 'react';
// import { View, StyleSheet, Text, TouchableWithoutFeedback, Animated, InteractionManager } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useNavigation } from '@react-navigation/native';
// import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import { RootStackParamList } from '../../App';
// import Video from 'react-native-video';
// import Icon from 'react-native-vector-icons/Ionicons';
// import HapticFeedback from 'react-native-haptic-feedback';

// import { ScreenTitle, Body } from '../components/common/StyledText';
// import { GradientButton } from '../components/interactive/GradientButton';

// type OnboardingScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'OnboardingScreen'>;

// const OnboardingScreen = () => {
//   const navigation = useNavigation<OnboardingScreenNavigationProp>();
//   const [stage, setStage] = useState<'discover' | 'reveal' | 'commit'>('discover');
//   const [isTransitioning, setIsTransitioning] = useState(false);
  
//   const discoverOpacity = useRef(new Animated.Value(1)).current;
//   const revealOpacity = useRef(new Animated.Value(0)).current;
//   const commitOpacity = useRef(new Animated.Value(0)).current;
//   const pointScale = useRef(new Animated.Value(1)).current;
//   const pointOpacity = useRef(new Animated.Value(1)).current;
//   const fadeOut = useRef(new Animated.Value(1)).current;

//   useEffect(() => {
//     const pulse = Animated.loop(
//       Animated.sequence([
//         Animated.timing(pointScale, { toValue: 1.1, duration: 1000, useNativeDriver: true }),
//         Animated.timing(pointScale, { toValue: 1, duration: 1000, useNativeDriver: true }),
//       ])
//     );
//     pulse.start();
//     return () => pulse.stop();
//   }, []);

//   const handlePressIn = () => {
//     if (stage !== 'discover') return;
//     HapticFeedback.trigger('impactLight');
//     setStage('reveal');
//     Animated.parallel([
//       Animated.timing(discoverOpacity, { toValue: 0, duration: 300, useNativeDriver: true }),
//       Animated.timing(revealOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
//       Animated.timing(pointScale, { toValue: 1.5, duration: 300, useNativeDriver: true }),
//     ]).start();
//   };

//   const handlePressOut = () => {
//     if (stage !== 'reveal') return;
//     HapticFeedback.trigger('impactMedium');
//     setStage('commit');
//     Animated.parallel([
//       Animated.timing(revealOpacity, { toValue: 0, duration: 300, useNativeDriver: true }),
//       Animated.timing(commitOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
//       Animated.timing(pointScale, { toValue: 0, duration: 300, useNativeDriver: true }),
//       Animated.timing(pointOpacity, { toValue: 0, duration: 300, useNativeDriver: true }),
//     ]).start();
//   };

//   const handleStart = () => {
//     if (isTransitioning) return;
//     setIsTransitioning(true);

//     // Stop all animations first
//     discoverOpacity.stopAnimation();
//     revealOpacity.stopAnimation();
//     commitOpacity.stopAnimation();
//     pointScale.stopAnimation();
//     pointOpacity.stopAnimation();

//     // Fade out the entire screen before navigating
//     Animated.timing(fadeOut, {
//       toValue: 0,
//       duration: 300,
//       useNativeDriver: true,
//     }).start(() => {
//       // Use reset to clear the stack and prevent back navigation
//       navigation.reset({
//         index: 0,
//         routes: [{ name: 'Login' }],
//       });
//     });
//   };

//   return (
//     <Animated.View style={[styles.container, { opacity: fadeOut }]}>
//       <Video
//         source={require('../components/common/onboarding.mp4')}
//         style={StyleSheet.absoluteFill}
//         muted={true}
//         repeat={true}
//         resizeMode="cover"
//         rate={0.7}
//         paused={false}
//         playInBackground={false}
//         playWhenInactive={false}
//         ignoreSilentSwitch="ignore"
//         bufferConfig={{
//           minBufferMs: 15000,
//           maxBufferMs: 50000,
//           bufferForPlaybackMs: 2500,
//           bufferForPlaybackAfterRebufferMs: 5000
//         }}
//         progressUpdateInterval={250}
//       />
//       <View style={styles.scrim} />
//       <SafeAreaView style={styles.content}>
        
//         <TouchableWithoutFeedback onPressIn={handlePressIn} onPressOut={handlePressOut}>
//             <View style={styles.touchableWrapper}>

//                 <Animated.View style={[styles.stageContainer, { opacity: discoverOpacity }]}>
//                     <Text style={styles.quote}>"The secret of getting ahead is getting started."</Text>
//                 </Animated.View>

//                 <Animated.View style={[styles.stageContainer, { opacity: revealOpacity }]}>
//                     <View style={styles.pointContainer}>
//                         <Icon name="leaf-outline" size={28} color="white" />
//                         <Body style={styles.pointText}>Build positive habits with micro-actions.</Body>
//                     </View>
//                     <View style={styles.pointContainer}>
//                         <Icon name="trophy-outline" size={28} color="white" />
//                         <Body style={styles.pointText}>Celebrate your wins, big and small.</Body>
//                     </View>
//                     <View style={styles.pointContainer}>
//                         <Icon name="people-outline" size={28} color="white" />
//                         <Body style={styles.pointText}>Join a supportive community on the same path.</Body>
//                     </View>
//                 </Animated.View>

//                 <Animated.View style={[styles.stageContainer, styles.commitContainer, { opacity: commitOpacity }]}>
//                     <ScreenTitle style={styles.title}>Your Future Self is Waiting.</ScreenTitle>
//                     <GradientButton title="START YOUR JOURNEY" onPress={handleStart} />
//                 </Animated.View>

//                 <Animated.View style={[styles.focusPointContainer, { opacity: pointOpacity }]}>
//                     <Animated.View style={[styles.focusPoint, { transform: [{ scale: pointScale }] }]}>
//                         <Icon name="finger-print" size={40} color="rgba(255,255,255,0.8)" />
//                     </Animated.View>
//                 </Animated.View>
//             </View>
//         </TouchableWithoutFeedback>
//       </SafeAreaView>
//     </Animated.View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#000' },
//   scrim: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0, 0, 0, 0.6)' },
//   content: { flex: 1 },
//   touchableWrapper: { flex: 1, justifyContent: 'center', alignItems: 'center' },
//   stageContainer: {
//     position: 'absolute',
//     width: '90%',
//     height: '60%',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   commitContainer: {
//       justifyContent: 'flex-end',
//       paddingBottom: 40,
//   },
//   quote: { fontFamily: 'Inter-Bold', fontSize: 34, color: 'white', textAlign: 'center' },
//   title: { color: 'white', textAlign: 'center', marginBottom: 40 },
//   pointContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 15 },
//   pointText: { color: 'white', fontSize: 18, marginLeft: 15, flex: 1 },
//   focusPointContainer: {
//       position: 'absolute',
//       bottom: 80,
//   },
//   focusPoint: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     backgroundColor: 'rgba(255, 255, 255, 0.1)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 2,
//     borderColor: 'rgba(255,255,255,0.3)',
//   },
// });

// export default OnboardingScreen;
