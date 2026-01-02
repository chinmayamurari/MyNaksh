import React, { useState, useCallback, useRef, useEffect } from 'react'
import { 
  FlatList, 
  StyleSheet,
} from 'react-native'
import { MessageBubble, Message } from '../components/MessageBubble'
import { ChatInput } from '../components/ChatInput'
import { SafeAreaView } from 'react-native-safe-area-context'

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


export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>(mockData)
  const flatListRef = useRef<FlatList>(null)

  // Auto-scroll to bottom when new message is added
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true })
      }, 100)
    }
  }, [messages.length])

  const handleSend = useCallback((messageText: string) => {
    const newMessage: Message = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      sender: 'user',
      text: messageText,
      timestamp: Date.now(),
      type: 'text',
    }

    setMessages((prevMessages) => [...prevMessages, newMessage])
  }, [])

  const handleReaction = useCallback((messageId: string, emoji: string) => {
    // Only update state when reaction is actually selected
    // Allow only one reaction at a time - toggle if same emoji, replace if different
    setMessages((prevMessages) =>
      prevMessages.map((msg) => {
        if (msg.id === messageId) {
          // If same emoji is selected, remove it (toggle off)
          // If different emoji is selected, replace the current one
          const newReaction = msg.reaction === emoji ? undefined : emoji
          return { ...msg, reaction: newReaction }
        }
        return msg
      })
    )
  }, [])

  const renderItem = useCallback(
    ({ item }: { item: Message }) => (
      <MessageBubble item={item} onReaction={handleReaction} />
    ),
    [handleReaction]
  )

  return (
    <SafeAreaView style={styles.container}>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        onContentSizeChange={() => {
          flatListRef.current?.scrollToEnd({ animated: true })
        }}
      />
      <ChatInput onSend={handleSend} />

    </SafeAreaView>

  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
})