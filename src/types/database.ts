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
          hebrew_name_suggestion_dismissed: boolean;
          avatar_style: string;
          avatar_seed: string | null;
          avatar_options: Json;
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
          hebrew_name_suggestion_dismissed?: boolean;
          avatar_style?: string;
          avatar_seed?: string | null;
          avatar_options?: Json;
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
          hebrew_name_suggestion_dismissed?: boolean;
          avatar_style?: string;
          avatar_seed?: string | null;
          avatar_options?: Json;
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
          progress_before_completion: number | null; // Story 5.1.2
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
          progress_before_completion?: number | null; // Story 5.1.2
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
          progress_before_completion?: number | null; // Story 5.1.2
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
      user_achievements: {
        Row: {
          id: string;
          user_id: string;
          badge_id: string;
          badge_type: 'milestone' | 'streak' | 'skill' | 'special';
          progress_current: number;
          progress_target: number;
          earned: boolean;
          earned_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          badge_id: string;
          badge_type: 'milestone' | 'streak' | 'skill' | 'special';
          progress_current?: number;
          progress_target?: number;
          earned?: boolean;
          earned_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          badge_id?: string;
          badge_type?: 'milestone' | 'streak' | 'skill' | 'special';
          progress_current?: number;
          progress_target?: number;
          earned?: boolean;
          earned_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'user_achievements_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      notifications: {
        Row: {
          id: string;
          recipient_id: string;
          actor_id: string;
          type: 'comment_reply' | 'solution_marked';
          guide_slug: string;
          comment_id: string;
          reply_id: string | null;
          comment_preview: string | null;
          is_read: boolean;
          created_at: string;
          read_at: string | null;
        };
        Insert: {
          id?: string;
          recipient_id: string;
          actor_id: string;
          type: 'comment_reply' | 'solution_marked';
          guide_slug: string;
          comment_id: string;
          reply_id?: string | null;
          comment_preview?: string | null;
          is_read?: boolean;
          created_at?: string;
          read_at?: string | null;
        };
        Update: {
          id?: string;
          recipient_id?: string;
          actor_id?: string;
          type?: 'comment_reply' | 'solution_marked';
          guide_slug?: string;
          comment_id?: string;
          reply_id?: string | null;
          comment_preview?: string | null;
          is_read?: boolean;
          created_at?: string;
          read_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'notifications_recipient_id_fkey';
            columns: ['recipient_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'notifications_actor_id_fkey';
            columns: ['actor_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'notifications_comment_id_fkey';
            columns: ['comment_id'];
            referencedRelation: 'guide_comments';
            referencedColumns: ['id'];
          },
        ];
      };
      admin_notifications: {
        Row: {
          id: string;
          type: 'new_user_digest' | 'content_flagged' | 'low_engagement' | 'performance_issue' | 'milestone';
          priority: 'high' | 'normal' | 'low';
          title: string;
          message: string;
          related_user_id: string | null;
          related_guide_slug: string | null;
          related_comment_id: string | null;
          metadata: Json;
          action_url: string | null;
          action_label: string | null;
          is_read: boolean;
          read_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          type: 'new_user_digest' | 'content_flagged' | 'low_engagement' | 'performance_issue' | 'milestone';
          priority?: 'high' | 'normal' | 'low';
          title: string;
          message: string;
          related_user_id?: string | null;
          related_guide_slug?: string | null;
          related_comment_id?: string | null;
          metadata?: Json;
          action_url?: string | null;
          action_label?: string | null;
          is_read?: boolean;
          read_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          type?: 'new_user_digest' | 'content_flagged' | 'low_engagement' | 'performance_issue' | 'milestone';
          priority?: 'high' | 'normal' | 'low';
          title?: string;
          message?: string;
          related_user_id?: string | null;
          related_guide_slug?: string | null;
          related_comment_id?: string | null;
          metadata?: Json;
          action_url?: string | null;
          action_label?: string | null;
          is_read?: boolean;
          read_at?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'admin_notifications_related_user_id_fkey';
            columns: ['related_user_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'admin_notifications_related_comment_id_fkey';
            columns: ['related_comment_id'];
            referencedRelation: 'guide_comments';
            referencedColumns: ['id'];
          },
        ];
      };
      admin_notification_preferences: {
        Row: {
          id: string;
          admin_id: string;
          new_user_digest_enabled: boolean;
          new_user_digest_frequency: string;
          content_flagged_enabled: boolean;
          content_flagged_frequency: string;
          low_engagement_enabled: boolean;
          low_engagement_frequency: string;
          performance_issues_enabled: boolean;
          performance_issues_frequency: string;
          milestones_enabled: boolean;
          milestones_frequency: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          admin_id: string;
          new_user_digest_enabled?: boolean;
          new_user_digest_frequency?: string;
          content_flagged_enabled?: boolean;
          content_flagged_frequency?: string;
          low_engagement_enabled?: boolean;
          low_engagement_frequency?: string;
          performance_issues_enabled?: boolean;
          performance_issues_frequency?: string;
          milestones_enabled?: boolean;
          milestones_frequency?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          admin_id?: string;
          new_user_digest_enabled?: boolean;
          new_user_digest_frequency?: string;
          content_flagged_enabled?: boolean;
          content_flagged_frequency?: string;
          low_engagement_enabled?: boolean;
          low_engagement_frequency?: string;
          performance_issues_enabled?: boolean;
          performance_issues_frequency?: string;
          milestones_enabled?: boolean;
          milestones_frequency?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'admin_notification_preferences_admin_id_fkey';
            columns: ['admin_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      admin_action_log: {
        Row: {
          id: string;
          admin_id: string;
          action_type: string;
          action_category: string;
          target_type: string | null;
          target_id: string | null;
          target_label: string | null;
          description: string;
          metadata: Json;
          ip_address: string | null;
          user_agent: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          admin_id: string;
          action_type: string;
          action_category?: string;
          target_type?: string | null;
          target_id?: string | null;
          target_label?: string | null;
          description: string;
          metadata?: Json;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          admin_id?: string;
          action_type?: string;
          action_category?: string;
          target_type?: string | null;
          target_id?: string | null;
          target_label?: string | null;
          description?: string;
          metadata?: Json;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'admin_action_log_admin_id_fkey';
            columns: ['admin_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      bug_reports: {
        Row: {
          id: string;
          user_id: string | null;
          email: string;
          title: string;
          description: string;
          location: string | null;
          status: 'new' | 'in_progress' | 'resolved' | 'closed';
          created_at: string;
          resolved_at: string | null;
          admin_notes: string | null;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          email: string;
          title: string;
          description: string;
          location?: string | null;
          status?: 'new' | 'in_progress' | 'resolved' | 'closed';
          created_at?: string;
          resolved_at?: string | null;
          admin_notes?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          email?: string;
          title?: string;
          description?: string;
          location?: string | null;
          status?: 'new' | 'in_progress' | 'resolved' | 'closed';
          created_at?: string;
          resolved_at?: string | null;
          admin_notes?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'bug_reports_user_id_fkey';
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
      increment_guide_views: {
        Args: {
          p_guide_slug: string;
        };
        Returns: void;
      };
      increment_guide_completion: {
        Args: {
          p_guide_slug: string;
        };
        Returns: void;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
