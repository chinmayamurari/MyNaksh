import React, { useCallback, useRef, useState, useLayoutEffect, useMemo, useEffect } from 'react'
import { 
  FlatList, 
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { MessageBubble, Message } from '../components/MessageBubble'
import { ChatInput } from '../components/ChatInput'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useChatStore } from '../store/chatStore'
import RatingOverlay from '../components/RatingOverlay'

export default function ChatScreen() {
  const flatListRef = useRef<FlatList>(null)
  const navigation = useNavigation()
  const [showRatingOverlay, setShowRatingOverlay] = useState(false)
  const previousMessageCountRef = useRef<number>(0)

  // Only subscribe to messages - this is all ChatScreen needs
  const messages = useChatStore((state) => state.messages)

  // Scroll to end only when new messages are added, not when content size changes
  useEffect(() => {
    const currentMessageCount = messages.length
    const previousMessageCount = previousMessageCountRef.current

    // Only scroll if a new message was added (count increased)
    if (currentMessageCount > previousMessageCount) {
      // Small delay to ensure layout is complete
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true })
      }, 100)
    }

    previousMessageCountRef.current = currentMessageCount
  }, [messages.length])

  const handleEndChat = useCallback(() => {
    setShowRatingOverlay(true)
  }, [])

  const headerRight = useMemo(
    () => (
      <TouchableOpacity
        onPress={handleEndChat}
        style={styles.endChatButton}
      >
        <Text style={styles.endChatButtonText}>End Chat</Text>
      </TouchableOpacity>
    ),
    [handleEndChat]
  )

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => headerRight,
    })
  }, [navigation, headerRight])

  const renderItem = useCallback(
    ({ item }: { item: Message }) => (
      <MessageBubble item={item} />
    ),
    []
  )

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={messages}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
      />
      <ChatInput />
      <RatingOverlay
        visible={showRatingOverlay}
        onClose={() => setShowRatingOverlay(false)}
      />
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
  endChatButton: {
    marginRight: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  endChatButtonText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: '600',
  },
})