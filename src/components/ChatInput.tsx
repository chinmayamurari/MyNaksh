import React, { useState } from 'react'
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
} from 'react-native'

interface ChatInputProps {
  onSend: (message: string) => void
}

export const ChatInput = React.memo(({ onSend }: ChatInputProps) => {
  const [inputText, setInputText] = useState('')

  const handleSend = () => {
    if (inputText.trim().length > 0) {
      onSend(inputText.trim())
      setInputText('')
    }
  }

  const handleSubmitEditing = () => {
    handleSend()
  }

  return (
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
})

