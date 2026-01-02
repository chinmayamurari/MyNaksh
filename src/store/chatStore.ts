import { create } from 'zustand'
import { Message } from '../components/MessageBubble'

interface ChatState {
  // Messages for current conversation
  messages: Message[]
  
  // Currently replying to message
  replyingTo: Message | null
  
  // Active conversation ID (for future multi-chat support)
  activeConversationId: string | null
  
  // Actions
  setMessages: (messages: Message[]) => void
  addMessage: (message: Message) => void
  setReplyingTo: (message: Message | null) => void
  handleReaction: (messageId: string, emoji: string) => void
  handleFeedback: (messageId: string, feedbackType: 'liked' | 'disliked' | null) => void
  handleFeedbackChip: (messageId: string, chip: string) => void
  sendMessage: (text: string) => void
  clearMessages: () => void
}

const mockData: Message[] = [
  {
    "id": "1",
    "sender": "system",
    "text": "Your session with Astrologer Vikram has started.",
    "timestamp": 1734681480000,
    "type": "event"
  },
  {
    "id": "2",
    "sender": "user",
    "text": "Namaste. I am feeling very anxious about my current job. Can you look at my chart?",
    "timestamp": 1734681600000,
    "type": "text"
  },
  {
    "id": "3",
    "sender": "ai_astrologer",
    "text": "Namaste! I am analyzing your birth details. Currently, you are running through Shani Mahadasha. This often brings pressure but builds resilience.",
    "timestamp": 1734681660000,
    "type": "ai",
    "hasFeedback": true,
    "feedbackType": "liked"
  },
  {
    "id": "4",
    "sender": "human_astrologer",
    "text": "I see the same. Look at your 6th house; Saturn is transiting there. This is why you feel the workload is heavy.",
    "timestamp": 1734681720000,
    "type": "human"
  },
  {
    "id": "5",
    "sender": "user",
    "text": "Is there any remedy for this? I find it hard to focus.",
    "timestamp": 1734681780000,
    "type": "text",
    "replyTo": "4"
  },
  {
    "id": "6",
    "sender": "ai_astrologer",
    "text": "I suggest chanting the Shani Mantra 108 times on Saturdays. Would you like the specific mantra text?",
    "timestamp": 1734681840000,
    "type": "ai",
    "hasFeedback": false
  }
]

export const useChatStore = create<ChatState>((set, get) => ({
  // Initial state
  messages: mockData,
  replyingTo: null,
  activeConversationId: null,

  // Set messages (useful for loading from API)
  setMessages: (messages: Message[]) => set({ messages }),

  // Add a new message
  addMessage: (message: Message) => set((currentState) => ({
    messages: [...currentState.messages, message]
  })),



  // Set replying to message
  setReplyingTo: (message: Message | null) => set({ replyingTo: message }),

  // Handle emoji reaction
  handleReaction: (messageId: string, emoji: string) => set((currentState) => ({
    messages: currentState.messages.map((msg) => {
      if (msg.id === messageId) {
        // Toggle if same emoji, replace if different
        const newReaction = msg.reaction === emoji ? undefined : emoji
        return { ...msg, reaction: newReaction }
      }
      return msg
    })
  })),

  // Handle feedback (like/dislike)
  handleFeedback: (messageId: string, feedbackType: 'liked' | 'disliked' | null) => set((currentState) => ({
    messages: currentState.messages.map((msg) => {
      if (msg.id === messageId) {
        // If switching from dislike to like, clear chips
        const feedbackChips = feedbackType === 'liked' ? [] : msg.feedbackChips
        return { ...msg, feedbackType, feedbackChips }
      }
      return msg
    })
  })),

  // Handle feedback chip selection
  handleFeedbackChip: (messageId: string, chip: string) => set((currentState) => ({
    messages: currentState.messages.map((msg) => {
      if (msg.id === messageId) {
        const currentChips = msg.feedbackChips || []
        // Toggle chip selection
        const newChips = currentChips.includes(chip)
          ? currentChips.filter((c) => c !== chip)
          : [...currentChips, chip]
        return { ...msg, feedbackChips: newChips }
      }
      return msg
    })
  })),

  // Send a new message
  sendMessage: (text: string) => {
    const state = get()
    const newMessage: Message = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      sender: 'user',
      text: text,
      timestamp: Date.now(),
      type: 'text',
      replyTo: state.replyingTo?.id,
    }
    
    set((currentState) => ({
      messages: [...currentState.messages, newMessage],
      replyingTo: null // Clear reply state after sending
    }))
  },

  // Clear all messages
  clearMessages: () => set({ messages: [] }),
}))

