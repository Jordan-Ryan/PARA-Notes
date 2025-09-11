export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      notes: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          content: string;
          para_category: ParaCategory;
          para_area: string | null;
          para_project: string | null;
          para_resource: string | null;
          tags: string[];
          is_encrypted: boolean;
          created_at: string;
          updated_at: string;
          synced_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          content: string;
          para_category: ParaCategory;
          para_area?: string | null;
          para_project?: string | null;
          para_resource?: string | null;
          tags?: string[];
          is_encrypted?: boolean;
          created_at?: string;
          updated_at?: string;
          synced_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          content?: string;
          para_category?: ParaCategory;
          para_area?: string | null;
          para_project?: string | null;
          para_resource?: string | null;
          tags?: string[];
          is_encrypted?: boolean;
          created_at?: string;
          updated_at?: string;
          synced_at?: string | null;
        };
      };
      para_areas: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string | null;
          color: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description?: string | null;
          color: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          description?: string | null;
          color?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      para_projects: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string | null;
          area_id: string | null;
          status: ProjectStatus;
          due_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description?: string | null;
          area_id?: string | null;
          status?: ProjectStatus;
          due_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          description?: string | null;
          area_id?: string | null;
          status?: ProjectStatus;
          due_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      para_resources: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string | null;
          url: string | null;
          type: ResourceType;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description?: string | null;
          url?: string | null;
          type?: ResourceType;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          description?: string | null;
          url?: string | null;
          type?: ResourceType;
          created_at?: string;
          updated_at?: string;
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
      para_category: ParaCategory;
      project_status: ProjectStatus;
      resource_type: ResourceType;
    };
  };
}

export type ParaCategory = 'projects' | 'areas' | 'resources' | 'archive';
export type ProjectStatus = 'active' | 'on_hold' | 'completed' | 'cancelled';
export type ResourceType = 'book' | 'article' | 'video' | 'podcast' | 'website' | 'other';

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T];
