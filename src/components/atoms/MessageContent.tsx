import React from 'react'
import { View, Text, Pressable } from 'react-native'
import { EmojiReactionBar } from './EmojiReactionBar'
import { styles } from '../styles/MessageBubble.styles'

// ============================================================================
// TYPES & INTERFACES
// ============================================================================
interface MessageContentProps {
  text: string
  reaction?: string
  isUser: boolean
  showReactionBar: boolean
  onLongPress: () => void
  onPress: () => void
  onEmojiSelect: (emoji: string) => void
  onDismiss: () => void
}

// ============================================================================
// COMPONENT
// ============================================================================
export const MessageContent = React.memo(({
  text,
  reaction,
  isUser,
  showReactionBar,
  onLongPress,
  onPress,
  onEmojiSelect,
  onDismiss,
}: MessageContentProps) => {
  return (
    <Pressable
      delayLongPress={1000}
      onLongPress={onLongPress}
      onPress={onPress}
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
            {text}
          </Text>
        </View>
        {reaction && (
          <View
            style={[
              styles.reactionsContainer,
              isUser ? styles.userReactionsContainer : styles.otherReactionsContainer,
            ]}
          >
            <View style={styles.reactionBadge}>
              <Text style={styles.reactionEmoji}>{reaction}</Text>
            </View>
          </View>
        )}
      </View>
      {showReactionBar && (
        <View style={styles.reactionBarWrapper}>
          <EmojiReactionBar
            visible={showReactionBar}
            onEmojiSelect={onEmojiSelect}
            onDismiss={onDismiss}
            isUserMessage={isUser}
          />
        </View>
      )}
    </Pressable>
  )
})

MessageContent.displayName = 'MessageContent'

