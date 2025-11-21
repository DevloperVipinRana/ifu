import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Text, TextInput, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ScreenTitle } from '../components/common/StyledText';
import { PraisePost } from '../components/common/PraisePost';
import { colors } from '../theme/color';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '@env';

const PraiseFeedScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [posts, setPosts] = useState<any[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<TextInput>(null);
  const flatListRef = useRef<FlatList>(null);
  const [highlightedPostId, setHighlightedPostId] = useState<string | null>(null);

  const fetchFeed = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const uid = await AsyncStorage.getItem('userId');
      
      console.log('token=', token);
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
      
      // Insert section headers between matched and unmatched posts
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

  // Handle scrolling to specific post from notification
  useEffect(() => {
    const scrollToPostId = route.params?.scrollToPostId;
    
    console.log('Scroll effect triggered:', {
      scrollToPostId,
      hasFilteredPosts: filteredPosts.length > 0,
      hasFlatListRef: !!flatListRef.current,
      totalPosts: filteredPosts.length
    });
    
    if (scrollToPostId && filteredPosts.length > 0 && !loading) {
      // Wait for FlatList to be fully rendered
      const timer = setTimeout(() => {
        const index = filteredPosts.findIndex(item => 
          item.type === 'post' && item._id === scrollToPostId
        );
        
        console.log('Post index found:', index);
        
        if (index !== -1 && flatListRef.current) {
          console.log('Attempting to scroll to index:', index);
          
          try {
            flatListRef.current.scrollToIndex({
              index,
              animated: true,
              viewPosition: 0.2,
            });

            // Highlight the post briefly
            setHighlightedPostId(scrollToPostId);
            setTimeout(() => setHighlightedPostId(null), 3000);
          } catch (error) {
            console.error('Scroll error:', error);
            // Fallback: scroll to offset
            flatListRef.current.scrollToOffset({
              offset: index * 200, // Approximate post height
              animated: true,
            });
            setHighlightedPostId(scrollToPostId);
            setTimeout(() => setHighlightedPostId(null), 3000);
          }
        } else {
          console.log('Post not found in feed');
        }
      }, 1000); // Increased timeout

      return () => clearTimeout(timer);
    }
  }, [filteredPosts, route.params?.scrollToPostId, loading]);

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

  const handleNewPost = () => {
    navigation.navigate('CreatePostScreen' as never);
  };

  // Handle scrollToIndex failures (when item is not in viewport)
  const onScrollToIndexFailed = (info: any) => {
    const wait = new Promise(resolve => setTimeout(resolve, 500));
    wait.then(() => {
      if (flatListRef.current) {
        flatListRef.current.scrollToIndex({
          index: info.index,
          animated: true,
          viewPosition: 0.2,
        });
      }
    });
  };

  // Render function for FlatList items
  const renderItem = ({ item }: any) => {
    if (item.type === 'header') {
      return (
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionHeaderText}>{item.title}</Text>
          <View style={styles.sectionHeaderLine} />
        </View>
      );
    }
    
    // Regular post - add highlight style if this post is highlighted
    const isHighlighted = highlightedPostId === item._id;
    
    return (
      <View style={[
        isHighlighted && styles.highlightedPostContainer
      ]}>
        <PraisePost
          {...item}
          currentUserId={currentUserId}
          onLike={() => handleLike(item._id)}
          onComment={(text: string) => handleComment(item._id, text)}
        />
      </View>
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
        ref={flatListRef}
        data={filteredPosts}
        keyExtractor={item => item.id || item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        onScrollToIndexFailed={onScrollToIndexFailed}
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
  highlightedPostContainer: {
    backgroundColor: `${colors.gradient?.passion?.[0] || '#FF6B6B'}10`,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.gradient?.passion?.[0] || '#FF6B6B',
    padding: 4,
    marginVertical: 4,
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
