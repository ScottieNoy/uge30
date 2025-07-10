export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      categories: {
        Row: {
          color: string | null
          created_at: string | null
          icon: string | null
          id: string
          jersey_id: string | null
          name: string
          points: number
          slug: string
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          icon?: string | null
          id?: string
          jersey_id?: string | null
          name: string
          points?: number
          slug: string
        }
        Update: {
          color?: string | null
          created_at?: string | null
          icon?: string | null
          id?: string
          jersey_id?: string | null
          name?: string
          points?: number
          slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_jersey_id_fkey"
            columns: ["jersey_id"]
            isOneToOne: false
            referencedRelation: "jerseys"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "categories_jersey_id_fkey"
            columns: ["jersey_id"]
            isOneToOne: false
            referencedRelation: "v_activity_feed"
            referencedColumns: ["jersey_id"]
          },
          {
            foreignKeyName: "categories_jersey_id_fkey"
            columns: ["jersey_id"]
            isOneToOne: false
            referencedRelation: "v_jersey_holders"
            referencedColumns: ["jersey_id"]
          },
          {
            foreignKeyName: "categories_jersey_id_fkey"
            columns: ["jersey_id"]
            isOneToOne: false
            referencedRelation: "v_jersey_leaderboards"
            referencedColumns: ["jersey_id"]
          },
          {
            foreignKeyName: "categories_jersey_id_fkey"
            columns: ["jersey_id"]
            isOneToOne: false
            referencedRelation: "v_jersey_overall_leaders"
            referencedColumns: ["jersey_id"]
          },
          {
            foreignKeyName: "categories_jersey_id_fkey"
            columns: ["jersey_id"]
            isOneToOne: false
            referencedRelation: "v_user_progression"
            referencedColumns: ["jersey_id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          content: string | null
          created_at: string | null
          id: string
          images: string[] | null
          user_id: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: string
          images?: string[] | null
          user_id?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: string
          images?: string[] | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users_with_display_name"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_jersey_holders"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "chat_messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_jersey_leaderboards"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "chat_messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_user_progression"
            referencedColumns: ["user_id"]
          },
        ]
      }
      comments: {
        Row: {
          content: string | null
          created_at: string | null
          id: string
          post_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: string
          post_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: string
          post_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users_with_display_name"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_jersey_holders"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_jersey_leaderboards"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_user_progression"
            referencedColumns: ["user_id"]
          },
        ]
      }
      debug_log: {
        Row: {
          created_at: string | null
          id: string
          message: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          message?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string | null
        }
        Relationships: []
      }
      events: {
        Row: {
          created_at: string | null
          description: string | null
          emoji: string | null
          id: string
          location: string | null
          stage_id: string | null
          time: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          emoji?: string | null
          id?: string
          location?: string | null
          stage_id?: string | null
          time?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          emoji?: string | null
          id?: string
          location?: string | null
          stage_id?: string | null
          time?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      jerseys: {
        Row: {
          bg_color: string | null
          border_color: string | null
          color: string | null
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          is_overall: boolean | null
          name: string | null
        }
        Insert: {
          bg_color?: string | null
          border_color?: string | null
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_overall?: boolean | null
          name?: string | null
        }
        Update: {
          bg_color?: string | null
          border_color?: string | null
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_overall?: boolean | null
          name?: string | null
        }
        Relationships: []
      }
      likes: {
        Row: {
          created_at: string | null
          id: string
          post_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          post_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users_with_display_name"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_jersey_holders"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_jersey_leaderboards"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_user_progression"
            referencedColumns: ["user_id"]
          },
        ]
      }
      point_jerseys: {
        Row: {
          id: string
          jersey_id: string | null
          point_id: string | null
        }
        Insert: {
          id?: string
          jersey_id?: string | null
          point_id?: string | null
        }
        Update: {
          id?: string
          jersey_id?: string | null
          point_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "point_jerseys_jersey_id_fkey"
            columns: ["jersey_id"]
            isOneToOne: false
            referencedRelation: "jerseys"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "point_jerseys_jersey_id_fkey"
            columns: ["jersey_id"]
            isOneToOne: false
            referencedRelation: "v_activity_feed"
            referencedColumns: ["jersey_id"]
          },
          {
            foreignKeyName: "point_jerseys_jersey_id_fkey"
            columns: ["jersey_id"]
            isOneToOne: false
            referencedRelation: "v_jersey_holders"
            referencedColumns: ["jersey_id"]
          },
          {
            foreignKeyName: "point_jerseys_jersey_id_fkey"
            columns: ["jersey_id"]
            isOneToOne: false
            referencedRelation: "v_jersey_leaderboards"
            referencedColumns: ["jersey_id"]
          },
          {
            foreignKeyName: "point_jerseys_jersey_id_fkey"
            columns: ["jersey_id"]
            isOneToOne: false
            referencedRelation: "v_jersey_overall_leaders"
            referencedColumns: ["jersey_id"]
          },
          {
            foreignKeyName: "point_jerseys_jersey_id_fkey"
            columns: ["jersey_id"]
            isOneToOne: false
            referencedRelation: "v_user_progression"
            referencedColumns: ["jersey_id"]
          },
          {
            foreignKeyName: "point_jerseys_point_id_fkey"
            columns: ["point_id"]
            isOneToOne: false
            referencedRelation: "points"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "point_jerseys_point_id_fkey"
            columns: ["point_id"]
            isOneToOne: false
            referencedRelation: "v_activity_feed"
            referencedColumns: ["point_id"]
          },
        ]
      }
      points: {
        Row: {
          category: string | null
          created_at: string | null
          id: string
          note: string | null
          stage_id: string | null
          submitted_by: string | null
          updated_at: string | null
          user_id: string | null
          value: number | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          id?: string
          note?: string | null
          stage_id?: string | null
          submitted_by?: string | null
          updated_at?: string | null
          user_id?: string | null
          value?: number | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          id?: string
          note?: string | null
          stage_id?: string | null
          submitted_by?: string | null
          updated_at?: string | null
          user_id?: string | null
          value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "points_stage_id_fkey"
            columns: ["stage_id"]
            isOneToOne: false
            referencedRelation: "stages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "points_stage_id_fkey"
            columns: ["stage_id"]
            isOneToOne: false
            referencedRelation: "v_jersey_leaderboards"
            referencedColumns: ["stage_id"]
          },
          {
            foreignKeyName: "points_stage_id_fkey"
            columns: ["stage_id"]
            isOneToOne: false
            referencedRelation: "v_user_progression"
            referencedColumns: ["stage_id"]
          },
          {
            foreignKeyName: "points_submitted_by_fkey"
            columns: ["submitted_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "points_submitted_by_fkey"
            columns: ["submitted_by"]
            isOneToOne: false
            referencedRelation: "users_with_display_name"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "points_submitted_by_fkey"
            columns: ["submitted_by"]
            isOneToOne: false
            referencedRelation: "v_jersey_holders"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "points_submitted_by_fkey"
            columns: ["submitted_by"]
            isOneToOne: false
            referencedRelation: "v_jersey_leaderboards"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "points_submitted_by_fkey"
            columns: ["submitted_by"]
            isOneToOne: false
            referencedRelation: "v_user_progression"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "points_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "points_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users_with_display_name"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "points_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_jersey_holders"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "points_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_jersey_leaderboards"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "points_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_user_progression"
            referencedColumns: ["user_id"]
          },
        ]
      }
      posts: {
        Row: {
          content: string | null
          created_at: string | null
          id: string
          images: string[] | null
          location: string | null
          pinned: boolean | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: string
          images?: string[] | null
          location?: string | null
          pinned?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: string
          images?: string[] | null
          location?: string | null
          pinned?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users_with_display_name"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_jersey_holders"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_jersey_leaderboards"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_user_progression"
            referencedColumns: ["user_id"]
          },
        ]
      }
      push_subscriptions: {
        Row: {
          created_at: string | null
          endpoint: string | null
          id: string
          keys: Json | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          endpoint?: string | null
          id?: string
          keys?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          endpoint?: string | null
          id?: string
          keys?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "push_subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "push_subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users_with_display_name"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "push_subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "v_jersey_holders"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "push_subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "v_jersey_leaderboards"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "push_subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "v_user_progression"
            referencedColumns: ["user_id"]
          },
        ]
      }
      shares: {
        Row: {
          created_at: string | null
          id: string
          post_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          post_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shares_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shares_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shares_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users_with_display_name"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shares_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_jersey_holders"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "shares_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_jersey_leaderboards"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "shares_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_user_progression"
            referencedColumns: ["user_id"]
          },
        ]
      }
      stage_podiums: {
        Row: {
          id: string
          jersey_id: string | null
          rank: number
          stage_id: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          jersey_id?: string | null
          rank: number
          stage_id?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          jersey_id?: string | null
          rank?: number
          stage_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stage_podiums_jersey_id_fkey"
            columns: ["jersey_id"]
            isOneToOne: false
            referencedRelation: "jerseys"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stage_podiums_jersey_id_fkey"
            columns: ["jersey_id"]
            isOneToOne: false
            referencedRelation: "v_activity_feed"
            referencedColumns: ["jersey_id"]
          },
          {
            foreignKeyName: "stage_podiums_jersey_id_fkey"
            columns: ["jersey_id"]
            isOneToOne: false
            referencedRelation: "v_jersey_holders"
            referencedColumns: ["jersey_id"]
          },
          {
            foreignKeyName: "stage_podiums_jersey_id_fkey"
            columns: ["jersey_id"]
            isOneToOne: false
            referencedRelation: "v_jersey_leaderboards"
            referencedColumns: ["jersey_id"]
          },
          {
            foreignKeyName: "stage_podiums_jersey_id_fkey"
            columns: ["jersey_id"]
            isOneToOne: false
            referencedRelation: "v_jersey_overall_leaders"
            referencedColumns: ["jersey_id"]
          },
          {
            foreignKeyName: "stage_podiums_jersey_id_fkey"
            columns: ["jersey_id"]
            isOneToOne: false
            referencedRelation: "v_user_progression"
            referencedColumns: ["jersey_id"]
          },
          {
            foreignKeyName: "stage_podiums_stage_id_fkey"
            columns: ["stage_id"]
            isOneToOne: false
            referencedRelation: "stages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stage_podiums_stage_id_fkey"
            columns: ["stage_id"]
            isOneToOne: false
            referencedRelation: "v_jersey_leaderboards"
            referencedColumns: ["stage_id"]
          },
          {
            foreignKeyName: "stage_podiums_stage_id_fkey"
            columns: ["stage_id"]
            isOneToOne: false
            referencedRelation: "v_user_progression"
            referencedColumns: ["stage_id"]
          },
          {
            foreignKeyName: "stage_podiums_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stage_podiums_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users_with_display_name"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stage_podiums_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_jersey_holders"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "stage_podiums_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_jersey_leaderboards"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "stage_podiums_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_user_progression"
            referencedColumns: ["user_id"]
          },
        ]
      }
      stages: {
        Row: {
          created_at: string | null
          date: string | null
          id: string
          name: string | null
        }
        Insert: {
          created_at?: string | null
          date?: string | null
          id?: string
          name?: string | null
        }
        Update: {
          created_at?: string | null
          date?: string | null
          id?: string
          name?: string | null
        }
        Relationships: []
      }
      teams: {
        Row: {
          color: string | null
          created_at: string | null
          emoji: string | null
          id: string
          name: string
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          emoji?: string | null
          id?: string
          name: string
        }
        Update: {
          color?: string | null
          created_at?: string | null
          emoji?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      user_jerseys: {
        Row: {
          awarded_at: string | null
          id: string
          jersey_id: string | null
          user_id: string | null
        }
        Insert: {
          awarded_at?: string | null
          id?: string
          jersey_id?: string | null
          user_id?: string | null
        }
        Update: {
          awarded_at?: string | null
          id?: string
          jersey_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_jerseys_jersey_id_fkey"
            columns: ["jersey_id"]
            isOneToOne: true
            referencedRelation: "jerseys"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_jerseys_jersey_id_fkey"
            columns: ["jersey_id"]
            isOneToOne: true
            referencedRelation: "v_activity_feed"
            referencedColumns: ["jersey_id"]
          },
          {
            foreignKeyName: "user_jerseys_jersey_id_fkey"
            columns: ["jersey_id"]
            isOneToOne: true
            referencedRelation: "v_jersey_holders"
            referencedColumns: ["jersey_id"]
          },
          {
            foreignKeyName: "user_jerseys_jersey_id_fkey"
            columns: ["jersey_id"]
            isOneToOne: true
            referencedRelation: "v_jersey_leaderboards"
            referencedColumns: ["jersey_id"]
          },
          {
            foreignKeyName: "user_jerseys_jersey_id_fkey"
            columns: ["jersey_id"]
            isOneToOne: true
            referencedRelation: "v_jersey_overall_leaders"
            referencedColumns: ["jersey_id"]
          },
          {
            foreignKeyName: "user_jerseys_jersey_id_fkey"
            columns: ["jersey_id"]
            isOneToOne: true
            referencedRelation: "v_user_progression"
            referencedColumns: ["jersey_id"]
          },
          {
            foreignKeyName: "user_jerseys_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_jerseys_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users_with_display_name"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_jerseys_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_jersey_holders"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_jerseys_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_jersey_leaderboards"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_jerseys_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_user_progression"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_jerseys_history: {
        Row: {
          awarded_at: string | null
          id: string
          jersey_id: string | null
          reason: string | null
          user_id: string | null
        }
        Insert: {
          awarded_at?: string | null
          id?: string
          jersey_id?: string | null
          reason?: string | null
          user_id?: string | null
        }
        Update: {
          awarded_at?: string | null
          id?: string
          jersey_id?: string | null
          reason?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_jerseys_history_jersey_id_fkey"
            columns: ["jersey_id"]
            isOneToOne: false
            referencedRelation: "jerseys"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_jerseys_history_jersey_id_fkey"
            columns: ["jersey_id"]
            isOneToOne: false
            referencedRelation: "v_activity_feed"
            referencedColumns: ["jersey_id"]
          },
          {
            foreignKeyName: "user_jerseys_history_jersey_id_fkey"
            columns: ["jersey_id"]
            isOneToOne: false
            referencedRelation: "v_jersey_holders"
            referencedColumns: ["jersey_id"]
          },
          {
            foreignKeyName: "user_jerseys_history_jersey_id_fkey"
            columns: ["jersey_id"]
            isOneToOne: false
            referencedRelation: "v_jersey_leaderboards"
            referencedColumns: ["jersey_id"]
          },
          {
            foreignKeyName: "user_jerseys_history_jersey_id_fkey"
            columns: ["jersey_id"]
            isOneToOne: false
            referencedRelation: "v_jersey_overall_leaders"
            referencedColumns: ["jersey_id"]
          },
          {
            foreignKeyName: "user_jerseys_history_jersey_id_fkey"
            columns: ["jersey_id"]
            isOneToOne: false
            referencedRelation: "v_user_progression"
            referencedColumns: ["jersey_id"]
          },
          {
            foreignKeyName: "user_jerseys_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_jerseys_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users_with_display_name"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_jerseys_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_jersey_holders"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_jerseys_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_jersey_leaderboards"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_jerseys_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_user_progression"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_teams: {
        Row: {
          id: string
          joined_at: string | null
          team_id: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          joined_at?: string | null
          team_id?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          joined_at?: string | null
          team_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_teams_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_teams_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_teams_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users_with_display_name"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_teams_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_jersey_holders"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_teams_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_jersey_leaderboards"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_teams_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_user_progression"
            referencedColumns: ["user_id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          displayname: string
          emoji: string | null
          firstname: string
          id: string
          is_admin: boolean | null
          lastname: string
          role: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          displayname: string
          emoji?: string | null
          firstname: string
          id: string
          is_admin?: boolean | null
          lastname: string
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          displayname?: string
          emoji?: string | null
          firstname?: string
          id?: string
          is_admin?: boolean | null
          lastname?: string
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      users_with_display_name: {
        Row: {
          created_at: string | null
          display_name: string | null
          emoji: string | null
          firstname: string | null
          id: string | null
          is_admin: boolean | null
          lastname: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          display_name?: never
          emoji?: string | null
          firstname?: string | null
          id?: string | null
          is_admin?: boolean | null
          lastname?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          display_name?: never
          emoji?: string | null
          firstname?: string | null
          id?: string | null
          is_admin?: boolean | null
          lastname?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      v_activity_feed: {
        Row: {
          category: string | null
          category_icon: string | null
          created_at: string | null
          jersey_color: string | null
          jersey_id: string | null
          jersey_name: string | null
          note: string | null
          point_id: string | null
          source_avatar: string | null
          source_id: string | null
          source_name: string | null
          target_avatar: string | null
          target_id: string | null
          target_name: string | null
          value: number | null
        }
        Relationships: [
          {
            foreignKeyName: "points_submitted_by_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "points_submitted_by_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "users_with_display_name"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "points_submitted_by_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "v_jersey_holders"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "points_submitted_by_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "v_jersey_leaderboards"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "points_submitted_by_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "v_user_progression"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "points_user_id_fkey"
            columns: ["target_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "points_user_id_fkey"
            columns: ["target_id"]
            isOneToOne: false
            referencedRelation: "users_with_display_name"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "points_user_id_fkey"
            columns: ["target_id"]
            isOneToOne: false
            referencedRelation: "v_jersey_holders"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "points_user_id_fkey"
            columns: ["target_id"]
            isOneToOne: false
            referencedRelation: "v_jersey_leaderboards"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "points_user_id_fkey"
            columns: ["target_id"]
            isOneToOne: false
            referencedRelation: "v_user_progression"
            referencedColumns: ["user_id"]
          },
        ]
      }
      v_jersey_holders: {
        Row: {
          avatar_url: string | null
          bg_color: string | null
          border_color: string | null
          color: string | null
          displayname: string | null
          is_overall: boolean | null
          jersey_icon: string | null
          jersey_id: string | null
          jersey_name: string | null
          total_points: number | null
          user_id: string | null
        }
        Relationships: []
      }
      v_jersey_leaderboards: {
        Row: {
          displayname: string | null
          jersey_id: string | null
          jersey_name: string | null
          stage_id: string | null
          stage_name: string | null
          total_points: number | null
          user_id: string | null
        }
        Relationships: []
      }
      v_jersey_overall_leaders: {
        Row: {
          avatar_url: string | null
          bg_color: string | null
          border_color: string | null
          color: string | null
          displayname: string | null
          is_overall: boolean | null
          jersey_description: string | null
          jersey_icon: string | null
          jersey_id: string | null
          jersey_name: string | null
          rank: number | null
          total_points: number | null
          user_id: string | null
        }
        Relationships: []
      }
      v_user_progression: {
        Row: {
          cumulative_points: number | null
          displayname: string | null
          jersey_id: string | null
          jersey_name: string | null
          points_in_stage: number | null
          stage_date: string | null
          stage_id: string | null
          stage_name: string | null
          user_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      perform_point_and_jersey_insert: {
        Args: {
          p_point_id: string
          p_user_id: string
          p_submitted_by: string
          p_value: number
          p_note: string
          p_stage_id: string
          p_jersey_id: string
          p_category: string
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
