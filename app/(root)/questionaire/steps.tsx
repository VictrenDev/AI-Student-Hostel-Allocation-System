import { Book, BookOpen, Calendar, Clock, Coffee, Dumbbell, Headphones, Moon, Music, Sun, Target, TrendingUp, Users } from "lucide-react";
const allHobbies = [
  { id: "gaming", label: "Gaming", icon: <Target size={16} /> },
  { id: "reading", label: "Reading", icon: <Book size={16} /> },
  { id: "music", label: "Music", icon: <Music size={16} /> },
  { id: "sports", label: "Sports", icon: <Dumbbell size={16} /> },
  { id: "coding", label: "Coding", icon: <TrendingUp size={16} /> },
  { id: "art", label: "Art/Creative", icon: <Users size={16} /> },
  { id: "fitness", label: "Fitness", icon: <Dumbbell size={16} /> },
  { id: "cooking", label: "Cooking", icon: <Coffee size={16} /> },
];

export const steps = [
  {
    title: "Daily Habits & Routine",
    icon: <Clock size={20} />,
    fields: [
      {
        id: "sleepSchedule",
        label: "Your Sleep Schedule",
        description: "When do you typically go to bed?",
        type: "radio",
        options: [
          {
            value: "early",
            label: "Early Bird (10 PM - 6 AM)",
            icon: <Sun size={16} />,
          },
          {
            value: "average",
            label: "Average (11 PM - 7 AM)",
            icon: <Clock size={16} />,
          },
          {
            value: "night",
            label: "Night Owl (1 AM - 9 AM)",
            icon: <Moon size={16} />,
          },
          {
            value: "irregular",
            label: "Irregular/Varies",
            icon: <Calendar size={16} />,
          },
        ],
      },
      {
        id: "studyHours",
        label: "Daily Study Hours",
        description: "How many hours do you study daily?",
        type: "radio",
        options: [
          { value: "1-2", label: "1-2 hours" },
          { value: "3-4", label: "3-4 hours" },
          { value: "5-6", label: "5-6 hours" },
          { value: "7+", label: "7+ hours" },
        ],
      },
      {
        id: "cleanliness",
        label: "Room Cleanliness",
        description: "How tidy do you keep your space?",
        type: "radio",
        options: [
          { value: "very", label: "Very organized" },
          { value: "moderate", label: "Moderately tidy" },
          { value: "relaxed", label: "Relaxed about mess" },
          { value: "minimal", label: "Minimal effort" },
        ],
      },
    ],
  },
  {
    title: "Personality & Social",
    icon: <Users size={20} />,
    fields: [
      {
        id: "socialPreference",
        label: "Social Preference",
        description: "How social are you in your living space?",
        type: "radio",
        options: [
          { value: "very", label: "Very social (love having people over)" },
          { value: "moderate", label: "Moderately social" },
          { value: "quiet", label: "Prefer quiet time" },
          { value: "mixed", label: "Mix of both" },
        ],
      },
      {
        id: "personalityType",
        label: "Personality Type",
        description: "Which best describes you?",
        type: "radio",
        options: [
          { value: "introvert", label: "Introvert (need alone time)" },
          { value: "extrovert", label: "Extrovert (energized by people)" },
          { value: "ambivert", label: "Ambivert (balanced)" },
          { value: "unsure", label: "Not sure" },
        ],
      },
      {
        id: "noiseTolerance",
        label: "Noise Tolerance",
        description: "How do you feel about noise in living space?",
        type: "radio",
        options: [
          { value: "quiet", label: "Need complete quiet" },
          { value: "low", label: "Prefer low background noise" },
          { value: "moderate", label: "Okay with moderate noise" },
          { value: "high", label: "Not bothered by noise" },
        ],
      },
    ],
  },
  {
    title: "Hobbies & Interests",
    icon: <Music size={20} />,
    fields: [
      {
        id: "hobbies",
        label: "Select Your Hobbies",
        description: "Choose activities you enjoy (select all that apply)",
        type: "checkbox",
        options: allHobbies,
      },
      {
        id: "musicPreference",
        label: "Music Preference",
        description: "Do you listen to music often?",
        type: "radio",
        options: [
          {
            value: "often",
            label: "Often with speakers",
            icon: <Headphones size={16} />,
          },
          { value: "headphones", label: "Usually with headphones" },
          { value: "sometimes", label: "Sometimes" },
          { value: "rarely", label: "Rarely" },
        ],
      },
      {
        id: "sportsInterest",
        label: "Sports & Fitness",
        description: "How active are you?",
        type: "radio",
        options: [
          { value: "very", label: "Very active (daily exercise)" },
          { value: "regular", label: "Regularly active" },
          { value: "occasional", label: "Occasionally active" },
          { value: "sedentary", label: "Mostly sedentary" },
        ],
      },
    ],
  },
  {
    title: "Academic Focus",
    icon: <BookOpen size={20} />,
    fields: [
      {
        id: "major",
        label: "Field of Study",
        description: "What is your major/field?",
        type: "input",
        placeholder: "e.g., Computer Science, Medicine, Business",
      },
      {
        id: "studyStyle",
        label: "Study Style",
        description: "How do you prefer to study?",
        type: "radio",
        options: [
          { value: "alone", label: "Alone in quiet" },
          { value: "group", label: "Group study sessions" },
          { value: "library", label: "Library/study spaces" },
          { value: "room", label: "In my room" },
        ],
      },
      {
        id: "academicGoals",
        label: "Academic Priority",
        description: "How important are grades to you?",
        type: "radio",
        options: [
          { value: "top", label: "Top priority (aiming for A's)" },
          { value: "high", label: "High priority (B+ or above)" },
          { value: "moderate", label: "Moderate priority (passing)" },
          { value: "balanced", label: "Balanced with social life" },
        ],
      },
      {
        id: "libraryFrequency",
        label: "Library Usage",
        description: "How often do you use the library?",
        type: "radio",
        options: [
          { value: "daily", label: "Daily" },
          { value: "weekly", label: "Few times a week" },
          { value: "monthly", label: "Once in a while" },
          { value: "rarely", label: "Rarely or never" },
        ],
      },
    ],
  },
];
