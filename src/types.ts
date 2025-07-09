import * as Icons from "lucide-react";
import { Database } from "../database.types";

/* -------------------- ENUMS -------------------- */

export const JERSEYS = [
  "førertroje",
  "gyldne_blaerer",
  "flydende_haand",
  "sprinter",
  "prikket",
  "ungdom",
  "punkttroje",
  "maane",
] as const;

export const CATEGORIES = [
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

export type Jersey = typeof JERSEYS[number]; // `jersey_id`
export type Category = typeof CATEGORIES[number]; // `category` in DB

export const CATEGORY_POINTS: Record<Category, number> = {
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

/* -------------------- DOMAIN MODELS -------------------- */

export interface User {
  id: string;
  firstname: string;
  lastname: string;
  displayname: string;
  avatar_url?: string | null;
  emoji: string | null;
  is_admin?: boolean | null;
  role: string | null;
  created_at: string | null;
  updated_at: string | null;
}

// Point event from `points` + optional jersey link
export interface UserPoint {
  id?: string;
  user_id: string;
  user?: User;
  jersey_id: string; // refers to a jersey category
  category: Category; // previously `category` in DB
  value: number;
  note?: string | null;
  stage_id?: string | null;
  submitted_by?: string;
  submitted_by_user?: User;
  created_at: string;
  updated_at?: string;
}

// Used in `Scan` and `AssignPointsForm`
export interface AssignPoints {
  jersey_id: string; // required: the actual jersey (e.g. førertroje)
  category: Category; // DB `category` column
  value: number;
  note?: string;
}

/* -------------------- LEADERBOARD -------------------- */

export interface LeaderboardEntry {
  user_id: string;
  user: User;
  jersey_id: string;
  total_points: number;
  rank: number;
}

/* -------------------- JERSEY CONFIG -------------------- */

export interface JerseyCategoryConfig {
  id: Jersey;
  name: string;
  icon: keyof typeof Icons;
  color: string;
  bgColor: string;
  borderColor: string;
}

export interface JerseyDisplay extends JerseyCategoryConfig {
  holder: string;
  displayName: string;
  points: number;
  avatar?: string | null;
}

export const jerseyConfigs: Record<Jersey, JerseyCategoryConfig> = {
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

/* -------------------- ACTIVITY -------------------- */

export interface Activity {
  id: string;
  icon: keyof typeof Icons;
  color: string;
  user: string;
  target: string;
  points: number;
  timestamp: string;
  type: Category;
  message: string;
}
