import React from 'react'
import { View, Text, StyleSheet, Platform } from 'react-native'

export interface Message {
  id: string
  sender: string
  text: string
  timestamp: number
  type: string
  hasFeedback?: boolean
  feedbackType?: string
  replyTo?: string
}

interface MessageBubbleProps {
  item: Message
}

const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  })
}

const getSenderLabel = (sender: string): string => {
  switch (sender) {
    case 'user':
      return 'You'
    case 'ai_astrologer':
      return 'AI Astrologer'
    case 'human_astrologer':
      return 'Astrologer Vikram'
    case 'system':
      return 'System'
    default:
      return sender
  }
}

export const MessageBubble = ({ item }: MessageBubbleProps) => {
  const isUser = item.sender === 'user'
  const isSystem = item.sender === 'system'

  if (isSystem) {
    return (
      <View style={styles.systemMessageContainer}>
        <Text style={styles.systemMessageText}>{item.text}</Text>
      </View>
    )
  }

  return (
    <View
      style={[
        styles.messageContainer,
        isUser ? styles.userMessageContainer : styles.otherMessageContainer,
      ]}
    >
      {!isUser && (
        <Text style={styles.senderLabel}>{getSenderLabel(item.sender)}</Text>
      )}
      <View
        style={[
          styles.messageBubble,
          isUser ? styles.userBubble : styles.otherBubble,
        ]}
      >
        <Text
          style={[
            styles.messageText,
            isUser ? styles.userMessageText : styles.otherMessageText,
          ]}
        >
          {item.text}
        </Text>
      </View>
      <Text style={[styles.timestamp, isUser && styles.userTimestamp]}>
        {formatTime(item.timestamp)}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  messageContainer: {
    marginBottom: 16,
    maxWidth: '80%',
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  otherMessageContainer: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  senderLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
    marginLeft: 4,
  },
  messageBubble: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  userBubble: {
    backgroundColor: '#007AFF',
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  otherMessageText: {
    color: '#000000',
  },
  timestamp: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
    marginLeft: 4,
  },
  userTimestamp: {
    textAlign: 'right',
    marginRight: 4,
  },
  systemMessageContainer: {
    alignSelf: 'center',
    backgroundColor: '#E8E8E8',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginVertical: 8,
    maxWidth: '90%',
  },
  systemMessageText: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
})

