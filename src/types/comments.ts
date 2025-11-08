import type { Database } from './database';

// Base comment type from database
export type GuideComment = Database['public']['Tables']['guide_comments']['Row'];
export type CommentInsert = Database['public']['Tables']['guide_comments']['Insert'];
export type CommentUpdate = Database['public']['Tables']['guide_comments']['Update'];

// Comment with user profile information
export interface CommentWithProfile extends GuideComment {
  profile: {
    id: string;
    display_name: string;
    role: string | null;
  };
}

// Comment with replies for threading
export interface CommentWithReplies extends CommentWithProfile {
  replies: CommentWithProfile[];
  reply_count: number;
}

// Comment sort options
export type CommentSort = 'recent' | 'most_helpful' | 'oldest';

// Comment vote type
export type CommentVote = Database['public']['Tables']['comment_votes']['Row'];
export type CommentVoteInsert = Database['public']['Tables']['comment_votes']['Insert'];

