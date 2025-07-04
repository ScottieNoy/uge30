import * as Icons from "lucide-react";
import { Database } from "../database.types";

/* ------------------------- CONSTANT ENUMS ------------------------- */

export const JERSEY_CATEGORIES = [
  "førertroje", // Leader Jersey
  "gyldne_blaerer", // Golden Bladders
  "flydende_haand", // Flowing Hand
  "sprinter", // Sprint
  "prikket", // Dotted
  "ungdom", // Youth
  "punkttroje", // Points Jersey
  "maane", // Moon
] as const;

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

export const SUBCATEGORY_POINTS: Record<Subcategory, number> = {
  beer: 1,
  wine: 2,
  vodka: 3,
  funnel: 4,
  shot: 2,
  beerpong: 3,
  cornhole: 2,
  dart: 2,
  billiard: 2,
  stigegolf: 2,
  bonus: 5,
  other: 1,
};

export type JerseyData = {
  id: JerseyCategory;
  name: string;
  participants: {
    user: User;
    total: number;
    rank: number;
    trend: "up" | "down";
    change: string;
  }[];
};

/* ------------------------- UI CATEGORY CONFIG ------------------------- */

export type JerseyCategoryConfig = {
  id: JerseyCategory;
  name: string;
  icon: keyof typeof Icons;
  color: string;
  bgColor: string;
  borderColor: string;
};

export type JerseyDisplay = JerseyCategoryConfig & {
  holder: string;
  points: number;
  displayName: string; // full name of the holder
  icon: keyof typeof Icons; // or React.ComponentType<any>
  avatar?: string | null; // optional avatar URL
};

export type JerseyCategory = (typeof JERSEY_CATEGORIES)[number];
export type Subcategory = (typeof SUBCATEGORIES)[number];

export interface User {
  id: string;
  firstname: string;
  lastname: string;
  displayname: string;
  avatar?: string | null;
  emoji: string | null;
  is_admin?: boolean | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface UserPoint {
  id?: string;
  user_id: string;
  user?: User;
  category: JerseyCategory;
  subcategory: Subcategory;
  value: number; // match Supabase column
  submitted_by?: string;
  submitted_by_user?: User;
  created_at: string;
  updated_at?: string;
}

export interface LeaderboardEntry {
  user_id: string;
  user: User;
  category: JerseyCategory;
  total_points: number;
  rank: number;
}

export interface Activity {
  id: string;
  icon: keyof typeof Icons; // or React.ComponentType<any> if you store the component
  color: string;
  user: string;
  target: string;
  points: number;
  timestamp: string;
  type: Subcategory;
  message: string;
  // category?: JerseyCategory; // optional
}
export type AssignPoints = {
  category: JerseyCategory;
  subcategory: Subcategory;
  value: number;
  note?: string; // optional note for the points assignment
};

/* ------------------------- DOMAIN MODELS ------------------------- */

// Supabase `users` table shape + optional frontend additions
export interface User {
  id: string;
  firstname: string;
  lastname: string;
  avatar?: string | null; // optional avatar URL
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
  førertroje: {
    id: "førertroje",
    name: "Maillot Jaune",
    icon: "Trophy",
    color: "from-yellow-400 to-yellow-500",
    bgColor: "bg-yellow-100",
    borderColor: "border-yellow-200",
  },
  gyldne_blaerer: {
    id: "gyldne_blaerer",
    name: "Den gyldne blære",
    icon: "Beer",
    color: "from-orange-400 to-orange-500",
    bgColor: "bg-orange-100",
    borderColor: "border-orange-200",
  },
  flydende_haand: {
    id: "flydende_haand",
    name: "Den flydende hånd",
    icon: "Hand",
    color: "from-blue-400 to-blue-500",
    bgColor: "bg-blue-100",
    borderColor: "border-blue-200",
  },
  sprinter: {
    id: "sprinter",
    name: "Maillot Vert",
    icon: "Bike",
    color: "from-green-400 to-green-500",
    bgColor: "bg-green-100",
    borderColor: "border-green-200",
  },
  prikket: {
    id: "prikket",
    name: "Maillot à Pois Rouges",
    icon: "CircleDot",
    color: "from-red-400 to-red-500",
    bgColor: "bg-red-100",
    borderColor: "border-red-200",
  },
  ungdom: {
    id: "ungdom",
    name: "Maillot Blanc",
    icon: "User",
    color: "from-gray-400 to-gray-500",
    bgColor: "bg-gray-100",
    borderColor: "border-gray-200",
  },
  punkttroje: {
    id: "punkttroje",
    name: "Le Plus Pédophile",
    icon: "Baby",
    color: "from-pink-400 to-pink-500",
    bgColor: "bg-pink-100",
    borderColor: "border-pink-200",
  },
  
  
  maane: {
    id: "maane",
    name: "Maillot Lune",
    icon: "Moon",
    color: "from-blue-600 to-blue-700",
    bgColor: "bg-blue-300",
    borderColor: "border-blue-400",
  },
  
  
  
};
