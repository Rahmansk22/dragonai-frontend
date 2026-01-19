export async function streamChat(
  prompt: string,
  onToken: (t: string) => void
) {

  // This function should be refactored to use /api/chats/{chatId}/messages for real chat
  throw new Error("streamChat is deprecated. Use sendMessageToChat with a chatId instead.");
}
