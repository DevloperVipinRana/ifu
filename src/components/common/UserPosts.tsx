import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Text,
  RefreshControl,
  Alert,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PraisePost } from './PraisePost';
import { colors } from '../../theme/color';
import { BASE_URL } from '@env';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';

interface Comment {
  user: {
    _id: string;
    name: string;
    profileImage?: string;
  };
  text: string;
  _id?: string;
}

interface Post {
  _id: string;
  user: {
    _id: string;
    name: string;
    profileImage?: string;
  };
  text: string;
  image?: string;
  likes: string[];
  comments: Comment[];
  created_at: string;
  hashtags?: string[];
}

export const UserPosts: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const flatListRef = useRef<FlatList<Post>>(null);

  // ✅ Safely extract optional param
  const scrollToPostId = (route?.params as any)?.scrollToPostId ?? null;

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // --- AUTH ---
  const initializeAuth = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const uid = await AsyncStorage.getItem('userId');

      if (!token || !uid) {
        setError('Authentication required. Please log in again.');
        setLoading(false);
        return false;
      }

      setUserId(uid);
      return true;
    } catch (err) {
      console.error('Error getting auth data:', err);
      setError('Failed to load authentication data.');
      setLoading(false);
      return false;
    }
  };

  // --- FETCH POSTS ---
  const fetchUserPosts = async (isRefresh = false) => {
    try {
      if (!isRefresh) setLoading(true);
      setError(null);

      const token = await AsyncStorage.getItem('token');
      if (!token) {
        setError('Authentication required. Please log in again.');
        setLoading(false);
        return;
      }

      console.log('🔍 Fetching user posts...');
      const response = await fetch(`${BASE_URL}/api/posts/my-posts`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to fetch posts');

      const data = await response.json();
      console.log(`✅ Received ${data.length} posts`);
      setPosts(data);

      // --- Scroll to a specific post if requested ---
      if (scrollToPostId && data.length > 0) {
        setTimeout(() => {
          const index = data.findIndex((p: Post) => p._id === scrollToPostId);
          if (index !== -1 && flatListRef.current) {
            flatListRef.current.scrollToIndex({
              index,
              animated: true,
              viewPosition: 0.5,
            });
          }
        }, 500);
      }
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to load your posts. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      const success = await initializeAuth();
      if (success) await fetchUserPosts();
    };
    init();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchUserPosts(true);
  };

  // --- LIKE / UNLIKE ---
  const handleLike = async (postId: string) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'Authentication required. Please log in again.');
        return;
      }

      const response = await fetch(`${BASE_URL}/api/posts/${postId}/like`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to like/unlike post');

      const data = await response.json();
      setPosts(prev =>
        prev.map(post =>
          post._id === postId ? { ...post, likes: data.likes } : post
        )
      );
    } catch (err) {
      console.error('Error liking post:', err);
      Alert.alert('Error', 'Failed to update like. Please try again.');
    }
  };

  // --- COMMENT ---
  const handleComment = async (postId: string, text: string) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'Authentication required. Please log in again.');
        return;
      }

      const response = await fetch(`${BASE_URL}/api/posts/${postId}/comment`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) throw new Error('Failed to add comment');

      const data = await response.json();
      setPosts(prev =>
        prev.map(post =>
          post._id === postId ? { ...post, comments: data.comments } : post
        )
      );
    } catch (err) {
      console.error('Error adding comment:', err);
      Alert.alert('Error', 'Failed to add comment. Please try again.');
    }
  };

  // --- DELETE POST ---
  const handleDeletePost = async (postId: string) => {
    Alert.alert('Delete Post', 'Are you sure you want to delete this post?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
              Alert.alert('Error', 'Authentication required. Please log in again.');
              return;
            }

            const response = await fetch(`${BASE_URL}/api/posts/${postId}`, {
              method: 'DELETE',
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            });

            if (!response.ok) throw new Error('Failed to delete post');

            setPosts(prev => prev.filter(post => post._id !== postId));
            Alert.alert('Success', 'Post deleted successfully');
          } catch (err) {
            console.error('Error deleting post:', err);
            Alert.alert('Error', 'Failed to delete post. Please try again.');
          }
        },
      },
    ]);
  };

  // --- RENDER HELPERS ---
  const renderPost = ({ item }: { item: Post }) => (
    <View style={styles.postContainer}>
      <PraisePost
        _id={item._id}
        user={item.user}
        text={item.text}
        image={item.image}
        likes={item.likes}
        comments={item.comments}
        onLike={() => handleLike(item._id)}
        onComment={text => handleComment(item._id, text)}
        currentUserId={userId || ''}
      />
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeletePost(item._id)}>
        <Icon name="trash-outline" size={20} color={colors.gradient.passion[0]} />
        <Text style={styles.deleteText}>Delete Post</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.gradient.passion[0]} />
        <Text style={styles.loadingText}>Loading your posts...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Posts</Text>
      </View>

      <FlatList
        ref={flatListRef}
        data={posts}
        renderItem={renderPost}
        keyExtractor={item => item._id}
        contentContainerStyle={[
          styles.listContent,
          posts.length === 0 && styles.emptyListContent,
        ]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.gradient.passion[0]]}
            tintColor={colors.gradient.passion[0]}
          />
        }
        showsVerticalScrollIndicator={false}
        onScrollToIndexFailed={info => {
          console.warn('Scroll failed for index', info.index);
          setTimeout(() => {
            if (flatListRef.current && info.averageItemLength > 0) {
              const offset = info.averageItemLength * info.index;
              flatListRef.current.scrollToOffset({ offset, animated: true });
            }
          }, 500);
        }}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Icon name="document-text-outline" size={80} color={colors.text.secondary} />
            <Text style={styles.emptyTitle}>No Posts Yet</Text>
            <Text style={styles.emptySubtitle}>Share your first post!</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 6,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: colors.text.primary,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background?.primary || '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.text.secondary,
  },
  listContent: {
    padding: 16,
  },
  emptyListContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  postContainer: {
    marginBottom: 8,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: -12,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  deleteText: {
    marginLeft: 8,
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: colors.gradient.passion[0],
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: colors.text.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: colors.text.secondary,
    textAlign: 'center',
  },
});

export default UserPosts;






// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   StyleSheet,
//   FlatList,
//   ActivityIndicator,
//   Text,
//   RefreshControl,
//   Alert,
//   TouchableOpacity,
// } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { PraisePost } from './PraisePost';
// import { colors } from '../../theme/color';
// import { BASE_URL } from '@env';
// import Icon from 'react-native-vector-icons/Ionicons';
// import { useNavigation } from '@react-navigation/native';

// interface Comment {
//   user: {
//     _id: string;
//     name: string;
//     profileImage?: string;
//   };
//   text: string;
//   _id?: string;
// }

// interface Post {
//   _id: string;
//   user: {
//     _id: string;
//     name: string;
//     profileImage?: string;
//   };
//   text: string;
//   image?: string;
//   likes: string[];
//   comments: Comment[];
//   created_at: string;
//   hashtags?: string[];
// }

// export const UserPosts: React.FC = () => {

//     const navigation = useNavigation();


//   const [posts, setPosts] = useState<Post[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [userId, setUserId] = useState<string | null>(null);

//   // Get userId from AsyncStorage
//   const initializeAuth = async () => {
//     try {
//       const token = await AsyncStorage.getItem('token');
//       const uid = await AsyncStorage.getItem('userId');
      
//       if (!token || !uid) {
//         setError('Authentication required. Please log in again.');
//         setLoading(false);
//         return false;
//       }
      
//       setUserId(uid);
//       return true;
//     } catch (err) {
//       console.error('Error getting auth data:', err);
//       setError('Failed to load authentication data.');
//       setLoading(false);
//       return false;
//     }
//   };

//   // Fetch user's posts using the new /my-posts endpoint
//   const fetchUserPosts = async (isRefresh = false) => {
//     try {
//       if (!isRefresh) setLoading(true);
//       setError(null);

//       // Get fresh token
//       const token = await AsyncStorage.getItem('token');

//       if (!token) {
//         setError('Authentication required. Please log in again.');
//         setLoading(false);
//         return;
//       }

//       console.log('🔍 Fetching user posts from /api/posts/my-posts');

//       const response = await fetch(`${BASE_URL}/api/posts/my-posts`, {
//         method: 'GET',
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       });

//       if (!response.ok) {
//         throw new Error('Failed to fetch posts');
//       }

//       const data = await response.json();
      
//       console.log(`✅ Received ${data.length} posts`);
      
//       setPosts(data);
//     } catch (err) {
//       console.error('Error fetching user posts:', err);
//       setError('Failed to load your posts. Please try again.');
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   useEffect(() => {
//     const initialize = async () => {
//       const success = await initializeAuth();
//       if (success) {
//         await fetchUserPosts();
//       }
//     };
//     initialize();
//   }, []);

//   const onRefresh = () => {
//     setRefreshing(true);
//     fetchUserPosts(true);
//   };

//   // Handle like/unlike post
//   const handleLike = async (postId: string) => {
//     try {
//       const token = await AsyncStorage.getItem('token');
      
//       if (!token) {
//         Alert.alert('Error', 'Authentication required. Please log in again.');
//         return;
//       }

//       const response = await fetch(`${BASE_URL}/api/posts/${postId}/like`, {
//         method: 'PUT',
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       });

//       if (!response.ok) {
//         throw new Error('Failed to like/unlike post');
//       }

//       const data = await response.json();

//       // Update local state
//       setPosts((prevPosts) =>
//         prevPosts.map((post) =>
//           post._id === postId ? { ...post, likes: data.likes } : post
//         )
//       );
//     } catch (err) {
//       console.error('Error liking post:', err);
//       Alert.alert('Error', 'Failed to update like. Please try again.');
//     }
//   };

//   // Handle add comment
//   const handleComment = async (postId: string, text: string) => {
//     try {
//       const token = await AsyncStorage.getItem('token');
      
//       if (!token) {
//         Alert.alert('Error', 'Authentication required. Please log in again.');
//         return;
//       }

//       const response = await fetch(`${BASE_URL}/api/posts/${postId}/comment`, {
//         method: 'POST',
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ text }),
//       });

//       if (!response.ok) {
//         throw new Error('Failed to add comment');
//       }

//       const data = await response.json();

//       // Update local state with new comments
//       setPosts((prevPosts) =>
//         prevPosts.map((post) =>
//           post._id === postId ? { ...post, comments: data.comments } : post
//         )
//       );
//     } catch (err) {
//       console.error('Error adding comment:', err);
//       Alert.alert('Error', 'Failed to add comment. Please try again.');
//     }
//   };

//   // Handle delete post
//   const handleDeletePost = async (postId: string) => {
//     Alert.alert(
//       'Delete Post',
//       'Are you sure you want to delete this post?',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Delete',
//           style: 'destructive',
//           onPress: async () => {
//             try {
//               const token = await AsyncStorage.getItem('token');
              
//               if (!token) {
//                 Alert.alert('Error', 'Authentication required. Please log in again.');
//                 return;
//               }

//               const response = await fetch(`${BASE_URL}/api/posts/${postId}`, {
//                 method: 'DELETE',
//                 headers: {
//                   Authorization: `Bearer ${token}`,
//                   'Content-Type': 'application/json',
//                 },
//               });

//               if (!response.ok) {
//                 throw new Error('Failed to delete post');
//               }

//               // Remove post from local state
//               setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
//               Alert.alert('Success', 'Post deleted successfully');
//             } catch (err) {
//               console.error('Error deleting post:', err);
//               Alert.alert('Error', 'Failed to delete post. Please try again.');
//             }
//           },
//         },
//       ]
//     );
//   };

//   const renderPost = ({ item }: { item: Post }) => (
//     <View style={styles.postContainer}>
//       <PraisePost
//         _id={item._id}
//         user={item.user}
//         text={item.text}
//         image={item.image}
//         likes={item.likes}
//         comments={item.comments}
//         onLike={() => handleLike(item._id)}
//         onComment={(text) => handleComment(item._id, text)}
//         currentUserId={userId || ''}
//       />
//       <TouchableOpacity
//         style={styles.deleteButton}
//         onPress={() => handleDeletePost(item._id)}
//       >
//         <Icon name="trash-outline" size={20} color={colors.gradient.passion[0]} />
//         <Text style={styles.deleteText}>Delete Post</Text>
//       </TouchableOpacity>
//     </View>
//   );

//   const renderEmptyState = () => (
//     <View style={styles.emptyContainer}>
//       <Icon name="document-text-outline" size={80} color={colors.text.secondary} />
//       <Text style={styles.emptyTitle}>No Posts Yet</Text>
//       <Text style={styles.emptySubtitle}>
//         Share your first post with the community!
//       </Text>
//     </View>
//   );

//   const renderError = () => (
//     <View style={styles.errorContainer}>
//       <Icon name="alert-circle-outline" size={80} color={colors.gradient.passion[0]} />
//       <Text style={styles.errorTitle}>Oops!</Text>
//       <Text style={styles.errorSubtitle}>{error}</Text>
//       <TouchableOpacity style={styles.retryButton} onPress={() => fetchUserPosts()}>
//         <Text style={styles.retryButtonText}>Try Again</Text>
//       </TouchableOpacity>
//     </View>
//   );

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color={colors.gradient.passion[0]} />
//         <Text style={styles.loadingText}>Loading your posts...</Text>
//       </View>
//     );
//   }

//   if (error && posts.length === 0) {
//     return renderError();
//   }

//   return (
//     <View style={styles.container}>
//         {/* Header */}
//     <View style={styles.header}>
//       <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
//         <Icon name="arrow-back" size={24} color={colors.text.primary} />
//       </TouchableOpacity>
//       <Text style={styles.headerTitle}>Your Posts</Text>
//     </View>
//       <FlatList
//         data={posts}
//         renderItem={renderPost}
//         keyExtractor={(item) => item._id}
//         contentContainerStyle={[
//           styles.listContent,
//           posts.length === 0 && styles.emptyListContent,
//         ]}
//         ListEmptyComponent={renderEmptyState}
//         refreshControl={
//           <RefreshControl
//             refreshing={refreshing}
//             onRefresh={onRefresh}
//             colors={[colors.gradient.passion[0]]}
//             tintColor={colors.gradient.passion[0]}
//           />
//         }
//         showsVerticalScrollIndicator={false}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//     header: {
//     marginTop: 20,
//   flexDirection: 'row',
//   alignItems: 'center',
//   paddingHorizontal: 16,
//   paddingVertical: 12,
//   backgroundColor: colors.background.primary,
//   borderBottomWidth: 1,
//   borderBottomColor: '#E5E7EB',
// },
// backButton: {
//   padding: 6,
//   marginRight: 10,
// },
// headerTitle: {
//   fontSize: 20,
//   fontFamily: 'Inter-SemiBold',
//   color: colors.text.primary,
// },

//   container: {
//     flex: 1,
//     backgroundColor: colors.background?.primary || '#F9FAFB',
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: colors.background?.primary || '#F9FAFB',
//   },
//   loadingText: {
//     marginTop: 16,
//     fontSize: 16,
//     fontFamily: 'Inter-Medium',
//     color: colors.text.secondary,
//   },
//   listContent: {
//     padding: 16,
//   },
//   emptyListContent: {
//     flexGrow: 1,
//     justifyContent: 'center',
//   },
//   postContainer: {
//     marginBottom: 8,
//   },
//   deleteButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: 'white',
//     borderRadius: 16,
//     paddingVertical: 12,
//     paddingHorizontal: 16,
//     marginTop: -12,
//     marginHorizontal: 16,
//     marginBottom: 16,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 10,
//     elevation: 2,
//   },
//   deleteText: {
//     marginLeft: 8,
//     fontSize: 14,
//     fontFamily: 'Inter-SemiBold',
//     color: colors.gradient.passion[0],
//   },
//   emptyContainer: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingHorizontal: 32,
//   },
//   emptyTitle: {
//     fontSize: 24,
//     fontFamily: 'Inter-Bold',
//     color: colors.text.primary,
//     marginTop: 16,
//     marginBottom: 8,
//   },
//   emptySubtitle: {
//     fontSize: 16,
//     fontFamily: 'Inter-Regular',
//     color: colors.text.secondary,
//     textAlign: 'center',
//     lineHeight: 24,
//   },
//   errorContainer: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingHorizontal: 32,
//     backgroundColor: colors.background?.primary || '#F9FAFB',
//   },
//   errorTitle: {
//     fontSize: 24,
//     fontFamily: 'Inter-Bold',
//     color: colors.text.primary,
//     marginTop: 16,
//     marginBottom: 8,
//   },
//   errorSubtitle: {
//     fontSize: 16,
//     fontFamily: 'Inter-Regular',
//     color: colors.text.secondary,
//     textAlign: 'center',
//     lineHeight: 24,
//     marginBottom: 24,
//   },
//   retryButton: {
//     backgroundColor: colors.gradient.passion[0],
//     paddingHorizontal: 32,
//     paddingVertical: 12,
//     borderRadius: 24,
//   },
//   retryButtonText: {
//     fontSize: 16,
//     fontFamily: 'Inter-Bold',
//     color: 'white',
//   },
// });