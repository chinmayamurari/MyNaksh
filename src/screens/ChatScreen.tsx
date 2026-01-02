import React, { useCallback, useRef, useState, useLayoutEffect, useMemo } from 'react'
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
import { RatingOverlay } from '../components/RatingOverlay'

export default function ChatScreen() {
  const flatListRef = useRef<FlatList>(null)
  const navigation = useNavigation()
  const [showRatingOverlay, setShowRatingOverlay] = useState(false)

  // Only subscribe to messages - this is all ChatScreen needs
  const messages = useChatStore((state) => state.messages)

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
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        onContentSizeChange={() => {
          flatListRef.current?.scrollToEnd({ animated: true })
        }}
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