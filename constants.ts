import { VibeItem, VibeType } from './types';

export const VIBE_ITEMS: Omit<VibeItem, 'id'>[] = [
  { text: "Rizz", type: VibeType.VALID, emoji: "⚡" },
  { text: "Based", type: VibeType.VALID, emoji: "🗿" },
  { text: "No Cap", type: VibeType.VALID, emoji: "🧢" },
  { text: "Main Character", type: VibeType.VALID, emoji: "✨" },
  { text: "Slay", type: VibeType.VALID, emoji: "💅" },
  { text: "W", type: VibeType.VALID, emoji: "🏆" },
  { text: "Goated", type: VibeType.VALID, emoji: "🐐" },
  { text: "Ate", type: VibeType.VALID, emoji: "🍽️" },
  { text: "Valid", type: VibeType.VALID, emoji: "✅" },
  { text: "Chef's Kiss", type: VibeType.VALID, emoji: "👨‍🍳" },

  { text: "Cheugy", type: VibeType.CRINGE, emoji: "🧣" },
  { text: "Karen", type: VibeType.CRINGE, emoji: "👱‍♀️" },
  { text: "L + Ratio", type: VibeType.CRINGE, emoji: "📉" },
  { text: "Mid", type: VibeType.CRINGE, emoji: "😐" },
  { text: "Simp", type: VibeType.CRINGE, emoji: "🥺" },
  { text: "Boomer", type: VibeType.CRINGE, emoji: "👴" },
  { text: "Gatekeep", type: VibeType.CRINGE, emoji: "🚪" },
  { text: "Ick", type: VibeType.CRINGE, emoji: "🤢" },
  { text: "NPC", type: VibeType.CRINGE, emoji: "🤖" },
  { text: "Ohio", type: VibeType.CRINGE, emoji: "🌽" }, // Meme reference
];

export const DEVELOPER_NAME = "M.Sharifi";
export const MAX_TIME_MS = 3000;
export const MIN_TIME_MS = 800; // Speed cap