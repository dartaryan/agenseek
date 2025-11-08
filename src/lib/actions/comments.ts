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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
 * Mark a comment as solution to a question
 * Only the question author can mark solutions
 */
export async function markCommentAsSolution(data: {
  userId: string;
  commentId: string;
  questionId: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    // Verify user is the question author
    const { data: question, error: questionError } = await supabase
      .from('guide_comments')
      .select('user_id, is_question')
      .eq('id', data.questionId)
      .single();

    if (questionError || !question) {
      console.error('Error fetching question:', questionError);
      return {
        success: false,
        error: 'שגיאה בטעינת השאלה',
      };
    }

    // Check if this is actually a question
    if (!question.is_question) {
      return {
        success: false,
        error: 'התגובה אינה שאלה',
      };
    }

    // Check if user is the question author
    if (question.user_id !== data.userId) {
      return {
        success: false,
        error: 'רק מחבר השאלה יכול לסמן פתרון',
      };
    }

    // Check if the comment is actually a reply to this question
    const { data: reply, error: replyError } = await supabase
      .from('guide_comments')
      .select('parent_comment_id')
      .eq('id', data.commentId)
      .single();

    if (replyError || !reply) {
      console.error('Error fetching reply:', replyError);
      return {
        success: false,
        error: 'שגיאה בטעינת התגובה',
      };
    }

    if (reply.parent_comment_id !== data.questionId) {
      return {
        success: false,
        error: 'התגובה אינה תשובה לשאלה זו',
      };
    }

    // Remove any existing solution for this question
    const { error: removeError } = await supabase
      .from('guide_comments')
      .update({ is_solution: false })
      .eq('parent_comment_id', data.questionId)
      .eq('is_solution', true);

    if (removeError) {
      console.error('Error removing existing solution:', removeError);
      // Don't fail - continue to mark new solution
    }

    // Mark this comment as solution
    const { error: markError } = await supabase
      .from('guide_comments')
      .update({ is_solution: true, updated_at: new Date().toISOString() })
      .eq('id', data.commentId);

    if (markError) {
      console.error('Error marking solution:', markError);
      return {
        success: false,
        error: 'שגיאה בסימון הפתרון',
      };
    }

    return {
      success: true,
    };
  } catch (err) {
    console.error('Error marking solution:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'שגיאה בסימון הפתרון',
    };
  }
}

/**
 * Unmark a comment as solution
 * Only the question author can unmark solutions
 */
export async function unmarkCommentAsSolution(data: {
  userId: string;
  commentId: string;
  questionId: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    // Verify user is the question author
    const { data: question, error: questionError } = await supabase
      .from('guide_comments')
      .select('user_id')
      .eq('id', data.questionId)
      .single();

    if (questionError || !question) {
      console.error('Error fetching question:', questionError);
      return {
        success: false,
        error: 'שגיאה בטעינת השאלה',
      };
    }

    // Check if user is the question author
    if (question.user_id !== data.userId) {
      return {
        success: false,
        error: 'רק מחבר השאלה יכול להסיר סימון פתרון',
      };
    }

    // Unmark the solution
    const { error: unmarkError } = await supabase
      .from('guide_comments')
      .update({ is_solution: false, updated_at: new Date().toISOString() })
      .eq('id', data.commentId);

    if (unmarkError) {
      console.error('Error unmarking solution:', unmarkError);
      return {
        success: false,
        error: 'שגיאה בהסרת סימון הפתרון',
      };
    }

    return {
      success: true,
    };
  } catch (err) {
    console.error('Error unmarking solution:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'שגיאה בהסרת סימון הפתרון',
    };
  }
}

/**
 * Edit a comment
 * Only the comment author can edit their comment
 */
export async function editComment(data: {
  userId: string;
  commentId: string;
  content: string;
}): Promise<{ success: boolean; error?: string }> {
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

    // Verify user is the comment author
    const { data: comment, error: fetchError } = await supabase
      .from('guide_comments')
      .select('user_id')
      .eq('id', data.commentId)
      .single();

    if (fetchError || !comment) {
      console.error('Error fetching comment:', fetchError);
      return {
        success: false,
        error: 'שגיאה בטעינת התגובה',
      };
    }

    // Check if user is the comment author
    if (comment.user_id !== data.userId) {
      return {
        success: false,
        error: 'רק מחבר התגובה יכול לערוך אותה',
      };
    }

    // Update the comment
    const { error: updateError } = await supabase
      .from('guide_comments')
      .update({
        content: data.content.trim(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', data.commentId);

    if (updateError) {
      console.error('Error updating comment:', updateError);
      return {
        success: false,
        error: 'שגיאה בעדכון התגובה',
      };
    }

    // Log activity
    await supabase.from('user_activity').insert([
      {
        user_id: data.userId,
        activity_type: 'comment_edited',
        metadata: {
          comment_id: data.commentId,
        },
      },
    ]);

    return {
      success: true,
    };
  } catch (err) {
    console.error('Error editing comment:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'שגיאה בעדכון התגובה',
    };
  }
}

/**
 * Check if a comment has replies
 */
async function checkForReplies(commentId: string): Promise<boolean> {
  try {
    const { count, error } = await supabase
      .from('guide_comments')
      .select('id', { count: 'exact', head: true })
      .eq('parent_comment_id', commentId);

    if (error) {
      console.error('Error checking for replies:', error);
      return false;
    }

    return (count || 0) > 0;
  } catch (err) {
    console.error('Error checking for replies:', err);
    return false;
  }
}

/**
 * Delete a comment
 * If comment has replies, do soft delete (replace content with placeholder)
 * If no replies, do hard delete (complete removal)
 * Only the comment author can delete their comment
 */
export async function deleteComment(data: {
  userId: string;
  commentId: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    // Verify user is the comment author
    const { data: comment, error: fetchError } = await supabase
      .from('guide_comments')
      .select('user_id, guide_slug')
      .eq('id', data.commentId)
      .single();

    if (fetchError || !comment) {
      console.error('Error fetching comment:', fetchError);
      return {
        success: false,
        error: 'שגיאה בטעינת התגובה',
      };
    }

    // Check if user is the comment author
    if (comment.user_id !== data.userId) {
      return {
        success: false,
        error: 'רק מחבר התגובה יכול למחוק אותה',
      };
    }

    // Check if comment has replies
    const hasReplies = await checkForReplies(data.commentId);

    if (hasReplies) {
      // Soft delete: Replace content with placeholder
      const { error: updateError } = await supabase
        .from('guide_comments')
        .update({
          content: '[התגובה נמחקה]',
          updated_at: new Date().toISOString(),
        })
        .eq('id', data.commentId);

      if (updateError) {
        console.error('Error soft deleting comment:', updateError);
        return {
          success: false,
          error: 'שגיאה במחיקת התגובה',
        };
      }
    } else {
      // Hard delete: Complete removal
      const { error: deleteError } = await supabase
        .from('guide_comments')
        .delete()
        .eq('id', data.commentId);

      if (deleteError) {
        console.error('Error hard deleting comment:', deleteError);
        return {
          success: false,
          error: 'שגיאה במחיקת התגובה',
        };
      }
    }

    // Log activity
    await supabase.from('user_activity').insert([
      {
        user_id: data.userId,
        activity_type: 'comment_deleted',
        guide_slug: comment.guide_slug,
        metadata: {
          comment_id: data.commentId,
          soft_delete: hasReplies,
        },
      },
    ]);

    return {
      success: true,
    };
  } catch (err) {
    console.error('Error deleting comment:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'שגיאה במחיקת התגובה',
    };
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

