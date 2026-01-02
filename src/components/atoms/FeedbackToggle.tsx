import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated'

// ============================================================================
// TYPES & INTERFACES
// ============================================================================
interface FeedbackToggleProps {
  feedbackType: 'liked' | 'disliked' | null
  selectedChips: string[]
  onFeedbackChange: (type: 'liked' | 'disliked' | null) => void
  onChipSelect: (chip: string) => void
}

const FEEDBACK_CHIPS = ['Inaccurate', 'Too Vague', 'Too Long']

// ============================================================================
// COMPONENT
// ============================================================================
export const FeedbackToggle = React.memo(({
  feedbackType,
  selectedChips,
  onFeedbackChange,
  onChipSelect,
}: FeedbackToggleProps) => {
  const chipsHeight = useSharedValue(0)
  const chipsOpacity = useSharedValue(0)

  // Animate chips when dislike is selected
  React.useEffect(() => {
    if (feedbackType === 'disliked') {
      chipsHeight.value = withTiming(40, { duration: 300 })
      chipsOpacity.value = withTiming(1, { duration: 300 })
    } else {
      chipsHeight.value = withTiming(0, { duration: 200 })
      chipsOpacity.value = withTiming(0, { duration: 200 })
    }
  }, [feedbackType, chipsHeight, chipsOpacity])

  const handleLikePress = () => {
    const newType = feedbackType === 'liked' ? null : 'liked'
    onFeedbackChange(newType)
  }

  const handleDislikePress = () => {
    const newType = feedbackType === 'disliked' ? null : 'disliked'
    onFeedbackChange(newType)
  }

  const handleChipPress = (chip: string) => {
    onChipSelect(chip)
  }

  const chipsAnimatedStyle = useAnimatedStyle(() => {
    return {
      height: chipsHeight.value,
      opacity: chipsOpacity.value,
      marginTop: interpolate(
        chipsHeight.value,
        [0, 40],
        [0, 8],
        Extrapolation.CLAMP
      ),
    }
  })

  return (
    <View style={styles.container}>
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            styles.likeButton,
            feedbackType === 'liked' && styles.buttonActive,
          ]}
          onPress={handleLikePress}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.buttonText,
              feedbackType === 'liked' && styles.buttonTextActive,
            ]}
          >
            👍 Like
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            styles.dislikeButton,
            feedbackType === 'disliked' && styles.buttonActive,
          ]}
          onPress={handleDislikePress}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.buttonText,
              feedbackType === 'disliked' && styles.buttonTextActive,
            ]}
          >
            👎 Dislike
          </Text>
        </TouchableOpacity>
      </View>

      <Animated.View style={[styles.chipsContainer, chipsAnimatedStyle]}>
        <View style={styles.chipsRow}>
          {FEEDBACK_CHIPS.map((chip) => {
            const isSelected = selectedChips.includes(chip)
            return (
              <TouchableOpacity
                key={chip}
                style={[
                  styles.chip,
                  isSelected && styles.chipSelected,
                ]}
                onPress={() => handleChipPress(chip)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.chipText,
                    isSelected && styles.chipTextSelected,
                  ]}
                >
                  {chip}
                </Text>
              </TouchableOpacity>
            )
          })}
        </View>
      </Animated.View>
    </View>
  )
})

FeedbackToggle.displayName = 'FeedbackToggle'

// ============================================================================
// STYLES
// ============================================================================
const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    overflow: 'hidden',
  },
  toggleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#F0F0F0',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  likeButton: {
    // Specific styles if needed
  },
  dislikeButton: {
    // Specific styles if needed
  },
  buttonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  buttonTextActive: {
    color: '#FFFFFF',
  },
  chipsContainer: {
    overflow: 'hidden',
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    paddingTop: 4,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  chipSelected: {
    backgroundColor: '#FF3B30',
    borderColor: '#FF3B30',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666',
  },
  chipTextSelected: {
    color: '#FFFFFF',
  },
})

