export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      points: {
        Row: {
          category: Database["public"]["Enums"]["jersey_category"]
          created_at: string | null
          id: string
          points: number
          subcategory: Database["public"]["Enums"]["subcategory"]
          submitted_by: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          category: Database["public"]["Enums"]["jersey_category"]
          created_at?: string | null
          id?: string
          points: number
          subcategory: Database["public"]["Enums"]["subcategory"]
          submitted_by?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          category?: Database["public"]["Enums"]["jersey_category"]
          created_at?: string | null
          id?: string
          points?: number
          subcategory?: Database["public"]["Enums"]["subcategory"]
          submitted_by?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
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
        ]
      }
      users: {
        Row: {
          created_at: string | null
          emoji: string | null
          firstname: string
          id: string
          is_admin: boolean | null
          lastname: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          emoji?: string | null
          firstname: string
          id: string
          is_admin?: boolean | null
          lastname: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          emoji?: string | null
          firstname?: string
          id?: string
          is_admin?: boolean | null
          lastname?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
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
        Relationships: [
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      jersey_category:
        | "gyldne_blaerer"
        | "sprinter"
        | "flydende_haand"
        | "førertroje"
        | "maane"
        | "prikket"
        | "punkttroje"
        | "ungdom"
      subcategory:
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
        | "other"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

