import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { he } from 'date-fns/locale';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  IconThumbUp,
  IconPencil,
  IconTrash,
  IconCheck,
} from '@tabler/icons-react';
import { hebrewLocale } from '@/lib/locale/he';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { toggleCommentVote, hasUserVoted, markCommentAsSolution, unmarkCommentAsSolution } from '@/lib/actions/comments';
import type { CommentWithProfile } from '@/types/comments';

interface CommentReplyProps {
  reply: CommentWithProfile;
  guideSlug: string;
  onVoteChange?: () => void;
  parentCommentId?: string | null;
  parentUserId?: string | null;
  parentIsQuestion?: boolean;
  onSolutionChange?: () => void;
}

export function CommentReply({ reply, onVoteChange, parentCommentId, parentUserId, parentIsQuestion, onSolutionChange }: CommentReplyProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [hasVoted, setHasVoted] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [helpfulCount, setHelpfulCount] = useState(reply.helpful_count);
  const [isMarkingSolution, setIsMarkingSolution] = useState(false);

  // Check if current user owns this reply
  const isOwner = user?.id === reply.user_id;

  // Check if current user is the question author (can mark solutions)
  const isQuestionAuthor = parentIsQuestion && user?.id === parentUserId;

  // Check if user has voted on mount
  useEffect(() => {
    const checkVoteStatus = async () => {
      if (user?.id) {
        const voted = await hasUserVoted(user.id, reply.id);
        setHasVoted(voted);
      }
    };

    checkVoteStatus();
  }, [user?.id, reply.id]);

  // Get user initials for avatar fallback
  const userInitial = reply.profile?.display_name?.charAt(0).toUpperCase() || 'U';

  // Format timestamp
  const timeAgo = formatDistanceToNow(new Date(reply.created_at), {
    addSuffix: true,
    locale: he,
  });

  const handleVote = async () => {
    if (!user) {
      toast({
        title: hebrewLocale.comments.voteError,
        description: hebrewLocale.comments.loginToVote,
        variant: 'destructive',
      });
      return;
    }

    // Can't vote on own comments
    if (isOwner) {
      toast({
        title: hebrewLocale.comments.voteError,
        description: hebrewLocale.comments.cannotVoteOwnComment,
        variant: 'destructive',
      });
      return;
    }

    setIsVoting(true);

    const result = await toggleCommentVote({
      userId: user.id,
      commentId: reply.id,
    });

    setIsVoting(false);

    if (result.success) {
      setHasVoted(result.hasVoted);
      setHelpfulCount((prev) => (result.hasVoted ? prev + 1 : prev - 1));

      // Notify parent to refresh if sorting by most helpful
      if (onVoteChange) {
        onVoteChange();
      }
    } else {
      toast({
        title: hebrewLocale.comments.voteError,
        description: result.error || hebrewLocale.comments.voteErrorGeneric,
        variant: 'destructive',
      });
    }
  };

  const handleToggleSolution = async () => {
    if (!user || !parentCommentId) {
      toast({
        title: hebrewLocale.comments.solutionError,
        description: hebrewLocale.comments.loginToVote,
        variant: 'destructive',
      });
      return;
    }

    setIsMarkingSolution(true);

    const result = reply.is_solution
      ? await unmarkCommentAsSolution({
          userId: user.id,
          commentId: reply.id,
          questionId: parentCommentId,
        })
      : await markCommentAsSolution({
          userId: user.id,
          commentId: reply.id,
          questionId: parentCommentId,
        });

    setIsMarkingSolution(false);

    if (result.success) {
      toast({
        title: reply.is_solution ? hebrewLocale.comments.solutionUnmarked : hebrewLocale.comments.solutionMarked,
        variant: 'default',
      });

      // Notify parent to refresh
      if (onSolutionChange) {
        onSolutionChange();
      }
    } else {
      toast({
        title: hebrewLocale.comments.solutionError,
        description: result.error || hebrewLocale.comments.voteErrorGeneric,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className={`
      flex gap-3 p-3 rounded-lg
      ${reply.is_solution ? 'bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800' : 'bg-white dark:bg-gray-900'}
    `}>
      {/* Avatar - Smaller for replies */}
      <div className="shrink-0">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 font-semibold text-xs">
            {userInitial}
          </AvatarFallback>
        </Avatar>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-2">
        {/* Header: Name, Role, Time, Badges */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-sm text-gray-900 dark:text-white">
                {reply.profile?.display_name || 'משתמש'}
              </span>
              {reply.profile?.role && (
                <Badge variant="secondary" className="text-xs">
                  {reply.profile.role}
                </Badge>
              )}
              {reply.is_solution && (
                <Badge variant="default" className="bg-green-500 hover:bg-green-600 text-xs">
                  <IconCheck className="h-3 w-3 ml-1" />
                  {hebrewLocale.comments.solution}
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {timeAgo}
              {reply.updated_at !== reply.created_at && (
                <span className="mr-1">{hebrewLocale.comments.edited}</span>
              )}
            </p>
          </div>
        </div>

        {/* Reply Content */}
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <p className="text-sm text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
            {reply.content}
          </p>
        </div>

        {/* Action Buttons - Smaller for replies */}
        <div className="flex items-center gap-1 flex-wrap">
          {/* Helpful Button */}
          <Button
            variant={hasVoted ? 'default' : 'ghost'}
            size="sm"
            className={`gap-1 h-7 text-xs ${
              hasVoted
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : ''
            } ${isOwner ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleVote}
            disabled={isVoting || isOwner}
          >
            <IconThumbUp
              className="h-3 w-3"
              fill={hasVoted ? 'currentColor' : 'none'}
            />
            <span>
              {hebrewLocale.comments.helpful}
              {helpfulCount > 0 && ` (${helpfulCount})`}
            </span>
          </Button>

          {/* Mark as Solution Button (only for question author) */}
          {isQuestionAuthor && (
            <Button
              variant={reply.is_solution ? 'default' : 'ghost'}
              size="sm"
              className={`gap-1 h-7 text-xs ${
                reply.is_solution
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : ''
              }`}
              onClick={handleToggleSolution}
              disabled={isMarkingSolution}
            >
              <IconCheck className="h-3 w-3" />
              <span>
                {reply.is_solution
                  ? hebrewLocale.comments.unmarkSolution
                  : hebrewLocale.comments.markAsSolution}
              </span>
            </Button>
          )}

          {/* Edit Button (owner only) */}
          {isOwner && (
            <Button variant="ghost" size="sm" className="gap-1 h-7 text-xs">
              <IconPencil className="h-3 w-3" />
              <span>{hebrewLocale.comments.edit}</span>
            </Button>
          )}

          {/* Delete Button (owner only) */}
          {isOwner && (
            <Button variant="ghost" size="sm" className="gap-1 h-7 text-xs text-destructive hover:text-destructive">
              <IconTrash className="h-3 w-3" />
              <span>{hebrewLocale.comments.delete}</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

