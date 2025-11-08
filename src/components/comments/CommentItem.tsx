import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { he } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  IconThumbUp,
  IconMessage,
  IconPencil,
  IconTrash,
  IconCheck,
} from '@tabler/icons-react';
import { hebrewLocale } from '@/lib/locale/he';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { CommentReply } from './CommentReply';
import { CommentForm } from './CommentForm';
import { toggleCommentVote, hasUserVoted, editComment, deleteComment } from '@/lib/actions/comments';
import type { CommentWithReplies } from '@/types/comments';
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

interface CommentItemProps {
  comment: CommentWithReplies;
  guideSlug: string;
  onVoteChange?: () => void;
}

export function CommentItem({ comment, guideSlug, onVoteChange }: CommentItemProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showReplies, setShowReplies] = useState(true);
  const [isReplying, setIsReplying] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [helpfulCount, setHelpfulCount] = useState(comment.helpful_count);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [avatarConfig, setAvatarConfig] = useState<AvatarConfig | null>(null);

  // Check if current user owns this comment
  const isOwner = user?.id === comment.user_id;

  // Story 0.3: Load commenter's avatar
  useEffect(() => {
    async function loadAvatar() {
      if (!comment.user_id) return;

      const { data } = await supabase
        .from('profiles')
        .select('avatar_style, avatar_seed, avatar_options')
        .eq('id', comment.user_id)
        .single();

      if (data?.avatar_style) {
        setAvatarConfig({
          style: data.avatar_style as any,
          seed: data.avatar_seed || comment.user_id,
          options: (data.avatar_options as Record<string, any>) || {},
        });
      }
    }
    loadAvatar();
  }, [comment.user_id]);

  // Check if user has voted on mount
  useEffect(() => {
    const checkVoteStatus = async () => {
      if (user?.id) {
        const voted = await hasUserVoted(user.id, comment.id);
        setHasVoted(voted);
      }
    };

    checkVoteStatus();
  }, [user?.id, comment.id]);

  // Format timestamp
  const timeAgo = formatDistanceToNow(new Date(comment.created_at), {
    addSuffix: true,
    locale: he,
  });

  // Format reply count
  const getReplyCountText = (count: number) => {
    if (count === 0) return hebrewLocale.comments.replyCount_zero;
    if (count === 1) return hebrewLocale.comments.replyCount_one;
    if (count === 2) return hebrewLocale.comments.replyCount_two;
    return hebrewLocale.comments.replyCount_many.replace('{count}', count.toString());
  };

  const handleReply = () => {
    setIsReplying(!isReplying);
  };

  const handleToggleReplies = () => {
    setShowReplies(!showReplies);
  };

  const handleReplySuccess = () => {
    setIsReplying(false);
    setShowReplies(true); // Automatically show replies after successful submission

    // Trigger refresh to show new reply immediately
    if (onVoteChange) {
      onVoteChange();
    }
  };

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
      commentId: comment.id,
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

  const handleEdit = () => {
    setIsEditing(true);
    setEditContent(comment.content);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditContent(comment.content);
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
      commentId: comment.id,
      content: editContent,
    });

    setIsSaving(false);

    if (result.success) {
      setIsEditing(false);
      toast({
        title: hebrewLocale.comments.editSuccess,
        variant: 'default',
      });

      // Refresh to show updated comment
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
      commentId: comment.id,
    });

    setIsDeleting(false);
    setShowDeleteDialog(false);

    if (result.success) {
      toast({
        title: hebrewLocale.comments.deleteSuccess,
        variant: 'default',
      });

      // Refresh to remove deleted comment
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
    <div id={`comment-${comment.id}`} className="space-y-4">
      {/* Main Comment */}
      <div className={`
        flex gap-3 p-4 rounded-lg
        ${comment.is_question ? 'bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800' : 'bg-gray-50 dark:bg-gray-800/50'}
      `}>
        {/* Avatar - Story 0.3 */}
        <div className="shrink-0">
          <UserAvatar
            config={avatarConfig}
            userId={comment.user_id}
            size="md"
            className="h-10 w-10"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-2">
          {/* Header: Name, Role, Time, Badges */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-gray-900 dark:text-white">
                  {comment.profile?.display_name || 'משתמש'}
                </span>
                {comment.profile?.role && (
                  <Badge variant="secondary" className="text-xs">
                    {comment.profile.role}
                  </Badge>
                )}
                {comment.is_question && (
                  <Badge variant="default" className="bg-orange-500 hover:bg-orange-600">
                    {hebrewLocale.comments.question}
                  </Badge>
                )}
                {comment.is_solution && (
                  <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                    <IconCheck className="h-3 w-3 ml-1" />
                    {hebrewLocale.comments.solution}
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {timeAgo}
                {comment.updated_at !== comment.created_at && (
                  <span className="mr-1">{hebrewLocale.comments.edited}</span>
                )}
              </p>
            </div>
          </div>

          {/* Comment Content */}
          {isEditing ? (
            <div className="space-y-2">
              <Textarea
                value={editContent}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEditContent(e.target.value)}
                className="min-h-[100px] resize-none"
                maxLength={5000}
                placeholder={hebrewLocale.comments.writeComment}
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
                  >
                    {hebrewLocale.comments.cancel}
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleSaveEdit}
                    disabled={isSaving || !editContent.trim()}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    {isSaving ? hebrewLocale.comments.submitting : hebrewLocale.comments.save}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
                {comment.content}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Helpful Button */}
            <Button
              variant={hasVoted ? 'default' : 'ghost'}
              size="sm"
              className={`gap-1 h-8 ${
                hasVoted
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : ''
              } ${isOwner ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={handleVote}
              disabled={isVoting || isOwner}
            >
              <IconThumbUp
                className="h-4 w-4"
                fill={hasVoted ? 'currentColor' : 'none'}
              />
              <span className="text-xs">
                {hebrewLocale.comments.helpful}
                {helpfulCount > 0 && ` (${helpfulCount})`}
              </span>
            </Button>

            {/* Reply Button */}
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 h-8"
              onClick={handleReply}
            >
              <IconMessage className="h-4 w-4" />
              <span className="text-xs">{hebrewLocale.comments.reply}</span>
            </Button>

            {/* Edit Button (owner only) */}
            {isOwner && !isEditing && (
              <Button
                variant="ghost"
                size="sm"
                className="gap-1 h-8"
                onClick={handleEdit}
              >
                <IconPencil className="h-4 w-4" />
                <span className="text-xs">{hebrewLocale.comments.edit}</span>
              </Button>
            )}

            {/* Delete Button (owner only) */}
            {isOwner && !isEditing && (
              <Button
                variant="ghost"
                size="sm"
                className="gap-1 h-8 text-destructive hover:text-destructive"
                onClick={() => setShowDeleteDialog(true)}
              >
                <IconTrash className="h-4 w-4" />
                <span className="text-xs">{hebrewLocale.comments.delete}</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Reply Form (when replying) */}
      {isReplying && (
        <div className="mr-12 mt-4">
          <CommentForm
            guideSlug={guideSlug}
            parentCommentId={comment.id}
            parentAuthorName={comment.profile?.display_name || ''}
            onSuccess={handleReplySuccess}
            onCancel={() => setIsReplying(false)}
          />
        </div>
      )}

      {/* Replies */}
      {comment.reply_count > 0 && (
        <div className="mr-12 space-y-2">
          {/* Toggle Replies Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleReplies}
            className="gap-2 h-7 text-xs text-emerald-600 hover:text-emerald-700"
          >
            <IconMessage className="h-3 w-3" />
            {showReplies ? hebrewLocale.comments.hideReplies : hebrewLocale.comments.viewReplies}
            {' '}({getReplyCountText(comment.reply_count)})
          </Button>

          {/* Reply List */}
          {showReplies && (
            <div className="space-y-3 pt-2 border-r-2 border-emerald-200 dark:border-emerald-800 pr-4">
              {/* Sort replies: solutions first, then by creation date */}
              {[...comment.replies]
                .sort((a, b) => {
                  // Solutions float to top
                  if (a.is_solution && !b.is_solution) return -1;
                  if (!a.is_solution && b.is_solution) return 1;
                  // Otherwise maintain chronological order
                  return 0;
                })
                .map((reply) => (
                  <CommentReply
                    key={reply.id}
                    reply={reply}
                    guideSlug={guideSlug}
                    onVoteChange={onVoteChange}
                    parentCommentId={comment.id}
                    parentUserId={comment.user_id}
                    parentIsQuestion={comment.is_question}
                    onSolutionChange={onVoteChange}
                  />
                ))}
            </div>
          )}
        </div>
      )}

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

