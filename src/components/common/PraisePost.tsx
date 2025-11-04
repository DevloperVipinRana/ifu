import React, { useState } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity, TextInput, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { CardHeader, Body } from '../common/StyledText';
import { colors } from '../../theme/color';
import { BASE_URL } from '@env';

interface Comment {
  user: {
    _id: string;
    name: string;
    profileImage?: string;
  };
  text: string;
  _id?: string;
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

        <TouchableOpacity style={styles.actionButton}>
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
});


