import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { he } from 'date-fns/locale';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
import { CommentReply } from './CommentReply';
import type { CommentWithReplies } from '@/types/comments';

interface CommentItemProps {
  comment: CommentWithReplies;
  guideSlug: string;
}

export function CommentItem({ comment, guideSlug }: CommentItemProps) {
  const { user } = useAuth();
  const [showReplies, setShowReplies] = useState(true);
  const [isReplying, setIsReplying] = useState(false);

  // Check if current user owns this comment
  const isOwner = user?.id === comment.user_id;

  // Get user initials for avatar fallback
  const userInitial = comment.profile?.display_name?.charAt(0).toUpperCase() || 'U';

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

  return (
    <div className="space-y-4">
      {/* Main Comment */}
      <div className={`
        flex gap-3 p-4 rounded-lg
        ${comment.is_question ? 'bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800' : 'bg-gray-50 dark:bg-gray-800/50'}
      `}>
        {/* Avatar */}
        <div className="shrink-0">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 font-semibold">
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
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <p className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
              {comment.content}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Helpful Button */}
            <Button variant="ghost" size="sm" className="gap-1 h-8">
              <IconThumbUp className="h-4 w-4" />
              <span className="text-xs">
                {hebrewLocale.comments.helpful}
                {comment.helpful_count > 0 && ` (${comment.helpful_count})`}
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
            {isOwner && (
              <Button variant="ghost" size="sm" className="gap-1 h-8">
                <IconPencil className="h-4 w-4" />
                <span className="text-xs">{hebrewLocale.comments.edit}</span>
              </Button>
            )}

            {/* Delete Button (owner only) */}
            {isOwner && (
              <Button variant="ghost" size="sm" className="gap-1 h-8 text-destructive hover:text-destructive">
                <IconTrash className="h-4 w-4" />
                <span className="text-xs">{hebrewLocale.comments.delete}</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Reply Form (when replying) */}
      {isReplying && (
        <div className="mr-12">
          <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <p className="text-sm text-muted-foreground mb-2">
              {hebrewLocale.comments.replyTo} {comment.profile?.display_name}
            </p>
            {/* Reply form will be implemented in Story 8.2 */}
            <textarea
              className="w-full p-2 border rounded-md resize-none"
              rows={3}
              placeholder={hebrewLocale.comments.writeComment}
              disabled
            />
            <div className="flex gap-2 mt-2">
              <Button size="sm" disabled>
                {hebrewLocale.comments.postReply}
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setIsReplying(false)}>
                {hebrewLocale.actions.cancel}
              </Button>
            </div>
          </div>
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
              {comment.replies.map((reply) => (
                <CommentReply
                  key={reply.id}
                  reply={reply}
                  guideSlug={guideSlug}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

