import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import Animated, {
  FadeIn,
  FadeOut,
  Layout,
} from 'react-native-reanimated'

interface RatingOverlayProps {
  visible: boolean
  onClose: () => void
}

export const RatingOverlay: React.FC<RatingOverlayProps> = ({
  visible,
  onClose,
}) => {
  const navigation = useNavigation()
  const [rating, setRating] = useState(0)
  const [submitted, setSubmitted] = useState(false)

  React.useEffect(() => {
    if (visible) {
      setRating(0)
      setSubmitted(false)
    }
  }, [visible])

  const handleStarPress = (starIndex: number) => {
    if (!submitted) {
      setRating(starIndex + 1)
    }
  }

  const handleSubmit = () => {
    if (rating === 0) {
      Alert.alert('Please Rate', 'Please select a rating before submitting.')
      return
    }

    setSubmitted(true)
    
    // Show confirmation alert
    Alert.alert(
      'Thank You!',
      `Your ${rating}-star rating has been captured. We appreciate your feedback!`,
      [
        {
          text: 'OK',
          onPress: () => {
            onClose()
            setRating(0)
            setSubmitted(false)
            // Navigate back one screen
            navigation.goBack()
          },
        },
      ]
    )
  }

  const handleClose = () => {
    onClose()
    setRating(0)
    setSubmitted(false)
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
    >
      <Animated.View
        style={[styles.overlay, StyleSheet.absoluteFill, styles.blurBackground]}
        entering={FadeIn.duration(300)}
        exiting={FadeOut.duration(200)}
      >
        {/* <View style={[StyleSheet.absoluteFill, styles.blurBackground]} /> */}

        <Animated.View
          style={styles.content}
          layout={Layout.springify().damping(15).stiffness(150)}
          entering={FadeIn.duration(300).delay(100)}
          exiting={FadeOut.duration(200)}
        >
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleClose}
          >
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>

          <View style={styles.ratingContainer}>
            <Text style={styles.thankYouText}>Thank You!</Text>
            <Text style={styles.subtitleText}>
              We hope you had a great experience
            </Text>

            <View style={styles.starsContainer}>
              {[0, 1, 2, 3, 4].map((index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleStarPress(index)}
                  disabled={submitted}
                  activeOpacity={0.7}
                  style={index < 4 && styles.starSpacing}
                >
                  <Text style={styles.star}>
                    {index < rating ? '★' : '☆'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {!submitted && (
              <View style={styles.submitContainer}>
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handleSubmit}
                >
                  <Text style={styles.submitButtonText}>Submit Rating</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blurBackground: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
  content: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 32,
    width: '85%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#666',
    lineHeight: 28,
  },
  ratingContainer: {
    alignItems: 'center',
    width: '100%',
  },
  thankYouText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitleText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
    textAlign: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  star: {
    fontSize: 48,
    color: '#FFD700',
    textShadowColor: 'rgba(255, 215, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  starSpacing: {
    marginRight: 12,
  },
  submitContainer: {
    width: '100%',
    marginTop: 8,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
})

export default RatingOverlay

