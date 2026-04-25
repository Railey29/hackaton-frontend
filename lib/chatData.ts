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
];

export const RESPONSE_POOL: string[] = [

];

export const DEFAULT_QUICK_REPLIES = [

];

export const AFTER_RESPONSE_QUICK_REPLIES = [
];

export const HISTORY_ITEMS: HistoryItem[] = [
];
