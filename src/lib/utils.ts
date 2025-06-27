import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import * as Icons from "lucide-react";

import { Subcategory } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const SUBCATEGORY_META: Record<
  Subcategory,
  {
    icon: keyof typeof Icons;
    label: string;
    color: string; // Tailwind gradient color
  }
> = {
  beer: { icon: "Beer", label: "Beer", color: "from-yellow-400 to-amber-500" },
  wine: { icon: "Wine", label: "Wine", color: "from-purple-400 to-pink-400" },
  vodka: { icon: "Flame", label: "Vodka", color: "from-red-500 to-orange-400" },
  funnel: {
    icon: "Shield",
    label: "Funnel",
    color: "from-blue-400 to-cyan-400",
  },
  shot: { icon: "Flame", label: "Shot", color: "from-red-500 to-yellow-400" },
  beerpong: {
    icon: "Gamepad2",
    label: "Beerpong",
    color: "from-green-400 to-lime-400",
  },
  cornhole: {
    icon: "Gamepad2",
    label: "Cornhole",
    color: "from-orange-400 to-yellow-400",
  },
  dart: {
    icon: "Target",
    label: "Dart",
    color: "from-purple-500 to-indigo-500",
  },
  billiard: {
    icon: "Gamepad2",
    label: "Billiard",
    color: "from-green-400 to-teal-400",
  },
  stigegolf: {
    icon: "Gamepad2",
    label: "Stigegolf",
    color: "from-blue-400 to-indigo-400",
  },
  bonus: { icon: "Gift", label: "Bonus", color: "from-pink-400 to-rose-400" },
  other: {
    icon: "CircleDot",
    label: "Other",
    color: "from-gray-400 to-gray-600",
  },
};
