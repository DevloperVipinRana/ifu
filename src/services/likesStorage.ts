import AsyncStorage from '@react-native-async-storage/async-storage';

const keyForUser = (userId: string) => `likedPosts:${userId}`;

export async function getLikedPostsForUser(userId: string): Promise<Set<string>> {
  if (!userId) return new Set();
  try {
    const raw = await AsyncStorage.getItem(keyForUser(userId));
    if (!raw) return new Set();
    const arr = JSON.parse(raw) as string[];
    return new Set(arr);
  } catch {
    return new Set();
  }
}

export async function setLikedPostsForUser(userId: string, liked: Set<string>): Promise<void> {
  if (!userId) return;
  try {
    const arr = Array.from(liked);
    await AsyncStorage.setItem(keyForUser(userId), JSON.stringify(arr));
  } catch {
    // noop
  }
}

export async function toggleLikeForUser(userId: string, postId: string): Promise<Set<string>> {
  const liked = await getLikedPostsForUser(userId);
  if (liked.has(postId)) {
    liked.delete(postId);
  } else {
    liked.add(postId);
  }
  await setLikedPostsForUser(userId, liked);
  return liked;
}


