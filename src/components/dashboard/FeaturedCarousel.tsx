// src/components/FeaturedCarousel.tsx

import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Define the structure of our feature data
interface FeatureItem {
  id: string;
  quote: string;
  author: string;
  image: string;
  feature: string;
}

const { width: screenWidth } = Dimensions.get('window');
const CARD_WIDTH = screenWidth - 29;
const CARD_MARGIN = 20;

// Features to navigate to - will be randomly assigned
const FEATURES = [
  'DailyGoalsScreen',
  'WeeklyGoalsScreen',
  'IcompletedScreen',
  'RandomActivitySelector',
  'LogAchievement',
];

// Large pool of inspirational quotes
const QUOTE_POOL = [
  { quote: 'The secret of getting ahead is getting started.', author: 'Mark Twain' },
  { quote: 'Success is not final, failure is not fatal: it is the courage to continue that counts.', author: 'Winston Churchill' },
  { quote: 'The journey of a thousand miles begins with a single step.', author: 'Lao Tzu' },
  { quote: 'We are what we repeatedly do. Excellence, then, is not an act, but a habit.', author: 'Aristotle' },
  { quote: 'The best time to plant a tree was 20 years ago. The second best time is now.', author: 'Chinese Proverb' },
  { quote: 'Success is the sum of small efforts, repeated day in and day out.', author: 'Robert Collier' },
  { quote: 'Do not wait; the time will never be just right. Start where you stand.', author: 'Napoleon Hill' },
  { quote: 'A year from now you may wish you had started today.', author: 'Karen Lamb' },
  { quote: 'The only way to do great work is to love what you do.', author: 'Steve Jobs' },
  { quote: 'Believe you can and you\'re halfway there.', author: 'Theodore Roosevelt' },
  { quote: 'Don\'t watch the clock; do what it does. Keep going.', author: 'Sam Levenson' },
  { quote: 'The future belongs to those who believe in the beauty of their dreams.', author: 'Eleanor Roosevelt' },
  { quote: 'It does not matter how slowly you go as long as you do not stop.', author: 'Confucius' },
  { quote: 'Everything you\'ve ever wanted is on the other side of fear.', author: 'George Addair' },
  { quote: 'Success is not how high you have climbed, but how you make a positive difference.', author: 'Roy T. Bennett' },
  { quote: 'Believe in yourself. You are braver than you think, more talented than you know.', author: 'Roy T. Bennett' },
  { quote: 'I learned that courage was not the absence of fear, but the triumph over it.', author: 'Nelson Mandela' },
  { quote: 'There is only one way to avoid criticism: do nothing, say nothing, and be nothing.', author: 'Aristotle' },
  { quote: 'Ask and it will be given to you; search, and you will find; knock and the door will be opened.', author: 'Jesus' },
  { quote: 'The only person you are destined to become is the person you decide to be.', author: 'Ralph Waldo Emerson' },
  { quote: 'Go confidently in the direction of your dreams. Live the life you have imagined.', author: 'Henry David Thoreau' },
  { quote: 'Few things can help an individual more than to place responsibility on them.', author: 'Booker T. Washington' },
  { quote: 'Certain things catch your eye, but pursue only those that capture the heart.', author: 'Ancient Indian Proverb' },
  { quote: 'When I let go of what I am, I become what I might be.', author: 'Lao Tzu' },
  { quote: 'Everything has beauty, but not everyone can see.', author: 'Confucius' },
  { quote: 'How wonderful it is that nobody need wait a single moment before starting to improve.', author: 'Anne Frank' },
  { quote: 'The question isn\'t who is going to let me; it\'s who is going to stop me.', author: 'Ayn Rand' },
  { quote: 'When everything seems to be going against you, remember the airplane takes off against the wind.', author: 'Henry Ford' },
  { quote: 'Too many of us are not living our dreams because we are living our fears.', author: 'Les Brown' },
  { quote: 'Challenges are what make life interesting and overcoming them is what makes life meaningful.', author: 'Joshua J. Marine' },
  { quote: 'If you want to lift yourself up, lift up someone else.', author: 'Booker T. Washington' },
  { quote: 'I have been impressed with the urgency of doing. Knowing is not enough; we must apply.', author: 'Leonardo da Vinci' },
  { quote: 'Limitations live only in our minds. But if we use our imaginations, our possibilities become limitless.', author: 'Jamie Paolinetti' },
  { quote: 'You take your life in your own hands, and what happens? A terrible thing, no one to blame.', author: 'Erica Jong' },
  { quote: 'What\'s money? A man is a success if he gets up in the morning and goes to bed at night and does what he wants.', author: 'Bob Dylan' },
  { quote: 'I didn\'t fail the test. I just found 100 ways to do it wrong.', author: 'Benjamin Franklin' },
  { quote: 'A person who never made a mistake never tried anything new.', author: 'Albert Einstein' },
  { quote: 'In order to succeed, your desire for success should be greater than your fear of failure.', author: 'Bill Cosby' },
  { quote: 'A successful man is one who can lay a firm foundation with the bricks others have thrown at him.', author: 'David Brinkley' },
  { quote: 'Don\'t be afraid to give up the good to go for the great.', author: 'John D. Rockefeller' },
];

// Large pool of high-quality motivational images from Unsplash
const IMAGE_POOL = [
  'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1495195134817-aeb325a55b65?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1519834785169-98be25ec3f84?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1504805572947-34fad45aed93?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1531545514256-b1400bc00f31?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1487017159836-4e23ece2e4cf?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1526948128573-703ee1aeb6fa?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop',
];

// Function to shuffle array
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Function to generate random feature data
const generateRandomData = (count: number): FeatureItem[] => {
  const shuffledQuotes = shuffleArray(QUOTE_POOL);
  const shuffledImages = shuffleArray(IMAGE_POOL);
  
  return Array.from({ length: count }, (_, index) => ({
    id: String(index + 1),
    quote: shuffledQuotes[index % shuffledQuotes.length].quote,
    author: shuffledQuotes[index % shuffledQuotes.length].author,
    image: shuffledImages[index % shuffledImages.length],
    feature: FEATURES[index % FEATURES.length],
  }));
};

const FeaturedCarousel = () => {
  const navigation = useNavigation();
  const flatListRef = useRef<FlatList | null>(null);
  
  const [featureData, setFeatureData] = useState<FeatureItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Generate random data on mount
  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true);
        
        // Try to fetch from API
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        try {
          const response = await fetch('https://api.quotable.io/quotes/random?limit=25&tags=inspirational', {
            signal: controller.signal,
          });
          
          clearTimeout(timeoutId);
          
          if (response.ok) {
            const quotes = await response.json();
            const shuffledImages = shuffleArray(IMAGE_POOL);
            
            const apiData: FeatureItem[] = quotes.map((quote: any, index: number) => ({
              id: String(index + 1),
              quote: quote.content,
              author: quote.author,
              image: shuffledImages[index % shuffledImages.length],
              feature: FEATURES[index % FEATURES.length],
            }));
            
            setFeatureData(apiData);
            console.log('Successfully loaded quotes from API');
            return;
          }
        } catch (apiError) {
          console.log('API fetch failed, using local data');
        }
        
        // Fallback to local random data (30 random combinations)
        const randomData = generateRandomData(30);
        setFeatureData(randomData);
        
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  // Automatic scrolling logic
  useEffect(() => {
    if (featureData.length === 0) return;

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (flatListRef.current && featureData.length > 0) {
        const nextIndex = (currentIndex + 1) % featureData.length;
        
        try {
          flatListRef.current.scrollToIndex({
            animated: true,
            index: nextIndex,
          });
          currentIndex = nextIndex;
        } catch (error) {
          // Silently handle scroll errors
        }
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [featureData]);

  const renderItem = ({ item }: { item: FeatureItem }) => (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={() => {
        console.log('Navigating to:', item.feature);
        navigation.navigate(item.feature as never);
      }}
    >
      <ImageBackground
        source={{ uri: item.image }}
        style={styles.imageBackground}
        imageStyle={styles.imageStyle}
        resizeMode="cover"
      >
        <View style={styles.overlay} />
        <Text style={styles.quoteText}>"{item.quote}"</Text>
        <Text style={styles.authorText}>- {item.author}</Text>
        <View style={styles.featuredButton}>
          <Text style={styles.featuredButtonText}>Get Started</Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );

  // Show loading state
  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading inspiration...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={featureData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.flatlistContent}
        snapToInterval={CARD_WIDTH}
        decelerationRate="fast"
        onScrollToIndexFailed={(info) => {
          setTimeout(() => {
            if (flatListRef.current) {
              flatListRef.current.scrollToIndex({
                index: info.index,
                animated: false,
              });
            }
          }, 100);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
    height: 220,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
    fontFamily: 'Inter-Regular',
  },
  flatlistContent: {
    paddingHorizontal: CARD_MARGIN / 2,
  },
  cardContainer: {
    width: CARD_WIDTH,
    marginHorizontal: CARD_MARGIN / 2,
    height: '100%',
  },
  imageBackground: {
    flex: 1,
    borderRadius: 20,
    justifyContent: 'center',
    padding: 25,
  },
  imageStyle: {
    borderRadius: 20,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 20,
  },
  quoteText: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: 'white',
    lineHeight: 28,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  authorText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 8,
    fontStyle: 'italic',
  },
  featuredButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: 'flex-start',
    marginTop: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  featuredButtonText: {
    color: 'white',
    fontFamily: 'Inter-Bold',
    fontSize: 16,
  },
});

export default FeaturedCarousel;



// // src/components/FeaturedCarousel.tsx

// import React, { useRef, useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   Dimensions,
//   TouchableOpacity,
//   ImageBackground,
// } from 'react-native';
// import { useNavigation } from '@react-navigation/native';

// // --- DATA: You can easily add or change quotes and images here ---
// const FEATURE_DATA = [
//   {
//     id: '1',
//     quote: 'The secret of getting ahead is getting started.',
//     author: 'Mark Twain',
//     image: require('../../assets/images/dashboard/image1.png'), // <-- IMPORTANT: Replace with your image path
//     feature: 'DailyGoalsScreen',
//   },
//   {
//     id: '2',
//     quote: 'It’s not what we do once in a while that shapes our lives, but what we do consistently.',
//     author: 'Tony Robbins',
//     image: require('../../assets/images/dashboard/image2.png'), // <-- IMPORTANT: Replace with your image path
//     feature: 'WeeklyGoalsScreen',
//   },
//   {
//     id: '3',
//     quote: 'The journey of a thousand miles begins with a single step.',
//     author: 'Lao Tzu',
//     image: require('../../assets/images/dashboard/image3.png'), // <-- IMPORTANT: Replace with your image path
//     feature: 'IcompletedScreen',
//   },
//   {
//     id: '4',
//     quote: 'We are what we repeatedly do. Excellence, then, is not an act, but a habit.',
//     author: 'Will Durant',
//     image: require('../../assets/images/dashboard/image4.png'), // <-- CHANGE THIS IMAGE
//     feature: 'WeeklyGoalsScreen',
//   },
//   {
//     id: '5',
//     quote: 'The best time to plant a tree was 20 years ago. The second best time is now.',
//     author: 'Chinese Proverb',
//     image: require('../../assets/images/dashboard/image5.png'), // <-- CHANGE THIS IMAGE
//     feature: 'IcompletedScreen',
//   },
//   {
//     id: '6',
//     quote: 'Success is the sum of small efforts, repeated day in and day out.',
//     author: 'Robert Collier',
//     image: require('../../assets/images/dashboard/image6.png'), // <-- CHANGE THIS IMAGE
//     feature: 'DailyGoalsScreen',
//   },
//   {
//     id: '7',
//     quote: 'Do not wait to strike till the iron is hot; but make it hot by striking.',
//     author: 'William Butler Yeats',
//     image: require('../../assets/images/loginImg/image7.png'), // <-- CHANGE THIS IMAGE
//     feature: 'RandomActivitySelector',
//   },
//   {
//     id: '8',
//     quote: 'A year from now you may wish you had started today.',
//     author: 'Karen Lamb',
//     image: require('../../assets/images/loginImg/image8.png'), // <-- CHANGE THIS IMAGE
//     feature: 'LogAchievement',
//   }
  
// ];

// const { width: screenWidth } = Dimensions.get('window');
// const CARD_WIDTH = screenWidth - 29;
// const CARD_MARGIN = 20;

// const FeaturedCarousel = () => {
//   const navigation = useNavigation();
//   // Create a ref for the FlatList to control it programmatically
//   const flatListRef = useRef<FlatList | null>(null);

//   // --- NEW: Automatic Scrolling Logic ---
//   useEffect(() => {
//     let currentIndex = 0;
//     // Set up an interval to scroll every 4 seconds (4000 milliseconds)
//     const interval = setInterval(() => {
//       if (flatListRef.current) {
//         // Calculate the next index, looping back to 0 if at the end
//         const nextIndex = (currentIndex + 1) % FEATURE_DATA.length;
        
//         // Use scrollToIndex to move the list
//         flatListRef.current.scrollToIndex({
//           animated: true,
//           index: nextIndex,
//         });
        
//         currentIndex = nextIndex;
//       }
//     }, 4000); // Change this value to make it scroll faster or slower

//     // Clean up the interval when the component is unmounted to prevent memory leaks
//     return () => clearInterval(interval);
//   }, []); // The empty dependency array ensures this runs only once on mount

//   const renderItem = ({ item }) => (
//     <TouchableOpacity
//       style={styles.cardContainer}
//       onPress={() => navigation.navigate(item.feature as never)}>
//       <ImageBackground
//         source={item.image}
//         style={styles.imageBackground}
//         imageStyle={styles.imageStyle}
//         resizeMode="cover">
//         <View style={styles.overlay} />
//         <Text style={styles.quoteText}>"{item.quote}"</Text>
//         <Text style={styles.authorText}>- {item.author}</Text>
//         <View style={styles.featuredButton}>
//           <Text style={styles.featuredButtonText}>Get Started</Text>
//         </View>
//       </ImageBackground>
//     </TouchableOpacity>
//   );

//   return (
//     <View style={styles.container}>
//       <FlatList
//         ref={flatListRef} // Assign the ref to the FlatList
//         data={FEATURE_DATA}
//         renderItem={renderItem}
//         keyExtractor={item => item.id}
//         horizontal
//         pagingEnabled
//         showsHorizontalScrollIndicator={false}
//         contentContainerStyle={styles.flatlistContent}
//         snapToInterval={CARD_WIDTH}
//         decelerationRate="fast"
//       />
//     </View>
//   );
// };

// // --- (Styles remain the same) ---
// const styles = StyleSheet.create({
//   container: {
//     marginTop: 15,
//     height: 220,
//   },
//   flatlistContent: {
//     paddingHorizontal: CARD_MARGIN / 2,
//   },
//   cardContainer: {
//     width: CARD_WIDTH,
//     marginHorizontal: CARD_MARGIN / 2,
//     height: '100%',
//   },
//   imageBackground: {
//     flex: 1,
//     borderRadius: 20,
//     justifyContent: 'center',
//     padding: 25,
//   },
//   imageStyle: {
//     borderRadius: 20,
//   },
//   overlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: 'rgba(0, 0, 0, 0.4)',
//     borderRadius: 20,
//   },
//   quoteText: {
//     fontSize: 20,
//     fontFamily: 'Inter-Bold',
//     color: 'white',
//     lineHeight: 28,
//     textShadowColor: 'rgba(0, 0, 0, 0.75)',
//     textShadowOffset: { width: -1, height: 1 },
//     textShadowRadius: 10,
//   },
//   authorText: {
//     fontSize: 16,
//     color: 'rgba(255, 255, 255, 0.8)',
//     marginTop: 8,
//     fontStyle: 'italic',
//   },
//   featuredButton: {
//     backgroundColor: 'rgba(255, 255, 255, 0.2)',
//     borderRadius: 15,
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     alignSelf: 'flex-start',
//     marginTop: 20,
//     borderWidth: 1,
//     borderColor: 'rgba(255, 255, 255, 0.3)',
//   },
//   featuredButtonText: {
//     color: 'white',
//     fontFamily: 'Inter-Bold',
//     fontSize: 16,
//   },
// });

// export default FeaturedCarousel;