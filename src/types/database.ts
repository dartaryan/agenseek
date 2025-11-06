export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string;
          email: string;
          role: string | null;
          interests: string[];
          experience_level: 'beginner' | 'intermediate' | 'advanced' | null;
          theme: 'light' | 'dark' | 'system';
          language: 'he';
          completed_onboarding: boolean;
          onboarded_at: string | null;
          is_admin: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name: string;
          email: string;
          role?: string | null;
          interests?: string[];
          experience_level?: 'beginner' | 'intermediate' | 'advanced' | null;
          theme?: 'light' | 'dark' | 'system';
          language?: 'he';
          completed_onboarding?: boolean;
          onboarded_at?: string | null;
          is_admin?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          display_name?: string;
          email?: string;
          role?: string | null;
          interests?: string[];
          experience_level?: 'beginner' | 'intermediate' | 'advanced' | null;
          theme?: 'light' | 'dark' | 'system';
          language?: 'he';
          completed_onboarding?: boolean;
          onboarded_at?: string | null;
          is_admin?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      user_progress: {
        Row: {
          id: string;
          user_id: string;
          guide_slug: string;
          guide_category: string;
          completed: boolean;
          progress_percent: number;
          last_position: string | null;
          time_spent_seconds: number;
          last_read_at: string;
          completed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          guide_slug: string;
          guide_category: string;
          completed?: boolean;
          progress_percent?: number;
          last_position?: string | null;
          time_spent_seconds?: number;
          last_read_at?: string;
          completed_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          guide_slug?: string;
          guide_category?: string;
          completed?: boolean;
          progress_percent?: number;
          last_position?: string | null;
          time_spent_seconds?: number;
          last_read_at?: string;
          completed_at?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'user_progress_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      user_notes: {
        Row: {
          id: string;
          user_id: string;
          guide_slug: string | null;
          title: string;
          content: Json;
          tags: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          guide_slug?: string | null;
          title: string;
          content: Json;
          tags?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          guide_slug?: string | null;
          title?: string;
          content?: Json;
          tags?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'user_notes_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      user_tasks: {
        Row: {
          id: string;
          user_id: string;
          guide_slug: string | null;
          parent_task_id: string | null;
          title: string;
          description: string | null;
          status: 'todo' | 'in_progress' | 'done';
          priority: 'high' | 'medium' | 'low';
          position: number;
          completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          guide_slug?: string | null;
          parent_task_id?: string | null;
          title: string;
          description?: string | null;
          status?: 'todo' | 'in_progress' | 'done';
          priority?: 'high' | 'medium' | 'low';
          position?: number;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          guide_slug?: string | null;
          parent_task_id?: string | null;
          title?: string;
          description?: string | null;
          status?: 'todo' | 'in_progress' | 'done';
          priority?: 'high' | 'medium' | 'low';
          position?: number;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'user_tasks_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'user_tasks_parent_task_id_fkey';
            columns: ['parent_task_id'];
            referencedRelation: 'user_tasks';
            referencedColumns: ['id'];
          },
        ];
      };
      guide_comments: {
        Row: {
          id: string;
          user_id: string;
          guide_slug: string;
          parent_comment_id: string | null;
          content: string;
          is_question: boolean;
          is_solution: boolean;
          helpful_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          guide_slug: string;
          parent_comment_id?: string | null;
          content: string;
          is_question?: boolean;
          is_solution?: boolean;
          helpful_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          guide_slug?: string;
          parent_comment_id?: string | null;
          content?: string;
          is_question?: boolean;
          is_solution?: boolean;
          helpful_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'guide_comments_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'guide_comments_parent_comment_id_fkey';
            columns: ['parent_comment_id'];
            referencedRelation: 'guide_comments';
            referencedColumns: ['id'];
          },
        ];
      };
      comment_votes: {
        Row: {
          id: string;
          user_id: string;
          comment_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          comment_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          comment_id?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'comment_votes_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'comment_votes_comment_id_fkey';
            columns: ['comment_id'];
            referencedRelation: 'guide_comments';
            referencedColumns: ['id'];
          },
        ];
      };
      guide_stats: {
        Row: {
          guide_slug: string;
          view_count: number;
          unique_viewers: number;
          helpful_votes: number;
          not_helpful_votes: number;
          avg_time_spent_seconds: number;
          completion_count: number;
          comment_count: number;
          updated_at: string;
        };
        Insert: {
          guide_slug: string;
          view_count?: number;
          unique_viewers?: number;
          helpful_votes?: number;
          not_helpful_votes?: number;
          avg_time_spent_seconds?: number;
          completion_count?: number;
          comment_count?: number;
          updated_at?: string;
        };
        Update: {
          guide_slug?: string;
          view_count?: number;
          unique_viewers?: number;
          helpful_votes?: number;
          not_helpful_votes?: number;
          avg_time_spent_seconds?: number;
          completion_count?: number;
          comment_count?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      user_activity: {
        Row: {
          id: string;
          user_id: string;
          activity_type: string;
          target_slug: string | null;
          metadata: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          activity_type: string;
          target_slug?: string | null;
          metadata?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          activity_type?: string;
          target_slug?: string | null;
          metadata?: Json | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'user_activity_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      guide_bookmarks: {
        Row: {
          id: string;
          user_id: string;
          guide_slug: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          guide_slug: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          guide_slug?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'guide_bookmarks_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
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
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
