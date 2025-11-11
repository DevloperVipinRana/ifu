// src/services/breakPopupService.ts

import { BASE_URL } from "@env";
import AsyncStorage from '@react-native-async-storage/async-storage';

// Game images from assets
const GAME_IMAGES = [
  require('../assets/images/memory.png'),
  require('../assets/images/simon.png'),
  require('../assets/images/snake.webp'),
  require('../assets/images/wordguess.png'),
  require('../assets/images/mindful.jpg'),
];

// Game screens mapping
const GAMES = [
  { screen: 'SnakeGame', name: 'Snake Game' },
  { screen: 'WordGuess', name: 'Word Guess' },
  { screen: 'SimonStartScreen', name: 'Simon Says' },
  { screen: 'MemoryBloomScreen', name: 'Memory Bloom' },
  { screen: 'twozeroGameScreen', name: '2048 Game' },
];

let lastResetTime = Date.now();
let cachedActivityImages: any[] | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // Cache for 5 minutes

/**
 * Fetch random activity images from backend
 */
export const fetchActivityImages = async (): Promise<any[]> => {
  try {
    const now = Date.now();

    // ✅ Use cached images if not expired
    if (cachedActivityImages && (now - lastFetchTime) < CACHE_DURATION) {
      console.log('📦 Using cached activity images');
      return cachedActivityImages;
    }

    // ✅ Get auth token
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      console.warn('⚠️ No auth token found, using fallback images');
      return GAME_IMAGES;
    }

    console.log('🌐 Fetching activity images from backend...');
    const response = await fetch(`${BASE_URL}/api/images/all?random=true&limit=30`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`❌ API returned status ${response.status}`);
      const errorText = await response.text();
      console.error('Error response:', errorText);
      return GAME_IMAGES;
    }

    const data = await response.json();

    console.log('📥 API Response Summary:', {
      success: data.success,
      count: data.count,
      hasImages: !!data.images,
      imageCount: data.images?.length || 0,
    });

    if (data.success && Array.isArray(data.images) && data.images.length > 0) {
      console.log(`🖼️ Received ${data.images.length} images from backend`);

      // Log detailed info of each image
      data.images.forEach((img: any, index: number) => {
        console.log(`➡️ [${index + 1}] Image ID: ${img.id}, URL: ${img.image_url}, Categories: ${img.categories}`);
      });

      const imageUris = data.images
        .map((img: any) => {
          if (!img.image_url) {
            console.warn(`⚠️ Missing image_url for ID ${img.id || '(unknown)'}`);
            return null;
          }

          // Optional: validate image format
          if (!img.image_url.startsWith('http')) {
            console.warn(`⚠️ Invalid image URL format for ID ${img.id}: ${img.image_url}`);
            return null;
          }

          return { id: img.id, uri: img.image_url, categories: img.categories };
        })
        .filter(Boolean); // remove null entries

      console.log(`✅ Valid images processed: ${imageUris.length}/${data.images.length}`);

      // Cache the images
      cachedActivityImages = imageUris;
      lastFetchTime = now;

      return imageUris;
    }

    console.warn('⚠️ API response invalid or empty, using fallback');
    return GAME_IMAGES;
  } catch (error) {
    console.error('❌ Error fetching activity images:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
    }
    return GAME_IMAGES;
  }
};



/**
 * Get random break activity (1min activity, 5min activity, or game)
 */
export const getRandomBreakActivity = async () => {
  const types = ['activity-1min', 'activity-5min', 'game'];
  const randomType = types[Math.floor(Math.random() * types.length)];

  switch (randomType) {
    case 'activity-1min': {
      // Fetch activity images for 1-minute activities
      const activityImages = await fetchActivityImages();
      return {
        type: 'activity-1min',
        title: '1-Minute Quick Activity',
        screen: 'RandomActivitySelector',
        images: activityImages,
      };
    }
    
    case 'activity-5min': {
      // Fetch activity images for 5-minute activities
      const activityImages = await fetchActivityImages();
      return {
        type: 'activity-5min',
        title: '5-Minute Activity Break',
        screen: 'ActivityListScreen',
        images: activityImages,
      };
    }
    
    case 'game': {
      // Use game images for games
      const randomGame = GAMES[Math.floor(Math.random() * GAMES.length)];
      return {
        type: 'game',
        title: randomGame.name,
        screen: randomGame.screen,
        images: GAME_IMAGES,
      };
    }
    
    default: {
      const activityImages = await fetchActivityImages();
      return {
        type: 'activity-1min',
        title: '1-Minute Quick Activity',
        screen: 'RandomActivitySelector',
        images: activityImages,
      };
    }
  }
};

/**
 * Reset the timer (called when user completes an activity)
 */
export const resetTimer = () => {
  lastResetTime = Date.now();
};

/**
 * Get time until next break (for debugging/testing)
 */
export const getTimeUntilNextBreak = () => {
  const elapsed = Date.now() - lastResetTime;
  const remaining = (5 * 60 * 1000) - elapsed;
  return Math.max(0, remaining);
};

/**
 * Clear cached images (call this when user logs out or needs fresh data)
 */
export const clearImageCache = () => {
  cachedActivityImages = null;
  lastFetchTime = 0;
  console.log('🗑️ Activity image cache cleared');
};

/**
 * Preload activity images (call this on app start or after login)
 */
export const preloadActivityImages = async () => {
  console.log('🚀 Preloading activity images...');
  await fetchActivityImages();
};