import { supabase } from '@/lib/supabase';
import type { CommentInsert } from '@/types/comments';

/**
 * Submit a comment or reply to a guide
 */
export async function submitComment(data: {
  userId: string;
  guideSlug: string;
  content: string;
  isQuestion: boolean;
  parentCommentId?: string | null;
}): Promise<{ success: boolean; commentId?: string; error?: string }> {
  try {
    // Validate content
    if (!data.content || data.content.trim().length === 0) {
      return {
        success: false,
        error: 'התגובה לא יכולה להיות ריקה',
      };
    }

    if (data.content.length > 5000) {
      return {
        success: false,
        error: 'חרגת ממספר התווים המותר (5000)',
      };
    }

    // Prepare comment data
    const commentData: CommentInsert = {
      user_id: data.userId,
      guide_slug: data.guideSlug,
      content: data.content.trim(),
      is_question: data.isQuestion,
      parent_comment_id: data.parentCommentId || null,
      helpful_count: 0,
      is_solution: false,
    };

    // Insert comment
    const { data: newComment, error: insertError } = await supabase
      .from('guide_comments')
      .insert([commentData])
      .select('id')
      .single();

    if (insertError) {
      console.error('Error inserting comment:', insertError);
      return {
        success: false,
        error: 'שגיאה בפרסום התגובה',
      };
    }

    // Log activity
    await logCommentActivity({
      userId: data.userId,
      guideSlug: data.guideSlug,
      commentId: newComment.id,
      parentCommentId: data.parentCommentId,
    });

    return {
      success: true,
      commentId: newComment.id,
    };
  } catch (err) {
    console.error('Error submitting comment:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'שגיאה בפרסום התגובה',
    };
  }
}

/**
 * Log comment activity to user_activity table
 */
async function logCommentActivity(data: {
  userId: string;
  guideSlug: string;
  commentId: string;
  parentCommentId?: string | null;
}): Promise<void> {
  try {
    await supabase.from('user_activity').insert([
      {
        user_id: data.userId,
        activity_type: 'comment_posted',
        guide_slug: data.guideSlug,
        metadata: {
          comment_id: data.commentId,
          parent_comment_id: data.parentCommentId,
          is_reply: !!data.parentCommentId,
        },
      },
    ]);
  } catch (err) {
    // Don't fail the comment submission if activity logging fails
    console.error('Error logging comment activity:', err);
  }
}

/**
 * Toggle helpful vote on a comment
 * If user has voted, removes the vote. If not, adds a vote.
 */
export async function toggleCommentVote(data: {
  userId: string;
  commentId: string;
}): Promise<{ success: boolean; hasVoted: boolean; error?: string }> {
  try {
    // Check if user has already voted
    const { data: existingVote, error: checkError } = await supabase
      .from('comment_votes')
      .select('id')
      .eq('user_id', data.userId)
      .eq('comment_id', data.commentId)
      .maybeSingle();

    if (checkError) {
      console.error('Error checking vote:', checkError);
      return {
        success: false,
        hasVoted: false,
        error: 'שגיאה בבדיקת הצבעה',
      };
    }

    if (existingVote) {
      // User has voted - remove the vote
      const { error: deleteError } = await supabase
        .from('comment_votes')
        .delete()
        .eq('id', existingVote.id);

      if (deleteError) {
        console.error('Error deleting vote:', deleteError);
        return {
          success: false,
          hasVoted: true,
          error: 'שגיאה בהסרת ההצבעה',
        };
      }

      // Decrement helpful_count using RPC function
      const { error: updateError } = await (supabase.rpc as any)('decrement_comment_helpful_count', {
        comment_id: data.commentId,
      });

      if (updateError) {
        console.error('Error decrementing helpful count:', updateError);
        // Don't fail the operation if count update fails
      }

      return {
        success: true,
        hasVoted: false,
      };
    } else {
      // User hasn't voted - add the vote
      const { error: insertError } = await supabase
        .from('comment_votes')
        .insert([{
          user_id: data.userId,
          comment_id: data.commentId,
        }]);

      if (insertError) {
        console.error('Error inserting vote:', insertError);
        return {
          success: false,
          hasVoted: false,
          error: 'שגיאה בהצבעה',
        };
      }

      // Increment helpful_count using RPC function
      const { error: updateError } = await (supabase.rpc as any)('increment_comment_helpful_count', {
        comment_id: data.commentId,
      });

      if (updateError) {
        console.error('Error incrementing helpful count:', updateError);
        // Don't fail the operation if count update fails
      }

      return {
        success: true,
        hasVoted: true,
      };
    }
  } catch (err) {
    console.error('Error toggling vote:', err);
    return {
      success: false,
      hasVoted: false,
      error: err instanceof Error ? err.message : 'שגיאה בהצבעה',
    };
  }
}

/**
 * Check if user has voted on a comment
 */
export async function hasUserVoted(userId: string, commentId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('comment_votes')
      .select('id')
      .eq('user_id', userId)
      .eq('comment_id', commentId)
      .maybeSingle();

    if (error) {
      console.error('Error checking user vote:', error);
      return false;
    }

    return !!data;
  } catch (err) {
    console.error('Error checking user vote:', err);
    return false;
  }
}

/**
 * Simple markdown renderer for preview
 * Handles basic markdown: bold, italic, code, links
 */
export function renderMarkdown(content: string): string {
  let rendered = content;

  // Bold: **text** or __text__
  rendered = rendered.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  rendered = rendered.replace(/__(.+?)__/g, '<strong>$1</strong>');

  // Italic: *text* or _text_
  rendered = rendered.replace(/\*(.+?)\*/g, '<em>$1</em>');
  rendered = rendered.replace(/_(.+?)_/g, '<em>$1</em>');

  // Inline code: `code`
  rendered = rendered.replace(/`(.+?)`/g, '<code class="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-sm font-mono">$1</code>');

  // Links: [text](url)
  rendered = rendered.replace(
    /\[(.+?)\]\((.+?)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-emerald-600 hover:underline">$1</a>'
  );

  // Line breaks
  rendered = rendered.replace(/\n/g, '<br />');

  return rendered;
}

