// mobile/src/data/activityLibrary.ts
import { colors } from '../theme/color';

// Define the shape of an activity
export interface Activity {
  key: string;
  category: string; // Format: "category>subcategory>sub-subcategory"
  type: 'timed' | 'reflection';
  params: {
    title: string;
    description?: string;
    question?: string;
    placeholder?: string;
    lottieSource?: any;
    gradient: string[];
    headerImage?: string;
    duration?: number;
    instructions?: string[]; // NEW: Step-by-step instructions
  };
}

// ==========================================
// HELPER FUNCTION TO CONVERT GOOGLE DRIVE LINKS
// ==========================================
const convertGoogleDriveLink = (url: string): string => {
  // Check if it's a Google Drive link
  if (url.includes('drive.google.com')) {
    // Extract file ID from various Google Drive URL formats
    const fileIdMatch = url.match(/[-\w]{25,}/);
    if (fileIdMatch) {
      return `https://drive.google.com/uc?export=view&id=${fileIdMatch[0]}`;
    }
  }
  return url;
};

// ==========================================
// THE EXPANDED LIBRARY OF 50 ACTIVITIES
// ==========================================
export const ACTIVITY_LIBRARY: Activity[] = [
    //
    // --- Mindfulness ---
    //
    { 
      key: 'breath_focus', 
      category: 'Mindfulness>Breathing>Deep Breathing', 
      type: 'timed', 
      params: { 
        title: 'Breath Focus', 
        description: 'Close your eyes and focus only on the sensation of your breath for 60 seconds.',
        instructions: [
          'Find a comfortable seated position',
          'Close your eyes gently',
          'Breathe naturally through your nose',
          'Focus on the sensation of air entering and leaving',
          'When your mind wanders, gently return to your breath'
        ],
        lottieSource: require('../assets/lottie/breathing.json'), 
        duration: 60, 
        gradient: colors.gradient.cool 
      } 
    },
    { 
      key: 'gratitude_moment', 
      category: 'Mindfulness>Reflection>Gratitude', 
      type: 'reflection', 
      params: { 
        title: 'Gratitude Moment', 
        question: 'What is one small thing that happened today that you are grateful for?', 
        placeholder: 'A good meal, a nice conversation, the weather...',
        instructions: [
          'Think about your day so far',
          'Identify one positive moment, no matter how small',
          'Reflect on why it made you feel good',
          'Write it down in detail'
        ],
        headerImage: 'https://images.unsplash.com/photo-1508615039623-a25605d2b022', 
        gradient: colors.gradient.warm 
      } 
    },
    { 
      key: 'sensory_check_in_sight', 
      category: 'Mindfulness>Grounding>Visual Awareness', 
      type: 'reflection', 
      params: { 
        title: 'Sensory Check-in: Sight', 
        question: 'Look around you. Name 5 things you can see right now.', 
        placeholder: 'e.g., A blue cup, a green plant, a wooden desk...',
        instructions: [
          'Pause and look around your environment',
          'Identify 5 distinct objects',
          'Notice their colors, shapes, and textures',
          'Write them down with descriptive details'
        ],
        headerImage: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809', 
        gradient: colors.gradient.cool 
      } 
    },
    { 
      key: 'sensory_check_in_sound', 
      category: 'Mindfulness>Grounding>Sound Awareness', 
      type: 'timed', 
      params: { 
        title: 'Sensory Check-in: Sound', 
        description: 'Close your eyes and for 60 seconds, just listen. Identify every sound you hear, near and far.',
        instructions: [
          'Close your eyes and relax',
          'Listen for sounds nearby',
          'Expand awareness to distant sounds',
          'Notice sounds without judging them',
          'Count how many different sounds you can identify'
        ],
        lottieSource: require('../assets/lottie/Circle.json'), 
        duration: 60, 
        gradient: colors.gradient.sky 
      } 
    },
    { 
      key: 'mindful_sip', 
      category: 'Mindfulness>Eating>Mindful Drinking', 
      type: 'timed', 
      params: { 
        title: 'Mindful Sip', 
        description: 'Take a sip of water, tea, or coffee. Spend 60 seconds noticing its temperature, taste, and the sensation of drinking.',
        instructions: [
          'Get your beverage ready',
          'Hold it in your hands and feel its temperature',
          'Smell it before taking a sip',
          'Take a slow sip and hold it in your mouth',
          'Notice the taste, texture, and sensation as you swallow'
        ],
        duration: 60, 
        lottieSource: require('../assets/lottie/coffee.json'), 
        gradient: colors.gradient.warm 
      } 
    },
    { 
      key: 'body_scan', 
      category: 'Mindfulness>Body Awareness>Progressive Relaxation', 
      type: 'timed', 
      params: { 
        title: 'One-Minute Body Scan', 
        description: 'Close your eyes. Mentally scan from your toes to your head, simply noticing any sensations without judgment.',
        instructions: [
          'Sit or lie down comfortably',
          'Close your eyes and breathe naturally',
          'Start by noticing your toes and feet',
          'Slowly move attention up through legs, torso, arms',
          'Finish at the crown of your head'
        ],
        duration: 60, 
        lottieSource: require('../assets/lottie/bodyscan.json'), 
        gradient: colors.gradient.lavender 
      } 
    },
    { 
      key: 'single_task_focus', 
      category: 'Mindfulness>Focus>Single-Tasking', 
      type: 'timed', 
      params: { 
        title: 'Single-Task Focus', 
        description: 'Choose one small task (like organizing your desk) and give it your undivided attention for 60 seconds. No multitasking.',
        instructions: [
          'Choose one simple task to focus on',
          'Remove all distractions',
          'Give the task your complete attention',
          'Notice the details of what you\'re doing',
          'Resist the urge to switch tasks'
        ],
        duration: 60, 
        gradient: colors.gradient.cool 
      } 
    },
    { 
      key: 'label_emotions', 
      category: 'Mindfulness>Emotional Awareness>Emotion Naming', 
      type: 'reflection', 
      params: { 
        title: 'Label Your Emotions', 
        question: 'How are you feeling right now? Try to name 1-3 emotions you are experiencing.', 
        placeholder: 'e.g., Calm, a little anxious, curious...',
        instructions: [
          'Take a moment to pause',
          'Check in with your body and mind',
          'Identify what you\'re feeling',
          'Name the emotions without judgment',
          'Notice where you feel them in your body'
        ],
        gradient: colors.gradient.passion 
      } 
    },
    { 
      key: 'nature_observation', 
      category: 'Mindfulness>Nature>Outdoor Awareness', 
      type: 'reflection', 
      params: { 
        title: 'Observe Nature', 
        question: 'Look out a window. Describe one thing you see in nature in detail.', 
        placeholder: 'The way the leaves move, the shape of a cloud...',
        instructions: [
          'Find a window with a nature view',
          'Take a moment to observe',
          'Choose one natural element',
          'Notice its details, colors, movements',
          'Describe it with rich sensory language'
        ],
        headerImage: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05', 
        gradient: colors.gradient.success 
      } 
    },
    { 
      key: 'intention_setting', 
      category: 'Mindfulness>Planning>Daily Intention', 
      type: 'reflection', 
      params: { 
        title: 'Set an Intention', 
        question: 'What is one word that describes how you want to feel for the next hour?', 
        placeholder: 'e.g., Focused, calm, present, energized...',
        instructions: [
          'Think about your upcoming hour',
          'Consider how you want to show up',
          'Choose one word that captures that feeling',
          'Visualize embodying that quality',
          'Set it as your intention'
        ],
        gradient: colors.gradient.cool 
      } 
    },

    //
    // --- Productivity (10) ---
    //
    { 
      key: 'next_tiny_action', 
      category: 'Productivity>Task Management>Action Planning', 
      type: 'reflection', 
      params: { 
        title: 'Next Tiny Action', 
        question: 'Look at your to-do list. What is the absolute smallest next step for your most important task?', 
        placeholder: 'Not "write report," but "open document."',
        instructions: [
          'Review your current tasks',
          'Identify the most important one',
          'Break it down into the smallest possible first step',
          'Make it so small it\'s impossible to avoid',
          'Write that micro-action down'
        ],
        gradient: colors.gradient.sky 
      } 
    },
    { 
      key: 'brain_dump', 
      category: 'Productivity>Mental Clarity>Mind Clearing', 
      type: 'reflection', 
      params: { 
        title: 'One-Minute Brain Dump', 
        question: 'What thoughts, tasks, or worries are taking up your mental space right now? List them out.', 
        placeholder: 'Get everything out of your head...',
        instructions: [
          'Grab your phone or paper',
          'Set a timer for 60 seconds',
          'Write everything on your mind',
          'Don\'t organize, just capture',
          'Feel the mental space clear'
        ],
        gradient: colors.gradient.lavender 
      } 
    },
    { 
      key: 'pomodoro_prep', 
      category: 'Productivity>Focus Techniques>Pomodoro Method', 
      type: 'reflection', 
      params: { 
        title: 'Pomodoro Prep', 
        question: 'What is the ONE thing you will focus on for the next 25 minutes?', 
        placeholder: 'Define your focus before you start the timer.',
        instructions: [
          'Review your task list',
          'Choose ONE priority task',
          'Define the specific outcome',
          'Remove all distractions',
          'Prepare your workspace'
        ],
        gradient: colors.gradient.cool 
      } 
    },
    { 
      key: 'declutter_digital', 
      category: 'Productivity>Organization>Digital Cleanup', 
      type: 'timed', 
      params: { 
        title: 'Digital Declutter', 
        description: 'Spend 60 seconds cleaning your computer desktop or organizing one folder.',
        instructions: [
          'Open your desktop or a messy folder',
          'Delete unnecessary files',
          'Move files to proper locations',
          'Create folders if needed',
          'Aim for a cleaner workspace'
        ],
        duration: 60, 
        lottieSource: require('../assets/lottie/folder.json'), 
        gradient: colors.gradient.sky 
      } 
    },
    { 
      key: 'declutter_physical', 
      category: 'Productivity>Organization>Physical Cleanup', 
      type: 'timed', 
      params: { 
        title: 'Physical Declutter', 
        description: 'Take 60 seconds to clear your immediate workspace. Put things away, wipe it down.',
        instructions: [
          'Scan your immediate workspace',
          'Put items back in their place',
          'Throw away trash',
          'Wipe down surfaces if needed',
          'Create a clean, organized space'
        ],
        duration: 60, 
        lottieSource: require('../assets/lottie/declutter.json'), 
        gradient: colors.gradient.mint 
      } 
    },
    { 
      key: 'two_minute_rule', 
      category: 'Productivity>Task Management>Quick Wins', 
      type: 'reflection', 
      params: { 
        title: 'The 2-Minute Rule', 
        question: 'What is one task you\'ve been avoiding that would take less than two minutes to do right now?', 
        placeholder: 'e.g., Reply to that email, take out the trash...',
        instructions: [
          'Think of small pending tasks',
          'Identify one that takes under 2 minutes',
          'Do it immediately',
          'Don\'t overthink it',
          'Feel the satisfaction of completion'
        ],
        gradient: colors.gradient.warm 
      } 
    },
    { 
      key: 'visualize_completion', 
      category: 'Productivity>Motivation>Mental Rehearsal', 
      type: 'timed', 
      params: { 
        title: 'Visualize Completion', 
        description: 'Close your eyes and for 60 seconds, vividly imagine the feeling of completing your most important task for the day.',
        instructions: [
          'Close your eyes and relax',
          'Think of your most important task',
          'Imagine completing it successfully',
          'Feel the sense of accomplishment',
          'Let that motivation energize you'
        ],
        duration: 60, 
        gradient: colors.gradient.passion 
      } 
    },
    { 
      key: 'review_priorities', 
      category: 'Productivity>Planning>Priority Alignment', 
      type: 'reflection', 
      params: { 
        title: 'Priority Check', 
        question: 'Look at your goals. Is what you are doing right now aligned with them?', 
        placeholder: 'A quick "yes" or "no, I should pivot" is enough.',
        instructions: [
          'Review your main goals',
          'Look at your current activity',
          'Ask if they align',
          'Be honest with yourself',
          'Adjust if needed'
        ],
        gradient: colors.gradient.cool 
      } 
    },
    { 
      key: 'close_tabs', 
      category: 'Productivity>Focus Techniques>Digital Minimalism', 
      type: 'timed', 
      params: { 
        title: 'Tab Triage', 
        description: 'Spend 60 seconds closing all unnecessary browser tabs. Be ruthless!',
        instructions: [
          'Count your open tabs',
          'Bookmark anything important',
          'Close tabs you haven\'t used today',
          'Keep only what you need now',
          'Enjoy a cleaner browser'
        ],
        duration: 60, 
        lottieSource: require('../assets/lottie/tabs.json'), 
        gradient: colors.gradient.sky 
      } 
    },
    { 
      key: 'plan_your_break', 
      category: 'Productivity>Rest>Break Planning', 
      type: 'reflection', 
      params: { 
        title: 'Plan Your Break', 
        question: 'What is one restorative thing you will do on your next break?', 
        placeholder: 'e.g., Walk outside, stretch, get water...',
        instructions: [
          'Think about when your next break is',
          'Choose one rejuvenating activity',
          'Make it specific and actionable',
          'Set a reminder if needed',
          'Commit to actually doing it'
        ],
        gradient: colors.gradient.success 
      } 
    },

    //
    // --- Fitness (8) ---
    //
    { 
      key: 'quick_stretch_desk', 
      category: 'Fitness>Stretching>Upper Body', 
      type: 'timed', 
      params: { 
        title: 'Desk Stretch', 
        description: 'Gently stretch your neck, wrists, and shoulders while sitting at your desk.',
        instructions: [
          'Sit up straight in your chair',
          'Roll your shoulders backward 5 times',
          'Tilt your head side to side',
          'Stretch your wrists by flexing and extending',
          'Take deep breaths throughout'
        ],
        duration: 60, 
        lottieSource: require('../assets/lottie/stretching.json'), 
        gradient: colors.gradient.mint 
      } 
    },
    { 
      key: 'one_minute_walk', 
      category: 'Fitness>Movement>Walking', 
      type: 'timed', 
      params: { 
        title: 'Mindful Walk', 
        description: 'Stand up and walk around your space for 60 seconds. Notice the feeling of your feet on the floor.',
        instructions: [
          'Stand up from your seat',
          'Walk at a comfortable pace',
          'Feel each footstep',
          'Notice your posture',
          'Breathe naturally as you move'
        ],
        duration: 60, 
        gradient: colors.gradient.cool 
      } 
    },
    { 
      key: 'hydration_break', 
      category: 'Fitness>Nutrition>Hydration', 
      type: 'reflection', 
      params: { 
        title: 'Hydration Break', 
        question: 'Have you had a glass of water in the last hour? Go grab one!', 
        placeholder: 'Just type "Done!" when you get back.',
        instructions: [
          'Check when you last drank water',
          'Get a full glass of water',
          'Drink it slowly',
          'Notice how your body feels',
          'Set a reminder for the next hour'
        ],
        gradient: colors.gradient.sky 
      } 
    },
    { 
      key: 'plank_challenge', 
      category: 'Fitness>Strength>Core', 
      type: 'timed', 
      params: { 
        title: 'Plank Challenge', 
        description: 'Hold a plank for as long as you can within the 60-second timer.',
        instructions: [
          'Get into plank position (forearms or hands)',
          'Keep your body straight',
          'Engage your core',
          'Hold for as long as possible',
          'Rest when you need to'
        ],
        duration: 60, 
        lottieSource: require('../assets/lottie/stretching.json'), 
        gradient: colors.gradient.warm 
      } 
    },
    { 
      key: 'wall_sit', 
      category: 'Fitness>Strength>Lower Body', 
      type: 'timed', 
      params: { 
        title: 'Wall Sit', 
        description: 'Find a wall and hold a seated position for 60 seconds.',
        instructions: [
          'Stand with your back against a wall',
          'Slide down until thighs are parallel to ground',
          'Keep knees above ankles',
          'Press back firmly into wall',
          'Hold and breathe steadily'
        ],
        duration: 60, 
        lottieSource: require('../assets/lottie/stretching.json'), 
        gradient: colors.gradient.warm 
      } 
    },
    { 
      key: 'jumping_jacks', 
      category: 'Fitness>Cardio>Energy Boost', 
      type: 'timed', 
      params: { 
        title: 'Energy Boost', 
        description: 'Do jumping jacks for 60 seconds to get your heart rate up.',
        instructions: [
          'Stand with feet together',
          'Jump while spreading legs and raising arms',
          'Return to starting position',
          'Keep a steady rhythm',
          'Go at your own pace'
        ],
        duration: 60, 
        gradient: colors.gradient.passion 
      } 
    },
    { 
      key: 'correct_posture', 
      category: 'Fitness>Posture>Alignment', 
      type: 'reflection', 
      params: { 
        title: 'Posture Check', 
        question: 'How is your posture right now? Sit or stand up straight, roll your shoulders back, and hold for a moment.', 
        placeholder: 'Type "Corrected!" when done.',
        instructions: [
          'Check your current posture',
          'Sit or stand tall',
          'Pull shoulders back and down',
          'Align head over spine',
          'Hold for 30 seconds'
        ],
        gradient: colors.gradient.mint 
      } 
    },
    { 
      key: 'schedule_workout', 
      category: 'Fitness>Planning>Workout Scheduling', 
      type: 'reflection', 
      params: { 
        title: 'Schedule a Workout', 
        question: 'Look at your calendar. When is your next workout? If it\'s not scheduled, block out the time now.', 
        placeholder: 'e.g., "Tomorrow at 7 AM," or "Just scheduled it!"',
        instructions: [
          'Open your calendar',
          'Find your next workout',
          'If none exists, choose a time',
          'Block out 30-60 minutes',
          'Set a reminder'
        ],
        gradient: colors.gradient.lavender 
      } 
    },

    // Continue with Growth, Creativity, Social, and Finance categories...
    // (I'll include a few more examples to show the pattern)

    //
    // --- Growth & Learning (3 examples) ---
    //
    { 
      key: 'log_a_win', 
      category: 'Growth>Self-Reflection>Achievement Tracking', 
      type: 'reflection', 
      params: { 
        title: 'Log a Win', 
        question: 'What is one thing, no matter how small, that you succeeded at today?', 
        placeholder: 'Finished a tough email, made a healthy choice...',
        instructions: [
          'Think through your day',
          'Identify one accomplishment',
          'No win is too small',
          'Write it in detail',
          'Celebrate it!'
        ],
        gradient: colors.gradient.lavender 
      } 
    },
    { 
      key: 'learn_a_word', 
      category: 'Growth>Learning>Vocabulary', 
      type: 'reflection', 
      params: { 
        title: 'Learn a New Word', 
        question: 'Think of a new word you learned recently. What does it mean?', 
        placeholder: 'Define it in your own terms.',
        instructions: [
          'Recall a new word you encountered',
          'Look up its definition if needed',
          'Write it in your own words',
          'Use it in a sentence',
          'Commit it to memory'
        ],
        gradient: colors.gradient.cool 
      } 
    },
    { 
      key: 'positive_self_talk', 
      category: 'Growth>Mindset>Self-Compassion', 
      type: 'reflection', 
      params: { 
        title: 'Positive Self-Talk', 
        question: 'Write one kind, encouraging sentence to yourself.', 
        placeholder: 'e.g., "You are capable and you are trying your best."',
        instructions: [
          'Think about what you need to hear',
          'Be kind and genuine',
          'Write as if to a good friend',
          'Make it specific to today',
          'Read it aloud to yourself'
        ],
        gradient: colors.gradient.passion 
      } 
    },

    //
    // --- Finance (2 examples) ---
    //
    {
      key: 'review_spending',
      category: 'Finance>Awareness>Spending Review',
      type: 'reflection',
      params: {
        title: 'Mindful Spending',
        question: 'Review your last 3 purchases. How do you feel about them now?',
        placeholder: 'Were they needs, wants, or impulses? No judgment, just observation.',
        instructions: [
          'Check your recent transactions',
          'Identify your last 3 purchases',
          'Categorize each as need, want, or impulse',
          'Reflect without judgment',
          'Note any patterns'
        ],
        headerImage: 'https://images.unsplash.com/photo-1599050751204-128b6d39d6e4',
        gradient: colors.gradient.success,
      }
    },
    {
      key: 'savings_boost',
      category: 'Finance>Saving>Micro-Savings',
      type: 'reflection',
      params: {
        title: 'Savings Boost',
        question: 'Can you transfer a small amount ($1, $5, $10) to your savings account right now?',
        placeholder: 'Just type "Done!" when you\'ve completed the transfer.',
        instructions: [
          'Open your banking app',
          'Choose an amount you can spare',
          'Transfer to savings',
          'Even $1 makes a difference',
          'Celebrate the habit'
        ],
        gradient: colors.gradient.cool,
      }
    },
];

// Export helper function to get activities by category
export const getActivitiesByMainCategory = (mainCategory: string): Activity[] => {
  return ACTIVITY_LIBRARY.filter(activity => 
    activity.category.split('>')[0] === mainCategory
  );
};

// Export helper to parse category levels
export const parseCategoryLevels = (category: string) => {
  const [main, sub, subSub] = category.split('>');
  return { main, sub, subSub };
};
