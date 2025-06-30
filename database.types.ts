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
          note: string | null
          subcategory: Database["public"]["Enums"]["subcategory"]
          submitted_by: string | null
          updated_at: string | null
          user_id: string
          value: number
        }
        Insert: {
          category: Database["public"]["Enums"]["jersey_category"]
          created_at?: string | null
          id?: string
          note?: string | null
          subcategory: Database["public"]["Enums"]["subcategory"]
          submitted_by?: string | null
          updated_at?: string | null
          user_id: string
          value: number
        }
        Update: {
          category?: Database["public"]["Enums"]["jersey_category"]
          created_at?: string | null
          id?: string
          note?: string | null
          subcategory?: Database["public"]["Enums"]["subcategory"]
          submitted_by?: string | null
          updated_at?: string | null
          user_id?: string
          value?: number
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
          displayname: string
          emoji: string | null
          firstname: string
          id: string
          is_admin: boolean | null
          lastname: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          displayname: string
          emoji?: string | null
          firstname: string
          id: string
          is_admin?: boolean | null
          lastname: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          displayname?: string
          emoji?: string | null
          firstname?: string
          id?: string
          is_admin?: boolean | null
          lastname?: string
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      jersey_category: [
        "gyldne_blaerer",
        "sprinter",
        "flydende_haand",
        "førertroje",
        "maane",
        "prikket",
        "punkttroje",
        "ungdom",
      ],
      subcategory: [
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
      ],
    },
  },
} as const

