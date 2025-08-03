export interface Database {
  public: {
    Tables: {
      presentations: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          content_input: any | null;
          content_analysis: any | null;
          visual_suggestions: any;
          selected_suggestion_id: string | null;
          selected_theme: string | null;
          status: 'draft' | 'processing' | 'completed' | 'error';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title?: string;
          description?: string | null;
          content_input?: any | null;
          content_analysis?: any | null;
          visual_suggestions?: any;
          selected_suggestion_id?: string | null;
          selected_theme?: string | null;
          status?: 'draft' | 'processing' | 'completed' | 'error';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string | null;
          content_input?: any | null;
          content_analysis?: any | null;
          visual_suggestions?: any;
          selected_suggestion_id?: string | null;
          selected_theme?: string | null;
          status?: 'draft' | 'processing' | 'completed' | 'error';
          created_at?: string;
          updated_at?: string;
        };
      };
      presentation_pages: {
        Row: {
          id: string;
          presentation_id: string;
          page_index: number;
          title: string;
          content: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          presentation_id: string;
          page_index?: number;
          title?: string;
          content?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          presentation_id?: string;
          page_index?: number;
          title?: string;
          content?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      ai_analysis_cache: {
        Row: {
          id: string;
          content_hash: string;
          analysis_result: any;
          created_at: string;
          expires_at: string;
        };
        Insert: {
          id?: string;
          content_hash: string;
          analysis_result: any;
          created_at?: string;
          expires_at?: string;
        };
        Update: {
          id?: string;
          content_hash?: string;
          analysis_result?: any;
          created_at?: string;
          expires_at?: string;
        };
      };
      admin_users: {
        Row: {
          id: string;
          user_id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          role: 'admin' | 'super_admin' | 'editor';
          permissions: any;
          provider: string;
          is_auto_created: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: 'admin' | 'super_admin' | 'editor';
          permissions?: any;
          provider?: string;
          is_auto_created?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: 'admin' | 'super_admin' | 'editor';
          permissions?: any;
          provider?: string;
          is_auto_created?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      narrative_flows: {
        Row: {
          id: string;
          name: string;
          description: string;
          flow_structure: any;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string;
          flow_structure?: any;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          flow_structure?: any;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      page_layouts: {
        Row: {
          id: string;
          name: string;
          description: string;
          layout_config: any;
          preview_image: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string;
          layout_config?: any;
          preview_image?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          layout_config?: any;
          preview_image?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      visual_metaphors: {
        Row: {
          id: string;
          name: string;
          description: string;
          metaphor_data: any;
          tags: string[];
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string;
          metaphor_data?: any;
          tags?: string[];
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          metaphor_data?: any;
          tags?: string[];
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      smart_icons: {
        Row: {
          id: string;
          name: string;
          description: string;
          svg_content: string;
          keywords: string[];
          category: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string;
          svg_content: string;
          keywords?: string[];
          category?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          svg_content?: string;
          keywords?: string[];
          category?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      page_compositions: {
        Row: {
          id: string;
          name: string;
          description: string;
          composition_rules: any;
          visual_hierarchy: any;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string;
          composition_rules?: any;
          visual_hierarchy?: any;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          composition_rules?: any;
          visual_hierarchy?: any;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      svg_imports: {
        Row: {
          id: string;
          filename: string;
          svg_content: string;
          description: string;
          tags: string[];
          import_source: string;
          is_processed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          filename: string;
          svg_content: string;
          description?: string;
          tags?: string[];
          import_source?: string;
          is_processed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          filename?: string;
          svg_content?: string;
          description?: string;
          tags?: string[];
          import_source?: string;
          is_processed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
