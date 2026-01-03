# State Management Comparison for MyNaksh Chat App

## Current Data Structure

- **Messages**: Array of Message objects with reactions, replies, feedback
- **Reply State**: Currently replying to message
- **Future**: Multiple conversations, user auth, real-time updates

---

## Recommendation: **Zustand** ⭐

### Why Zustand?

✅ **Lightweight** (~1KB, minimal bundle size)  
✅ **Simple API** (easy to learn, less boilerplate)  
✅ **Great Performance** (selective subscriptions, no unnecessary re-renders)  
✅ **Scalable** (works well as app grows)  
✅ **React Native Friendly** (works seamlessly with RN)  
✅ **TypeScript Support** (excellent type inference)

### Installation

```bash
npm install zustand
# or
yarn add zustand
```

### Usage Example (Already Created)

See `src/store/chatStore.ts` for the complete implementation.

**In ChatScreen.tsx:**

```typescript
import { useChatStore } from '../store/chatStore';

export default function ChatScreen() {
  // Selective subscriptions - only re-render when these change
  const messages = useChatStore(state => state.messages);
  const replyingTo = useChatStore(state => state.replyingTo);
  const handleSend = useChatStore(state => state.sendMessage);
  const handleReaction = useChatStore(state => state.handleReaction);
  const setReplyingTo = useChatStore(state => state.setReplyingTo);
  const handleCancelReply = () => useChatStore.getState().setReplyingTo(null);

  // Rest of your component...
}
```

### Pros

- Minimal boilerplate
- Easy to test
- Can use outside React components
- DevTools support available
- Middleware support (persist, immer, etc.)

### Cons

- Additional dependency (but very small)
- Less ecosystem than Redux

---

## Alternative 1: Context API

### When to Use

- Want zero dependencies
- Simple state that doesn't change frequently
- Small app with few contexts

### Installation

No installation needed (built into React)

### Implementation Example

**src/context/ChatContext.tsx:**

```typescript
import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Message } from '../components/MessageBubble';

interface ChatState {
  messages: Message[];
  replyingTo: Message | null;
}

type ChatAction =
  | { type: 'SET_MESSAGES'; payload: Message[] }
  | { type: 'ADD_MESSAGE'; payload: Message }
  | {
      type: 'UPDATE_MESSAGE';
      payload: { id: string; updates: Partial<Message> };
    }
  | { type: 'SET_REPLYING_TO'; payload: Message | null }
  | { type: 'HANDLE_REACTION'; payload: { messageId: string; emoji: string } };

const initialState: ChatState = {
  messages: mockData,
  replyingTo: null,
};

function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'SET_MESSAGES':
      return { ...state, messages: action.payload };
    case 'ADD_MESSAGE':
      return { ...state, messages: [...state.messages, action.payload] };
    case 'UPDATE_MESSAGE':
      return {
        ...state,
        messages: state.messages.map(msg =>
          msg.id === action.payload.id
            ? { ...msg, ...action.payload.updates }
            : msg,
        ),
      };
    case 'SET_REPLYING_TO':
      return { ...state, replyingTo: action.payload };
    case 'HANDLE_REACTION':
      return {
        ...state,
        messages: state.messages.map(msg => {
          if (msg.id === action.payload.messageId) {
            const newReaction =
              msg.reaction === action.payload.emoji
                ? undefined
                : action.payload.emoji;
            return { ...msg, reaction: newReaction };
          }
          return msg;
        }),
      };
    default:
      return state;
  }
}

const ChatContext = createContext<{
  state: ChatState;
  dispatch: React.Dispatch<ChatAction>;
} | null>(null);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  return (
    <ChatContext.Provider value={{ state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within ChatProvider');
  }
  return context;
}
```

**Usage:**

```typescript
// Wrap app in App.tsx
<ChatProvider>
  <AppRouter />
</ChatProvider>;

// In ChatScreen.tsx
const { state, dispatch } = useChat();
const messages = state.messages;
dispatch({ type: 'ADD_MESSAGE', payload: newMessage });
```

### Pros

- No dependencies
- Built into React
- Good for simple cases

### Cons

- Can cause performance issues (all consumers re-render on any state change)
- Boilerplate increases with complexity
- Need to split contexts to avoid re-renders
- More verbose than Zustand

---

## Alternative 2: Redux Toolkit

### When to Use

- Very complex state management needs
- Need time-travel debugging
- Large team with established Redux patterns
- Need extensive middleware ecosystem

### Installation

```bash
npm install @reduxjs/toolkit react-redux
```

### Implementation Example

**src/store/chatSlice.ts:**

```typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Message } from '../components/MessageBubble';

interface ChatState {
  messages: Message[];
  replyingTo: Message | null;
}

const initialState: ChatState = {
  messages: mockData,
  replyingTo: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload;
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    updateMessage: (
      state,
      action: PayloadAction<{ id: string; updates: Partial<Message> }>,
    ) => {
      const index = state.messages.findIndex(
        msg => msg.id === action.payload.id,
      );
      if (index !== -1) {
        state.messages[index] = {
          ...state.messages[index],
          ...action.payload.updates,
        };
      }
    },
    setReplyingTo: (state, action: PayloadAction<Message | null>) => {
      state.replyingTo = action.payload;
    },
    handleReaction: (
      state,
      action: PayloadAction<{ messageId: string; emoji: string }>,
    ) => {
      const msg = state.messages.find(m => m.id === action.payload.messageId);
      if (msg) {
        msg.reaction =
          msg.reaction === action.payload.emoji
            ? undefined
            : action.payload.emoji;
      }
    },
  },
});

export const {
  setMessages,
  addMessage,
  updateMessage,
  setReplyingTo,
  handleReaction,
} = chatSlice.actions;
export default chatSlice.reducer;
```

**src/store/store.ts:**

```typescript
import { configureStore } from '@reduxjs/toolkit';
import chatReducer from './chatSlice';

export const store = configureStore({
  reducer: {
    chat: chatReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

**Usage:**

```typescript
// In App.tsx
import { Provider } from 'react-redux';
import { store } from './store/store';

<Provider store={store}>
  <AppRouter />
</Provider>;

// In ChatScreen.tsx
import { useSelector, useDispatch } from 'react-redux';
import { addMessage, handleReaction } from '../store/chatSlice';

const messages = useSelector((state: RootState) => state.chat.messages);
const dispatch = useDispatch();
dispatch(addMessage(newMessage));
```

### Pros

- Extensive ecosystem
- DevTools support
- Time-travel debugging
- Large community
- Well-established patterns

### Cons

- More boilerplate
- Steeper learning curve
- Larger bundle size
- Overkill for most apps
- More setup required

---

## Comparison Table

| Feature        | Zustand   | Context API | Redux Toolkit |
| -------------- | --------- | ----------- | ------------- |
| Bundle Size    | ~1KB      | 0KB         | ~15KB         |
| Boilerplate    | Minimal   | Medium      | High          |
| Learning Curve | Easy      | Easy        | Moderate      |
| Performance    | Excellent | Can be poor | Good          |
| DevTools       | Available | Limited     | Excellent     |
| TypeScript     | Excellent | Good        | Excellent     |
| Scalability    | Good      | Limited     | Excellent     |
| Best For       | Most apps | Simple apps | Complex apps  |

---

## Final Recommendation

**Use Zustand** for your chat app because:

1. Your app is currently simple but will grow
2. You need good performance for message updates
3. Minimal setup and learning curve
4. Easy to add features like persistence later
5. Perfect balance of simplicity and power

The store implementation is already created in `src/store/chatStore.ts` - you can start using it right away!
