export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      agents: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
        Relationships: []
      }
      maps: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
        Relationships: []
      }
      matches: {
        Row: {
          blue_rounds: number
          date: string
          id: string
          map_id: string
          mode_id: string
          red_rounds: number
          winning_team: string
        }
        Insert: {
          blue_rounds?: number
          date: string
          id: string
          map_id: string
          mode_id: string
          red_rounds?: number
          winning_team: string
        }
        Update: {
          blue_rounds?: number
          date?: string
          id?: string
          map_id?: string
          mode_id?: string
          red_rounds?: number
          winning_team?: string
        }
        Relationships: [
          {
            foreignKeyName: "matches_map_id_fkey"
            columns: ["map_id"]
            isOneToOne: false
            referencedRelation: "maps"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_mode_id_fkey"
            columns: ["mode_id"]
            isOneToOne: false
            referencedRelation: "modes"
            referencedColumns: ["id"]
          },
        ]
      }
      modes: {
        Row: {
          id: string
          mode_type: string
          name: string
        }
        Insert: {
          id: string
          mode_type: string
          name: string
        }
        Update: {
          id?: string
          mode_type?: string
          name?: string
        }
        Relationships: []
      }
      performances: {
        Row: {
          ability_casts: Json | null
          agent_id: string
          assists: number
          behavior: Json | null
          bodyshots: number
          damage_dealt: number
          damage_taken: number
          deaths: number
          economy: Json | null
          headshots: number
          kills: number
          legshots: number
          match_id: string
          player_id: string
          rank: Json | null
          score: number
          team: string
        }
        Insert: {
          ability_casts?: Json | null
          agent_id: string
          assists: number
          behavior?: Json | null
          bodyshots: number
          damage_dealt: number
          damage_taken: number
          deaths: number
          economy?: Json | null
          headshots: number
          kills: number
          legshots: number
          match_id: string
          player_id: string
          rank?: Json | null
          score: number
          team: string
        }
        Update: {
          ability_casts?: Json | null
          agent_id?: string
          assists?: number
          behavior?: Json | null
          bodyshots?: number
          damage_dealt?: number
          damage_taken?: number
          deaths?: number
          economy?: Json | null
          headshots?: number
          kills?: number
          legshots?: number
          match_id?: string
          player_id?: string
          rank?: Json | null
          score?: number
          team?: string
        }
        Relationships: [
          {
            foreignKeyName: "performances_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "performances_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "performances_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      players: {
        Row: {
          customization: Json
          id: string
          level: number
          name: string
          rank: Json
          region: Database["public"]["Enums"]["region_enum"]
          tag: string
        }
        Insert: {
          customization: Json
          id: string
          level?: number
          name: string
          rank: Json
          region: Database["public"]["Enums"]["region_enum"]
          tag: string
        }
        Update: {
          customization?: Json
          id?: string
          level?: number
          name?: string
          rank?: Json
          region?: Database["public"]["Enums"]["region_enum"]
          tag?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      map_enum:
        | "ascent"
        | "haven"
        | "bind"
        | "split"
        | "icebox"
        | "breeze"
        | "lotus"
        | "pearl"
        | "sunset"
        | "fracture"
        | "abyss"
        | "corrode"
        | "district"
        | "kabash"
        | "piazza"
        | "drift"
        | "glitch"
      mode_enum: "competitive" | "unrated" | "deathmatch" | "team_deathmatch"
      region_enum: "na" | "eu" | "latam" | "br" | "ap" | "kr"
      team_enum: "red" | "blue"
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
    Enums: {
      map_enum: [
        "ascent",
        "haven",
        "bind",
        "split",
        "icebox",
        "breeze",
        "lotus",
        "pearl",
        "sunset",
        "fracture",
        "abyss",
        "corrode",
        "district",
        "kabash",
        "piazza",
        "drift",
        "glitch",
      ],
      mode_enum: ["competitive", "unrated", "deathmatch", "team_deathmatch"],
      region_enum: ["na", "eu", "latam", "br", "ap", "kr"],
      team_enum: ["red", "blue"],
    },
  },
} as const
