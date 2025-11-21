import React, { useState } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity, TextInput, Dimensions, Modal, FlatList, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { CardHeader, Body } from '../common/StyledText';
import { colors } from '../../theme/color';
import { BASE_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Comment {
  user: {
    _id: string;
    name: string;
    profileImage?: string;
  };
  text: string;
  _id?: string;
}

interface User {
  _id: string;
  name: string;
  profileImage?: string;
}

interface PraisePostProps {
  _id: string;
  user: { name: string; profileImage?: string; _id: string };
  text: string;
  image?: string;
  likes: string[];
  comments: Comment[];
  onLike: () => void;
  onComment: (text: string) => void;
  currentUserId: string;
}

const SCREEN_WIDTH = Dimensions.get('window').width;
const MAX_IMAGE_HEIGHT = 500;

export const PraisePost: React.FC<PraisePostProps> = ({
  _id,
  user,
  text,
  image,
  likes,
  comments,
  onLike,
  onComment,
  currentUserId,
}) => {
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [imageAspectRatio, setImageAspectRatio] = useState<number | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [sharingTo, setSharingTo] = useState<string | null>(null);

  const { name, profileImage: initialProfileImage } = user;

  // Check if current user has liked this post
  const isPraised = likes.includes(currentUserId);

  const handlePraise = () => {
    onLike();
  };

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    onComment(commentText.trim());
    setCommentText('');
  };

  // Get image dimensions when loaded
  const handleImageLoad = (imageUri: string) => {
    Image.getSize(
      imageUri,
      (width, height) => {
        const aspectRatio = width / height;
        setImageAspectRatio(aspectRatio);
      },
      (error) => {
        console.error('Failed to get image size:', error);
        setImageAspectRatio(16 / 9);
      }
    );
  };

  // Calculate image height based on aspect ratio
  const getImageHeight = () => {
    if (!imageAspectRatio) return 250;
    
    const calculatedHeight = SCREEN_WIDTH / imageAspectRatio;
    return Math.min(calculatedHeight, MAX_IMAGE_HEIGHT);
  };

  // Fetch users for sharing
  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const token = await AsyncStorage.getItem('token');
      
      const response = await fetch(`${BASE_URL}/api/posts/${_id}/share-users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleSharePress = () => {
    setShowShareModal(true);
    fetchUsers();
  };

  const handleShareToUser = async (userId: string) => {
    try {
      setSharingTo(userId);
      const token = await AsyncStorage.getItem('token');
      
      const response = await fetch(`${BASE_URL}/api/posts/${_id}/share`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ recipientId: userId }),
      });

      if (response.ok) {
        // Remove the user from the list after successful share
        setUsers(prev => prev.filter(u => u._id !== userId));
        
        // Show success feedback
        setTimeout(() => {
          setSharingTo(null);
        }, 500);
      }
    } catch (error) {
      console.error('Error sharing post:', error);
      setSharingTo(null);
    }
  };

  const profileImageSource =
    initialProfileImage && initialProfileImage !== 'null' && initialProfileImage !== ''
      ? { uri: `${BASE_URL}${initialProfileImage}` }
      : require('../../assets/images/default_profile.jpg');

  // Get full image URL
  const fullImageUrl = image
    ? image.startsWith('http')
      ? image
      : `${BASE_URL}${image}`
    : null;

  // Load image dimensions when component mounts
  React.useEffect(() => {
    if (fullImageUrl) {
      handleImageLoad(fullImageUrl);
    }
  }, [fullImageUrl]);

  const renderUserItem = ({ item }: { item: User }) => {
    const userProfileImage =
      item.profileImage && item.profileImage !== 'null' && item.profileImage !== ''
        ? { uri: `${BASE_URL}${item.profileImage}` }
        : require('../../assets/images/default_profile.jpg');

    const isSharing = sharingTo === item._id;

    return (
      <TouchableOpacity
        style={styles.userItem}
        onPress={() => handleShareToUser(item._id)}
        disabled={isSharing}
      >
        <Image source={userProfileImage} style={styles.userAvatar} />
        <Text style={styles.userName}>{item.name}</Text>
        {isSharing ? (
          <ActivityIndicator size="small" color={colors.gradient.passion[0]} />
        ) : (
          <Icon name="paper-plane-outline" size={20} color={colors.gradient.passion[0]} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Image source={profileImageSource} style={styles.avatar} />
        <CardHeader>{name}</CardHeader>
      </View>

      <Body style={styles.postText}>{text}</Body>
      
      {fullImageUrl && (
        <Image
          source={{ uri: fullImageUrl }}
          style={[
            styles.postImage,
            {
              height: getImageHeight(),
              aspectRatio: imageAspectRatio || undefined,
            },
          ]}
          resizeMode="cover"
        />
      )}

      <View style={styles.footer}>
        <TouchableOpacity style={styles.actionButton} onPress={handlePraise}>
          <Icon
            name={isPraised ? 'heart' : 'heart-outline'}
            size={24}
            color={isPraised ? colors.gradient.passion[0] : colors.text.secondary}
          />
          <Text style={[styles.actionText, isPraised && { color: colors.gradient.passion[0] }]}>
            {likes.length} Praises
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={() => setShowComments(!showComments)}>
          <Icon name="chatbubble-outline" size={24} color={colors.text.secondary} />
          <Text style={styles.actionText}>{comments.length} Comments</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleSharePress}>
          <Icon name="arrow-redo-outline" size={24} color={colors.text.secondary} />
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>
      </View>

      {showComments && (
        <View style={styles.commentsSection}>
          {comments.map((c, idx) => (
            <View key={c._id || idx} style={styles.commentItem}>
              <View style={styles.commentHeader}>
                <Image
                  source={
                    c.user?.profileImage && c.user.profileImage !== 'null' && c.user.profileImage !== ''
                      ? { uri: `${BASE_URL}${c.user.profileImage}` }
                      : require('../../assets/images/default_profile.jpg')
                  }
                  style={styles.commentAvatar}
                />
                <View style={styles.commentContent}>
                  <Text style={styles.commentUserName}>{c.user?.name || 'Unknown User'}</Text>
                  <Text style={styles.commentText}>{c.text}</Text>
                </View>
              </View>
            </View>
          ))}
          
          <View style={styles.addCommentContainer}>
            <TextInput
              value={commentText}
              onChangeText={setCommentText}
              placeholder="Add a comment..."
              placeholderTextColor={colors.text?.secondary || '#999'}
              style={styles.commentInput}
            />
            <TouchableOpacity onPress={handleAddComment} style={styles.sendButton}>
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Share Modal */}
      <Modal
        visible={showShareModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowShareModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Share Post</Text>
              <TouchableOpacity onPress={() => setShowShareModal(false)}>
                <Icon name="close" size={28} color={colors.text.primary} />
              </TouchableOpacity>
            </View>

            {loadingUsers ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.gradient.passion[0]} />
              </View>
            ) : users.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Icon name="people-outline" size={60} color={colors.text.secondary} />
                <Text style={styles.emptyText}>No users available to share with</Text>
              </View>
            ) : (
              <FlatList
                data={users}
                keyExtractor={(item) => item._id}
                renderItem={renderUserItem}
                contentContainerStyle={styles.userList}
              />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    overflow: 'hidden',
  },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 15 
  },
  avatar: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    marginRight: 10, 
    backgroundColor: colors.border 
  },
  postText: { 
    fontSize: 16, 
    lineHeight: 24, 
    paddingHorizontal: 20 
  },
  postImage: { 
    width: '100%',
    marginTop: 10,
  },
  footer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-around', 
    borderTopWidth: 1, 
    borderColor: colors.border 
  },
  actionButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 15 
  },
  actionText: { 
    marginLeft: 8, 
    fontFamily: 'Inter-SemiBold', 
    color: colors.text.secondary 
  },
  commentsSection: {
    paddingHorizontal: 15,
    paddingBottom: 15,
    paddingTop: 10,
  },
  commentItem: {
    marginBottom: 12,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
    backgroundColor: colors.border,
  },
  commentContent: {
    flex: 1,
    backgroundColor: colors.background?.secondary || '#F9FAFB',
    borderRadius: 16,
    padding: 5,
  },
  commentUserName: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    color: colors.text?.primary || '#111827',
    marginBottom: 4,
    marginTop: -10,
  },
  commentText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.text?.primary || '#111827',
    lineHeight: 20,
  },
  addCommentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.text?.primary || '#333',
  },
  sendButton: {
    marginLeft: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sendButtonText: {
    color: colors.gradient.passion[0],
    fontFamily: 'Inter-Bold',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: colors.text.primary,
  },
  userList: {
    padding: 20,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.background?.secondary || '#F9FAFB',
    borderRadius: 12,
    marginBottom: 10,
  },
  userAvatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    marginRight: 12,
    backgroundColor: colors.border,
  },
  userName: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: colors.text.primary,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: colors.text.secondary,
  },
});
