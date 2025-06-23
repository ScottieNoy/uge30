export type JerseyCategory =
  | "gyldne_blaerer"
  | "sprinter"
  | "flydende_haand"
  | "førertroje"
  | "maane"
  | "prikket"
  | "paedofil"
  | "ungdom"

export type Subcategory =
  | "beer"
  | "wine"
  | "vodka"
  | "funnel"
  | "shot"
  | "beerpong"
  | "cornhole"
  | "dart"
  | "billiard"
  | "stigegolf"
  | "bonus"
  | "other" // fallback

export interface Point {
  id: string
  user_id: string
  category: JerseyCategory
  subcategory: Subcategory
  value: number
  submitted_by?: string
  created_at: string
}



export interface User {
  id: string
  firstname: string
  lastname: string
  emoji: string
}


