import React, { useCallback, useRef } from 'react'
import { 
  FlatList, 
  StyleSheet,
} from 'react-native'
import { MessageBubble, Message } from '../components/MessageBubble'
import { ChatInput } from '../components/ChatInput'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useChatStore } from '../store/chatStore'

export default function ChatScreen() {
  const flatListRef = useRef<FlatList>(null)

  // Only subscribe to messages - this is all ChatScreen needs
  const messages = useChatStore((state) => state.messages)

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
})