import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { he } from 'date-fns/locale';
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
import { toggleCommentVote, hasUserVoted, markCommentAsSolution, unmarkCommentAsSolution, editComment, deleteComment } from '@/lib/actions/comments';
import type { CommentWithProfile } from '@/types/comments';
import { Textarea } from '@/components/ui/textarea';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { UserAvatar } from '@/components/ui/user-avatar';
import { supabase } from '@/lib/supabase';
import type { AvatarConfig } from '@/lib/avatar';

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
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(reply.content);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [avatarConfig, setAvatarConfig] = useState<AvatarConfig | null>(null);

  // Check if current user owns this reply
  const isOwner = user?.id === reply.user_id;

  // Check if current user is the question author (can mark solutions)
  const isQuestionAuthor = parentIsQuestion && user?.id === parentUserId;

  // Story 0.3: Load commenter's avatar
  useEffect(() => {
    async function loadAvatar() {
      if (!reply.user_id) return;

      const { data } = await supabase
        .from('profiles')
        .select('avatar_style, avatar_seed, avatar_options')
        .eq('id', reply.user_id)
        .single();

      if (data?.avatar_style) {
        setAvatarConfig({
          style: data.avatar_style as any,
          seed: data.avatar_seed || reply.user_id,
          options: data.avatar_options || {},
        });
      }
    }
    loadAvatar();
  }, [reply.user_id]);

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

  const handleEdit = () => {
    setIsEditing(true);
    setEditContent(reply.content);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditContent(reply.content);
  };

  const handleSaveEdit = async () => {
    if (!user) return;

    // Validate content
    if (!editContent.trim()) {
      toast({
        title: hebrewLocale.comments.editError,
        description: hebrewLocale.comments.emptyComment,
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);

    const result = await editComment({
      userId: user.id,
      commentId: reply.id,
      content: editContent,
    });

    setIsSaving(false);

    if (result.success) {
      setIsEditing(false);
      toast({
        title: hebrewLocale.comments.editSuccess,
        variant: 'default',
      });

      // Refresh to show updated reply
      if (onVoteChange) {
        onVoteChange();
      }
    } else {
      toast({
        title: hebrewLocale.comments.editError,
        description: result.error,
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async () => {
    if (!user) return;

    setIsDeleting(true);

    const result = await deleteComment({
      userId: user.id,
      commentId: reply.id,
    });

    setIsDeleting(false);
    setShowDeleteDialog(false);

    if (result.success) {
      toast({
        title: hebrewLocale.comments.deleteSuccess,
        variant: 'default',
      });

      // Refresh to remove deleted reply
      if (onVoteChange) {
        onVoteChange();
      }
    } else {
      toast({
        title: hebrewLocale.comments.deleteError,
        description: result.error,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className={`
      flex gap-3 p-3 rounded-lg
      ${reply.is_solution ? 'bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800' : 'bg-white dark:bg-gray-900'}
    `}>
      {/* Avatar - Story 0.3: Smaller for replies */}
      <div className="shrink-0">
        <UserAvatar
          config={avatarConfig}
          userId={reply.user_id}
          size="sm"
          className="h-8 w-8"
        />
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
        {isEditing ? (
          <div className="space-y-2">
            <Textarea
              value={editContent}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEditContent(e.target.value)}
              className="min-h-[80px] resize-none text-sm"
              maxLength={5000}
              placeholder={hebrewLocale.comments.writeReply}
              autoFocus
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {editContent.length} / 5000
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancelEdit}
                  disabled={isSaving}
                  className="h-7 text-xs"
                >
                  {hebrewLocale.comments.cancel}
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleSaveEdit}
                  disabled={isSaving || !editContent.trim()}
                  className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700"
                >
                  {isSaving ? hebrewLocale.comments.submitting : hebrewLocale.comments.save}
                </Button>
              </div>
            </div>
          </div>
        ) : (
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <p className="text-sm text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
            {reply.content}
          </p>
        </div>
        )}

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
          {isOwner && !isEditing && (
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 h-7 text-xs"
              onClick={handleEdit}
            >
              <IconPencil className="h-3 w-3" />
              <span>{hebrewLocale.comments.edit}</span>
            </Button>
          )}

          {/* Delete Button (owner only) */}
          {isOwner && !isEditing && (
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 h-7 text-xs text-destructive hover:text-destructive"
              onClick={() => setShowDeleteDialog(true)}
            >
              <IconTrash className="h-3 w-3" />
              <span>{hebrewLocale.comments.delete}</span>
            </Button>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-white text-right" dir="rtl">
          <AlertDialogHeader className="text-right">
            <AlertDialogTitle className="text-right">{hebrewLocale.comments.delete}</AlertDialogTitle>
            <AlertDialogDescription className="text-right">
              {hebrewLocale.comments.deleteConfirm}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{hebrewLocale.comments.cancel}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting ? hebrewLocale.comments.submitting : hebrewLocale.comments.delete}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

