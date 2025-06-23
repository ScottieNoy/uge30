export type PointCategory =
  | "beer"
  | "shot"
  | "cocktail"
  | "funnel"
  | "game"
  | "latenight"
  | "chaos"
  | "bonus"

export interface User {
  id: string
  name: string
  emoji: string
}

export interface Point {
  id: string
  user_id: string
  category: PointCategory
  value: number
  submitted_by?: string
  created_at: string
}
