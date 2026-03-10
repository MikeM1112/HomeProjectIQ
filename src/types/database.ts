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
      profiles: {
        Row: {
          id: string;
          username: string | null;
          display_name: string | null;
          avatar_url: string | null;
          role: 'user' | 'admin';
          xp: number;
          total_xp: number;
          level: number;
          total_savings: number;
          streak: number;
          last_active_at: string | null;
          skills: Record<string, number>;
          badges: string[];
          onboarding_completed_at: string | null;
          locale: string;
          currency: string;
          units: 'metric' | 'imperial';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username?: string | null;
          display_name?: string | null;
          avatar_url?: string | null;
          role?: 'user' | 'admin';
          xp?: number;
          total_xp?: number;
          level?: number;
          total_savings?: number;
          streak?: number;
          last_active_at?: string | null;
          skills?: Record<string, number>;
          badges?: string[];
          onboarding_completed_at?: string | null;
          locale?: string;
          currency?: string;
          units?: 'metric' | 'imperial';
        };
        Update: {
          id?: string;
          username?: string | null;
          display_name?: string | null;
          avatar_url?: string | null;
          role?: 'user' | 'admin';
          xp?: number;
          total_xp?: number;
          level?: number;
          total_savings?: number;
          streak?: number;
          last_active_at?: string | null;
          skills?: Record<string, number>;
          badges?: string[];
          onboarding_completed_at?: string | null;
          locale?: string;
          currency?: string;
          units?: 'metric' | 'imperial';
        };
        Relationships: [];
      };
      projects: {
        Row: {
          id: string;
          user_id: string;
          category_id: string;
          title: string;
          confidence: number;
          verdict: 'diy_easy' | 'diy_caution' | 'hire_pro';
          intake_answers: Record<string, string>;
          status: 'planning' | 'in_progress' | 'completed' | 'hired_pro';
          estimated_diy_lo: number | null;
          estimated_diy_hi: number | null;
          estimated_pro_lo: number | null;
          estimated_pro_hi: number | null;
          actual_cost: number | null;
          xp_awarded: number;
          created_at: string;
          updated_at: string;
          completed_at: string | null;
          outcome_status: 'success' | 'partial' | 'failed' | null;
          outcome_actual_cost: number | null;
          outcome_actual_hours: number | null;
          outcome_difficulty: 'easier' | 'as_expected' | 'harder' | null;
          outcome_complications: string | null;
          outcome_would_diy_again: boolean | null;
          outcome_photos: string[];
          outcome_submitted_at: string | null;
          ai_photo_url: string | null;
          ai_description: string | null;
          assessment_mode: 'category' | 'ai_photo';
        };
        Insert: {
          id?: string;
          user_id: string;
          category_id: string;
          title: string;
          confidence: number;
          verdict: 'diy_easy' | 'diy_caution' | 'hire_pro';
          intake_answers?: Record<string, string>;
          status?: 'planning' | 'in_progress' | 'completed' | 'hired_pro';
          estimated_diy_lo?: number | null;
          estimated_diy_hi?: number | null;
          estimated_pro_lo?: number | null;
          estimated_pro_hi?: number | null;
          actual_cost?: number | null;
          xp_awarded?: number;
          outcome_status?: 'success' | 'partial' | 'failed' | null;
          outcome_actual_cost?: number | null;
          outcome_actual_hours?: number | null;
          outcome_difficulty?: 'easier' | 'as_expected' | 'harder' | null;
          outcome_complications?: string | null;
          outcome_would_diy_again?: boolean | null;
          outcome_photos?: string[];
          outcome_submitted_at?: string | null;
          ai_photo_url?: string | null;
          ai_description?: string | null;
          assessment_mode?: 'category' | 'ai_photo';
        };
        Update: {
          id?: string;
          user_id?: string;
          category_id?: string;
          title?: string;
          confidence?: number;
          verdict?: 'diy_easy' | 'diy_caution' | 'hire_pro';
          intake_answers?: Record<string, string>;
          status?: 'planning' | 'in_progress' | 'completed' | 'hired_pro';
          estimated_diy_lo?: number | null;
          estimated_diy_hi?: number | null;
          estimated_pro_lo?: number | null;
          estimated_pro_hi?: number | null;
          actual_cost?: number | null;
          xp_awarded?: number;
          completed_at?: string | null;
          outcome_status?: 'success' | 'partial' | 'failed' | null;
          outcome_actual_cost?: number | null;
          outcome_actual_hours?: number | null;
          outcome_difficulty?: 'easier' | 'as_expected' | 'harder' | null;
          outcome_complications?: string | null;
          outcome_would_diy_again?: boolean | null;
          outcome_photos?: string[];
          outcome_submitted_at?: string | null;
          ai_photo_url?: string | null;
          ai_description?: string | null;
          assessment_mode?: 'category' | 'ai_photo';
        };
        Relationships: [];
      };
      logbook_entries: {
        Row: {
          id: string;
          user_id: string;
          project_id: string | null;
          title: string;
          category_id: string;
          notes: string | null;
          cost: number | null;
          labor_type: 'diy' | 'hired_pro' | 'warranty';
          photo_urls: string[];
          xp_awarded: number;
          repair_date: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          project_id?: string | null;
          title: string;
          category_id: string;
          notes?: string | null;
          cost?: number | null;
          labor_type: 'diy' | 'hired_pro' | 'warranty';
          photo_urls?: string[];
          xp_awarded?: number;
          repair_date?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          project_id?: string | null;
          title?: string;
          category_id?: string;
          notes?: string | null;
          cost?: number | null;
          labor_type?: 'diy' | 'hired_pro' | 'warranty';
          photo_urls?: string[];
          xp_awarded?: number;
          repair_date?: string;
        };
        Relationships: [];
      };
      toolbox_items: {
        Row: {
          id: string;
          user_id: string;
          tool_id: string;
          tool_name: string;
          category: string;
          notes: string | null;
          added_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          tool_id: string;
          tool_name: string;
          category: string;
          notes?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          tool_id?: string;
          tool_name?: string;
          category?: string;
          notes?: string | null;
        };
        Relationships: [];
      };
      friendships: {
        Row: {
          id: string;
          requester_id: string;
          addressee_id: string;
          status: 'pending' | 'accepted' | 'blocked';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          requester_id: string;
          addressee_id: string;
          status?: 'pending' | 'accepted' | 'blocked';
        };
        Update: {
          id?: string;
          requester_id?: string;
          addressee_id?: string;
          status?: 'pending' | 'accepted' | 'blocked';
        };
        Relationships: [];
      };
      feature_flags: {
        Row: {
          id: string;
          flag_name: string;
          is_enabled: boolean;
          description: string | null;
          updated_by: string | null;
          updated_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          flag_name: string;
          is_enabled?: boolean;
          description?: string | null;
          updated_by?: string | null;
        };
        Update: {
          id?: string;
          flag_name?: string;
          is_enabled?: boolean;
          description?: string | null;
          updated_by?: string | null;
        };
        Relationships: [];
      };
      home_profiles: {
        Row: {
          id: string;
          user_id: string;
          home_type: string;
          home_age: string;
          heating_type: string;
          has_ac: boolean;
          has_chimney: boolean;
          has_septic: boolean;
          has_sump_pump: boolean;
          has_garage: boolean;
          has_deck: boolean;
          has_yard: boolean;
          setup_completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          home_type?: string;
          home_age?: string;
          heating_type?: string;
          has_ac?: boolean;
          has_chimney?: boolean;
          has_septic?: boolean;
          has_sump_pump?: boolean;
          has_garage?: boolean;
          has_deck?: boolean;
          has_yard?: boolean;
          setup_completed_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          home_type?: string;
          home_age?: string;
          heating_type?: string;
          has_ac?: boolean;
          has_chimney?: boolean;
          has_septic?: boolean;
          has_sump_pump?: boolean;
          has_garage?: boolean;
          has_deck?: boolean;
          has_yard?: boolean;
          setup_completed_at?: string | null;
        };
        Relationships: [];
      };
      maintenance_tasks: {
        Row: {
          id: string;
          user_id: string;
          task_id: string;
          title: string;
          category: string;
          frequency: string;
          season: string | null;
          importance: string;
          last_completed_at: string | null;
          next_due_at: string | null;
          is_dismissed: boolean;
          snoozed_until: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          task_id: string;
          title: string;
          category: string;
          frequency: string;
          season?: string | null;
          importance?: string;
          next_due_at?: string | null;
          is_dismissed?: boolean;
          notes?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          task_id?: string;
          title?: string;
          category?: string;
          frequency?: string;
          season?: string | null;
          importance?: string;
          last_completed_at?: string | null;
          next_due_at?: string | null;
          is_dismissed?: boolean;
          snoozed_until?: string | null;
          notes?: string | null;
        };
        Relationships: [];
      };
      quote_requests: {
        Row: {
          id: string;
          user_id: string;
          project_id: string | null;
          title: string;
          category_id: string;
          estimated_pro_lo: number | null;
          estimated_pro_hi: number | null;
          estimated_diy_lo: number | null;
          estimated_diy_hi: number | null;
          materials_json: Json;
          tools_json: Json;
          call_script: string;
          zip_code: string;
          preferred_timeline: string;
          contact_preference: string;
          contact_phone: string | null;
          notes: string | null;
          status: string;
          bid_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          project_id?: string | null;
          title: string;
          category_id: string;
          estimated_pro_lo?: number | null;
          estimated_pro_hi?: number | null;
          estimated_diy_lo?: number | null;
          estimated_diy_hi?: number | null;
          materials_json?: Json;
          tools_json?: Json;
          call_script?: string;
          zip_code: string;
          preferred_timeline?: string;
          contact_preference?: string;
          contact_phone?: string | null;
          notes?: string | null;
          status?: string;
          bid_count?: number;
        };
        Update: {
          id?: string;
          user_id?: string;
          project_id?: string | null;
          title?: string;
          category_id?: string;
          estimated_pro_lo?: number | null;
          estimated_pro_hi?: number | null;
          estimated_diy_lo?: number | null;
          estimated_diy_hi?: number | null;
          materials_json?: Json;
          tools_json?: Json;
          call_script?: string;
          zip_code?: string;
          preferred_timeline?: string;
          contact_preference?: string;
          contact_phone?: string | null;
          notes?: string | null;
          status?: string;
          bid_count?: number;
        };
        Relationships: [];
      };
    };
    Views: {
      assessment_outcome_stats: {
        Row: {
          category_id: string;
          verdict: string;
          total_assessments: number;
          total_outcomes: number;
          success_count: number;
          partial_count: number;
          failed_count: number;
          avg_actual_cost: number | null;
          avg_actual_hours: number | null;
          avg_confidence: number | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      increment_xp: {
        Args: { p_user_id: string; p_amount: number };
        Returns: undefined;
      };
      decrement_xp: {
        Args: { p_user_id: string; p_amount: number };
        Returns: undefined;
      };
      increment_savings: {
        Args: { p_user_id: string; p_amount: number };
        Returns: undefined;
      };
      decrement_savings: {
        Args: { p_user_id: string; p_amount: number };
        Returns: undefined;
      };
      create_project_with_xp: {
        Args: {
          p_user_id: string;
          p_category_id: string;
          p_title: string;
          p_confidence: number;
          p_verdict: string;
          p_intake_answers: Record<string, string>;
          p_estimated_diy_lo?: number | null;
          p_estimated_diy_hi?: number | null;
          p_estimated_pro_lo?: number | null;
          p_estimated_pro_hi?: number | null;
          p_xp_amount?: number;
          p_assessment_mode?: string;
        };
        Returns: string;
      };
      create_logbook_with_xp: {
        Args: {
          p_user_id: string;
          p_title: string;
          p_category_id: string;
          p_repair_date: string;
          p_labor_type: string;
          p_xp_amount: number;
          p_cost?: number | null;
          p_notes?: string | null;
        };
        Returns: string;
      };
      delete_logbook_with_xp: {
        Args: {
          p_user_id: string;
          p_entry_id: string;
        };
        Returns: boolean;
      };
      submit_outcome_with_xp: {
        Args: {
          p_user_id: string;
          p_project_id: string;
          p_outcome_status: string;
          p_xp_amount: number;
          p_outcome_actual_cost?: number | null;
          p_outcome_actual_hours?: number | null;
          p_outcome_difficulty?: string | null;
          p_outcome_complications?: string | null;
          p_outcome_would_diy_again?: boolean | null;
        };
        Returns: Record<string, unknown>;
      };
      complete_maintenance_task: {
        Args: {
          p_user_id: string;
          p_task_id: string;
          p_xp_amount?: number;
          p_next_due_at?: string | null;
        };
        Returns: Record<string, unknown>;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];

export type InsertTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];

export type UpdateTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];
