// ============================================================================
// MESSAGE BUBBLE UTILITY FUNCTIONS
// ============================================================================

/**
 * Formats a timestamp into a readable time string
 * @param timestamp - Unix timestamp in milliseconds
 * @returns Formatted time string (e.g., "02:30 PM")
 */
export const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  })
}

/**
 * Converts a sender identifier to a display label
 * @param sender - Sender identifier string
 * @returns Display label for the sender
 */
export const getSenderLabel = (sender: string): string => {
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

