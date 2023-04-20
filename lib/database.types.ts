export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      address: {
        Row: {
          city: string
          coordinates: Json
          country: string
          created_at: string
          district: string | null
          id: number
          is_primary: boolean
          label: string
          note: string | null
          number: string
          postal: string | null
          street: string
          user: string
        }
        Insert: {
          city: string
          coordinates: Json
          country?: string
          created_at?: string
          district?: string | null
          id?: number
          is_primary?: boolean
          label: string
          note?: string | null
          number: string
          postal?: string | null
          street: string
          user: string
        }
        Update: {
          city?: string
          coordinates?: Json
          country?: string
          created_at?: string
          district?: string | null
          id?: number
          is_primary?: boolean
          label?: string
          note?: string | null
          number?: string
          postal?: string | null
          street?: string
          user?: string
        }
      }
      alergen: {
        Row: {
          icon: string
          id: number
          label: string
        }
        Insert: {
          icon: string
          id?: number
          label: string
        }
        Update: {
          icon?: string
          id?: number
          label?: string
        }
      }
      customers: {
        Row: {
          id: string
          stripe_customer_id: string | null
        }
        Insert: {
          id: string
          stripe_customer_id?: string | null
        }
        Update: {
          id?: string
          stripe_customer_id?: string | null
        }
      }
      diet: {
        Row: {
          icon: string
          id: number
          label: string
        }
        Insert: {
          icon: string
          id?: number
          label: string
        }
        Update: {
          icon?: string
          id?: number
          label?: string
        }
      }
      food_attributes: {
        Row: {
          icon: string
          id: number
          label: string
        }
        Insert: {
          icon: string
          id?: number
          label: string
        }
        Update: {
          icon?: string
          id?: number
          label?: string
        }
      }
      kitchen_accessory: {
        Row: {
          icon: string
          id: number
          label: string
        }
        Insert: {
          icon: string
          id?: number
          label: string
        }
        Update: {
          icon?: string
          id?: number
          label?: string
        }
      }
      notifications: {
        Row: {
          created_at: string | null
          href: string | null
          id: number
          message: string
          read: boolean
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          href?: string | null
          id?: number
          message: string
          read?: boolean
          title: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          href?: string | null
          id?: number
          message?: string
          read?: boolean
          title?: string
          user_id?: string
        }
      }
      prices: {
        Row: {
          active: boolean | null
          currency: string | null
          description: string | null
          id: string
          interval: Database["public"]["Enums"]["pricing_plan_interval"] | null
          interval_count: number | null
          metadata: Json | null
          product_id: string | null
          trial_period_days: number | null
          type: Database["public"]["Enums"]["pricing_type"] | null
          unit_amount: number | null
        }
        Insert: {
          active?: boolean | null
          currency?: string | null
          description?: string | null
          id: string
          interval?: Database["public"]["Enums"]["pricing_plan_interval"] | null
          interval_count?: number | null
          metadata?: Json | null
          product_id?: string | null
          trial_period_days?: number | null
          type?: Database["public"]["Enums"]["pricing_type"] | null
          unit_amount?: number | null
        }
        Update: {
          active?: boolean | null
          currency?: string | null
          description?: string | null
          id?: string
          interval?: Database["public"]["Enums"]["pricing_plan_interval"] | null
          interval_count?: number | null
          metadata?: Json | null
          product_id?: string | null
          trial_period_days?: number | null
          type?: Database["public"]["Enums"]["pricing_type"] | null
          unit_amount?: number | null
        }
      }
      products: {
        Row: {
          active: boolean | null
          description: string | null
          id: string
          image: string | null
          metadata: Json | null
          name: string | null
        }
        Insert: {
          active?: boolean | null
          description?: string | null
          id: string
          image?: string | null
          metadata?: Json | null
          name?: string | null
        }
        Update: {
          active?: boolean | null
          description?: string | null
          id?: string
          image?: string | null
          metadata?: Json | null
          name?: string | null
        }
      }
      subscriptions: {
        Row: {
          cancel_at: string | null
          cancel_at_period_end: boolean | null
          canceled_at: string | null
          created: string
          current_period_end: string
          current_period_start: string
          ended_at: string | null
          id: string
          metadata: Json | null
          price_id: string | null
          quantity: number | null
          status: Database["public"]["Enums"]["subscription_status"] | null
          trial_end: string | null
          trial_start: string | null
          user_id: string
        }
        Insert: {
          cancel_at?: string | null
          cancel_at_period_end?: boolean | null
          canceled_at?: string | null
          created?: string
          current_period_end?: string
          current_period_start?: string
          ended_at?: string | null
          id: string
          metadata?: Json | null
          price_id?: string | null
          quantity?: number | null
          status?: Database["public"]["Enums"]["subscription_status"] | null
          trial_end?: string | null
          trial_start?: string | null
          user_id: string
        }
        Update: {
          cancel_at?: string | null
          cancel_at_period_end?: boolean | null
          canceled_at?: string | null
          created?: string
          current_period_end?: string
          current_period_start?: string
          ended_at?: string | null
          id?: string
          metadata?: Json | null
          price_id?: string | null
          quantity?: number | null
          status?: Database["public"]["Enums"]["subscription_status"] | null
          trial_end?: string | null
          trial_start?: string | null
          user_id?: string
        }
      }
      users: {
        Row: {
          account_setup_completed: boolean
          avatar_url: string | null
          billing_address: Json | null
          full_name: string | null
          id: string
          is_staff: boolean
          newsletter: boolean
          number_of_portions: number | null
          payment_method: Json | null
          pick_up: boolean | null
          terms: boolean
        }
        Insert: {
          account_setup_completed?: boolean
          avatar_url?: string | null
          billing_address?: Json | null
          full_name?: string | null
          id: string
          is_staff?: boolean
          newsletter?: boolean
          number_of_portions?: number | null
          payment_method?: Json | null
          pick_up?: boolean | null
          terms?: boolean
        }
        Update: {
          account_setup_completed?: boolean
          avatar_url?: string | null
          billing_address?: Json | null
          full_name?: string | null
          id?: string
          is_staff?: boolean
          newsletter?: boolean
          number_of_portions?: number | null
          payment_method?: Json | null
          pick_up?: boolean | null
          terms?: boolean
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      pricing_plan_interval: "day" | "week" | "month" | "year"
      pricing_type: "one_time" | "recurring"
      subscription_status:
        | "trialing"
        | "active"
        | "canceled"
        | "incomplete"
        | "incomplete_expired"
        | "past_due"
        | "unpaid"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
