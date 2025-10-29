// import { colors } from '../assests/theme/color1';
import {colors} from '../../theme/color1'

// We now store all activities in one array.
// Each object defines which screen to go to and what data to pass.
export const ACTIVITIES = [
    {
        key: '5m_breathing',
        title: 'Box Breathing',
        description: 'A 5-minute exercise to calm your nervous system.',
        icon: 'wind', // Feather icon name
        type:'Yoga',
        gradient: colors.gradient.cool,
        screen: 'ActivityPlayerScreen', // This activity opens the player
        params: {
            title: 'Box Breathing',
            description: 'Inhale for 4 seconds, hold for 4, exhale for 4, and hold for 4. Follow the animation and find your calm.',
            lottieSource: require('../../assets/animation/Meditaion.json'),
            duration: 300,
            speed: 1.5,
        },
    },
    {
        key: '5m_tidy',
        title: 'The 5-Minute Tidy',
        description: 'Clear your space to clear your mind.',
        type: 'Focus',
        icon: 'archive', // Feather icon name
        gradient: colors.gradient.warm,
        screen: 'ActivityPlayerScreen',
        params: {
            title: 'The 5-Minute Tidy',
            description: 'Choose one small area and organize it for just 5 minutes. You\'ll be surprised at the difference it makes.',
            lottieSource: require('../../assets/animation/activityAnimation.json'),
            duration: 300,
            speed: 1,
        },
    },
    {
    key: '5m_workout',
    title: 'Mini Workout',
    type: 'Workout',
    description: 'A quick full-body circuit to get your blood flowing.',
    icon: 'zap', // Feather icon name for energy
    gradient: colors.gradient.passion, // Using the Pink -> Purple gradient
    screen: 'ActivityPlayerScreen',
    params: {
        title: '5-Minute Mini Workout',
        description: '10 squats, 10 push-ups, 20 jumping jacks. Repeat the cycle until the timer ends.',
        // IMPORTANT: You will need to find a suitable workout animation and place it here
        lottieSource: require('../../assets/animation/Workout.json'),
        duration: 300, // 5 minutes in seconds
        speed: 1, // Normal playback speed
        style: { width: 260, height: 260 } // A slightly smaller size might fit a workout animation better
    },
},
{
    key: '5m_doo',
    title: 'Doodle Challenge',
    description: 'Unleash your creativity with a quick sketch.',
    type: 'Creative',
    icon: 'edit-3', // Feather icon name for drawing/doodling
    gradient: colors.gradient.warm, // Using the Orange -> Yellow gradient
    screen: 'ActivityPlayerScreen',
    params: {
        title: '5-Minute Doodle Challenge',
        description: 'write anything you see around you for the next 5 minutes. Don\'t judge, just write!',
        duration: 300, 
        style: { width: 280, height: 280 } 
    },
},
{
  key: 'morning_stretch',
  title: 'Morning Stretch',
  type: 'Workout',
  description: 'Wake up your body with gentle stretches and breathing.',
  icon: 'sunrise',
  gradient: colors.gradient.warm, // orange → yellow
  screen: 'ActivityPlayerScreen',
  params: {
    title: 'Morning Stretch Routine',
    description: 'Start your day with 10 neck rolls, 10 arm circles, 10 side stretches, and 5 deep breaths.',
    lottieSource: require('../../assets/animation/Workout.json'),
    duration: 240, // 4 minutes
    speed: 1,
    style: { width: 260, height: 260 }
  }
},
{
  key: 'core_burn',
  title: 'Core Burner',
  type: 'Workout',
  description: 'A quick ab-focused circuit for a strong core.',
  icon: 'activity',
  gradient: colors.gradient.fire, // red → orange
  screen: 'ActivityPlayerScreen',
  params: {
    title: 'Core Burn Challenge',
    description: '20 crunches, 15 leg raises, 30-second plank, repeat twice.',
    lottieSource: require('../../assets/animation/Workout.json'),
    duration: 360, // 6 minutes
    speed: 1,
    style: { width: 260, height: 260 }
  }
},
{
  key: 'cardio_blast',
  title: 'Cardio Blast',
  type: 'Workout',
  description: 'High-energy moves to boost your heart rate fast.',
  icon: 'heart',
  gradient: colors.gradient.passion, // pink → purple
  screen: 'ActivityPlayerScreen',
  params: {
    title: 'Cardio Blast',
    description: '30 jumping jacks, 20 high knees, 10 burpees — go hard and repeat!',
    lottieSource: require('../../assets/animation/Workout.json'),
    duration: 300, // 5 minutes
    speed: 1,
    style: { width: 260, height: 260 }
  }
},
{
  key: 'leg_day',
  title: 'Leg Day Quickie',
  type: 'Workout',
  description: 'Fire up your lower body in just 6 minutes.',
  icon: 'zap',
  gradient: colors.gradient.energy, // yellow → red
  screen: 'ActivityPlayerScreen',
  params: {
    title: 'Leg Day Quickie',
    description: '15 squats, 20 lunges (10 each leg), 15 calf raises, and 10 jump squats.',
    lottieSource: require('../../assets/animation/Workout.json'),
    duration: 360,
    speed: 1,
    style: { width: 260, height: 260 }
  }
}
,
//for yoga
{
  key: 'morning_flow',
  title: 'Morning Flow',
  type: 'Yoga',
  description: 'Start your day with a gentle yoga sequence to energize your body.',
  icon: 'sunrise',
  gradient: colors.gradient.serenity,
  screen: 'ActivityPlayerScreen',
  params: {
    title: 'Morning Flow Yoga',
    description: 'Cat-cow stretch, forward fold, downward dog, and sun salutations.',
    lottieSource: require('../../assets/animation/Meditaion.json'),
    duration: 420, // 7 minutes
    speed: 0.9,
    style: { width: 260, height: 260 }
  }
},
{
  key: 'stress_release',
  title: 'Stress Release',
  type: 'Yoga',
  description: 'Calm your mind and body with slow, restorative poses.',
  icon: 'wind',
  gradient: colors.gradient.warm,
  screen: 'ActivityPlayerScreen',
  params: {
    title: 'Stress Release Yoga',
    description: 'Includes seated forward fold, child’s pose, and legs-up-the-wall for relaxation.',
    lottieSource: require('../../assets/animation/Meditaion.json'),
    duration: 480, // 8 minutes
    speed: 0.8,
    style: { width: 260, height: 260 }
  }
},
{
  key: 'flexibility_focus',
  title: 'Flexibility Focus',
  type: 'Yoga',
  description: 'Improve flexibility through slow stretches and deep breathing.',
  icon: 'move',
  gradient: colors.gradient.passion,
  screen: 'ActivityPlayerScreen',
  params: {
    title: 'Flexibility Focus',
    description: 'Hold each stretch for 30 seconds. Includes pigeon pose, seated twist, and butterfly pose.',
    lottieSource: require('../../assets/animation/Meditaion.json'),
    duration: 600, // 10 minutes
    speed: 0.9,
    style: { width: 260, height: 260 }
  }
},
{
  key: 'balance_builder',
  title: 'Balance Builder',
  type: 'Yoga',
  description: 'Enhance your balance and stability with mindful movements.',
  icon: 'anchor',
  gradient: colors.gradient.energy,
  screen: 'ActivityPlayerScreen',
  params: {
    title: 'Balance Builder Yoga',
    description: 'Try tree pose, warrior III, and chair pose to strengthen your legs and focus.',
    lottieSource: require('../../assets/animation/Meditaion.json'),
    duration: 360, // 6 minutes
    speed: 1,
    style: { width: 260, height: 260 }
  }
},
{
  key: 'evening_relax',
  title: 'Evening Relaxation',
  type: 'Yoga',
  description: 'Unwind your body after a long day with calming yoga poses.',
  icon: 'moon',
  gradient: colors.gradient.serenity,
  screen: 'ActivityPlayerScreen',
  params: {
    title: 'Evening Relaxation Yoga',
    description: 'Includes child’s pose, reclined twist, and deep breathing for relaxation.',
    lottieSource: require('../../assets/animation/Meditaion.json'),
    duration: 420, // 7 minutes
    speed: 0.8,
    style: { width: 260, height: 260 }
  }
},
{
  key: 'core_stability_yoga',
  title: 'Core Stability',
  type: 'Yoga',
  description: 'Strengthen your core through controlled, mindful movements.',
  icon: 'activity',
  gradient: colors.gradient.fire,
  screen: 'ActivityPlayerScreen',
  params: {
    title: 'Core Stability Yoga',
    description: 'Perform plank variations, boat pose, and bridge pose with deep breaths.',
    lottieSource: require('../../assets/animation/Meditaion.json'),
    duration: 420, // 7 minutes
    speed: 1,
    style: { width: 260, height: 260 }
  }
},
{
  key: 'detox_flow',
  title: 'Detox Flow',
  type: 'Yoga',
  description: 'Twisting poses to boost digestion and flush out toxins.',
  icon: 'refresh-ccw',
  gradient: colors.gradient.warm,
  screen: 'ActivityPlayerScreen',
  params: {
    title: 'Detox Flow Yoga',
    description: 'Includes revolved chair, triangle twist, and seated spinal twist.',
    lottieSource: require('../../assets/animation/Meditaion.json'),
    duration: 540, // 9 minutes
    speed: 0.9,
    style: { width: 260, height: 260 }
  }
},
{
  key: 'bedtime_calm',
  title: 'Bedtime Calm',
  type: 'Yoga',
  description: 'Ease into sleep with this slow and relaxing yoga flow.',
  icon: 'moon',
  gradient: colors.gradient.serenity,
  screen: 'ActivityPlayerScreen',
  params: {
    title: 'Bedtime Calm Yoga',
    description: 'Focus on deep breathing with supported bridge, legs-up-the-wall, and savasana.',
    lottieSource: require('../../assets/animation/Meditaion.json'),
    duration: 600, // 10 minutes
    speed: 0.7,
    style: { width: 260, height: 260 }
  }
}
,

//creative
{
  key: '5m_freewrite',
  title: 'Free Writing Burst',
  description: 'Write continuously without stopping — let your thoughts flow.',
  type: 'Creative',
  icon: 'pen-tool',
  gradient: colors.gradient.passion, // Pink -> Purple
  screen: 'ActivityPlayerScreen',
  params: {
    title: '5-Minute Free Writing',
    description: 'Write anything that comes to mind for 5 minutes. Don’t edit or judge your words — just let them out.',
    duration: 300,
    style: { width: 280, height: 280 }
  }
},
{
  key: '5m_color_play',
  title: 'Color Play',
  description: 'Experiment with colors and patterns for fun relaxation.',
  type: 'Creative',
  icon: 'droplet',
  gradient: colors.gradient.warm, // Orange -> Yellow
  screen: 'ActivityPlayerScreen',
  params: {
    title: '5-Minute Color Play',
    description: 'Grab colors or imagine them digitally — create random shapes or gradients that feel good.',
    duration: 300,
    style: { width: 280, height: 280 }
  }
},
{
  key: '10m_story_seed',
  title: 'Story Seed',
  description: 'Start a short story based on a random thought or word.',
  type: 'Creative',
  icon: 'book-open',
  gradient: colors.gradient.serenity, // Blue -> Violet
  screen: 'ActivityPlayerScreen',
  params: {
    title: '10-Minute Story Seed',
    description: 'Pick one random object near you and write a 10-minute story imagining its secret life.',
    duration: 600,
    style: { width: 280, height: 280 }
  }
},
{
  key: '5m_mind_map',
  title: 'Mind Map Moment',
  description: 'Map out your ideas visually — connect thoughts freely.',
  type: 'Creative',
  icon: 'git-branch',
  gradient: colors.gradient.energy, // Yellow -> Red
  screen: 'ActivityPlayerScreen',
  params: {
    title: '5-Minute Mind Map',
    description: 'Choose a topic (e.g., “Happiness”) and quickly branch related words or ideas for 5 minutes.',
    duration: 300,
    style: { width: 280, height: 280 }
  }
},
{
  key: '10m_music_flow',
  title: 'Music Flow',
  description: 'Let music guide your emotions or creative thoughts.',
  type: 'Creative',
  icon: 'music',
  gradient: colors.gradient.fire, // Red -> Orange
  screen: 'ActivityPlayerScreen',
  params: {
    title: '10-Minute Music Flow',
    description: 'Play your favorite calm or inspiring track, close your eyes, and let your imagination drift.',
    duration: 600,
    style: { width: 280, height: 280 }
  }
},


//focus

{
  key: '5m_tidy',
  title: 'The 5-Minute Tidy',
  description: 'Clear your space to clear your mind.',
  type: 'Focus',
  icon: 'archive',
  gradient: colors.gradient.warm,
  screen: 'ActivityPlayerScreen',
  params: {
    title: 'The 5-Minute Tidy',
    description: 'Choose one small area and organize it for just 5 minutes. You\'ll be surprised at the difference it makes.',
    lottieSource: require('../../assets/animation/activityAnimation.json'),
    duration: 300,
    speed: 1,
  },
},
{
  key: '5m_focus_reset',
  title: 'Focus Reset',
  description: 'A short mental reset to regain concentration.',
  type: 'Focus',
  icon: 'target',
  gradient: colors.gradient.cool,
  screen: 'ActivityPlayerScreen',
  params: {
    title: 'Focus Reset',
    description: 'Close your eyes, take 3 deep breaths, then focus on one small goal for the next 5 minutes.',
    lottieSource: require('../../assets/animation/activityAnimation.json'),
    duration: 300,
    speed: 1,
  },
},
{
  key: '5m_desk_sort',
  title: 'Desk Sort Sprint',
  description: 'Declutter your desk to declutter your brain.',
  type: 'Focus',
  icon: 'inbox',
  gradient: colors.gradient.passion,
  screen: 'ActivityPlayerScreen',
  params: {
    title: 'Desk Sort Sprint',
    description: 'Sort through papers, cords, or your desktop for exactly 5 minutes—then stop.',
    lottieSource: require('../../assets/animation/activityAnimation.json'),
    duration: 300,
    speed: 1,
  },
},
{
  key: '5m_mind_clearing',
  title: 'Mind Clearing Minute',
  description: 'Refocus by clearing mental clutter.',
  type: 'Focus',
  icon: 'wind',
  gradient: colors.gradient.success,
  screen: 'ActivityPlayerScreen',
  params: {
    title: 'Mind Clearing Minute',
    description: 'Write down everything that’s on your mind, then pick the one thing that matters most to act on.',
    lottieSource: require('../../assets/animation/activityAnimation.json'),
    duration: 300,
    speed: 1,
  },
},
{
  key: '5m_single_task',
  title: 'Single-Task Mode',
  description: 'Train your brain to do one thing at a time.',
  type: 'Focus',
  icon: 'check-square',
  gradient: colors.gradient.cool,
  screen: 'ActivityPlayerScreen',
  params: {
    title: 'Single-Task Mode',
    description: 'Pick one small task and give it your full attention for the next 5 minutes—no distractions.',
    lottieSource: require('../../assets/animation/activityAnimation.json'),
    duration: 300,
    speed: 1,
  },
},
{
  key: '5m_stretch_break',
  title: 'Stretch & Refocus',
  description: 'Loosen your body to refresh your focus.',
  type: 'Focus',
  icon: 'activity',
  gradient: colors.gradient.success,
  screen: 'ActivityPlayerScreen',
  params: {
    title: 'Stretch & Refocus',
    description: 'Stand up, stretch your arms and back, roll your shoulders, and take 3 deep breaths.',
    lottieSource: require('../../assets/animation/activityAnimation.json'),
    duration: 300,
    speed: 1,
  },
},
{
  key: '5m_goal_review',
  title: 'Goal Glance',
  description: 'Revisit your top priorities for clarity.',
  type: 'Focus',
  icon: 'flag',
  gradient: colors.gradient.passion,
  screen: 'ActivityPlayerScreen',
  params: {
    title: 'Goal Glance',
    description: 'Review your main goals for today or the week, and adjust one thing that’s off track.',
    lottieSource: require('../../assets/animation/activityAnimation.json'),
    duration: 300,
    speed: 1,
  },
},
{
  key: '5m_silent_focus',
  title: 'Silent Focus',
  description: 'Practice quiet attention for 5 minutes.',
  type: 'Focus',
  icon: 'eye',
  gradient: colors.gradient.warm,
  screen: 'ActivityPlayerScreen',
  params: {
    title: 'Silent Focus',
    description: 'Sit quietly, observe your surroundings, and notice small details without reacting or judging.',
    lottieSource: require('../../assets/animation/activityAnimation.json'),
    duration: 300,
    speed: 1,
  },
},

//finance

{
  key: '5m_budget_check',
  title: '5-Minute Budget Check',
  description: 'Quickly review your weekly spending.',
  type: 'Finance',
  icon: 'pie-chart',
  gradient: colors.gradient.energy,
  screen: 'ActivityPlayerScreen',
  params: {
    title: '5-Minute Budget Check',
    description: 'Open your budget app or notebook and review your expenses from the past week. Note one adjustment for next week.',
    lottieSource: require('../../assets/animation/finance.json'),
    duration: 300,
    speed: 1,
  }
},
{
  key: '5m_savings_goal',
  title: 'Savings Snapshot',
  description: 'Check your progress toward your savings goals.',
  type: 'Finance',
  icon: 'trending-up',
  gradient: colors.gradient.success,
  screen: 'ActivityPlayerScreen',
  params: {
    title: '5-Minute Savings Goal',
    description: 'Look at your savings account or piggy bank. Celebrate your progress and plan one small deposit.',
    lottieSource: require('../../assets/animation/finance.json'),
    duration: 300,
    speed: 1,
  }
},
{
  key: '5m_subscription_review',
  title: 'Subscription Review',
  description: 'Evaluate ongoing subscriptions and memberships.',
  type: 'Finance',
  icon: 'credit-card',
  gradient: colors.gradient.warm,
  screen: 'ActivityPlayerScreen',
  params: {
    title: '5-Minute Subscription Review',
    description: 'List your active subscriptions. Cancel one you don’t need or use less.',
    lottieSource: require('../../assets/animation/finance.json'),
    duration: 300,
    speed: 1,
  }
},
{
  key: '5m_spending_reflect',
  title: 'Spending Reflection',
  description: 'Understand your recent purchases.',
  type: 'Finance',
  icon: 'eye',
  gradient: colors.gradient.passion,
  screen: 'ActivityPlayerScreen',
  params: {
    title: '5-Minute Spending Reflection',
    description: 'Think about your last few purchases. Which were necessary? Which were impulsive? Note one lesson.',
    lottieSource: require('../../assets/animation/finance.json'),
    duration: 300,
    speed: 1,
  }
},
{
  key: '5m_goal_plan',
  title: 'Goal Planning',
  description: 'Plan a small financial goal for the week.',
  type: 'Finance',
  icon: 'flag',
  gradient: colors.gradient.cool,
  screen: 'ActivityPlayerScreen',
  params: {
    title: '5-Minute Goal Plan',
    description: 'Set one small financial goal (e.g., save $10, avoid eating out) and write down your plan.',
    lottieSource: require('../../assets/animation/finance.json'),
    duration: 300,
    speed: 1,
  }
},
{
  key: '5m_investment_check',
  title: 'Investment Snapshot',
  description: 'Take a quick look at your investments or retirement accounts.',
  type: 'Finance',
  icon: 'trending-up',
  gradient: colors.gradient.success,
  screen: 'ActivityPlayerScreen',
  params: {
    title: '5-Minute Investment Check',
    description: 'Review your portfolio performance. Note one positive takeaway or adjustment.',
    lottieSource: require('../../assets/animation/finance.json'),
    duration: 300,
    speed: 1,
  }
},
{
  key: '5m_cashflow',
  title: 'Cash Flow Review',
  description: 'Understand your income vs expenses.',
  type: 'Finance',
  icon: 'bar-chart-2',
  gradient: colors.gradient.fire,
  screen: 'ActivityPlayerScreen',
  params: {
    title: '5-Minute Cash Flow Review',
    description: 'Check if you are spending more than you earn. Identify one improvement for the next week.',
    lottieSource: require('../../assets/animation/finance.json'),
    duration: 300,
    speed: 1,
  }
},
{
  key: '5m_financial_reflect',
  title: 'Financial Reflection',
  description: 'Reflect on your financial habits.',
  type: 'Finance',
  icon: 'book-open',
  gradient: colors.gradient.serenity,
  screen: 'ActivityPlayerScreen',
  params: {
    title: '5-Minute Financial Reflection',
    description: 'Write down one habit you want to improve or start this week (saving, spending, investing).',
    lottieSource: require('../../assets/animation/finance.json'),
    duration: 300,
    speed: 1,
  }
},

//productivity


{
  key: '5m_priority_list',
  title: 'Priority List',
  description: 'List your top 3 tasks for the next 5 minutes.',
  type: 'Productivity',
  icon: 'list',
  gradient: colors.gradient.warm,
  screen: 'ActivityPlayerScreen',
  params: {
    title: '5-Minute Priority List',
    description: 'Write down the top 3 tasks you want to complete. Focus only on these tasks for the next 5 minutes.',
    lottieSource: require('../../assets/animation/productivity.json'),
    duration: 300,
    speed: 1,
  }
},
{
  key: '5m_time_block',
  title: 'Time Block Sprint',
  description: 'Dedicate 5 minutes to a single task without distractions.',
  type: 'Productivity',
  icon: 'clock',
  gradient: colors.gradient.cool,
  screen: 'ActivityPlayerScreen',
  params: {
    title: '5-Minute Time Block',
    description: 'Pick one task and work on it without switching or multitasking for 5 minutes.',
    lottieSource: require('../../assets/animation/productivity.json'),
    duration: 300,
    speed: 1,
  }
},
{
  key: '5m_email_cleanup',
  title: 'Email Cleanup',
  description: 'Declutter your inbox for a clearer mind.',
  type: 'Productivity',
  icon: 'mail',
  gradient: colors.gradient.passion,
  screen: 'ActivityPlayerScreen',
  params: {
    title: '5-Minute Email Cleanup',
    description: 'Go through unread emails and either archive, delete, or respond quickly. Focus on small wins.',
    lottieSource: require('../../assets/animation/productivity.json'),
    duration: 300,
    speed: 1,
  }
},
{
  key: '5m_quick_win',
  title: 'Quick Win',
  description: 'Complete a small task that gives instant satisfaction.',
  type: 'Productivity',
  icon: 'check-circle',
  gradient: colors.gradient.energy,
  screen: 'ActivityPlayerScreen',
  params: {
    title: '5-Minute Quick Win',
    description: 'Choose one small task you’ve been postponing and finish it in 5 minutes.',
    lottieSource: require('../../assets/animation/productivity.json'),
    duration: 300,
    speed: 1,
  }
},
{
  key: '5m_workspace_organize',
  title: 'Workspace Organize',
  description: 'Clear your workspace to boost focus.',
  type: 'Productivity',
  icon: 'archive',
  gradient: colors.gradient.fire,
  screen: 'ActivityPlayerScreen',
  params: {
    title: '5-Minute Workspace Organize',
    description: 'Tidy your desk, put away unnecessary items, and prepare your workspace for better productivity.',
    lottieSource: require('../../assets/animation/productivity.json'),
    duration: 300,
    speed: 1,
  }
},
{
  key: '5m_brainstorm',
  title: 'Brainstorm Burst',
  description: 'Generate new ideas quickly and freely.',
  type: 'Productivity',
  icon: 'zap',
  gradient: colors.gradient.serenity,
  screen: 'ActivityPlayerScreen',
  params: {
    title: '5-Minute Brainstorm',
    description: 'Pick a topic or project and write down as many ideas as possible in 5 minutes without judging them.',
    lottieSource: require('../../assets/animation/productivity.json'),
    duration: 300,
    speed: 1,
  }
},
{
  key: '5m_goal_review',
  title: 'Goal Review',
  description: 'Check progress on your main goals for clarity.',
  type: 'Productivity',
  icon: 'flag',
  gradient: colors.gradient.success,
  screen: 'ActivityPlayerScreen',
  params: {
    title: '5-Minute Goal Review',
    description: 'Look at your current goals, see what progress you made, and decide the next step.',
    lottieSource: require('../../assets/animation/productivity.json'),
    duration: 300,
    speed: 1,
  }
},
{
  key: '5m_focus_music',
  title: 'Focus Music',
  description: 'Use music to enhance concentration.',
  type: 'Productivity',
  icon: 'music',
  gradient: colors.gradient.cool,
  screen: 'ActivityPlayerScreen',
  params: {
    title: '5-Minute Focus Music',
    description: 'Play an instrumental or ambient track, close distractions, and work mindfully for 5 minutes.',
    lottieSource: require('../../assets/animation/productivity.json'),
    duration: 300,
    speed: 1,
  }
}
    
];



// // import { colors } from '../../assets/theme/color1';
// import { colors } from '../../theme/color1';

// // We now store all activities in one array.
// // Each object defines which screen to go to and what data to pass.
// export const ACTIVITIES = [
//     {
//         key: '5m_breathing',
//         title: 'Box Breathing',
//         description: 'A 5-minute exercise to calm your nervous system.',
//         icon: 'wind', // Feather icon name
//         gradient: colors.gradient.cool,
//         screen: 'ActivityPlayerScreen', // This activity opens the player
//         params: {
//             title: 'Box Breathing',
//             description: 'Inhale for 4 seconds, hold for 4, exhale for 4, and hold for 4. Follow the animation and find your calm.',
//             // lottieSource: require('../assests/animation/Meditaion.json'),
//             lottieSource: require('../../assets/animation/Meditaion.json'),
//             duration: 300,
//             speed: 1.5,
//         },
//     },
//     {
//         key: '5m_tidy',
//         title: 'The 5-Minute Tidy',
//         description: 'Clear your space to clear your mind.',
//         icon: 'archive', // Feather icon name
//         gradient: colors.gradient.warm,
//         screen: 'ActivityPlayerScreen',
//         params: {
//             title: 'The 5-Minute Tidy',
//             description: 'Choose one small area and organize it for just 5 minutes. You\'ll be surprised at the difference it makes.',
//             lottieSource: require('../../assets/animation//activityAnimation.json'),
//             duration: 300,
//             speed: 1,
//         },
//     },
//     {
//     key: '5m_workout',
//     title: 'Mini Workout',
//     description: 'A quick full-body circuit to get your blood flowing.',
//     icon: 'zap', // Feather icon name for energy
//     gradient: colors.gradient.passion, // Using the Pink -> Purple gradient
//     screen: 'ActivityPlayerScreen',
//     params: {
//         title: '5-Minute Mini Workout',
//         description: '10 squats, 10 push-ups, 20 jumping jacks. Repeat the cycle until the timer ends.',
//         // IMPORTANT: You will need to find a suitable workout animation and place it here
//         lottieSource: require('../../assets/animation//Workout.json'),
//         duration: 300, // 5 minutes in seconds
//         speed: 1, // Normal playback speed
//         style: { width: 260, height: 260 } // A slightly smaller size might fit a workout animation better
//     },
// },
// {
//     key: '5m_doodle',
//     title: 'Doodle Challenge',
//     description: 'Unleash your creativity with a quick sketch.',
//     icon: 'edit-3', // Feather icon name for drawing/doodling
//     gradient: colors.gradient.warm, // Using the Orange -> Yellow gradient
//     screen: 'ActivityPlayerScreen',
//     params: {
//         title: '5-Minute Doodle Challenge',
//         description: 'Grab a pen and paper and draw anything you see around you for the next 5 minutes. Don\'t judge, just create!',
//         // IMPORTANT: You will need to find a suitable drawing/doodling animation

//         duration: 300, // 5 minutes in seconds
    
//         style: { width: 280, height: 280 } // Standard size
//     },
// },
//     // You can easily add more activities here that go to the SAME screen
//     // or different screens in the future.
// ];