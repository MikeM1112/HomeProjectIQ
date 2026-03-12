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
      tool_loans: {
        Row: {
          id: string;
          user_id: string;
          tool_id: string;
          tool_name: string;
          tool_emoji: string;
          borrower_name: string;
          lent_date: string;
          return_date: string | null;
          due_date: string | null;
          status: 'out' | 'returned' | 'overdue';
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          tool_id: string;
          tool_name: string;
          tool_emoji?: string;
          borrower_name: string;
          lent_date?: string;
          return_date?: string | null;
          due_date?: string | null;
          status?: 'out' | 'returned' | 'overdue';
          notes?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          tool_id?: string;
          tool_name?: string;
          tool_emoji?: string;
          borrower_name?: string;
          lent_date?: string;
          return_date?: string | null;
          due_date?: string | null;
          status?: 'out' | 'returned' | 'overdue';
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
      households: {
        Row: {
          id: string;
          name: string;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          created_by: string;
        };
        Update: {
          id?: string;
          name?: string;
          created_by?: string;
        };
        Relationships: [];
      };
      household_members: {
        Row: {
          id: string;
          household_id: string;
          user_id: string;
          role: 'owner' | 'admin' | 'member';
          joined_at: string;
        };
        Insert: {
          id?: string;
          household_id: string;
          user_id: string;
          role?: 'owner' | 'admin' | 'member';
        };
        Update: {
          id?: string;
          household_id?: string;
          user_id?: string;
          role?: 'owner' | 'admin' | 'member';
        };
        Relationships: [];
      };
      properties: {
        Row: {
          id: string;
          household_id: string;
          name: string;
          address: string | null;
          home_type: string;
          year_built: number | null;
          square_footage: number | null;
          lot_size_sqft: number | null;
          floors: number | null;
          bedrooms: number | null;
          bathrooms: number | null;
          photo_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          household_id: string;
          name: string;
          address?: string | null;
          home_type?: string;
          year_built?: number | null;
          square_footage?: number | null;
          lot_size_sqft?: number | null;
          floors?: number | null;
          bedrooms?: number | null;
          bathrooms?: number | null;
          photo_url?: string | null;
        };
        Update: {
          id?: string;
          household_id?: string;
          name?: string;
          address?: string | null;
          home_type?: string;
          year_built?: number | null;
          square_footage?: number | null;
          lot_size_sqft?: number | null;
          floors?: number | null;
          bedrooms?: number | null;
          bathrooms?: number | null;
          photo_url?: string | null;
        };
        Relationships: [];
      };
      property_zones: {
        Row: {
          id: string;
          property_id: string;
          name: string;
          zone_type: 'interior' | 'exterior' | 'garage' | 'yard' | 'roof' | 'basement' | 'attic';
          floor_number: number | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          property_id: string;
          name: string;
          zone_type?: 'interior' | 'exterior' | 'garage' | 'yard' | 'roof' | 'basement' | 'attic';
          floor_number?: number | null;
          notes?: string | null;
        };
        Update: {
          id?: string;
          property_id?: string;
          name?: string;
          zone_type?: 'interior' | 'exterior' | 'garage' | 'yard' | 'roof' | 'basement' | 'attic';
          floor_number?: number | null;
          notes?: string | null;
        };
        Relationships: [];
      };
      systems: {
        Row: {
          id: string;
          property_id: string;
          name: string;
          system_type: 'hvac' | 'plumbing' | 'electrical' | 'roofing' | 'foundation' | 'appliance' | 'exterior' | 'interior' | 'landscaping' | 'security' | 'other';
          brand: string | null;
          model: string | null;
          install_date: string | null;
          warranty_expiry: string | null;
          expected_lifespan_years: number | null;
          condition: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
          last_serviced_at: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          property_id: string;
          name: string;
          system_type: 'hvac' | 'plumbing' | 'electrical' | 'roofing' | 'foundation' | 'appliance' | 'exterior' | 'interior' | 'landscaping' | 'security' | 'other';
          brand?: string | null;
          model?: string | null;
          install_date?: string | null;
          warranty_expiry?: string | null;
          expected_lifespan_years?: number | null;
          condition?: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
          last_serviced_at?: string | null;
          notes?: string | null;
        };
        Update: {
          id?: string;
          property_id?: string;
          name?: string;
          system_type?: 'hvac' | 'plumbing' | 'electrical' | 'roofing' | 'foundation' | 'appliance' | 'exterior' | 'interior' | 'landscaping' | 'security' | 'other';
          brand?: string | null;
          model?: string | null;
          install_date?: string | null;
          warranty_expiry?: string | null;
          expected_lifespan_years?: number | null;
          condition?: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
          last_serviced_at?: string | null;
          notes?: string | null;
        };
        Relationships: [];
      };
      system_components: {
        Row: {
          id: string;
          system_id: string;
          name: string;
          component_type: string | null;
          brand: string | null;
          model: string | null;
          serial_number: string | null;
          install_date: string | null;
          warranty_expiry: string | null;
          condition: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          system_id: string;
          name: string;
          component_type?: string | null;
          brand?: string | null;
          model?: string | null;
          serial_number?: string | null;
          install_date?: string | null;
          warranty_expiry?: string | null;
          condition?: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
          notes?: string | null;
        };
        Update: {
          id?: string;
          system_id?: string;
          name?: string;
          component_type?: string | null;
          brand?: string | null;
          model?: string | null;
          serial_number?: string | null;
          install_date?: string | null;
          warranty_expiry?: string | null;
          condition?: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
          notes?: string | null;
        };
        Relationships: [];
      };
      guided_sessions: {
        Row: {
          id: string;
          project_id: string;
          user_id: string;
          status: 'active' | 'paused' | 'completed' | 'abandoned';
          current_step: number;
          total_steps: number;
          started_at: string;
          completed_at: string | null;
          paused_at: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          user_id: string;
          status?: 'active' | 'paused' | 'completed' | 'abandoned';
          current_step?: number;
          total_steps?: number;
          notes?: string | null;
        };
        Update: {
          id?: string;
          project_id?: string;
          user_id?: string;
          status?: 'active' | 'paused' | 'completed' | 'abandoned';
          current_step?: number;
          total_steps?: number;
          completed_at?: string | null;
          paused_at?: string | null;
          notes?: string | null;
        };
        Relationships: [];
      };
      step_checkpoints: {
        Row: {
          id: string;
          session_id: string;
          step_number: number;
          title: string;
          instructions: string | null;
          photo_url: string | null;
          ai_validation_status: 'pending' | 'passed' | 'failed' | 'skipped';
          ai_feedback: string | null;
          completed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          step_number: number;
          title: string;
          instructions?: string | null;
          photo_url?: string | null;
          ai_validation_status?: 'pending' | 'passed' | 'failed' | 'skipped';
          ai_feedback?: string | null;
          completed_at?: string | null;
        };
        Update: {
          id?: string;
          session_id?: string;
          step_number?: number;
          title?: string;
          instructions?: string | null;
          photo_url?: string | null;
          ai_validation_status?: 'pending' | 'passed' | 'failed' | 'skipped';
          ai_feedback?: string | null;
          completed_at?: string | null;
        };
        Relationships: [];
      };
      project_required_tools: {
        Row: {
          id: string;
          project_id: string;
          tool_id: string;
          tool_name: string;
          is_owned: boolean;
          is_borrowable: boolean;
          source: 'owned' | 'borrow' | 'purchase' | 'rent' | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          tool_id: string;
          tool_name: string;
          is_owned?: boolean;
          is_borrowable?: boolean;
          source?: 'owned' | 'borrow' | 'purchase' | 'rent' | null;
        };
        Update: {
          id?: string;
          project_id?: string;
          tool_id?: string;
          tool_name?: string;
          is_owned?: boolean;
          is_borrowable?: boolean;
          source?: 'owned' | 'borrow' | 'purchase' | 'rent' | null;
        };
        Relationships: [];
      };
      handy_profiles: {
        Row: {
          id: string;
          user_id: string;
          display_name: string | null;
          bio: string | null;
          skills: string[];
          rating: number;
          total_reviews: number;
          tools_lent_count: number;
          repairs_helped: number;
          is_available: boolean;
          latitude: number | null;
          longitude: number | null;
          neighborhood: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          display_name?: string | null;
          bio?: string | null;
          skills?: string[];
          rating?: number;
          total_reviews?: number;
          tools_lent_count?: number;
          repairs_helped?: number;
          is_available?: boolean;
          latitude?: number | null;
          longitude?: number | null;
          neighborhood?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          display_name?: string | null;
          bio?: string | null;
          skills?: string[];
          rating?: number;
          total_reviews?: number;
          tools_lent_count?: number;
          repairs_helped?: number;
          is_available?: boolean;
          latitude?: number | null;
          longitude?: number | null;
          neighborhood?: string | null;
        };
        Relationships: [];
      };
      timeline_events: {
        Row: {
          id: string;
          user_id: string;
          property_id: string | null;
          project_id: string | null;
          event_type: 'repair' | 'maintenance' | 'inspection' | 'purchase' | 'warranty' | 'incident' | 'upgrade' | 'other';
          title: string;
          description: string | null;
          cost: number | null;
          photo_urls: string[];
          metadata: Json;
          event_date: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          property_id?: string | null;
          project_id?: string | null;
          event_type: 'repair' | 'maintenance' | 'inspection' | 'purchase' | 'warranty' | 'incident' | 'upgrade' | 'other';
          title: string;
          description?: string | null;
          cost?: number | null;
          photo_urls?: string[];
          metadata?: Json;
          event_date?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          property_id?: string | null;
          project_id?: string | null;
          event_type?: 'repair' | 'maintenance' | 'inspection' | 'purchase' | 'warranty' | 'incident' | 'upgrade' | 'other';
          title?: string;
          description?: string | null;
          cost?: number | null;
          photo_urls?: string[];
          metadata?: Json;
          event_date?: string;
        };
        Relationships: [];
      };
      documents: {
        Row: {
          id: string;
          user_id: string;
          property_id: string | null;
          document_type: 'receipt' | 'warranty' | 'manual' | 'inspection_report' | 'insurance' | 'permit' | 'contract' | 'photo' | 'other';
          title: string;
          description: string | null;
          file_url: string;
          file_type: string | null;
          file_size: number | null;
          metadata: Json;
          expires_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          property_id?: string | null;
          document_type: 'receipt' | 'warranty' | 'manual' | 'inspection_report' | 'insurance' | 'permit' | 'contract' | 'photo' | 'other';
          title: string;
          description?: string | null;
          file_url: string;
          file_type?: string | null;
          file_size?: number | null;
          metadata?: Json;
          expires_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          property_id?: string | null;
          document_type?: 'receipt' | 'warranty' | 'manual' | 'inspection_report' | 'insurance' | 'permit' | 'contract' | 'photo' | 'other';
          title?: string;
          description?: string | null;
          file_url?: string;
          file_type?: string | null;
          file_size?: number | null;
          metadata?: Json;
          expires_at?: string | null;
        };
        Relationships: [];
      };
      capability_scores: {
        Row: {
          id: string;
          user_id: string;
          property_id: string | null;
          overall_score: number;
          tool_readiness: number;
          repair_experience: number;
          maintenance_completion: number;
          documentation_score: number;
          emergency_preparedness: number;
          capability_level: 'beginner' | 'developing' | 'capable' | 'proficient' | 'expert';
          suggestions: Json;
          calculated_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          property_id?: string | null;
          overall_score?: number;
          tool_readiness?: number;
          repair_experience?: number;
          maintenance_completion?: number;
          documentation_score?: number;
          emergency_preparedness?: number;
          capability_level?: 'beginner' | 'developing' | 'capable' | 'proficient' | 'expert';
          suggestions?: Json;
        };
        Update: {
          id?: string;
          user_id?: string;
          property_id?: string | null;
          overall_score?: number;
          tool_readiness?: number;
          repair_experience?: number;
          maintenance_completion?: number;
          documentation_score?: number;
          emergency_preparedness?: number;
          capability_level?: 'beginner' | 'developing' | 'capable' | 'proficient' | 'expert';
          suggestions?: Json;
        };
        Relationships: [];
      };
      risk_scores: {
        Row: {
          id: string;
          user_id: string;
          property_id: string | null;
          system_id: string | null;
          system_type: string;
          risk_level: 'low' | 'moderate' | 'high' | 'critical';
          risk_score: number;
          failure_probability: number | null;
          estimated_repair_cost: number | null;
          time_to_failure_days: number | null;
          contributing_factors: Json;
          calculated_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          property_id?: string | null;
          system_id?: string | null;
          system_type: string;
          risk_level?: 'low' | 'moderate' | 'high' | 'critical';
          risk_score?: number;
          failure_probability?: number | null;
          estimated_repair_cost?: number | null;
          time_to_failure_days?: number | null;
          contributing_factors?: Json;
        };
        Update: {
          id?: string;
          user_id?: string;
          property_id?: string | null;
          system_id?: string | null;
          system_type?: string;
          risk_level?: 'low' | 'moderate' | 'high' | 'critical';
          risk_score?: number;
          failure_probability?: number | null;
          estimated_repair_cost?: number | null;
          time_to_failure_days?: number | null;
          contributing_factors?: Json;
        };
        Relationships: [];
      };
      alerts: {
        Row: {
          id: string;
          user_id: string;
          property_id: string | null;
          alert_type: 'risk' | 'maintenance' | 'warranty' | 'weather' | 'system' | 'recommendation';
          severity: 'info' | 'warning' | 'urgent' | 'critical';
          title: string;
          message: string;
          action_url: string | null;
          is_read: boolean;
          is_dismissed: boolean;
          metadata: Json;
          expires_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          property_id?: string | null;
          alert_type: 'risk' | 'maintenance' | 'warranty' | 'weather' | 'system' | 'recommendation';
          severity?: 'info' | 'warning' | 'urgent' | 'critical';
          title: string;
          message: string;
          action_url?: string | null;
          is_read?: boolean;
          is_dismissed?: boolean;
          metadata?: Json;
          expires_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          property_id?: string | null;
          alert_type?: 'risk' | 'maintenance' | 'warranty' | 'weather' | 'system' | 'recommendation';
          severity?: 'info' | 'warning' | 'urgent' | 'critical';
          title?: string;
          message?: string;
          action_url?: string | null;
          is_read?: boolean;
          is_dismissed?: boolean;
          metadata?: Json;
          expires_at?: string | null;
        };
        Relationships: [];
      };
      recommendations: {
        Row: {
          id: string;
          user_id: string;
          property_id: string | null;
          recommendation_type: 'preventative' | 'upgrade' | 'repair' | 'maintenance' | 'efficiency' | 'safety';
          priority: 'low' | 'medium' | 'high' | 'urgent';
          title: string;
          description: string;
          estimated_cost_lo: number | null;
          estimated_cost_hi: number | null;
          estimated_savings: number | null;
          difficulty: 'easy' | 'moderate' | 'hard' | 'professional' | null;
          is_completed: boolean;
          is_dismissed: boolean;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          property_id?: string | null;
          recommendation_type: 'preventative' | 'upgrade' | 'repair' | 'maintenance' | 'efficiency' | 'safety';
          priority?: 'low' | 'medium' | 'high' | 'urgent';
          title: string;
          description: string;
          estimated_cost_lo?: number | null;
          estimated_cost_hi?: number | null;
          estimated_savings?: number | null;
          difficulty?: 'easy' | 'moderate' | 'hard' | 'professional' | null;
          is_completed?: boolean;
          is_dismissed?: boolean;
          metadata?: Json;
        };
        Update: {
          id?: string;
          user_id?: string;
          property_id?: string | null;
          recommendation_type?: 'preventative' | 'upgrade' | 'repair' | 'maintenance' | 'efficiency' | 'safety';
          priority?: 'low' | 'medium' | 'high' | 'urgent';
          title?: string;
          description?: string;
          estimated_cost_lo?: number | null;
          estimated_cost_hi?: number | null;
          estimated_savings?: number | null;
          difficulty?: 'easy' | 'moderate' | 'hard' | 'professional' | null;
          is_completed?: boolean;
          is_dismissed?: boolean;
          metadata?: Json;
        };
        Relationships: [];
      };
      issue_types: {
        Row: {
          id: string;
          code: string;
          name: string;
          category: string | null;
          description: string | null;
          default_severity: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          name: string;
          category?: string | null;
          description?: string | null;
          default_severity?: string | null;
        };
        Update: {
          id?: string;
          code?: string;
          name?: string;
          category?: string | null;
          description?: string | null;
          default_severity?: string | null;
        };
        Relationships: [];
      };
      scans: {
        Row: {
          id: string;
          property_id: string;
          zone_id: string | null;
          user_id: string;
          scan_type: string;
          status: string;
          user_note: string | null;
          started_at: string;
          completed_at: string | null;
          metadata: Json | null;
        };
        Insert: {
          id?: string;
          property_id: string;
          zone_id?: string | null;
          user_id: string;
          scan_type: string;
          status?: string;
          user_note?: string | null;
          metadata?: Json | null;
        };
        Update: {
          id?: string;
          property_id?: string;
          zone_id?: string | null;
          user_id?: string;
          scan_type?: string;
          status?: string;
          user_note?: string | null;
          completed_at?: string | null;
          metadata?: Json | null;
        };
        Relationships: [];
      };
      scan_images: {
        Row: {
          id: string;
          scan_id: string;
          image_url: string;
          image_order: number | null;
          captured_at: string | null;
          metadata: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          scan_id: string;
          image_url: string;
          image_order?: number | null;
          captured_at?: string | null;
          metadata?: Json | null;
        };
        Update: {
          id?: string;
          scan_id?: string;
          image_url?: string;
          image_order?: number | null;
          captured_at?: string | null;
          metadata?: Json | null;
        };
        Relationships: [];
      };
      diagnoses: {
        Row: {
          id: string;
          scan_id: string;
          issue_type_id: string | null;
          title: string;
          summary: string | null;
          confidence_score: number | null;
          severity: string | null;
          urgency: string | null;
          risk_if_ignored: string | null;
          recommended_action: string | null;
          diy_possible: boolean | null;
          estimated_diy_cost_min: number | null;
          estimated_diy_cost_max: number | null;
          estimated_pro_cost_min: number | null;
          estimated_pro_cost_max: number | null;
          estimated_time_minutes: number | null;
          skill_level: string | null;
          status: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          scan_id: string;
          issue_type_id?: string | null;
          title: string;
          summary?: string | null;
          confidence_score?: number | null;
          severity?: string | null;
          urgency?: string | null;
          risk_if_ignored?: string | null;
          recommended_action?: string | null;
          diy_possible?: boolean | null;
          estimated_diy_cost_min?: number | null;
          estimated_diy_cost_max?: number | null;
          estimated_pro_cost_min?: number | null;
          estimated_pro_cost_max?: number | null;
          estimated_time_minutes?: number | null;
          skill_level?: string | null;
          status?: string | null;
        };
        Update: {
          id?: string;
          scan_id?: string;
          issue_type_id?: string | null;
          title?: string;
          summary?: string | null;
          confidence_score?: number | null;
          severity?: string | null;
          urgency?: string | null;
          risk_if_ignored?: string | null;
          recommended_action?: string | null;
          diy_possible?: boolean | null;
          estimated_diy_cost_min?: number | null;
          estimated_diy_cost_max?: number | null;
          estimated_pro_cost_min?: number | null;
          estimated_pro_cost_max?: number | null;
          estimated_time_minutes?: number | null;
          skill_level?: string | null;
          status?: string | null;
        };
        Relationships: [];
      };
      diagnosis_evidence: {
        Row: {
          id: string;
          diagnosis_id: string;
          evidence_type: string;
          description: string | null;
          confidence_score: number | null;
          source_region: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          diagnosis_id: string;
          evidence_type: string;
          description?: string | null;
          confidence_score?: number | null;
          source_region?: Json | null;
        };
        Update: {
          id?: string;
          diagnosis_id?: string;
          evidence_type?: string;
          description?: string | null;
          confidence_score?: number | null;
          source_region?: Json | null;
        };
        Relationships: [];
      };
      project_steps: {
        Row: {
          id: string;
          project_id: string;
          step_order: number;
          title: string;
          description: string | null;
          safety_note: string | null;
          expected_visual_state: string | null;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          step_order: number;
          title: string;
          description?: string | null;
          safety_note?: string | null;
          expected_visual_state?: string | null;
          status?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          step_order?: number;
          title?: string;
          description?: string | null;
          safety_note?: string | null;
          expected_visual_state?: string | null;
          status?: string;
        };
        Relationships: [];
      };
      project_materials: {
        Row: {
          id: string;
          project_id: string;
          name: string;
          quantity: number | null;
          unit: string | null;
          estimated_cost: number | null;
          purchase_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          name: string;
          quantity?: number | null;
          unit?: string | null;
          estimated_cost?: number | null;
          purchase_url?: string | null;
        };
        Update: {
          id?: string;
          project_id?: string;
          name?: string;
          quantity?: number | null;
          unit?: string | null;
          estimated_cost?: number | null;
          purchase_url?: string | null;
        };
        Relationships: [];
      };
      guided_step_checkpoints: {
        Row: {
          id: string;
          guided_session_id: string;
          project_step_id: string;
          checkpoint_type: string | null;
          status: string | null;
          ai_feedback: string | null;
          confidence_score: number | null;
          requires_reroute: boolean;
          safety_flag: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          guided_session_id: string;
          project_step_id: string;
          checkpoint_type?: string | null;
          status?: string | null;
          ai_feedback?: string | null;
          confidence_score?: number | null;
          requires_reroute?: boolean;
          safety_flag?: boolean;
        };
        Update: {
          id?: string;
          guided_session_id?: string;
          project_step_id?: string;
          checkpoint_type?: string | null;
          status?: string | null;
          ai_feedback?: string | null;
          confidence_score?: number | null;
          requires_reroute?: boolean;
          safety_flag?: boolean;
        };
        Relationships: [];
      };
      guided_checkpoint_images: {
        Row: {
          id: string;
          guided_step_checkpoint_id: string;
          image_url: string;
          image_order: number | null;
          metadata: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          guided_step_checkpoint_id: string;
          image_url: string;
          image_order?: number | null;
          metadata?: Json | null;
        };
        Update: {
          id?: string;
          guided_step_checkpoint_id?: string;
          image_url?: string;
          image_order?: number | null;
          metadata?: Json | null;
        };
        Relationships: [];
      };
      guided_messages: {
        Row: {
          id: string;
          guided_session_id: string;
          sender_type: string;
          message: string;
          message_type: string | null;
          metadata: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          guided_session_id: string;
          sender_type: string;
          message: string;
          message_type?: string | null;
          metadata?: Json | null;
        };
        Update: {
          id?: string;
          guided_session_id?: string;
          sender_type?: string;
          message?: string;
          message_type?: string | null;
          metadata?: Json | null;
        };
        Relationships: [];
      };
      tools: {
        Row: {
          id: string;
          name: string;
          category: string | null;
          sub_category: string | null;
          brand: string | null;
          model: string | null;
          typical_use_cases: string[] | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          category?: string | null;
          sub_category?: string | null;
          brand?: string | null;
          model?: string | null;
          typical_use_cases?: string[] | null;
        };
        Update: {
          id?: string;
          name?: string;
          category?: string | null;
          sub_category?: string | null;
          brand?: string | null;
          model?: string | null;
          typical_use_cases?: string[] | null;
        };
        Relationships: [];
      };
      system_readings: {
        Row: {
          id: string;
          system_id: string;
          reading_type: string;
          reading_value: number | null;
          unit: string | null;
          source: string | null;
          metadata: Json | null;
          recorded_at: string;
        };
        Insert: {
          id?: string;
          system_id: string;
          reading_type: string;
          reading_value?: number | null;
          unit?: string | null;
          source?: string | null;
          metadata?: Json | null;
        };
        Update: {
          id?: string;
          system_id?: string;
          reading_type?: string;
          reading_value?: number | null;
          unit?: string | null;
          source?: string | null;
          metadata?: Json | null;
        };
        Relationships: [];
      };
      badges: {
        Row: {
          id: string;
          code: string;
          name: string;
          description: string | null;
          badge_type: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          name: string;
          description?: string | null;
          badge_type?: string | null;
        };
        Update: {
          id?: string;
          code?: string;
          name?: string;
          description?: string | null;
          badge_type?: string | null;
        };
        Relationships: [];
      };
      user_badges: {
        Row: {
          id: string;
          user_id: string;
          badge_id: string;
          awarded_at: string;
          reason: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          badge_id: string;
          reason?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          badge_id?: string;
          reason?: string | null;
        };
        Relationships: [];
      };
      leaderboard_entries: {
        Row: {
          id: string;
          user_id: string;
          leaderboard_type: string;
          period_start: string;
          period_end: string;
          score: number;
          rank: number | null;
          metadata: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          leaderboard_type: string;
          period_start: string;
          period_end: string;
          score?: number;
          rank?: number | null;
          metadata?: Json | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          leaderboard_type?: string;
          period_start?: string;
          period_end?: string;
          score?: number;
          rank?: number | null;
          metadata?: Json | null;
        };
        Relationships: [];
      };
      receipts: {
        Row: {
          id: string;
          property_id: string;
          project_id: string | null;
          merchant_name: string | null;
          amount: number | null;
          purchase_date: string | null;
          file_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          property_id: string;
          project_id?: string | null;
          merchant_name?: string | null;
          amount?: number | null;
          purchase_date?: string | null;
          file_url?: string | null;
        };
        Update: {
          id?: string;
          property_id?: string;
          project_id?: string | null;
          merchant_name?: string | null;
          amount?: number | null;
          purchase_date?: string | null;
          file_url?: string | null;
        };
        Relationships: [];
      };
      warranties: {
        Row: {
          id: string;
          property_id: string;
          system_id: string | null;
          provider: string | null;
          coverage_type: string | null;
          start_date: string | null;
          end_date: string | null;
          document_id: string | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          property_id: string;
          system_id?: string | null;
          provider?: string | null;
          coverage_type?: string | null;
          start_date?: string | null;
          end_date?: string | null;
          document_id?: string | null;
          notes?: string | null;
        };
        Update: {
          id?: string;
          property_id?: string;
          system_id?: string | null;
          provider?: string | null;
          coverage_type?: string | null;
          start_date?: string | null;
          end_date?: string | null;
          document_id?: string | null;
          notes?: string | null;
        };
        Relationships: [];
      };
      inspections: {
        Row: {
          id: string;
          property_id: string;
          inspection_type: string;
          performed_by: string | null;
          inspection_date: string;
          summary: string | null;
          score: number | null;
          document_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          property_id: string;
          inspection_type: string;
          performed_by?: string | null;
          inspection_date: string;
          summary?: string | null;
          score?: number | null;
          document_id?: string | null;
        };
        Update: {
          id?: string;
          property_id?: string;
          inspection_type?: string;
          performed_by?: string | null;
          inspection_date?: string;
          summary?: string | null;
          score?: number | null;
          document_id?: string | null;
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
