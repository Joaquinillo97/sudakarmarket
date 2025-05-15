export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      card_info: {
        Row: {
          cmc: number | null
          color_identity: string[] | null
          colors: string[] | null
          created_at: string
          id: string
          keywords: string[] | null
          last_price_update: string | null
          legalities: Json | null
          mana_cost: string | null
          oracle_text: string | null
          price_ars: number | null
          price_eur: number | null
          price_usd: number | null
          type_line: string | null
          updated_at: string
        }
        Insert: {
          cmc?: number | null
          color_identity?: string[] | null
          colors?: string[] | null
          created_at?: string
          id: string
          keywords?: string[] | null
          last_price_update?: string | null
          legalities?: Json | null
          mana_cost?: string | null
          oracle_text?: string | null
          price_ars?: number | null
          price_eur?: number | null
          price_usd?: number | null
          type_line?: string | null
          updated_at?: string
        }
        Update: {
          cmc?: number | null
          color_identity?: string[] | null
          colors?: string[] | null
          created_at?: string
          id?: string
          keywords?: string[] | null
          last_price_update?: string | null
          legalities?: Json | null
          mana_cost?: string | null
          oracle_text?: string | null
          price_ars?: number | null
          price_eur?: number | null
          price_usd?: number | null
          type_line?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "card_info_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "cards"
            referencedColumns: ["id"]
          },
        ]
      }
      cards: {
        Row: {
          collector_number: string
          created_at: string
          id: string
          image_uri: string | null
          image_uri_art_crop: string | null
          image_uri_small: string | null
          name: string
          rarity: string
          scryfall_id: string
          set_code: string
          set_name: string
          updated_at: string
        }
        Insert: {
          collector_number: string
          created_at?: string
          id?: string
          image_uri?: string | null
          image_uri_art_crop?: string | null
          image_uri_small?: string | null
          name: string
          rarity: string
          scryfall_id: string
          set_code: string
          set_name: string
          updated_at?: string
        }
        Update: {
          collector_number?: string
          created_at?: string
          id?: string
          image_uri?: string | null
          image_uri_art_crop?: string | null
          image_uri_small?: string | null
          name?: string
          rarity?: string
          scryfall_id?: string
          set_code?: string
          set_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          created_at: string
          id: string
          is_read: boolean
          recipient_id: string
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_read?: boolean
          recipient_id: string
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_read?: boolean
          recipient_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          location: string | null
          rating: number | null
          transactions_count: number | null
          updated_at: string
          username: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          location?: string | null
          rating?: number | null
          transactions_count?: number | null
          updated_at?: string
          username: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          location?: string | null
          rating?: number | null
          transactions_count?: number | null
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
      user_inventory: {
        Row: {
          card_id: string
          condition: Database["public"]["Enums"]["card_condition"]
          created_at: string
          for_trade: boolean
          id: string
          language: Database["public"]["Enums"]["card_language"]
          notes: string | null
          price: number
          quantity: number
          updated_at: string
          user_id: string
        }
        Insert: {
          card_id: string
          condition: Database["public"]["Enums"]["card_condition"]
          created_at?: string
          for_trade?: boolean
          id?: string
          language: Database["public"]["Enums"]["card_language"]
          notes?: string | null
          price: number
          quantity: number
          updated_at?: string
          user_id: string
        }
        Update: {
          card_id?: string
          condition?: Database["public"]["Enums"]["card_condition"]
          created_at?: string
          for_trade?: boolean
          id?: string
          language?: Database["public"]["Enums"]["card_language"]
          notes?: string | null
          price?: number
          quantity?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_inventory_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_inventory_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      wishlists: {
        Row: {
          card_id: string
          created_at: string
          id: string
          priority: number | null
          user_id: string
        }
        Insert: {
          card_id: string
          created_at?: string
          id?: string
          priority?: number | null
          user_id: string
        }
        Update: {
          card_id?: string
          created_at?: string
          id?: string
          priority?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlists_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wishlists_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      card_condition: "NM" | "SP" | "MP" | "HP" | "DMG"
      card_language:
        | "Inglés"
        | "Español"
        | "Portugués"
        | "Japonés"
        | "Coreano"
        | "Ruso"
        | "Chino Simplificado"
        | "Chino Tradicional"
        | "Alemán"
        | "Francés"
        | "Italiano"
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
  public: {
    Enums: {
      card_condition: ["NM", "SP", "MP", "HP", "DMG"],
      card_language: [
        "Inglés",
        "Español",
        "Portugués",
        "Japonés",
        "Coreano",
        "Ruso",
        "Chino Simplificado",
        "Chino Tradicional",
        "Alemán",
        "Francés",
        "Italiano",
      ],
    },
  },
} as const
