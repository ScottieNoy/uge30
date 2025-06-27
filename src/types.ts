import * as Icons from "lucide-react";

/* ------------------------- CONSTANT ENUMS ------------------------- */

export const JERSEY_CATEGORIES = [
  "gyldne_blaerer", // Golden Bladders
  "sprinter", // Sprint
  "flydende_haand", // Flowing Hand
  "førertroje", // Leader Jersey
  "maane", // Moon
  "prikket", // Dotted
  "punkttroje", // Points Jersey
  "ungdom", // Youth
] as const;

export type JerseyCategory = (typeof JERSEY_CATEGORIES)[number];

export const SUBCATEGORIES = [
  "beer",
  "wine",
  "vodka",
  "funnel",
  "shot",
  "beerpong",
  "cornhole",
  "dart",
  "billiard",
  "stigegolf",
  "bonus",
  "other",
] as const;

export type Subcategory = (typeof SUBCATEGORIES)[number];

/* ------------------------- UI CATEGORY CONFIG ------------------------- */

export type JerseyCategoryConfig = {
  id: string;
  name: JerseyCategory;
  icon: keyof typeof Icons;
  color: string;
  bgColor: string;
  borderColor: string;
};

export type JerseyDisplay = JerseyCategoryConfig & {
  holder: string;
  points: number;
  icon: keyof typeof Icons; // or React.ComponentType<any>
};

export type Activity = {
  id: string;
  icon: keyof typeof Icons;
  color: string; // Tailwind gradient color
  label: string;
  user: string; // User's name or identifier
  target: string; // Target of the activity (e.g., another user, challenge)
  points: number; // Points earned or associated with the activity
  timestamp: string; // ISO date string or formatted date
  type: Subcategory; // Type of activity (e.g., beer, wine, etc.)
  message: string; // Description of the activity
};

/* ------------------------- DOMAIN MODELS ------------------------- */

// Supabase `users` table shape + optional frontend additions
export interface User {
  id: string;
  firstname: string;
  lastname: string;
  emoji: string | null; // optional emoji
  is_admin?: boolean | null; // optional admin flag
  created_at: string | null; // optional created date
  updated_at: string | null; // optional updated date
}

// Supabase `points` table shape + optional relational data
export interface UserPoint {
  id?: string; // optional ID for existing points
  user_id: string;
  user?: User; // optional expanded user info
  category: JerseyCategory;
  subcategory: Subcategory;
  points: number; // renamed from `value` for clarity
  submitted_by?: string;
  submitted_by_user?: User; // optional expanded submitter info
  created_at: string;
  updated_at?: string;
}

// Leaderboard aggregated info
export interface LeaderboardEntry {
  user_id: string;
  user: User;
  category: JerseyCategory;
  total_points: number;
  rank: number;
}

export const jerseyConfigs: Record<JerseyCategory, JerseyCategoryConfig> = {
  gyldne_blaerer: {
    id: "gyldne_blaerer",
    name: "gyldne_blaerer",
    icon: "Trophy",
    color: "from-yellow-400 to-yellow-500",
    bgColor: "bg-yellow-100",
    borderColor: "border-yellow-200",
  },
  sprinter: {
    id: "sprinter",
    name: "sprinter",
    icon: "CloudLightning",
    color: "from-blue-400 to-blue-500",
    bgColor: "bg-blue-100",
    borderColor: "border-blue-200",
  },
  flydende_haand: {
    id: "flydende_haand",
    name: "flydende_haand",
    icon: "Hand",
    color: "from-green-400 to-green-500",
    bgColor: "bg-green-100",
    borderColor: "border-green-200",
  },
  førertroje: {
    id: "førertroje",
    name: "førertroje",
    icon: "FlagTriangleLeft",
    color: "from-red-400 to-red-500",
    bgColor: "bg-red-100",
    borderColor: "border-red-200",
  },
  maane: {
    id: "maane",
    name: "maane",
    icon: "Moon",
    color: "from-purple-400 to-purple-500",
    bgColor: "bg-purple-100",
    borderColor: "border-purple-200",
  },
  prikket: {
    id: "prikket",
    name: "prikket",
    icon: "CircleDot",
    color: "from-pink-400 to-pink-500",
    bgColor: "bg-pink-100",
    borderColor: "border-pink-200",
  },
  punkttroje: {
    id: "punkttroje",
    name: "punkttroje",
    icon: "Baby",
    color: "from-orange-400 to-orange-500",
    bgColor: "bg-orange-100",
    borderColor: "border-orange-200",
  },
  ungdom: {
    id: "ungdom",
    name: "ungdom",
    icon: "WheatIcon",
    color: "from-teal-400 to-teal-500",
    bgColor: "bg-teal-100",
    borderColor: "border-teal-200",
  },
};
