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
      alergens: {
        Row: {
          description: string | null
          icon: string | null
          id: number
          label: string
        }
        Insert: {
          description?: string | null
          icon?: string | null
          id?: number
          label: string
        }
        Update: {
          description?: string | null
          icon?: string | null
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
      diets: {
        Row: {
          description: string | null
          icon: string | null
          id: number
          label: string
        }
        Insert: {
          description?: string | null
          icon?: string | null
          id?: number
          label: string
        }
        Update: {
          description?: string | null
          icon?: string | null
          id?: number
          label?: string
        }
      }
      food_attributes: {
        Row: {
          icon: string | null
          id: number
          label: string
        }
        Insert: {
          icon?: string | null
          id?: number
          label: string
        }
        Update: {
          icon?: string | null
          id?: number
          label?: string
        }
      }
      ingredient_version_order: {
        Row: {
          amount: number
          cost: number
          created_at: string | null
          delivery_at: string
          expires_at: string
          extra_info: Json | null
          id: number
          in_stock: number
          ingredient_version: number
          ordered_at: string
          status: Database["public"]["Enums"]["order_status"]
          status_changed_at: string
          unit: number
        }
        Insert: {
          amount: number
          cost: number
          created_at?: string | null
          delivery_at: string
          expires_at: string
          extra_info?: Json | null
          id?: number
          in_stock: number
          ingredient_version: number
          ordered_at: string
          status: Database["public"]["Enums"]["order_status"]
          status_changed_at?: string
          unit: number
        }
        Update: {
          amount?: number
          cost?: number
          created_at?: string | null
          delivery_at?: string
          expires_at?: string
          extra_info?: Json | null
          id?: number
          in_stock?: number
          ingredient_version?: number
          ordered_at?: string
          status?: Database["public"]["Enums"]["order_status"]
          status_changed_at?: string
          unit?: number
        }
      }
      ingredient_version_remove: {
        Row: {
          amount: number
          created_at: string | null
          extra_info: Json | null
          id: number
          ingredient_version: number
          reason: Database["public"]["Enums"]["ingredient_version_removal_reason"]
          removed_at: string
          unit: number
        }
        Insert: {
          amount: number
          created_at?: string | null
          extra_info?: Json | null
          id?: number
          ingredient_version: number
          reason: Database["public"]["Enums"]["ingredient_version_removal_reason"]
          removed_at?: string
          unit: number
        }
        Update: {
          amount?: number
          created_at?: string | null
          extra_info?: Json | null
          id?: number
          ingredient_version?: number
          reason?: Database["public"]["Enums"]["ingredient_version_removal_reason"]
          removed_at?: string
          unit?: number
        }
      }
      ingredient_versions: {
        Row: {
          cost: number
          created_at: string | null
          expiration_period: number
          id: number
          in_stock: number
          ingredient: number
          source: string
          status: Database["public"]["Enums"]["ingredient_status"]
          status_changed_at: string
        }
        Insert: {
          cost: number
          created_at?: string | null
          expiration_period?: number
          id?: number
          in_stock?: number
          ingredient: number
          source: string
          status?: Database["public"]["Enums"]["ingredient_status"]
          status_changed_at?: string
        }
        Update: {
          cost?: number
          created_at?: string | null
          expiration_period?: number
          id?: number
          in_stock?: number
          ingredient?: number
          source?: string
          status?: Database["public"]["Enums"]["ingredient_status"]
          status_changed_at?: string
        }
      }
      ingredients: {
        Row: {
          created_at: string | null
          extra_info: Json | null
          id: number
          img: string | null
          name: string
          search_tags: string[] | null
          unit: number
        }
        Insert: {
          created_at?: string | null
          extra_info?: Json | null
          id?: number
          img?: string | null
          name: string
          search_tags?: string[] | null
          unit: number
        }
        Update: {
          created_at?: string | null
          extra_info?: Json | null
          id?: number
          img?: string | null
          name?: string
          search_tags?: string[] | null
          unit?: number
        }
      }
      kitchen_accessory: {
        Row: {
          icon: string | null
          id: number
          label: string
        }
        Insert: {
          icon?: string | null
          id?: number
          label: string
        }
        Update: {
          icon?: string | null
          id?: number
          label?: string
        }
      }
      M2M_ingredients_alergens: {
        Row: {
          alergen: number
          id: number
          ingredient: number
        }
        Insert: {
          alergen: number
          id?: number
          ingredient: number
        }
        Update: {
          alergen?: number
          id?: number
          ingredient?: number
        }
      }
      notifications: {
        Row: {
          created_at: string | null
          href: string | null
          id: number
          message: string
          read: boolean
          tags: string[] | null
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          href?: string | null
          id?: number
          message: string
          read?: boolean
          tags?: string[] | null
          title: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          href?: string | null
          id?: number
          message?: string
          read?: boolean
          tags?: string[] | null
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
      units: {
        Row: {
          base_unit: number | null
          conversion_rate: number
          id: number
          measurement_system: Database["public"]["Enums"]["measurement_system"]
          name: string
          property: Database["public"]["Enums"]["physical_property"]
          sign: string
        }
        Insert: {
          base_unit?: number | null
          conversion_rate: number
          id?: number
          measurement_system: Database["public"]["Enums"]["measurement_system"]
          name: string
          property: Database["public"]["Enums"]["physical_property"]
          sign: string
        }
        Update: {
          base_unit?: number | null
          conversion_rate?: number
          id?: number
          measurement_system?: Database["public"]["Enums"]["measurement_system"]
          name?: string
          property?: Database["public"]["Enums"]["physical_property"]
          sign?: string
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
      ingredient_status: "active" | "preparation" | "archived"
      ingredient_version_removal_reason:
        | "expired"
        | "expired_before_expiration"
        | "unfit_to_sell"
        | "other"
        | "used"
      measurement_system: "metric" | "imperial"
      order_status:
        | "awaiting_order"
        | "ordered"
        | "delivered"
        | "canceled"
        | "returned"
        | "other"
      physical_property: "mass" | "volume" | "length" | "count"
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

export type Address = Database['public']['Tables']['address']['Row'];
export type Alergens = Database['public']['Tables']['alergens']['Row'];
export type Customers = Database['public']['Tables']['customers']['Row'];
export type Diets = Database['public']['Tables']['diets']['Row'];
export type Food_attributes = Database['public']['Tables']['food_attributes']['Row'];
export type Ingredient_version_order = Database['public']['Tables']['ingredient_version_order']['Row'];
export type Ingredient_version_remove = Database['public']['Tables']['ingredient_version_remove']['Row'];
export type Ingredient_versions = Database['public']['Tables']['ingredient_versions']['Row'];
export type Ingredients = Database['public']['Tables']['ingredients']['Row'];
export type Kitchen_accessory = Database['public']['Tables']['kitchen_accessory']['Row'];
export type M2M_ingredients_alergens = Database['public']['Tables']['M2M_ingredients_alergens']['Row'];
export type Notifications = Database['public']['Tables']['notifications']['Row'];
export type Prices = Database['public']['Tables']['prices']['Row'];
export type Products = Database['public']['Tables']['products']['Row'];
export type Subscriptions = Database['public']['Tables']['subscriptions']['Row'];
export type Units = Database['public']['Tables']['units']['Row'];
export type Users = Database['public']['Tables']['users']['Row'];
