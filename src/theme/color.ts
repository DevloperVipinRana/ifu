// mobile/src/theme/colors.ts
export const colors = {
  // Base Colors
  background: {
    primary: '#F4F7FF', // A very light, slightly blue off-white
    secondary: '#FFFFFF', // For cards
  },
  text: {
    primary: '#2D3748', // A dark charcoal, not pure black
    secondary: '#718096', // A muted gray for subtitles
    onGradient: '#FFFFFF', // White text for use on gradient buttons
  },
  
  // Gradients (Define the start and end colors)
  gradient: {
    warm: ['#FF8A65', '#FFB74D'],   // Orange -> Yellow
    cool: ['#4FC3F7', '#64B5F6'],   // Light Blue -> Blue
    passion: ['#F06292', '#BA68C8'], // Pink -> Purple
    success: ['#81C784', '#AED581'], // Green -> Light Green
    sky: ['#81D4FA', '#4FC3F7'],     // Light Sky -> Sky Blue
    lavender: ['#B39DDB', '#9575CD'],// Light Purple -> Purple
    mint: ['#A5D6A7', '#81C784'],    // Light Mint -> Mint Green
  },
    system: {
    warning: '#EF5350', // A standard red for warnings/deletes
    success: '#66BB6A', // A standard green
  },

  // UI Elements
  icon: '#A0AEC0',
  iconActive: '#2D3748', // Or a primary brand color
  border: '#E2E8F0',
};
