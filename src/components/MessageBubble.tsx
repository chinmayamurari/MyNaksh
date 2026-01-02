
import React, { useState, useEffect, useRef } from 'react'
import {
  View,
  Text,
} from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated'
import { MessageContent } from './atoms/MessageContent'
import { useChatStore } from '../store/chatStore'
import { styles } from './styles/MessageBubble.styles'
import { formatTime, getSenderLabel } from './utils/messageBubble.utils'

// ============================================================================
// TYPES & INTERFACES
// ============================================================================
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
}

const SWIPE_THRESHOLD = 80 // Minimum swipe distance to trigger reply
const MAX_SWIPE = 100 // Maximum swipe distance
const REACTION_BAR_AUTO_DISMISS_TIME = 3000 // 3 seconds


export const MessageBubble = React.memo(({
  item,
}: MessageBubbleProps) => {


  const handleReaction = useChatStore((state) => state.handleReaction)
  const setReplyingTo = useChatStore((state) => state.setReplyingTo)
  const [showReactionBar, setShowReactionBar] = useState(false)
  const dismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const translateX = useSharedValue(0) // Reanimated shared value for swipe gesture


  const isUser = item.sender === 'user'
  const isSystem = item.sender === 'system'


  // --------------------------------------------------------------------------
  // Effects
  // --------------------------------------------------------------------------
  // Auto-dismiss reaction bar after timeout if no selection
  useEffect(() => {
    if (showReactionBar) {
      dismissTimerRef.current = setTimeout(() => {
        setShowReactionBar(false)
      }, REACTION_BAR_AUTO_DISMISS_TIME)
    }

    return () => {
      if (dismissTimerRef.current) {
        clearTimeout(dismissTimerRef.current)
      }
    }
  }, [showReactionBar])

  // --------------------------------------------------------------------------
  // Event Handlers
  // --------------------------------------------------------------------------
  const handleLongPress = () => {
    if (!isSystem) {
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
    
    // Update chat state directly from store
    handleReaction(item.id, emoji)
    
    // Hide reaction bar
    setShowReactionBar(false)
  }

  const handleDismiss = () => {
    if (dismissTimerRef.current) {
      clearTimeout(dismissTimerRef.current)
    }
    setShowReactionBar(false)
  }

  const triggerReply = () => {
    setReplyingTo(item)
  }

  // --------------------------------------------------------------------------
  // Gesture Handlers
  // --------------------------------------------------------------------------
  const panGesture = Gesture.Pan()
    .activeOffsetX([10, Infinity]) // Only activate for right swipe (minimum 10px)
    .failOffsetY([-10, 10]) // Fail if vertical movement is too large (prevents interference with scrolling)
    .onUpdate((event) => {
      'worklet'
      // Only allow right swipe (positive translation)
      if (event.translationX > 0) {
        translateX.value = Math.min(event.translationX, MAX_SWIPE)
      } else {
        // Reset if swiping left
        translateX.value = 0
      }
    })
    .onEnd((event) => {
      'worklet'
      if (event.translationX >= SWIPE_THRESHOLD) {
        // Trigger reply if threshold reached
        runOnJS(triggerReply)()
      }
      // Spring back to original position
      translateX.value = withSpring(0, {
        damping: 15,
        stiffness: 150,
      })
    })

  // --------------------------------------------------------------------------
  // Animated Styles
  // --------------------------------------------------------------------------
  const animatedBubbleStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    }
  })

  const animatedReplyIconStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      [0, SWIPE_THRESHOLD / 2, SWIPE_THRESHOLD],
      [0, 0.5, 1],
      Extrapolation.CLAMP
    )
    const scale = interpolate(
      translateX.value,
      [0, SWIPE_THRESHOLD],
      [0.5, 1],
      Extrapolation.CLAMP
    )
    return {
      opacity,
      transform: [{ scale }],
    }
  })

  // --------------------------------------------------------------------------
  // Render Helpers
  // --------------------------------------------------------------------------
  const renderSystemMessage = () => (
    <View style={styles.systemMessageContainer}>
      <Text style={styles.systemMessageText}>{item.text}</Text>
    </View>
  )

  const renderRegularMessage = () => (
    <View
      style={[
        styles.messageContainer,
        isUser ? styles.userMessageContainer : styles.otherMessageContainer,
      ]}
    >
      {!isUser && (
        <Text style={styles.senderLabel}>{getSenderLabel(item.sender)}</Text>
      )}
      <View style={styles.swipeContainer}>
        {/* Reply icon background - appears when swiping */}
        <Animated.View
          style={[
            styles.replyIconContainer,
            isUser ? styles.replyIconContainerUser : styles.replyIconContainerOther,
            animatedReplyIconStyle,
          ]}
        >
          <Text style={styles.replyIcon}>↩️</Text>
        </Animated.View>

        <GestureDetector gesture={panGesture}>
          <Animated.View style={animatedBubbleStyle}>
            <MessageContent
              text={item.text}
              reaction={item.reaction}
              isUser={isUser}
              showReactionBar={showReactionBar}
              onLongPress={handleLongPress}
              onPress={handlePress}
              onEmojiSelect={handleEmojiSelect}
              onDismiss={handleDismiss}
            />
          </Animated.View>
        </GestureDetector>
      </View>
      <Text style={[styles.timestamp, isUser && styles.userTimestamp]}>
        {formatTime(item.timestamp)}
      </Text>
    </View>
  )

  // --------------------------------------------------------------------------
  // Main Render
  // --------------------------------------------------------------------------
  if (isSystem) {
    return renderSystemMessage()
  }

  return renderRegularMessage()
}, (prevProps, nextProps) => {
  // Return true if props are equal (skip re-render), false if different (re-render)
  return (
    prevProps.item.id === nextProps.item.id &&
    prevProps.item.text === nextProps.item.text &&
    prevProps.item.sender === nextProps.item.sender &&
    prevProps.item.timestamp === nextProps.item.timestamp &&
    prevProps.item.reaction === nextProps.item.reaction
  )
})

MessageBubble.displayName = 'MessageBubble'



