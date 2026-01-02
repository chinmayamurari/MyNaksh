import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Platform,
} from 'react-native'

interface EmojiReactionBarProps {
  visible: boolean
  onEmojiSelect: (emoji: string) => void
  onDismiss: () => void
  isUserMessage?: boolean
}

const EMOJI_SET = ['❤️','🙏', '✨', '🌙']

export const EmojiReactionBar = ({
  visible,
  onEmojiSelect,
  onDismiss,
  isUserMessage = false,
}: EmojiReactionBarProps) => {
  const scaleAnim = React.useRef(new Animated.Value(0)).current
  const opacityAnim = React.useRef(new Animated.Value(0)).current

  React.useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start()
    } else {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start()
    }
  }, [visible, scaleAnim, opacityAnim])

  if (!visible) {
    return null
  }

  const handleEmojiPress = (emoji: string) => {
    onEmojiSelect(emoji)
    onDismiss()
  }

  return (
    <Animated.View
      style={[
        styles.container,
        isUserMessage ? styles.userContainer : styles.otherContainer,
        {
          opacity: opacityAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <View style={styles.bar}>
        {EMOJI_SET.map((emoji, index) => (
          <TouchableOpacity
            key={index}
            style={styles.emojiButton}
            onPress={() => handleEmojiPress(emoji)}
            activeOpacity={0.7}
          >
            <Text style={styles.emoji}>{emoji}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: '100%',
    marginBottom: 8,
    zIndex: 1000,
  },
  userContainer: {
    alignSelf: 'flex-end',
  },
  otherContainer: {
    alignSelf: 'flex-start',
  },
  bar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 8,
    paddingVertical: 6,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  emojiButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 2,
  },
  emoji: {
    fontSize: 16,
  },
})

