# MyNaksh Chat App

A React Native chat application for astrological consultations, featuring smooth animations, gesture-based interactions, and efficient state management.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the App](#running-the-app)
- [Project Structure](#project-structure)
- [Technical Implementation](#technical-implementation)
  - [React Native Reanimated 3](#react-native-reanimated-3)
  - [Gesture Handling](#gesture-handling)
  - [State Management](#state-management)
- [Features](#features)
- [Dependencies](#dependencies)

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** >= 20.0.0
- **npm** or **yarn**
- **React Native CLI** (for running on physical devices)
- **Xcode** (for iOS development on macOS)
- **Android Studio** (for Android development)
- **CocoaPods** (for iOS dependencies)

## Installation

1. **Clone the repository** (if applicable) or navigate to the project directory:

   ```bash
   cd MyNaksh
   ```

2. **Install dependencies**:

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Install iOS dependencies** (macOS only):
   ```bash
   cd ios
   pod install
   cd ..
   ```

## Running the App

### iOS

1. **Start the Metro bundler**:

   ```bash
   npm start
   # or
   yarn start
   ```

2. **Run on iOS Simulator** (in a new terminal):

   ```bash
   npm run ios
   # or
   yarn ios
   ```

3. **Run on a physical iOS device**:
   ```bash
   npm run ios -- --device "Your Device Name"
   ```

### Android

1. **Start the Metro bundler**:

   ```bash
   npm start
   # or
   yarn start
   ```

2. **Run on Android Emulator or Device** (in a new terminal):

   ```bash
   npm run android
   # or
   yarn android
   ```

   **Note**: Make sure you have an Android emulator running or a physical device connected via USB with USB debugging enabled.

### Troubleshooting

- **Metro bundler issues**: Clear cache with `npm start -- --reset-cache`
- **iOS build issues**: Clean build folder in Xcode (Product → Clean Build Folder) and re-run `pod install`
- **Android build issues**: Clean gradle cache with `cd android && ./gradlew clean && cd ..`

## Project Structure

```
MyNaksh/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── atoms/           # Atomic components (EmojiReactionBar, FeedbackToggle, MessageContent)
│   │   ├── styles/          # Component-specific styles
│   │   ├── utils/           # Utility functions
│   │   ├── ChatInput.tsx   # Chat input component
│   │   ├── MessageBubble.tsx # Message bubble with gestures
│   │   └── RatingOverlay.tsx # Rating modal overlay
│   ├── screens/             # Screen components
│   │   ├── HomeScreen.tsx
│   │   └── ChatScreen.tsx
│   ├── store/               # State management
│   │   └── chatStore.ts     # Zustand store
│   └── AppRouter.tsx        # Navigation setup
├── android/                 # Android native code
├── ios/                     # iOS native code
├── App.tsx                  # Root component
└── package.json
```

## Technical Implementation

### React Native Reanimated 3

This app uses **React Native Reanimated v4.0.0** (the latest version, which maintains API compatibility with Reanimated 3) to create smooth, performant animations that run on the UI thread.

#### Configuration

Reanimated is configured in `babel.config.js`:

```javascript
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    'react-native-reanimated/plugin', // Must be last
  ],
};
```

**Important**: The Reanimated plugin must be the last plugin in the Babel configuration.

#### Usage in the App

##### 1. **Swipe-to-Reply Animation** (`MessageBubble.tsx`)

Reanimated is used to create smooth swipe gestures on message bubbles:

- **Shared Values**: `translateX` tracks the horizontal swipe position
- **Animated Styles**: `useAnimatedStyle` creates reactive styles that update on the UI thread
- **Spring Animation**: `withSpring` provides natural, bouncy animations when releasing a swipe

```typescript
const translateX = useSharedValue(0);

const panGesture = Gesture.Pan()
  .onUpdate(event => {
    'worklet';
    translateX.value = Math.min(event.translationX, MAX_SWIPE);
  })
  .onEnd(event => {
    'worklet';
    translateX.value = withSpring(0, {
      damping: 12,
      stiffness: 180,
      mass: 0.8,
    });
  });

const animatedBubbleStyle = useAnimatedStyle(() => ({
  transform: [{ translateX: translateX.value }],
}));
```

##### 2. **Reply Icon Animation** (`MessageBubble.tsx`)

The reply icon fades in and scales up as the user swipes:

```typescript
const animatedReplyIconStyle = useAnimatedStyle(() => {
  const opacity = interpolate(
    translateX.value,
    [0, SWIPE_THRESHOLD / 2, SWIPE_THRESHOLD],
    [0, 0.5, 1],
    Extrapolation.CLAMP,
  );
  const scale = interpolate(
    translateX.value,
    [0, SWIPE_THRESHOLD],
    [0.5, 1],
    Extrapolation.CLAMP,
  );
  return { opacity, transform: [{ scale }] };
});
```

##### 3. **Rating Overlay Animations** (`RatingOverlay.tsx`)

Reanimated's layout animations and enter/exit animations create smooth modal transitions:

```typescript
<Animated.View
  entering={FadeIn.duration(300)}
  exiting={FadeOut.duration(200)}
  layout={Layout.springify().damping(15).stiffness(150)}
>
  {/* Rating content */}
</Animated.View>
```

##### 4. **Feedback Toggle Animations** (`FeedbackToggle.tsx`)

Smooth height and opacity transitions when feedback chips appear:

```typescript
const chipsHeight = useSharedValue(0);
const chipsOpacity = useSharedValue(0);

React.useEffect(() => {
  if (feedbackType === 'disliked') {
    chipsHeight.value = withTiming(40, { duration: 300 });
    chipsOpacity.value = withTiming(1, { duration: 300 });
  }
}, [feedbackType]);
```

#### Key Reanimated Features Used

- **Worklets**: Functions that run on the UI thread (marked with `'worklet'`)
- **Shared Values**: Mutable values that can be read/written from both JS and UI threads
- **Animated Styles**: Styles that automatically update when shared values change
- **Interpolation**: Smooth value mapping between ranges
- **Spring/Timing Animations**: Natural motion with configurable physics
- **Layout Animations**: Automatic animations when layout changes
- **Enter/Exit Animations**: Smooth component mount/unmount transitions

### Gesture Handling

The app uses **react-native-gesture-handler v2.30.0** for native gesture recognition, providing better performance and more accurate gesture detection than React Native's built-in gesture system.

#### Setup

The app is wrapped in `GestureHandlerRootView` in `App.tsx`:

```typescript
import { GestureHandlerRootView } from 'react-native-gesture-handler';

function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppContent />
    </GestureHandlerRootView>
  );
}
```

#### Swipe-to-Reply Gesture (`MessageBubble.tsx`)

The app implements a custom pan gesture for swiping messages to reply:

```typescript
const panGesture = Gesture.Pan()
  .activeOffsetX([10, Infinity]) // Only activate for right swipe (minimum 10px)
  .failOffsetY([-10, 10]) // Fail if vertical movement is too large
  .onUpdate(event => {
    'worklet';
    if (event.translationX > 0) {
      translateX.value = Math.min(event.translationX, MAX_SWIPE);
    }
  })
  .onEnd(event => {
    'worklet';
    if (event.translationX >= SWIPE_THRESHOLD) {
      runOnJS(triggerReply)(); // Call JS function from worklet
    }
    translateX.value = withSpring(0, { damping: 12, stiffness: 180 });
  });
```

#### Gesture Features

- **Pan Gesture**: Detects horizontal swipe movements
- **Active Offset**: Only activates when swiping right (prevents accidental triggers)
- **Fail Offset**: Prevents interference with vertical scrolling
- **Threshold Detection**: Triggers reply action when swipe exceeds 80px
- **Worklet Integration**: Gesture handlers run on UI thread for 60fps performance
- **JS Bridge**: Uses `runOnJS()` to call JavaScript functions from gesture handlers

#### Long Press for Reactions

Long press on messages triggers the emoji reaction bar (implemented using React Native's `TouchableOpacity` with `onLongPress`).

### State Management

The app uses **Zustand v5.0.2** for state management, chosen for its simplicity, performance, and minimal boilerplate.

#### Why Zustand?

- ✅ **Lightweight**: ~1KB bundle size
- ✅ **Simple API**: Minimal boilerplate, easy to learn
- ✅ **Great Performance**: Selective subscriptions prevent unnecessary re-renders
- ✅ **TypeScript Support**: Excellent type inference
- ✅ **React Native Friendly**: Works seamlessly with RN
- ✅ **Scalable**: Easy to extend as the app grows

#### Store Structure (`src/store/chatStore.ts`)

```typescript
interface ChatState {
  messages: Message[];
  replyingTo: Message | null;
  activeConversationId: string | null;
  // Actions
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  setReplyingTo: (message: Message | null) => void;
  handleReaction: (messageId: string, emoji: string) => void;
  handleFeedback: (
    messageId: string,
    feedbackType: 'liked' | 'disliked' | null,
  ) => void;
  handleFeedbackChip: (messageId: string, chip: string) => void;
  sendMessage: (text: string) => void;
  clearMessages: () => void;
}
```

#### Usage Pattern

Components subscribe only to the state they need, preventing unnecessary re-renders:

```typescript
// In ChatScreen.tsx
const messages = useChatStore(state => state.messages);

// In ChatInput.tsx
const replyingTo = useChatStore(state => state.replyingTo);
const sendMessage = useChatStore(state => state.sendMessage);

// In MessageBubble.tsx
const handleReaction = useChatStore(state => state.handleReaction);
const handleFeedback = useChatStore(state => state.handleFeedback);
```

#### Benefits Over Alternatives

**vs. Context API**:

- No provider wrapper needed
- Selective subscriptions prevent re-render cascades
- Can be used outside React components

**vs. Redux**:

- Much less boilerplate
- Smaller bundle size
- Easier to learn and maintain
- Sufficient for most app needs

For a detailed comparison, see `STATE_MANAGEMENT_COMPARISON.md`.

## Features

- 💬 **Real-time Chat Interface**: Smooth message display with auto-scrolling
- 👆 **Swipe-to-Reply**: Swipe right on any message to reply
- 😊 **Emoji Reactions**: Long press messages to add emoji reactions
- 👍 **Feedback System**: Like/dislike AI messages with detailed feedback chips
- ⭐ **Rating Overlay**: Rate your chat experience with animated star ratings
- 🎨 **Smooth Animations**: All interactions use Reanimated for 60fps animations
- 📱 **Cross-Platform**: Works on both iOS and Android

## Dependencies

### Core

- `react`: 19.2.0
- `react-native`: 0.83.1

### Navigation

- `@react-navigation/native`: ^6.1.0
- `@react-navigation/native-stack`: ^6.9.0
- `react-native-safe-area-context`: ^5.5.2
- `react-native-screens`: ^4.0.0

### Animations & Gestures

- `react-native-reanimated`: ^4.0.0
- `react-native-gesture-handler`: ^2.30.0
- `react-native-worklets`: ^0.7.0

### State Management

- `zustand`: ^5.0.2

### Development

- `typescript`: ^5.8.3
- `@types/react`: ^19.2.0
- `eslint`: ^8.19.0
- `prettier`: 2.8.8

## License

This project is private and proprietary.

---

**Built with ❤️ using React Native, Reanimated, and Zustand**
