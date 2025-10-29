import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Text, TextInput, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { ScreenTitle } from '../components/common/StyledText';
import { PraisePost } from '../components/common/PraisePost';
import { colors } from '../theme/color';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '@env';
import BreakPromptModal from '../components/common/BreakPromptModal';

const PraiseFeedScreen = () => {
  const navigation = useNavigation();
  const [posts, setPosts] = useState<any[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [showBreakModal, setShowBreakModal] = useState(false);
  const [breakType, setBreakType] = useState<'one' | 'five'>('five');
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<TextInput>(null);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastActivityTsRef = useRef<number>(Date.now());

  // const resetIdleTimer = useCallback(() => {
  //   lastActivityTsRef.current = Date.now();
  //   if (idleTimerRef.current) {
  //     clearTimeout(idleTimerRef.current);
  //   }
  //   idleTimerRef.current = setTimeout(() => {
  //     // 2 minutes of continuous focus/scrolling without leaving the screen
  //     const isOneMinute = Math.random() < 0.5;
  //     setBreakType(isOneMinute ? 'one' : 'five');
  //     setShowBreakModal(true);
  //   }, 2 * 60 * 1000);
  // }, []);
  const resetIdleTimer = useCallback(() => {
  lastActivityTsRef.current = Date.now();

  if (idleTimerRef.current) {
    clearTimeout(idleTimerRef.current);
  }

  idleTimerRef.current = setTimeout(() => {
    // 30 seconds of continuous focus/scrolling without leaving the screen
    const isOneMinute = Math.random() < 0.5;
    setBreakType(isOneMinute ? 'one' : 'five');
    setShowBreakModal(true);
  }, 30 * 1000); // 30 seconds
}, []);


  const fetchFeed = async () => {
    
    try {
      const token = await AsyncStorage.getItem('token');
      
      const uid = await AsyncStorage.getItem('userId');
      
      console.log('token=', token);
      // console.log('uid=', uid);
      if (!uid) {
        console.error('No user ID found');
        setLoading(false);
        return;
      }
      
      setCurrentUserId(uid);
      
      const res = await fetch(`${BASE_URL}/api/posts/feed`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      
      // ✅ Insert section headers between matched and unmatched posts
      const processedData: any[] = [];
      let hasMatchingPosts = false;
      let hasAddedOtherHeader = false;
      
      data.forEach((post: any) => {
        // Add "For You" header before first matching post
        if (post.matchesInterest && !hasMatchingPosts) {
          processedData.push({ type: 'header', id: 'header-matched', title: 'For You ✨' });
          hasMatchingPosts = true;
        }
        
        // Add "Other Posts" header before first non-matching post
        // if (!post.matchesInterest && !hasAddedOtherHeader) {
        //   processedData.push({ type: 'header', id: 'header-other', title: 'Other Posts You Might Like' });
        //   hasAddedOtherHeader = true;
        // }
        if (!post.matchesInterest && !hasAddedOtherHeader) {
  const headerTitle = hasMatchingPosts ? 'Other Posts You Might Like' : 'Posts You Might Like';
  processedData.push({ type: 'header', id: 'header-other', title: headerTitle });
  hasAddedOtherHeader = true;
}
        
        processedData.push({ ...post, type: 'post' });
      });
      
      setPosts(processedData);
      setFilteredPosts(processedData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      // If search is empty, show all posts with original structure
      setFilteredPosts(posts);
      return;
    }

    // Filter posts by hashtag matching
    const searchTerm = query.toLowerCase().replace(/^#/, '').trim();
    const filtered = posts.filter(item => {
      if (item.type === 'header') return false; // Remove headers during search
      
      const hashtags = item.hashtags?.map((h: string) => 
        h.toLowerCase().replace(/^#/, '')
      ) || [];
      
      // Check if any hashtag includes the search term
      return hashtags.some((tag: string) => tag.includes(searchTerm));
    });

    // Add search results header if results exist
    if (filtered.length > 0) {
      setFilteredPosts([
        { type: 'header', id: 'header-search', title: `Search Results for "${query}"` },
        ...filtered
      ]);
    } else {
      setFilteredPosts([
        { type: 'header', id: 'header-no-results', title: 'No posts found' }
      ]);
    }
  }, [posts]);

  const toggleSearch = () => {
    if (showSearch) {
      // Close search
      setShowSearch(false);
      setSearchQuery('');
      setFilteredPosts(posts);
      Keyboard.dismiss();
    } else {
      // Open search
      setShowSearch(true);
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  };

  const handleLike = async (postId: string) => {
    try {
      // Optimistic UI update - update in both posts and filteredPosts
      const updatePosts = (prevPosts: any[]) => prevPosts.map(item => {
        if (item.type !== 'post' || item._id !== postId) return item;
        
        const likes = item.likes ?? [];
        const isLiked = likes.includes(currentUserId);
        
        return {
          ...item,
          likes: isLiked 
            ? likes.filter((id: string) => id !== currentUserId) 
            : [...likes, currentUserId]
        };
      });

      setPosts(updatePosts);
      setFilteredPosts(updatePosts);

      // Fire server request
      const token = await AsyncStorage.getItem('token');
      const res = await fetch(`${BASE_URL}/api/posts/${postId}/like`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!res.ok) {
        throw new Error('Failed to update like');
      }
      
      const updatedPost = await res.json();

      // Only update if the server response has valid likes array
      if (updatedPost && updatedPost.likes) {
        const updateWithServerData = (prevPosts: any[]) => prevPosts.map(item => 
          (item.type === 'post' && item._id === postId) 
            ? { ...item, likes: updatedPost.likes } 
            : item
        );
        setPosts(updateWithServerData);
        setFilteredPosts(updateWithServerData);
      }
    } catch (err) {
      console.error('Like error:', err);
      // Revert optimistic update on error
      const revertPosts = (prevPosts: any[]) => prevPosts.map(item => {
        if (item.type !== 'post' || item._id !== postId) return item;
        
        const likes = item.likes ?? [];
        const isLiked = likes.includes(currentUserId);
        
        return {
          ...item,
          likes: isLiked 
            ? likes.filter((id: string) => id !== currentUserId) 
            : [...likes, currentUserId]
        };
      });
      setPosts(revertPosts);
      setFilteredPosts(revertPosts);
    }
  };

  const handleComment = async (postId: string, text: string) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch(`${BASE_URL}/api/posts/${postId}/comment`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });
      const updatedPost = await res.json();

      const updateWithComments = (prevPosts: any[]) =>
        prevPosts.map(item =>
          (item.type === 'post' && item._id === postId)
            ? { ...item, comments: updatedPost.comments }
            : item
        );

      setPosts(updateWithComments);
      setFilteredPosts(updateWithComments);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchFeed(); }, []);

  // Setup timer on focus; clear on blur/unmount
  useEffect(() => {
    const unsubscribeFocus = navigation.addListener('focus', () => {
      resetIdleTimer();
    });
    const unsubscribeBlur = navigation.addListener('blur', () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    });
    return () => {
      unsubscribeFocus();
      unsubscribeBlur();
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [navigation, resetIdleTimer]);

  const handleNewPost = () => {
    navigation.navigate('CreatePostScreen' as never);
  };

  // ✅ Render function for FlatList items
  const renderItem = ({ item }: any) => {
    if (item.type === 'header') {
      return (
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionHeaderText}>{item.title}</Text>
          <View style={styles.sectionHeaderLine} />
        </View>
      );
    }
    
    // Regular post
    return (
      <PraisePost
        {...item}
        currentUserId={currentUserId}
        onLike={() => handleLike(item._id)}
        onComment={(text: string) => handleComment(item._id, text)}
      />
    );
  };

  if (loading || !currentUserId) {
    return <ActivityIndicator size="large" style={{ flex: 1, justifyContent: 'center' }} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {!showSearch ? (
          // Default header with title and search icon
          <>
            <ScreenTitle>Praise Feed</ScreenTitle>
            <TouchableOpacity onPress={toggleSearch} style={styles.searchIcon}>
              <Icon name="search-outline" size={24} color={colors.text?.primary || '#333'} />
            </TouchableOpacity>
          </>
        ) : (
          // Search bar mode
          <View style={styles.searchBarContainer}>
            <Icon name="search-outline" size={20} color={colors.text?.secondary || '#666'} style={styles.searchIconInBar} />
            <TextInput
              ref={searchInputRef}
              style={styles.searchInput}
              placeholder="Search by hashtag..."
              placeholderTextColor={colors.text?.secondary || '#999'}
              value={searchQuery}
              onChangeText={handleSearch}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity onPress={toggleSearch} style={styles.closeSearchIcon}>
              <Icon name="close-outline" size={24} color={colors.text?.primary || '#333'} />
            </TouchableOpacity>
          </View>
        )}
      </View>

      <FlatList
        data={filteredPosts}
        keyExtractor={item => item.id || item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        onScrollBeginDrag={resetIdleTimer}
        onScrollEndDrag={resetIdleTimer}
        onMomentumScrollEnd={resetIdleTimer}
        ListEmptyComponent={
          searchQuery ? (
            <View style={styles.emptyContainer}>
              <Icon name="search-outline" size={48} color={colors.text?.secondary || '#999'} />
              <Text style={styles.emptyText}>No posts found with that hashtag</Text>
            </View>
          ) : null
        }
      />

      <TouchableOpacity style={styles.fab} onPress={handleNewPost}>
        <Icon name="create-outline" size={32} color="white" />
      </TouchableOpacity>

      <BreakPromptModal
        visible={showBreakModal}
        message={breakType === 'one' ? "How about a quick 1-minute activity?" : "Take a quick 5-minute activity break?"}
        onCancel={() => {
          setShowBreakModal(false);
          resetIdleTimer();
        }}
        onConfirm={() => {
          setShowBreakModal(false);
          if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
          // Navigate based on randomly chosen type
          if (breakType === 'one') {
            navigation.navigate('RandomActivitySelector' as never);
          } else {
            navigation.navigate('ActivityListScreen' as never);
          }
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background.primary },
  header: { 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20, 
    marginVertical: -10, 
    borderBottomWidth: 1, 
    borderBottomColor: colors.border, 
    paddingBottom: 10 
  },
  searchIcon: {
    padding: 8,
  },
  searchBarContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background?.secondary || '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 12,
    height: 40,
  },
  searchIconInBar: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text?.primary || '#333',
    paddingVertical: 8,
  },
  closeSearchIcon: {
    padding: 4,
  },
  list: { padding: 20 },
  sectionHeader: {
    marginTop: 2,
    marginBottom: 15,
    alignItems: 'center',
  },
  sectionHeaderText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text?.primary || '#333',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  sectionHeaderLine: {
    height: 2,
    width: 60,
    backgroundColor: colors.gradient?.passion?.[0] || '#FF6B6B',
    borderRadius: 1,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.text?.secondary || '#666',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 40,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.gradient.passion[0],
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
});

export default PraiseFeedScreen;
