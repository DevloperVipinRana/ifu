import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  Pressable,
  Animated,
  Dimensions,
  ImageBackground,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';


import { RootStackParamList } from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'GamesScreen'>;




const { width } = Dimensions.get('window');
const VERTICAL_GAP = 10;     
const HORIZONTAL_GAP = 12;  
const CARD_WIDTH = (width / 2) - HORIZONTAL_GAP * 1.5;

// Placeholder icons
const SearchIcon = () => <Text style={{ fontSize: 20 }}>🔍</Text>;
const BellIcon = () => <Text style={{ fontSize: 20 }}>🔔</Text>;

// Tile with image and title below
const Tile = ({ image, title, illustration, onPress }: { image: any, title: string, illustration?: string, onPress: () => void }) => {
  const scale = useState(new Animated.Value(1))[0];

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => Animated.spring(scale, { toValue: 1.03, friction: 5, useNativeDriver: true }).start()}
      onPressOut={() => Animated.spring(scale, { toValue: 1, friction: 5, useNativeDriver: true }).start()}
      style={{ marginBottom: VERTICAL_GAP, marginHorizontal: HORIZONTAL_GAP / 2 }}
    >
      <Animated.View style={{ transform: [{ scale }] }}>
        {/* Image */}
        <ImageBackground
          source={image}
          style={[styles.tileImage, { width: CARD_WIDTH }]}
          imageStyle={{ borderRadius: 20 }}
        >
          <Text style={styles.tileIllustration}>{illustration}</Text>
        </ImageBackground>

        {/* Title below image */}
        <Text style={styles.tileTitle}>{title}</Text>
      </Animated.View>
    </Pressable>
  );
};

const GamesScreen = ({ navigation }: Props) => {
  const tiles = [
    // { title: 'Bumble Puzzles', illustration: '🧩', image: require('../assets/images/puzzle.webp') },
    { title: 'Memory Bloom', illustration: '🧠', image: require('../assets/images/memory.png') },
    { title: 'Simon says', illustration: '❓', image: require('../assets/images/simon.png') },
    { title: 'Snake game', illustration: '🐍', image: require('../assets/images/snake.webp') },
    { title: '2048', illustration: '🌈', image: require('../assets/images/mindful.jpg') },
    { title: 'Word guess', illustration: '🅰️', image: require('../assets/images/wordguess.png') },
  ];

  return (
    <LinearGradient colors={['#f0e6ff', '#d8e2ff', '#e0f7ff']}
            style={styles.backgroundGradient}>
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.pageTitle}>GAMES</Text>
        <Text style={styles.pageSubtitle}>Play, Grow, Achieve!</Text>
        <View style={styles.searchBarContainer}>
          <SearchIcon />
          <TextInput style={styles.searchInput} placeholder="Search..." placeholderTextColor="#ccc" />
          <BellIcon />
        </View>
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        <View style={styles.tileGrid}>
          {tiles.map((tile, index) => (
            <Tile
              key={index}
              title={tile.title}
              // illustration={tile.illustration}
              image={tile.image}
              onPress={() => navigation.navigate('GameInfo', { game: tile })}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  backgroundGradient: { flex: 1 },
  container: { flex: 1 },
  header: { padding: 20, paddingTop: 30, backgroundColor: '#d4dbdfff', borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  pageSubtitle: { fontWeight: '600', fontSize: 18, color: '#256db5ff', alignSelf: 'center', marginBottom: 10, fontStyle: 'italic' },
  pageTitle: { fontSize: 24, fontWeight: 'bold', color: '#333', alignSelf: 'center', marginBottom: 15 },
  searchBarContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 25, paddingHorizontal: 15, paddingVertical: 10, elevation: 3 },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 16 },
  content: { flex: 1, paddingVertical: VERTICAL_GAP },
  tileGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  tileImage: { height: 150, borderRadius: 20, justifyContent: 'flex-end', padding: 10, elevation: 5, borderWidth: 1, borderColor: '#382857ff' },
  tileTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginTop: 8, textAlign: 'center' },
  tileIllustration: { fontSize: 30, alignSelf: 'flex-end' },
});

export default GamesScreen;
