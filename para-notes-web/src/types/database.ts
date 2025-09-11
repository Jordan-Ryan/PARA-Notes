export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          preferences: Record<string, unknown> | null;
          created_at: string;
          updated_at: string;
          last_login_at: string | null;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          preferences?: Record<string, unknown> | null;
          created_at?: string;
          updated_at?: string;
          last_login_at?: string | null;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          preferences?: Record<string, unknown> | null;
          created_at?: string;
          updated_at?: string;
          last_login_at?: string | null;
        };
      };
      para_items: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          category: 'projects' | 'areas' | 'resources' | 'archive';
          status: 'active' | 'completed' | 'archived';
          priority: 'low' | 'medium' | 'high';
          due_date: string | null;
          created_at: string;
          updated_at: string;
          user_id: string;
          tags: string[];
          metadata: Record<string, unknown> | null;
          // Project specific fields
          deadline?: string | null;
          progress?: number | null;
          parent_area_id?: string | null;
          next_actions?: string[] | null;
          waiting_for?: string | null;
          // Area specific fields
          standards?: string[] | null;
          review_frequency?: 'daily' | 'weekly' | 'monthly' | 'quarterly' | null;
          last_reviewed?: string | null;
          // Resource specific fields
          url?: string | null;
          type?: 'article' | 'book' | 'video' | 'course' | 'tool' | 'other' | null;
          author?: string | null;
          source?: string | null;
          is_read?: boolean | null;
          rating?: number | null;
          // Archive specific fields
          archived_at?: string | null;
          reason?: string | null;
          original_category?: 'projects' | 'areas' | 'resources' | 'archive' | null;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          category: 'projects' | 'areas' | 'resources' | 'archive';
          status?: 'active' | 'completed' | 'archived';
          priority?: 'low' | 'medium' | 'high';
          due_date?: string | null;
          created_at?: string;
          updated_at?: string;
          user_id: string;
          tags?: string[];
          metadata?: Record<string, unknown> | null;
          // Project specific fields
          deadline?: string | null;
          progress?: number | null;
          parent_area_id?: string | null;
          next_actions?: string[] | null;
          waiting_for?: string | null;
          // Area specific fields
          standards?: string[] | null;
          review_frequency?: 'daily' | 'weekly' | 'monthly' | 'quarterly' | null;
          last_reviewed?: string | null;
          // Resource specific fields
          url?: string | null;
          type?: 'article' | 'book' | 'video' | 'course' | 'tool' | 'other' | null;
          author?: string | null;
          source?: string | null;
          is_read?: boolean | null;
          rating?: number | null;
          // Archive specific fields
          archived_at?: string | null;
          reason?: string | null;
          original_category?: 'projects' | 'areas' | 'resources' | 'archive' | null;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          category?: 'projects' | 'areas' | 'resources' | 'archive';
          status?: 'active' | 'completed' | 'archived';
          priority?: 'low' | 'medium' | 'high';
          due_date?: string | null;
          created_at?: string;
          updated_at?: string;
          user_id?: string;
          tags?: string[];
          metadata?: Record<string, unknown> | null;
          // Project specific fields
          deadline?: string | null;
          progress?: number | null;
          parent_area_id?: string | null;
          next_actions?: string[] | null;
          waiting_for?: string | null;
          // Area specific fields
          standards?: string[] | null;
          review_frequency?: 'daily' | 'weekly' | 'monthly' | 'quarterly' | null;
          last_reviewed?: string | null;
          // Resource specific fields
          url?: string | null;
          type?: 'article' | 'book' | 'video' | 'course' | 'tool' | 'other' | null;
          author?: string | null;
          source?: string | null;
          is_read?: boolean | null;
          rating?: number | null;
          // Archive specific fields
          archived_at?: string | null;
          reason?: string | null;
          original_category?: 'projects' | 'areas' | 'resources' | 'archive' | null;
        };
      };
      notes: {
        Row: {
          id: string;
          title: string;
          content: string;
          category: 'projects' | 'areas' | 'resources' | 'archive';
          para_item_id: string | null;
          tags: string[];
          is_encrypted: boolean;
          is_pinned: boolean;
          created_at: string;
          updated_at: string;
          user_id: string;
          version: number;
          metadata: Record<string, unknown> | null;
        };
        Insert: {
          id?: string;
          title: string;
          content: string;
          category: 'projects' | 'areas' | 'resources' | 'archive';
          para_item_id?: string | null;
          tags?: string[];
          is_encrypted?: boolean;
          is_pinned?: boolean;
          created_at?: string;
          updated_at?: string;
          user_id: string;
          version?: number;
          metadata?: Record<string, unknown> | null;
        };
        Update: {
          id?: string;
          title?: string;
          content?: string;
          category?: 'projects' | 'areas' | 'resources' | 'archive';
          para_item_id?: string | null;
          tags?: string[];
          is_encrypted?: boolean;
          is_pinned?: boolean;
          created_at?: string;
          updated_at?: string;
          user_id?: string;
          version?: number;
          metadata?: Record<string, unknown> | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
