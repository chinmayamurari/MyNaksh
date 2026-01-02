import React, { useState } from 'react'
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
} from 'react-native'
import { useChatStore } from '../store/chatStore'

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

export const ChatInput = React.memo(() => {
  const [inputText, setInputText] = useState('')
  
  // Direct access to store - only subscribe to what this component needs
  const replyingTo = useChatStore((state) => state.replyingTo)
  const sendMessage = useChatStore((state) => state.sendMessage)
  const setReplyingTo = useChatStore((state) => state.setReplyingTo)

  const handleSend = () => {
    if (inputText.trim().length > 0) {
      sendMessage(inputText.trim())
      setInputText('')
    }
  }
  
  const handleCancelReply = () => {
    setReplyingTo(null)
  }

  const handleSubmitEditing = () => {
    handleSend()
  }

  return (
    <View>
      {replyingTo && (
        <View style={styles.replyPreviewContainer}>
          <View style={styles.replyPreviewContent}>
            <View style={styles.replyPreviewLeft}>
              <View style={styles.replyPreviewIndicator} />
              <View style={styles.replyPreviewTextContainer}>
                <Text style={styles.replyPreviewLabel}>
                  Replying to {getSenderLabel(replyingTo.sender)}
                </Text>
                <Text style={styles.replyPreviewText} numberOfLines={1}>
                  {replyingTo.text}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancelReply}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Type your message..."
          placeholderTextColor="#999"
          value={inputText}
          onChangeText={setInputText}
          multiline
          maxLength={500}
          keyboardType="default"
          returnKeyType="send"
          onSubmitEditing={handleSubmitEditing}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            inputText.trim().length === 0 && styles.sendButtonDisabled,
          ]}
          onPress={handleSend}
          disabled={inputText.trim().length === 0}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
})

ChatInput.displayName = 'ChatInput'

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    alignItems: 'flex-end',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    paddingTop: 10,
    maxHeight: 100,
    fontSize: 16,
    backgroundColor: '#F5F5F5',
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 70,
  },
  sendButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  replyPreviewContainer: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  replyPreviewContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  replyPreviewLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  replyPreviewIndicator: {
    width: 3,
    height: 40,
    backgroundColor: '#007AFF',
    borderRadius: 2,
    marginRight: 12,
  },
  replyPreviewTextContainer: {
    flex: 1,
  },
  replyPreviewLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 2,
  },
  replyPreviewText: {
    fontSize: 14,
    color: '#666',
  },
  cancelButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  cancelButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
  },
})

