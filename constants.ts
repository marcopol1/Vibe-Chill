
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

export const DAILY_VIBES = [
  "Immaculate",
  "Feral",
  "Unbothered",
  "Chaotic Good",
  "Main Character Energy",
  "Entering Villain Era",
  "Cozy",
  "High Key Stressed",
  "Living Rent Free",
  "Down Bad"
];

export const GAME_BACKGROUNDS = [
  "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80", // Cyberpunk Market
  "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&w=800&q=80", // Glitch Datamosh
  "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=800&q=80", // Vaporwave Neon
  "https://images.unsplash.com/photo-1504851149312-7a075b496cc7?auto=format&fit=crop&w=800&q=80", // Neon Smoke
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80", // Abstract Liquid
  "https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=800&q=80", // Retro TV
  "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&w=800&q=80", // Neon Signs
  "https://images.unsplash.com/photo-1592659762303-90081d34b277?auto=format&fit=crop&w=800&q=80", // Abstract Gradient
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80", // Party Crowd
  "https://images.unsplash.com/photo-1614726365723-49cfa5a47c23?auto=format&fit=crop&w=800&q=80", // Iridescent
];
