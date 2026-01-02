import React, { useState, useEffect, useRef } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Pressable,
} from 'react-native'
import { EmojiReactionBar } from './EmojiReactionBar'

export interface Message {
  id: string
  sender: string
  text: string
  timestamp: number
  type: string
  hasFeedback?: boolean
  feedbackType?: string
  replyTo?: string
  reaction?: string
}

interface MessageBubbleProps {
  item: Message
  onReaction?: (messageId: string, emoji: string) => void
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

export const MessageBubble = React.memo(({
  item,
  onReaction,
}: MessageBubbleProps) => {
  const isUser = item.sender === 'user'
  const isSystem = item.sender === 'system'
  const [showReactionBar, setShowReactionBar] = useState(false)
  const dismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Auto-dismiss reaction bar after 3 seconds if no selection
  useEffect(() => {
    if (showReactionBar) {
      dismissTimerRef.current = setTimeout(() => {
        setShowReactionBar(false)
      }, 3000)
    }

    return () => {
      if (dismissTimerRef.current) {
        clearTimeout(dismissTimerRef.current)
      }
    }
  }, [showReactionBar])

  const handleLongPress = () => {
    if (!isSystem && onReaction) {
      setShowReactionBar(true)
    }
  }

  const handlePress = () => {
    // If reaction bar is open, dismiss it on regular press
    if (showReactionBar) {
      handleDismiss()
    }
  }

  const handleEmojiSelect = (emoji: string) => {
    // Clear the auto-dismiss timer
    if (dismissTimerRef.current) {
      clearTimeout(dismissTimerRef.current)
    }
    
    // Update chat state only when reaction is selected
    if (onReaction) {
      onReaction(item.id, emoji)
    }
    
    // Hide reaction bar
    setShowReactionBar(false)
  }

  const handleDismiss = () => {
    if (dismissTimerRef.current) {
      clearTimeout(dismissTimerRef.current)
    }
    setShowReactionBar(false)
  }

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
      <Pressable
        delayLongPress={1000}
        onLongPress={handleLongPress}
        onPress={handlePress}
      >
        <View style={styles.bubbleWrapper}>
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
          {item.reaction && (
            <View
              style={[
                styles.reactionsContainer,
                isUser ? styles.userReactionsContainer : styles.otherReactionsContainer,
              ]}
            >
              <View style={styles.reactionBadge}>
                <Text style={styles.reactionEmoji}>{item.reaction}</Text>
              </View>
            </View>
          )}
        </View>
        {showReactionBar && (
          <View style={[
            styles.reactionBarWrapper,
          ]}>
            <EmojiReactionBar
              visible={showReactionBar}
              onEmojiSelect={handleEmojiSelect}
              onDismiss={handleDismiss}
              isUserMessage={isUser}
            />
          </View>
        )}
      </Pressable>
      <Text style={[styles.timestamp, isUser && styles.userTimestamp]}>
        {formatTime(item.timestamp)}
      </Text>
    </View>
  )
}, (prevProps, nextProps) => {
  // Return true if props are equal (skip re-render), false if different (re-render)
  return (
    prevProps.item.id === nextProps.item.id &&
    prevProps.item.text === nextProps.item.text &&
    prevProps.item.sender === nextProps.item.sender &&
    prevProps.item.timestamp === nextProps.item.timestamp &&
    prevProps.item.reaction === nextProps.item.reaction &&
    prevProps.onReaction === nextProps.onReaction
  )
})

MessageBubble.displayName = 'MessageBubble'

const styles = StyleSheet.create({
  messageContainer: {
    marginBottom: 16,
    maxWidth: '80%',
    overflow: 'visible',
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
  bubbleWrapper: {
    position: 'relative',
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
  reactionBarWrapper: {
    position: 'absolute',
    bottom:-16,
    width: '100%',
  },
  reactionsContainer: {
    position: 'absolute',
    bottom: -6,
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderRadius: 12,
    zIndex: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  userReactionsContainer: {
    right: 4,
  },
  otherReactionsContainer: {
    left: 4,
  },
  reactionBadge: {
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  reactionEmoji: {
    fontSize: 12,
  },
})

