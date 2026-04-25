export type FlairType = "Anxiety" | "Burnout" | "Grief" | "Loneliness" | "Just venting" | "Feeling lost";

export type Rant = {
  id: string;
  alias: string;
  initials: string;
  avatarColor: string; // tailwind bg class
  timestamp: string;
  flair: FlairType;
  body: string;
  feltCount: number;
  replyCount: number;
};

export const MOCK_RANTS: Rant[] = [
];
