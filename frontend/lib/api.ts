import { Message } from '@/types/message';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function fetchMessages(): Promise<Message[]> {
  const url = `${API_URL}/api/messages`;
  console.log('📡 Fetching messages from:', url);

  try {
    const response = await fetch(url);
    console.log('📡 Response status:', response.status, response.statusText);

    if (!response.ok) {
      console.error('❌ Failed to fetch messages:', response.status, response.statusText);
      throw new Error(`Failed to fetch messages: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`✅ Successfully fetched ${data.length} messages`);
    return data;
  } catch (error) {
    console.error('❌ Error fetching messages:', error);
    throw error;
  }
}
