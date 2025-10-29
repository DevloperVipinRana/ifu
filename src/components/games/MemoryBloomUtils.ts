// mobile/src/utils/gameUtils.ts

// These are the core icons representing life areas.
// We've added more to support up to 8 pairs for "Hard" difficulty.
const ICONS = [
  'barbell-outline', // Fitness
  'leaf-outline',    // Mindfulness
  'book-outline',    // Learning
  'heart-outline',   // Relationships
  'bulb-outline',    // Creativity
  'cash-outline',    // Finance
  'musical-notes-outline', // Hobbies / Music
  'color-palette-outline', // Art / Hobbies
];

export interface Card {
  id: string;
  iconName: string;
  isMatched: boolean;
}

// This function creates a shuffled deck of card pairs for our game.
export const createMemoryBoard = (pairCount: number = 6): Card[] => {
  if (pairCount > ICONS.length) {
    throw new Error('Not enough unique icons for the requested number of pairs.');
  }

  // 1. Select the icons we'll use for this game
  const selectedIcons = ICONS.slice(0, pairCount);

  // 2. Create two cards for each selected icon
  const cardPairs: Card[] = [];
  selectedIcons.forEach((iconName, index) => {
    cardPairs.push({ id: `card_${index}_a`, iconName, isMatched: false });
    cardPairs.push({ id: `card_${index}_b`, iconName, isMatched: false });
  });

  // 3. Shuffle the deck randomly
  // (Fisher-Yates shuffle algorithm)
  for (let i = cardPairs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cardPairs[i], cardPairs[j]] = [cardPairs[j], cardPairs[i]];
  }

  return cardPairs;
};