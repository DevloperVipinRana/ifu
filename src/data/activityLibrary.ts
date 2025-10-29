// mobile/src/data/activityLibrary.ts
import { colors } from '../theme/color';

// Define the shape of an activity
export interface Activity {
  key: string;
  category: 'Mindfulness' | 'Productivity' | 'Fitness' | 'Creativity' | 'Growth' | 'Social' | 'Finance';
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
  };
}

// ==========================================
// THE EXPANDED LIBRARY OF 50 ACTIVITIES
// ==========================================
export const ACTIVITY_LIBRARY: Activity[] = [
    //
    // --- Mindfulness (10) ---
    //
    { key: 'breath_focus', category: 'Mindfulness', type: 'timed', params: { title: 'Breath Focus', description: 'Close your eyes and focus only on the sensation of your breath for 60 seconds.', lottieSource: require('../assets/lottie/breathing.json'), duration: 60, gradient: colors.gradient.cool } },
    { key: 'gratitude_moment', category: 'Mindfulness', type: 'reflection', params: { title: 'Gratitude Moment', question: 'What is one small thing that happened today that you are grateful for?', placeholder: 'A good meal, a nice conversation, the weather...', headerImage: 'https://images.unsplash.com/photo-1508615039623-a25605d2b022', gradient: colors.gradient.warm } },
    { key: 'sensory_check_in_sight', category: 'Mindfulness', type: 'reflection', params: { title: 'Sensory Check-in: Sight', question: 'Look around you. Name 5 things you can see right now.', placeholder: 'e.g., A blue cup, a green plant, a wooden desk...', headerImage: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809', gradient: colors.gradient.cool } },
    { key: 'sensory_check_in_sound', category: 'Mindfulness', type: 'timed', params: { title: 'Sensory Check-in: Sound', description: 'Close your eyes and for 60 seconds, just listen. Identify every sound you hear, near and far.', lottieSource: require('../assets/lottie/Circle.json'), duration: 60, gradient: colors.gradient.sky } },
    { key: 'mindful_sip', category: 'Mindfulness', type: 'timed', params: { title: 'Mindful Sip', description: 'Take a sip of water, tea, or coffee. Spend 60 seconds noticing its temperature, taste, and the sensation of drinking.', duration: 60, lottieSource: require('../assets/lottie/coffee.json'), gradient: colors.gradient.warm } },
    { key: 'body_scan', category: 'Mindfulness', type: 'timed', params: { title: 'One-Minute Body Scan', description: 'Close your eyes. Mentally scan from your toes to your head, simply noticing any sensations without judgment.', duration: 60, lottieSource: require('../assets/lottie/bodyscan.json'), gradient: colors.gradient.lavender } },
    { key: 'single_task_focus', category: 'Mindfulness', type: 'timed', params: { title: 'Single-Task Focus', description: 'Choose one small task (like organizing your desk) and give it your undivided attention for 60 seconds. No multitasking.', duration: 60, gradient: colors.gradient.cool } },
    { key: 'label_emotions', category: 'Mindfulness', type: 'reflection', params: { title: 'Label Your Emotions', question: 'How are you feeling right now? Try to name 1-3 emotions you are experiencing.', placeholder: 'e.g., Calm, a little anxious, curious...', gradient: colors.gradient.passion } },
    { key: 'nature_observation', category: 'Mindfulness', type: 'reflection', params: { title: 'Observe Nature', question: 'Look out a window. Describe one thing you see in nature in detail.', placeholder: 'The way the leaves move, the shape of a cloud...', headerImage: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05', gradient: colors.gradient.success } },
    { key: 'intention_setting', category: 'Mindfulness', type: 'reflection', params: { title: 'Set an Intention', question: 'What is one word that describes how you want to feel for the next hour?', placeholder: 'e.g., Focused, calm, present, energized...', gradient: colors.gradient.cool } },

    //
    // --- Productivity (10) ---
    //
    { key: 'next_tiny_action', category: 'Productivity', type: 'reflection', params: { title: 'Next Tiny Action', question: 'Look at your to-do list. What is the absolute smallest next step for your most important task?', placeholder: 'Not "write report," but "open document."', gradient: colors.gradient.sky } },
    { key: 'brain_dump', category: 'Productivity', type: 'reflection', params: { title: 'One-Minute Brain Dump', question: 'What thoughts, tasks, or worries are taking up your mental space right now? List them out.', placeholder: 'Get everything out of your head...', gradient: colors.gradient.lavender } },
    { key: 'pomodoro_prep', category: 'Productivity', type: 'reflection', params: { title: 'Pomodoro Prep', question: 'What is the ONE thing you will focus on for the next 25 minutes?', placeholder: 'Define your focus before you start the timer.', gradient: colors.gradient.cool } },
    { key: 'declutter_digital', category: 'Productivity', type: 'timed', params: { title: 'Digital Declutter', description: 'Spend 60 seconds cleaning your computer desktop or organizing one folder.', duration: 60, lottieSource: require('../assets/lottie/folder.json'), gradient: colors.gradient.sky } },
    { key: 'declutter_physical', category: 'Productivity', type: 'timed', params: { title: 'Physical Declutter', description: 'Take 60 seconds to clear your immediate workspace. Put things away, wipe it down.', duration: 60, lottieSource: require('../assets/lottie/declutter.json'), gradient: colors.gradient.mint } },
    { key: 'two_minute_rule', category: 'Productivity', type: 'reflection', params: { title: 'The 2-Minute Rule', question: 'What is one task you\'ve been avoiding that would take less than two minutes to do right now?', placeholder: 'e.g., Reply to that email, take out the trash...', gradient: colors.gradient.warm } },
    { key: 'visualize_completion', category: 'Productivity', type: 'timed', params: { title: 'Visualize Completion', description: 'Close your eyes and for 60 seconds, vividly imagine the feeling of completing your most important task for the day.', duration: 60, gradient: colors.gradient.passion } },
    { key: 'review_priorities', category: 'Productivity', type: 'reflection', params: { title: 'Priority Check', question: 'Look at your goals. Is what you are doing right now aligned with them?', placeholder: 'A quick "yes" or "no, I should pivot" is enough.', gradient: colors.gradient.cool } },
    { key: 'close_tabs', category: 'Productivity', type: 'timed', params: { title: 'Tab Triage', description: 'Spend 60 seconds closing all unnecessary browser tabs. Be ruthless!', duration: 60, lottieSource: require('../assets/lottie/tabs.json'), gradient: colors.gradient.sky } },
    { key: 'plan_your_break', category: 'Productivity', type: 'reflection', params: { title: 'Plan Your Break', question: 'What is one restorative thing you will do on your next break?', placeholder: 'e.g., Walk outside, stretch, get water...', gradient: colors.gradient.success } },

    //
    // --- Fitness (8) ---
    //
    { key: 'quick_stretch_desk', category: 'Fitness', type: 'timed', params: { title: 'Desk Stretch', description: 'Gently stretch your neck, wrists, and shoulders while sitting at your desk.', duration: 60, lottieSource: require('../assets/lottie/stretching.json'), gradient: colors.gradient.mint } },
    { key: 'one_minute_walk', category: 'Fitness', type: 'timed', params: { title: 'Mindful Walk', description: 'Stand up and walk around your space for 60 seconds. Notice the feeling of your feet on the floor.', duration: 60, gradient: colors.gradient.cool } },
    { key: 'hydration_break', category: 'Fitness', type: 'reflection', params: { title: 'Hydration Break', question: 'Have you had a glass of water in the last hour? Go grab one!', placeholder: 'Just type "Done!" when you get back.', gradient: colors.gradient.sky } },
    { key: 'plank_challenge', category: 'Fitness', type: 'timed', params: { title: 'Plank Challenge', description: 'Hold a plank for as long as you can within the 60-second timer.', duration: 60, lottieSource: require('../assets/lottie/stretching.json'), gradient: colors.gradient.warm } },
    { key: 'wall_sit', category: 'Fitness', type: 'timed', params: { title: 'Wall Sit', description: 'Find a wall and hold a seated position for 60 seconds.', duration: 60, lottieSource: require('../assets/lottie/stretching.json'), gradient: colors.gradient.warm } },
    { key: 'jumping_jacks', category: 'Fitness', type: 'timed', params: { title: 'Energy Boost', description: 'Do jumping jacks for 60 seconds to get your heart rate up.', duration: 60, gradient: colors.gradient.passion } },
    { key: 'correct_posture', category: 'Fitness', type: 'reflection', params: { title: 'Posture Check', question: 'How is your posture right now? Sit or stand up straight, roll your shoulders back, and hold for a moment.', placeholder: 'Type "Corrected!" when done.', gradient: colors.gradient.mint } },
    { key: 'schedule_workout', category: 'Fitness', type: 'reflection', params: { title: 'Schedule a Workout', question: 'Look at your calendar. When is your next workout? If it\'s not scheduled, block out the time now.', placeholder: 'e.g., "Tomorrow at 7 AM," or "Just scheduled it!"', gradient: colors.gradient.lavender } },

    //
    // --- Growth & Learning (8) ---
    //
    { key: 'log_a_win', category: 'Growth', type: 'reflection', params: { title: 'Log a Win', question: 'What is one thing, no matter how small, that you succeeded at today?', placeholder: 'Finished a tough email, made a healthy choice...', gradient: colors.gradient.lavender } },
    { key: 'learn_a_word', category: 'Growth', type: 'reflection', params: { title: 'Learn a New Word', question: 'Think of a new word you learned recently. What does it mean?', placeholder: 'Define it in your own terms.', gradient: colors.gradient.cool } },
    { key: 'identify_a_challenge', category: 'Growth', type: 'reflection', params: { title: 'Identify a Challenge', question: 'What was the hardest part of your day so far, and what did you learn from it?', placeholder: 'Reflect on a single lesson.', gradient: colors.gradient.passion } },
    { key: 'ask_a_question', category: 'Growth', type: 'reflection', params: { title: 'Ask a Question', question: 'What is one thing you are curious about right now?', placeholder: 'It could be anything from your work to a random fact.', gradient: colors.gradient.sky } },
    { key: 'review_a_goal', category: 'Growth', type: 'reflection', params: { title: 'Goal Check-in', question: 'Review your main weekly goal. Are you on track? What\'s one thing you can do to move it forward?', placeholder: 'A quick status check can be very powerful.', gradient: colors.gradient.cool } },
    { key: 'positive_self_talk', category: 'Growth', type: 'reflection', params: { title: 'Positive Self-Talk', question: 'Write one kind, encouraging sentence to yourself.', placeholder: 'e.g., "You are capable and you are trying your best."', gradient: colors.gradient.passion } },
    { key: 'read_an_article', category: 'Growth', type: 'timed', params: { title: 'Quick Read', description: 'Open a bookmarked article or a news site and just read for 60 seconds. Absorb as much as you can.', duration: 60, lottieSource: require('../assets/lottie/reading.json'), gradient: colors.gradient.warm } },
    { key: 'skill_practice', category: 'Growth', type: 'timed', params: { title: 'Skill Practice', description: 'Dedicate 60 seconds to practicing one specific skill (e.g., a musical chord, a line of code, a language flashcard).', duration: 60, gradient: colors.gradient.lavender } },

    //
    // --- Creativity (7) ---
    //
    { key: 'doodle_break', category: 'Creativity', type: 'timed', params: { title: 'Doodle Break', description: 'Grab a pen and paper (or a tablet) and just doodle for 60 seconds. No goals, no judgment.', duration: 60, lottieSource: require('../assets/lottie/doodle.json'), gradient: colors.gradient.passion } },
    { key: 'describe_an_object', category: 'Creativity', type: 'reflection', params: { title: 'Describe an Object', question: 'Pick an object nearby. Describe it in the most creative and unusual way you can.', placeholder: 'e.g., A stapler isn\'t a tool, it\'s a metal jaw that binds paper worlds together.', gradient: colors.gradient.warm } },
    { key: 'brainstorm_ideas', category: 'Creativity', type: 'reflection', params: { title: 'Rapid Brainstorm', question: 'Pick a problem or topic. List as many ideas related to it as you can in 60 seconds, no matter how silly.', placeholder: 'e.g., "Ways to improve my morning routine..."', gradient: colors.gradient.sky } },
    { key: 'listen_to_new_music', category: 'Creativity', type: 'timed', params: { title: 'New Music', description: 'Play the first 60 seconds of a song from a genre you don\'t normally listen to.', duration: 60, lottieSource: require('../assets/lottie/music.json'), gradient: colors.gradient.passion } },
    { key: 'freewrite', category: 'Creativity', type: 'timed', params: { title: 'One-Minute Freewrite', description: 'Open a text editor and write continuously for 60 seconds without stopping, editing, or judging.', duration: 60, lottieSource: require('../assets/lottie/doodle.json'), gradient: colors.gradient.cool } },
    { key: 'reframe_a_problem', category: 'Creativity', type: 'reflection', params: { title: 'Reframe a Problem', question: 'Think of a challenge you\'re facing. How would someone you admire (a mentor, a hero) approach it?', placeholder: 'Try to see it from a new perspective.', gradient: colors.gradient.lavender } },
    { key: 'word_association', category: 'Creativity', type: 'reflection', params: { title: 'Word Association', question: 'Start with one word (e.g., "growth"). Now, what\'s the next word that comes to mind? And the next?', placeholder: 'e.g., Growth -> Tree -> Green -> Money -> Work...', gradient: colors.gradient.mint } },
    
    //
    // --- Social (7) ---
    //
    { key: 'send_positive_text', category: 'Social', type: 'reflection', params: { title: 'Send a Positive Text', question: 'Think of one person you appreciate. Send them a quick text telling them why.', placeholder: 'Just type "Sent!" when you are done.', gradient: colors.gradient.passion } },
    { key: 'plan_a_connection', category: 'Social', type: 'reflection', params: { title: 'Plan a Connection', question: 'Who is one person you haven\'t spoken to in a while? Make a plan to call them this week.', placeholder: 'e.g., "I\'ll call Sarah on Wednesday evening."', gradient: colors.gradient.sky } },
    { key: 'empathy_check_in', category: 'Social', type: 'reflection', params: { title: 'Empathy Check-in', question: 'Think about someone you interacted with today. What might they be feeling or going through?', placeholder: 'Try to see things from their perspective for a moment.', gradient: colors.gradient.lavender } },
    { key: 'practice_active_listening', category: 'Social', type: 'reflection', params: { title: 'Active Listening Prep', question: 'In your next conversation, what is one thing you can do to be a better listener?', placeholder: 'e.g., "I will not interrupt," or "I will ask a follow-up question."', gradient: colors.gradient.cool } },
    { key: 'give_a_compliment', category: 'Social', type: 'reflection', params: { title: 'Give a Compliment', question: 'Think of someone in your life. What is one genuine compliment you can give them the next time you see them?', placeholder: 'Prepare a specific and sincere compliment.', gradient: colors.gradient.passion } },
    { key: 'express_gratitude_social', category: 'Social', type: 'reflection', params: { title: 'Express Gratitude', question: 'Name one person who has helped you recently and why you\'re grateful for their help.', placeholder: 'This helps reinforce the value of your social connections.', gradient: colors.gradient.warm } },
    { key: 'community_praise', category: 'Social', type: 'reflection', params: { title: 'Praise a Peer', question: 'Think of someone in a community you belong to (work, hobbies). What is something cool they did recently?', placeholder: 'Recognizing others is a powerful habit.', gradient: colors.gradient.mint } },

    // ===================================
// --- Finance Activities (10) ---
// ===================================
{
    key: 'review_spending',
    category: 'Finance', // Note: You may need to add 'Finance' to your Activity['category'] type
    type: 'reflection',
    params: {
        title: 'Mindful Spending',
        question: 'Review your last 3 purchases. How do you feel about them now?',
        placeholder: 'Were they needs, wants, or impulses? No judgment, just observation.',
        headerImage: 'https://images.unsplash.com/photo-1599050751204-128b6d39d6e4',
        gradient: colors.gradient.success,
    }
},
{
    key: 'set_financial_goal',
    category: 'Finance',
    type: 'reflection',
    params: {
        title: 'Define a Money Goal',
        question: 'What is one small, achievable financial goal for this week?',
        placeholder: 'e.g., "Save $20," "Don\'t buy coffee out," or "List one item for sale online."',
        gradient: colors.gradient.lavender,
    }
},
{
    key: 'savings_boost',
    category: 'Finance',
    type: 'reflection',
    params: {
        title: 'Savings Boost',
        question: 'Can you transfer a small amount ($1, $5, $10) to your savings account right now?',
        placeholder: 'Just type "Done!" when you\'ve completed the transfer.',
        gradient: colors.gradient.cool,
    }
},
{
    key: 'cancel_subscription_check',
    category: 'Finance',
    type: 'reflection',
    params: {
        title: 'Subscription Check',
        question: 'Name one subscription service you pay for. Is it still providing value?',
        placeholder: 'e.g., Netflix, Spotify, a gym membership...',
        gradient: colors.gradient.sky,
    }
},
{
    key: 'visualize_debt_free',
    category: 'Finance',
    type: 'timed',
    params: {
        title: 'Visualize Financial Freedom',
        description: 'Close your eyes for 60 seconds and imagine the feeling of being completely debt-free. What would that feel like?',
        duration: 60,
        lottieSource: require('../assets/lottie/finance.json'), // Find a 'growth' or 'success' Lottie
        gradient: colors.gradient.warm,
    }
},
{
    key: 'no_spend_challenge',
    category: 'Finance',
    type: 'reflection',
    params: {
        title: 'No-Spend Challenge',
        question: 'Can you commit to not spending any non-essential money for the next 24 hours?',
        placeholder: 'Type "I commit" to start your challenge!',
        gradient: colors.gradient.passion,
    }
},
{
    key: 'financial_gratitude',
    category: 'Finance',
    type: 'reflection',
    params: {
        title: 'Financial Gratitude',
        question: 'What is one financial resource or tool you are grateful for?',
        placeholder: 'e.g., A stable job, a helpful budgeting app, access to a bank account...',
        gradient: colors.gradient.mint,
    }
},
{
    key: 'learn_finance_term',
    category: 'Finance',
    type: 'reflection',
    params: {
        title: 'Learn a Money Term',
        question: 'Look up one financial term you don\'t understand (e.g., "compound interest," "asset allocation"). What did you learn?',
        placeholder: 'Write a one-sentence definition in your own words.',
        gradient: colors.gradient.cool,
    }
},
{
    key: 'check_credit_score',
    category: 'Finance',
    type: 'reflection',
    params: {
        title: 'Know Your Score',
        question: 'When was the last time you checked your credit score? Make a plan to check it this week.',
        placeholder: 'e.g., "I\'ll check it on Friday," or "Just checked it!"',
        gradient: colors.gradient.lavender,
    }
},
{
    key: 'track_one_expense',
    category: 'Finance',
    type: 'reflection',
    params: {
        title: 'Track One Expense',
        question: 'What was the last thing you spent money on? Open your notes app and log it.',
        placeholder: 'e.g., "$5.25 - Coffee at local shop"',
        gradient: colors.gradient.sky,
    }
}
];