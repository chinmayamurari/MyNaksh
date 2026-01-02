import { StyleSheet, Platform } from 'react-native'

// ============================================================================
// MESSAGE BUBBLE STYLES
// ============================================================================

export const styles = StyleSheet.create({
  // --------------------------------------------------------------------------
  // Container Styles
  // --------------------------------------------------------------------------
  messageContainer: {
    marginBottom: 16,
    maxWidth: '80%',
    overflow: 'visible',
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  otherMessageContainer: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  bubbleWrapper: {
    position: 'relative',
  },
  swipeContainer: {
    position: 'relative',
    overflow: 'visible',
  },

  // --------------------------------------------------------------------------
  // Message Bubble Styles
  // --------------------------------------------------------------------------
  messageBubble: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  userBubble: {
    backgroundColor: '#007AFF',
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
  },

  // --------------------------------------------------------------------------
  // Text Styles
  // --------------------------------------------------------------------------
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  otherMessageText: {
    color: '#000000',
  },
  senderLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
    marginLeft: 4,
  },
  timestamp: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
    marginLeft: 4,
  },
  userTimestamp: {
    textAlign: 'right',
    marginRight: 4,
  },

  // --------------------------------------------------------------------------
  // System Message Styles
  // --------------------------------------------------------------------------
  systemMessageContainer: {
    alignSelf: 'center',
    backgroundColor: '#E8E8E8',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginVertical: 8,
    maxWidth: '90%',
  },
  systemMessageText: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },

  // --------------------------------------------------------------------------
  // Reaction Styles
  // --------------------------------------------------------------------------
  reactionBarWrapper: {
    position: 'absolute',
    bottom: -16,
    width: '100%',
  },
  reactionsContainer: {
    position: 'absolute',
    bottom: -6,
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderRadius: 12,
    zIndex: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  userReactionsContainer: {
    right: 4,
  },
  otherReactionsContainer: {
    left: 4,
  },
  reactionBadge: {
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  reactionEmoji: {
    fontSize: 12,
  },

  // --------------------------------------------------------------------------
  // Swipe/Reply Icon Styles
  // --------------------------------------------------------------------------
  replyIconContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#007AFF',
    zIndex: 1,
    top: '50%',
    marginTop: -25, // Center vertically
  },
  replyIconContainerUser: {
    left: -60,
  },
  replyIconContainerOther: {
    left: 0, // Always on the left side for right swipe
  },
  replyIcon: {
    fontSize: 24,
  },
})

