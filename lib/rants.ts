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
  {
    id: "1",
    alias: "quietstranger_7",
    initials: "QS",
    avatarColor: "bg-sage-200",
    timestamp: "2 hours ago",
    flair: "Burnout",
    body: "I've been staring at the same line of code for 4 hours. Everyone thinks I'm killing it but I feel like I'm drowning. I just want to pause everything for a week.",
    feltCount: 24,
    replyCount: 5,
  },
  {
    id: "2",
    alias: "moonlight_walker",
    initials: "MW",
    avatarColor: "bg-stone-300",
    timestamp: "5 hours ago",
    flair: "Loneliness",
    body: "Moved to a new city for a job. The job is great but my apartment is so quiet. I miss just having someone in the other room.",
    feltCount: 42,
    replyCount: 12,
  },
  {
    id: "3",
    alias: "tired_soul",
    initials: "TS",
    avatarColor: "bg-sage-300",
    timestamp: "Yesterday",
    flair: "Anxiety",
    body: "My chest has felt tight all day for literally no reason. I hate when my body decides we are in danger when I'm just trying to make coffee.",
    feltCount: 89,
    replyCount: 8,
  },
  {
    id: "4",
    alias: "gentle_rain",
    initials: "GR",
    avatarColor: "bg-stone-200",
    timestamp: "Yesterday",
    flair: "Feeling lost",
    body: "I'm 28 and I feel like everyone else got a manual on how to be an adult that I somehow missed. Just faking it every single day.",
    feltCount: 156,
    replyCount: 23,
  },
];
