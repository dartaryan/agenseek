// ============================================
// Guide Votes Service
// Story 11.9 - Bookmark and Helpful Feedback Functionality
// ============================================

import { supabase } from './supabase';

/**
 * Guide vote data structure
 */
export interface GuideVote {
  id: string;
  user_id: string;
  guide_slug: string;
  is_helpful: boolean;
  created_at: string;
}

/**
 * Guide feedback statistics
 */
export interface GuideFeedbackStats {
  helpful: number;
  notHelpful: number;
  total: number;
  ratio: number; // Helpful percentage (0-100)
}

/**
 * Check if user has voted on a guide
 * Returns true if voted helpful, false if voted not helpful, null if not voted
 */
export async function hasUserVoted(
  userId: string,
  guideSlug: string
): Promise<boolean | null> {
  const { data, error } = await supabase
    .from('guide_votes')
    .select('is_helpful')
    .eq('user_id', userId)
    .eq('guide_slug', guideSlug)
    .maybeSingle();

  if (error) {
    console.error('Error checking vote status:', error);
    return null;
  }

  if (!data) return null;
  return data.is_helpful;
}

/**
 * Submit a vote (helpful or not helpful)
 * Throws error if user has already voted
 */
export async function submitVote(
  userId: string,
  guideSlug: string,
  isHelpful: boolean
): Promise<void> {
  // Check if already voted
  const existingVote = await hasUserVoted(userId, guideSlug);
  if (existingVote !== null) {
    throw new Error('כבר דירגת את המדריך הזה');
  }

  // Insert vote
  const { error: voteError } = await supabase.from('guide_votes').insert({
    user_id: userId,
    guide_slug: guideSlug,
    is_helpful: isHelpful,
  });

  if (voteError) {
    console.error('Error inserting vote:', voteError);
    throw voteError;
  }

  // Update stats using database function
  const functionName = isHelpful
    ? 'increment_helpful_votes'
    : 'increment_not_helpful_votes';

  const { error: statsError } = await supabase.rpc(functionName, {
    guide_slug_param: guideSlug,
  });

  if (statsError) {
    console.error('Error updating guide stats:', statsError);
    throw statsError;
  }
}

/**
 * Get feedback statistics for a guide
 */
export async function getGuideFeedbackStats(
  guideSlug: string
): Promise<GuideFeedbackStats> {
  const { data, error } = await supabase
    .from('guide_stats')
    .select('helpful_votes, not_helpful_votes')
    .eq('guide_slug', guideSlug)
    .maybeSingle();

  if (error || !data) {
    return {
      helpful: 0,
      notHelpful: 0,
      total: 0,
      ratio: 0,
    };
  }

  const helpful = data.helpful_votes || 0;
  const notHelpful = data.not_helpful_votes || 0;
  const total = helpful + notHelpful;
  const ratio = total > 0 ? (helpful / total) * 100 : 0;

  return {
    helpful,
    notHelpful,
    total,
    ratio: Math.round(ratio),
  };
}

/**
 * Get all votes for a user (for analytics)
 */
export async function getUserVotes(userId: string): Promise<GuideVote[]> {
  const { data, error } = await supabase
    .from('guide_votes')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching user votes:', error);
    throw error;
  }

  return data || [];
}

/**
 * Get vote counts for multiple guides (for admin analytics)
 */
export async function getMultipleGuidesStats(
  guideSlugs: string[]
): Promise<Record<string, GuideFeedbackStats>> {
  const { data, error } = await supabase
    .from('guide_stats')
    .select('guide_slug, helpful_votes, not_helpful_votes')
    .in('guide_slug', guideSlugs);

  if (error) {
    console.error('Error fetching multiple guide stats:', error);
    return {};
  }

  const statsMap: Record<string, GuideFeedbackStats> = {};

  data?.forEach((stat) => {
    const helpful = stat.helpful_votes || 0;
    const notHelpful = stat.not_helpful_votes || 0;
    const total = helpful + notHelpful;
    const ratio = total > 0 ? (helpful / total) * 100 : 0;

    statsMap[stat.guide_slug] = {
      helpful,
      notHelpful,
      total,
      ratio: Math.round(ratio),
    };
  });

  return statsMap;
}

