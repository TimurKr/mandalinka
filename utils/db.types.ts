export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface Database {
  public: {
    Tables: {
      address: {
        Row: {
          city: string;
          coordinates: Json;
          country: string;
          created_at: string;
          district: string | null;
          id: number;
          is_primary: boolean;
          label: string;
          note: string | null;
          number: string;
          postal: string | null;
          street: string;
          user: string;
        };
        Insert: {
          city: string;
          coordinates: Json;
          country?: string;
          created_at?: string;
          district?: string | null;
          id?: number;
          is_primary?: boolean;
          label: string;
          note?: string | null;
          number: string;
          postal?: string | null;
          street: string;
          user: string;
        };
        Update: {
          city?: string;
          coordinates?: Json;
          country?: string;
          created_at?: string;
          district?: string | null;
          id?: number;
          is_primary?: boolean;
          label?: string;
          note?: string | null;
          number?: string;
          postal?: string | null;
          street?: string;
          user?: string;
        };
      };
      alergen: {
        Row: {
          description: string | null;
          icon: string | null;
          id: number;
          label: string;
        };
        Insert: {
          description?: string | null;
          icon?: string | null;
          id?: number;
          label: string;
        };
        Update: {
          description?: string | null;
          icon?: string | null;
          id?: number;
          label?: string;
        };
      };
      customer: {
        Row: {
          id: string;
          stripe_customer_id: string | null;
        };
        Insert: {
          id: string;
          stripe_customer_id?: string | null;
        };
        Update: {
          id?: string;
          stripe_customer_id?: string | null;
        };
      };
      diet: {
        Row: {
          description: string | null;
          icon: string | null;
          id: number;
          label: string;
        };
        Insert: {
          description?: string | null;
          icon?: string | null;
          id?: number;
          label: string;
        };
        Update: {
          description?: string | null;
          icon?: string | null;
          id?: number;
          label?: string;
        };
      };
      food_attribute: {
        Row: {
          icon: string | null;
          id: number;
          label: string;
        };
        Insert: {
          icon?: string | null;
          id?: number;
          label: string;
        };
        Update: {
          icon?: string | null;
          id?: number;
          label?: string;
        };
      };
      ingredient: {
        Row: {
          created_at: string | null;
          extra_info: Json | null;
          id: number;
          img: string | null;
          in_stock: number;
          name: string;
          search_tags: string[] | null;
          unit: string;
        };
        Insert: {
          created_at?: string | null;
          extra_info?: Json | null;
          id?: number;
          img?: string | null;
          in_stock?: number;
          name: string;
          search_tags?: string[] | null;
          unit: string;
        };
        Update: {
          created_at?: string | null;
          extra_info?: Json | null;
          id?: number;
          img?: string | null;
          in_stock?: number;
          name?: string;
          search_tags?: string[] | null;
          unit?: string;
        };
      };
      ingredient_alergen: {
        Row: {
          alergen: number;
          id: number;
          ingredient: number;
        };
        Insert: {
          alergen: number;
          id?: number;
          ingredient: number;
        };
        Update: {
          alergen?: number;
          id?: number;
          ingredient?: number;
        };
      };
      ingredient_version: {
        Row: {
          cost: number | null;
          created_at: string;
          expiration_period: number;
          id: number;
          in_stock: number;
          ingredient: number;
          source: string;
          status: Database['public']['Enums']['ingredient_status'];
          status_changed_at: string;
          version_number: number;
        };
        Insert: {
          cost?: number | null;
          created_at?: string;
          expiration_period: number;
          id?: number;
          in_stock?: number;
          ingredient: number;
          source: string;
          status?: Database['public']['Enums']['ingredient_status'];
          status_changed_at?: string;
          version_number?: number;
        };
        Update: {
          cost?: number | null;
          created_at?: string;
          expiration_period?: number;
          id?: number;
          in_stock?: number;
          ingredient?: number;
          source?: string;
          status?: Database['public']['Enums']['ingredient_status'];
          status_changed_at?: string;
          version_number?: number;
        };
      };
      ingredient_version_order: {
        Row: {
          amount: number;
          cost: number;
          created_at: string;
          delivery_at: string | null;
          expires_at: string | null;
          extra_info: Json | null;
          id: number;
          in_stock: number;
          ingredient_version: number;
          ordered_at: string | null;
          status: Database['public']['Enums']['ingredient_version_order_status'];
          status_changed_at: string;
          unit: string;
        };
        Insert: {
          amount: number;
          cost: number;
          created_at?: string;
          delivery_at?: string | null;
          expires_at?: string | null;
          extra_info?: Json | null;
          id?: number;
          in_stock?: number;
          ingredient_version: number;
          ordered_at?: string | null;
          status?: Database['public']['Enums']['ingredient_version_order_status'];
          status_changed_at?: string;
          unit: string;
        };
        Update: {
          amount?: number;
          cost?: number;
          created_at?: string;
          delivery_at?: string | null;
          expires_at?: string | null;
          extra_info?: Json | null;
          id?: number;
          in_stock?: number;
          ingredient_version?: number;
          ordered_at?: string | null;
          status?: Database['public']['Enums']['ingredient_version_order_status'];
          status_changed_at?: string;
          unit?: string;
        };
      };
      ingredient_version_removal: {
        Row: {
          amount: number;
          created_at: string;
          extra_info: Json | null;
          id: number;
          ingredient_version: number;
          reason: Database['public']['Enums']['ingredient_version_removal_reason'];
          removed_at: string;
          unit: string;
        };
        Insert: {
          amount: number;
          created_at?: string;
          extra_info?: Json | null;
          id?: number;
          ingredient_version: number;
          reason: Database['public']['Enums']['ingredient_version_removal_reason'];
          removed_at?: string;
          unit: string;
        };
        Update: {
          amount?: number;
          created_at?: string;
          extra_info?: Json | null;
          id?: number;
          ingredient_version?: number;
          reason?: Database['public']['Enums']['ingredient_version_removal_reason'];
          removed_at?: string;
          unit?: string;
        };
      };
      kitchen_accessory: {
        Row: {
          icon: string | null;
          id: number;
          label: string;
        };
        Insert: {
          icon?: string | null;
          id?: number;
          label: string;
        };
        Update: {
          icon?: string | null;
          id?: number;
          label?: string;
        };
      };
      notification: {
        Row: {
          created_at: string | null;
          href: string | null;
          id: number;
          message: string;
          read: boolean;
          tags: string[] | null;
          title: string;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          href?: string | null;
          id?: number;
          message: string;
          read?: boolean;
          tags?: string[] | null;
          title: string;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          href?: string | null;
          id?: number;
          message?: string;
          read?: boolean;
          tags?: string[] | null;
          title?: string;
          user_id?: string;
        };
      };
      price: {
        Row: {
          active: boolean | null;
          currency: string | null;
          description: string | null;
          id: string;
          interval: Database['public']['Enums']['pricing_plan_interval'] | null;
          interval_count: number | null;
          metadata: Json | null;
          product_id: string | null;
          trial_period_days: number | null;
          type: Database['public']['Enums']['pricing_type'] | null;
          unit_amount: number | null;
        };
        Insert: {
          active?: boolean | null;
          currency?: string | null;
          description?: string | null;
          id: string;
          interval?:
            | Database['public']['Enums']['pricing_plan_interval']
            | null;
          interval_count?: number | null;
          metadata?: Json | null;
          product_id?: string | null;
          trial_period_days?: number | null;
          type?: Database['public']['Enums']['pricing_type'] | null;
          unit_amount?: number | null;
        };
        Update: {
          active?: boolean | null;
          currency?: string | null;
          description?: string | null;
          id?: string;
          interval?:
            | Database['public']['Enums']['pricing_plan_interval']
            | null;
          interval_count?: number | null;
          metadata?: Json | null;
          product_id?: string | null;
          trial_period_days?: number | null;
          type?: Database['public']['Enums']['pricing_type'] | null;
          unit_amount?: number | null;
        };
      };
      product: {
        Row: {
          active: boolean | null;
          description: string | null;
          id: string;
          image: string | null;
          metadata: Json | null;
          name: string | null;
        };
        Insert: {
          active?: boolean | null;
          description?: string | null;
          id: string;
          image?: string | null;
          metadata?: Json | null;
          name?: string | null;
        };
        Update: {
          active?: boolean | null;
          description?: string | null;
          id?: string;
          image?: string | null;
          metadata?: Json | null;
          name?: string | null;
        };
      };
      subscription: {
        Row: {
          cancel_at: string | null;
          cancel_at_period_end: boolean | null;
          canceled_at: string | null;
          created: string;
          current_period_end: string;
          current_period_start: string;
          ended_at: string | null;
          id: string;
          metadata: Json | null;
          price_id: string | null;
          quantity: number | null;
          status: Database['public']['Enums']['subscription_status'] | null;
          trial_end: string | null;
          trial_start: string | null;
          user_id: string;
        };
        Insert: {
          cancel_at?: string | null;
          cancel_at_period_end?: boolean | null;
          canceled_at?: string | null;
          created?: string;
          current_period_end?: string;
          current_period_start?: string;
          ended_at?: string | null;
          id: string;
          metadata?: Json | null;
          price_id?: string | null;
          quantity?: number | null;
          status?: Database['public']['Enums']['subscription_status'] | null;
          trial_end?: string | null;
          trial_start?: string | null;
          user_id: string;
        };
        Update: {
          cancel_at?: string | null;
          cancel_at_period_end?: boolean | null;
          canceled_at?: string | null;
          created?: string;
          current_period_end?: string;
          current_period_start?: string;
          ended_at?: string | null;
          id?: string;
          metadata?: Json | null;
          price_id?: string | null;
          quantity?: number | null;
          status?: Database['public']['Enums']['subscription_status'] | null;
          trial_end?: string | null;
          trial_start?: string | null;
          user_id?: string;
        };
      };
      unit: {
        Row: {
          base_unit: string | null;
          conversion_rate: number;
          id: number;
          measurement_system: Database['public']['Enums']['measurement_system'];
          name: string;
          property: Database['public']['Enums']['physical_property'];
          sign: string;
        };
        Insert: {
          base_unit?: string | null;
          conversion_rate: number;
          id?: number;
          measurement_system: Database['public']['Enums']['measurement_system'];
          name: string;
          property: Database['public']['Enums']['physical_property'];
          sign: string;
        };
        Update: {
          base_unit?: string | null;
          conversion_rate?: number;
          id?: number;
          measurement_system?: Database['public']['Enums']['measurement_system'];
          name?: string;
          property?: Database['public']['Enums']['physical_property'];
          sign?: string;
        };
      };
      user: {
        Row: {
          account_setup_completed: boolean;
          avatar_url: string | null;
          billing_address: Json | null;
          full_name: string | null;
          id: string;
          is_staff: boolean;
          newsletter: boolean;
          number_of_portions: number | null;
          payment_method: Json | null;
          pick_up: boolean | null;
          terms: boolean;
        };
        Insert: {
          account_setup_completed?: boolean;
          avatar_url?: string | null;
          billing_address?: Json | null;
          full_name?: string | null;
          id: string;
          is_staff?: boolean;
          newsletter?: boolean;
          number_of_portions?: number | null;
          payment_method?: Json | null;
          pick_up?: boolean | null;
          terms?: boolean;
        };
        Update: {
          account_setup_completed?: boolean;
          avatar_url?: string | null;
          billing_address?: Json | null;
          full_name?: string | null;
          id?: string;
          is_staff?: boolean;
          newsletter?: boolean;
          number_of_portions?: number | null;
          payment_method?: Json | null;
          pick_up?: boolean | null;
          terms?: boolean;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      update_ingredient_in_stock: {
        Args: {
          ingredient_id: number;
        };
        Returns: undefined;
      };
      update_ingredient_version_in_stock: {
        Args: {
          ingredient_version_id: number;
        };
        Returns: undefined;
      };
    };
    Enums: {
      ingredient_status: 'active' | 'preparation' | 'archived';
      ingredient_version_order_status:
        | 'awaiting_order'
        | 'ordered'
        | 'delivered'
        | 'canceled'
        | 'expired';
      ingredient_version_removal_reason:
        | 'expired'
        | 'expired_before_expiration'
        | 'unfit_to_sell'
        | 'other'
        | 'used';
      measurement_system: 'metric' | 'imperial';
      physical_property: 'mass' | 'volume' | 'length' | 'count';
      pricing_plan_interval: 'day' | 'week' | 'month' | 'year';
      pricing_type: 'one_time' | 'recurring';
      subscription_status:
        | 'trialing'
        | 'active'
        | 'canceled'
        | 'incomplete'
        | 'incomplete_expired'
        | 'past_due'
        | 'unpaid';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

export type Address = Database['public']['Tables']['address']['Row'];
export type InsertAddress = Database['public']['Tables']['address']['Insert'];
export type UpdateAddress = Database['public']['Tables']['address']['Update'];

export type Alergen = Database['public']['Tables']['alergen']['Row'];
export type InsertAlergen = Database['public']['Tables']['alergen']['Insert'];
export type UpdateAlergen = Database['public']['Tables']['alergen']['Update'];

export type Customer = Database['public']['Tables']['customer']['Row'];
export type InsertCustomer = Database['public']['Tables']['customer']['Insert'];
export type UpdateCustomer = Database['public']['Tables']['customer']['Update'];

export type Diet = Database['public']['Tables']['diet']['Row'];
export type InsertDiet = Database['public']['Tables']['diet']['Insert'];
export type UpdateDiet = Database['public']['Tables']['diet']['Update'];

export type FoodAttribute =
  Database['public']['Tables']['food_attribute']['Row'];
export type InsertFoodAttribute =
  Database['public']['Tables']['food_attribute']['Insert'];
export type UpdateFoodAttribute =
  Database['public']['Tables']['food_attribute']['Update'];

export type Ingredient = Database['public']['Tables']['ingredient']['Row'];
export type InsertIngredient =
  Database['public']['Tables']['ingredient']['Insert'];
export type UpdateIngredient =
  Database['public']['Tables']['ingredient']['Update'];

export type IngredientAlergen =
  Database['public']['Tables']['ingredient_alergen']['Row'];
export type InsertIngredientAlergen =
  Database['public']['Tables']['ingredient_alergen']['Insert'];
export type UpdateIngredientAlergen =
  Database['public']['Tables']['ingredient_alergen']['Update'];

export type IngredientVersion =
  Database['public']['Tables']['ingredient_version']['Row'];
export type InsertIngredientVersion =
  Database['public']['Tables']['ingredient_version']['Insert'];
export type UpdateIngredientVersion =
  Database['public']['Tables']['ingredient_version']['Update'];

export type IngredientVersionOrder =
  Database['public']['Tables']['ingredient_version_order']['Row'];
export type InsertIngredientVersionOrder =
  Database['public']['Tables']['ingredient_version_order']['Insert'];
export type UpdateIngredientVersionOrder =
  Database['public']['Tables']['ingredient_version_order']['Update'];

export type IngredientVersionRemoval =
  Database['public']['Tables']['ingredient_version_removal']['Row'];
export type InsertIngredientVersionRemoval =
  Database['public']['Tables']['ingredient_version_removal']['Insert'];
export type UpdateIngredientVersionRemoval =
  Database['public']['Tables']['ingredient_version_removal']['Update'];

export type KitchenAccessory =
  Database['public']['Tables']['kitchen_accessory']['Row'];
export type InsertKitchenAccessory =
  Database['public']['Tables']['kitchen_accessory']['Insert'];
export type UpdateKitchenAccessory =
  Database['public']['Tables']['kitchen_accessory']['Update'];

export type Notification = Database['public']['Tables']['notification']['Row'];
export type InsertNotification =
  Database['public']['Tables']['notification']['Insert'];
export type UpdateNotification =
  Database['public']['Tables']['notification']['Update'];

export type Price = Database['public']['Tables']['price']['Row'];
export type InsertPrice = Database['public']['Tables']['price']['Insert'];
export type UpdatePrice = Database['public']['Tables']['price']['Update'];

export type Product = Database['public']['Tables']['product']['Row'];
export type InsertProduct = Database['public']['Tables']['product']['Insert'];
export type UpdateProduct = Database['public']['Tables']['product']['Update'];

export type Subscription = Database['public']['Tables']['subscription']['Row'];
export type InsertSubscription =
  Database['public']['Tables']['subscription']['Insert'];
export type UpdateSubscription =
  Database['public']['Tables']['subscription']['Update'];

export type Unit = Database['public']['Tables']['unit']['Row'];
export type InsertUnit = Database['public']['Tables']['unit']['Insert'];
export type UpdateUnit = Database['public']['Tables']['unit']['Update'];

export type User = Database['public']['Tables']['user']['Row'];
export type InsertUser = Database['public']['Tables']['user']['Insert'];
export type UpdateUser = Database['public']['Tables']['user']['Update'];
