export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      comments: {
        Row: {
          id: string;
          post_id: string;
          user_id: string;
          content: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          post_id: string;
          user_id: string;
          content: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          post_id?: string;
          user_id?: string;
          content?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "comments_post_id_fkey";
            columns: ["post_id"];
            isOneToOne: false;
            referencedRelation: "posts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "comments_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };

      post_likes: {
        Row: {
          post_id: string;
          user_id: string;
          created_at: string | null;
        };
        Insert: {
          post_id: string;
          user_id: string;
          created_at?: string | null;
        };
        Update: {
          post_id?: string;
          user_id?: string;
          created_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "post_likes_post_id_fkey";
            columns: ["post_id"];
            isOneToOne: false;
            referencedRelation: "posts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "post_likes_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };

      posts: {
        Row: {
          id: string;
          user_id: string;
          content: string;
          pinned: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          content: string;
          pinned?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          content?: string;
          pinned?: boolean;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "posts_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };

      events: {
        Row: {
          id: string;
          stage_id: string;
          title: string;
          description: string | null;
          emoji: string | null;
          location: string | null;
          time: string; // ISO 8601 timestamp
          created_at: string | null;
        };
        Insert: {
          id?: string;
          stage_id: string;
          title: string;
          description?: string | null;
          emoji?: string | null;
          location?: string | null;
          time: string;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          stage_id?: string;
          title?: string;
          description?: string | null;
          emoji?: string | null;
          location?: string | null;
          time?: string;
          created_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "events_stage_id_fkey";
            columns: ["stage_id"];
            isOneToOne: false;
            referencedRelation: "stages";
            referencedColumns: ["id"];
          }
        ];
      };

      stages: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          emoji: string | null;
          position: number;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          emoji?: string | null;
          position?: number;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          emoji?: string | null;
          position?: number;
          created_at?: string | null;
        };
        Relationships: [];
      };

      points: {
        Row: {
          category: Database["public"]["Enums"]["jersey_category"];
          created_at: string | null;
          id: string;
          note: string | null;
          subcategory: Database["public"]["Enums"]["subcategory"];
          submitted_by: string | null;
          updated_at: string | null;
          user_id: string;
          value: number;
        };
        Insert: {
          category: Database["public"]["Enums"]["jersey_category"];
          created_at?: string | null;
          id?: string;
          note?: string | null;
          subcategory: Database["public"]["Enums"]["subcategory"];
          submitted_by?: string | null;
          updated_at?: string | null;
          user_id: string;
          value: number;
        };
        Update: {
          category?: Database["public"]["Enums"]["jersey_category"];
          created_at?: string | null;
          id?: string;
          note?: string | null;
          subcategory?: Database["public"]["Enums"]["subcategory"];
          submitted_by?: string | null;
          updated_at?: string | null;
          user_id?: string;
          value?: number;
        };
        Relationships: [
          {
            foreignKeyName: "points_submitted_by_fkey";
            columns: ["submitted_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "points_submitted_by_fkey";
            columns: ["submitted_by"];
            isOneToOne: false;
            referencedRelation: "users_with_display_name";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "points_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "points_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users_with_display_name";
            referencedColumns: ["id"];
          }
        ];
      };
      users: {
        Row: {
          avatar: string | null;
          created_at: string | null;
          displayname: string;
          emoji: string | null;
          firstname: string;
          id: string;
          is_admin: boolean | null;
          lastname: string;
          updated_at: string | null;
        };
        Insert: {
          avatar?: string | null;
          created_at?: string | null;
          displayname: string;
          emoji?: string | null;
          firstname: string;
          id: string;
          is_admin?: boolean | null;
          lastname: string;
          updated_at?: string | null;
        };
        Update: {
          avatar?: string | null;
          created_at?: string | null;
          displayname?: string;
          emoji?: string | null;
          firstname?: string;
          id?: string;
          is_admin?: boolean | null;
          lastname?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      push_subscriptions: {
        Row: {
          user_id: string;
          endpoint: string;
          keys: Json;
          created_at: string | null;
        };
        Insert: {
          user_id: string;
          endpoint: string;
          keys: Json;
          created_at?: string | null;
        };
        Update: {
          user_id?: string;
          endpoint?: string;
          keys?: Json;
          created_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "push_subscriptions_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      users_with_display_name: {
        Row: {
          created_at: string | null;
          display_name: string | null;
          emoji: string | null;
          firstname: string | null;
          id: string | null;
          is_admin: boolean | null;
          lastname: string | null;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          display_name?: never;
          emoji?: string | null;
          firstname?: string | null;
          id?: string | null;
          is_admin?: boolean | null;
          lastname?: string | null;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          display_name?: never;
          emoji?: string | null;
          firstname?: string | null;
          id?: string | null;
          is_admin?: boolean | null;
          lastname?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      fetch_posts_with_likes_and_counts: {
  Args: {
    current_user_id: string;
  };
  Returns: {
    id: string;
    content: string;
    created_at: string;
    pinned: boolean;
    user_id: string;
    displayname: string;
    avatar: string | null;
    emoji: string | null;
    like_count: number;
    liked_by_user: boolean;
    comment_count: number;
  }[];
};

    };

    Enums: {
      jersey_category:
        | "gyldne_blaerer"
        | "sprinter"
        | "flydende_haand"
        | "førertroje"
        | "maane"
        | "prikket"
        | "punkttroje"
        | "ungdom";
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
        | "other";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DefaultSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
      DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] &
      DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never;

export const Constants = {
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
} as const;
