import * as Icons from "lucide-react";
import { Database } from "../database.types";

/* ------------------------- CONSTANT ENUMS ------------------------- */

export const JERSEY_CATEGORIES = [
  "ede64da5-3020-4812-aafb-a89550629af3", // Leader Jersey
  "45158f97-3418-401c-b02f-8cd91d7ef7d3", // Golden Bladders
  "c82651a0-7737-4010-9baa-e884259a2b9c", // Flowing Hand
  "00f9b012-02b1-41a2-8146-62e2750380a6", // Sprint
  "dccd4651-7429-4679-a352-8a6a5993863b", // Dotted
  "ad5a8eed-74d5-48ea-8f13-7e9b968419f2", // Youth
  "22020dc6-4d9a-4200-96d5-c36db91ff3be", // Humorous or troll-based points
  "4a58d3e7-c9eb-4d13-bd2a-2040f98eabb1", // Moon
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
  avatar_url?: string | null;
  emoji: string | null;
  is_admin?: boolean | null;
  role: string | null; // e.g., "user", "admin"
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
  "ede64da5-3020-4812-aafb-a89550629af3": {
    name: "Maillot Jaune",
    icon: "Trophy",
    color: "from-yellow-400 to-yellow-500",
    bgColor: "bg-yellow-100",
    borderColor: "border-yellow-200",
  },
  "45158f97-3418-401c-b02f-8cd91d7ef7d3": {
    name: "Den gyldne blære",
    icon: "Beer",
    color: "from-orange-400 to-orange-500",
    bgColor: "bg-orange-100",
    borderColor: "border-orange-200",
  },
  "c82651a0-7737-4010-9baa-e884259a2b9c": {
    name: "Den flydende hånd",
    icon: "Hand",
    color: "from-blue-400 to-blue-500",
    bgColor: "bg-blue-100",
    borderColor: "border-blue-200",
  },
  "00f9b012-02b1-41a2-8146-62e2750380a6": {
    name: "Maillot Vert",
    icon: "Bike",
    color: "from-green-400 to-green-500",
    bgColor: "bg-green-100",
    borderColor: "border-green-200",
  },
  "dccd4651-7429-4679-a352-8a6a5993863b": {
    name: "Maillot à Pois Rouges",
    icon: "CircleDot",
    color: "from-red-400 to-red-500",
    bgColor: "bg-red-100",
    borderColor: "border-red-200",
  },
  "ad5a8eed-74d5-48ea-8f13-7e9b968419f2": {
    name: "Maillot Blanc",
    icon: "User",
    color: "from-gray-400 to-gray-500",
    bgColor: "bg-gray-100",
    borderColor: "border-gray-200",
  },
  "22020dc6-4d9a-4200-96d5-c36db91ff3be": {
    name: "Le Plus Pédophile",
    icon: "Baby",
    color: "from-pink-400 to-pink-500",
    bgColor: "bg-pink-100",
    borderColor: "border-pink-200",
  },

  "4a58d3e7-c9eb-4d13-bd2a-2040f98eabb1": {
    name: "Maillot Lune",
    icon: "Moon",
    color: "from-blue-600 to-blue-700",
    bgColor: "bg-blue-300",
    borderColor: "border-blue-400",
  },
};
