export type Message = {
  id: string;
  sender: 'bot' | 'user';
  text: string;
};

export type HistoryItem = {
  id: string;
  title: string;
  date: string;
};

export const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    sender: 'bot',
    text: "Hey, I'm SafeSpace. This is a judgment-free zone — what's on your mind?",
  },
];

export const RESPONSE_POOL: string[] = [];

export const DEFAULT_QUICK_REPLIES: string[] = [
  "I'm feeling anxious",
  "I need to vent",
  "I can't sleep",
  "I feel overwhelmed",
];

export const AFTER_RESPONSE_QUICK_REPLIES: string[] = [
  "Tell me more",
  "What should I do?",
  "I feel a bit better",
  "I'm still struggling",
];

export const HISTORY_ITEMS: HistoryItem[] = [];