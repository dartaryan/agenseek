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
import type { CommentWithProfile } from '@/types/comments';

interface CommentReplyProps {
  reply: CommentWithProfile;
  guideSlug: string;
}

export function CommentReply({ reply }: CommentReplyProps) {
  const { user } = useAuth();

  // Check if current user owns this reply
  const isOwner = user?.id === reply.user_id;

  // Get user initials for avatar fallback
  const userInitial = reply.profile?.display_name?.charAt(0).toUpperCase() || 'U';

  // Format timestamp
  const timeAgo = formatDistanceToNow(new Date(reply.created_at), {
    addSuffix: true,
    locale: he,
  });

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
          <Button variant="ghost" size="sm" className="gap-1 h-7 text-xs">
            <IconThumbUp className="h-3 w-3" />
            <span>
              {hebrewLocale.comments.helpful}
              {reply.helpful_count > 0 && ` (${reply.helpful_count})`}
            </span>
          </Button>

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

