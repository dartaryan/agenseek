import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { CommentWithProfile, CommentWithReplies, CommentSort } from '@/types/comments';
import type { RealtimeChannel } from '@supabase/supabase-js';

/**
 * Hook to fetch and manage guide comments with real-time updates
 */
export function useComments(
  guideSlug: string,
  sortBy: CommentSort = 'recent',
  showQuestionsOnly: boolean = false
) {
  const [comments, setComments] = useState<CommentWithReplies[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);
  const COMMENTS_PER_PAGE = 20;

  // Fetch comments with user profiles
  const fetchComments = useCallback(async (pageNum: number = 1) => {
    try {
      setLoading(true);
      setError(null);

      // Determine sort order
      let orderColumn: string;
      let orderAscending = false;

      switch (sortBy) {
        case 'most_helpful':
          orderColumn = 'helpful_count';
          break;
        case 'oldest':
          orderColumn = 'created_at';
          orderAscending = true;
          break;
        case 'recent':
        default:
          orderColumn = 'created_at';
          break;
      }

      // Build query for top-level comments (no parent)
      let query = supabase
        .from('guide_comments')
        .select(`
          *,
          profile:profiles!guide_comments_user_id_fkey(
            id,
            display_name,
            role
          )
        `, { count: 'exact' })
        .eq('guide_slug', guideSlug)
        .is('parent_comment_id', null);

      // Apply question filter if enabled
      if (showQuestionsOnly) {
        query = query.eq('is_question', true);
      }

      // Apply sorting and pagination
      const { data: topLevelComments, error: fetchError, count } = await query
        .order(orderColumn, { ascending: orderAscending })
        .range((pageNum - 1) * COMMENTS_PER_PAGE, pageNum * COMMENTS_PER_PAGE - 1);

      if (fetchError) throw fetchError;

      // Fetch replies for each top-level comment
      const commentsWithReplies: CommentWithReplies[] = await Promise.all(
        (topLevelComments || []).map(async (comment) => {
          const { data: replies, error: repliesError } = await supabase
            .from('guide_comments')
            .select(`
              *,
              profile:profiles!guide_comments_user_id_fkey(
                id,
                display_name,
                role
              )
            `)
            .eq('parent_comment_id', comment.id)
            .order('created_at', { ascending: true });

          if (repliesError) {
            console.error('Error fetching replies:', repliesError);
            return {
              ...comment,
              profile: comment.profile,
              replies: [],
              reply_count: 0,
            };
          }

          return {
            ...comment,
            profile: comment.profile,
            replies: replies || [],
            reply_count: replies?.length || 0,
          };
        })
      );

      // Update state
      if (pageNum === 1) {
        setComments(commentsWithReplies);
      } else {
        setComments((prev) => [...prev, ...commentsWithReplies]);
      }

      // Check if there are more comments
      const totalFetched = pageNum * COMMENTS_PER_PAGE;
      setHasMore(count ? totalFetched < count : false);
      setPage(pageNum);
    } catch (err) {
      console.error('Error fetching comments:', err);
      setError(err instanceof Error ? err.message : 'שגיאה בטעינת תגובות');
    } finally {
      setLoading(false);
    }
  }, [guideSlug, sortBy, showQuestionsOnly]);

  // Load more comments
  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchComments(page + 1);
    }
  }, [loading, hasMore, page, fetchComments]);

  // Refresh comments (e.g., after posting)
  const refresh = useCallback(() => {
    fetchComments(1);
  }, [fetchComments]);

  // Initial fetch
  useEffect(() => {
    fetchComments(1);
  }, [fetchComments]);

  // Set up real-time subscription for new comments
  useEffect(() => {
    const channel: RealtimeChannel = supabase
      .channel(`comments:${guideSlug}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'guide_comments',
          filter: `guide_slug=eq.${guideSlug}`,
        },
        async (payload) => {
          // Fetch the new comment with profile data
          const { data: newComment } = await supabase
            .from('guide_comments')
            .select(`
              *,
              profile:profiles!guide_comments_user_id_fkey(
                id,
                display_name,
                role
              )
            `)
            .eq('id', payload.new.id)
            .single();

          if (newComment) {
            const commentWithProfile = newComment as CommentWithProfile;

            // If it's a reply, add to parent's replies
            if (commentWithProfile.parent_comment_id) {
              setComments((prev) =>
                prev.map((comment) =>
                  comment.id === commentWithProfile.parent_comment_id
                    ? {
                        ...comment,
                        replies: [...comment.replies, commentWithProfile],
                        reply_count: comment.reply_count + 1,
                      }
                    : comment
                )
              );
            } else {
              // Top-level comment - add to list
              const newCommentWithReplies: CommentWithReplies = {
                ...commentWithProfile,
                replies: [],
                reply_count: 0,
              };
              setComments((prev) => [newCommentWithReplies, ...prev]);
            }
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'guide_comments',
          filter: `guide_slug=eq.${guideSlug}`,
        },
        async (payload) => {
          // Fetch updated comment with profile
          const { data: updatedComment } = await supabase
            .from('guide_comments')
            .select(`
              *,
              profile:profiles!guide_comments_user_id_fkey(
                id,
                display_name,
                role
              )
            `)
            .eq('id', payload.new.id)
            .single();

          if (updatedComment) {
            const commentWithProfile = updatedComment as CommentWithProfile;

            // Update in replies or top-level
            if (commentWithProfile.parent_comment_id) {
              setComments((prev) =>
                prev.map((comment) =>
                  comment.id === commentWithProfile.parent_comment_id
                    ? {
                        ...comment,
                        replies: comment.replies.map((reply) =>
                          reply.id === commentWithProfile.id
                            ? commentWithProfile
                            : reply
                        ),
                      }
                    : comment
                )
              );
            } else {
              setComments((prev) =>
                prev.map((comment) =>
                  comment.id === commentWithProfile.id
                    ? { ...comment, ...commentWithProfile }
                    : comment
                )
              );
            }
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'guide_comments',
          filter: `guide_slug=eq.${guideSlug}`,
        },
        (payload) => {
          const deletedId = payload.old.id;

          // Remove from replies or top-level
          setComments((prev) => {
            // Remove from top-level
            const filtered = prev.filter((comment) => comment.id !== deletedId);

            // Remove from replies
            return filtered.map((comment) => ({
              ...comment,
              replies: comment.replies.filter((reply) => reply.id !== deletedId),
              reply_count: comment.replies.filter((reply) => reply.id !== deletedId)
                .length,
            }));
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [guideSlug]);

  return {
    comments,
    loading,
    error,
    hasMore,
    loadMore,
    refresh,
    totalCount: comments.reduce(
      (sum, comment) => sum + 1 + comment.reply_count,
      0
    ),
  };
}

/**
 * Hook to check if current user has voted on a comment
 */
export function useCommentVote(commentId: string, userId: string | undefined) {
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setHasVoted(false);
      setLoading(false);
      return;
    }

    const checkVote = async () => {
      const { data } = await supabase
        .from('comment_votes')
        .select('id')
        .eq('comment_id', commentId)
        .eq('user_id', userId)
        .single();

      setHasVoted(!!data);
      setLoading(false);
    };

    checkVote();
  }, [commentId, userId]);

  return { hasVoted, loading };
}

