import { useState } from 'react';
import { useComments } from '@/hooks/useComments';
import { CommentItem } from './CommentItem';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IconMessage, IconSortDescending } from '@tabler/icons-react';
import { hebrewLocale } from '@/lib/locale/he';
import type { CommentSort } from '@/types/comments';

interface CommentThreadProps {
  guideSlug: string;
}

export function CommentThread({ guideSlug }: CommentThreadProps) {
  const [sortBy, setSortBy] = useState<CommentSort>('recent');
  const { comments, loading, error, hasMore, loadMore, totalCount } = useComments(
    guideSlug,
    sortBy
  );

  const handleSortChange = (value: string) => {
    setSortBy(value as CommentSort);
  };

  // Format comment count
  const getCommentCountText = (count: number) => {
    if (count === 0) return hebrewLocale.comments.commentCount_zero;
    if (count === 1) return hebrewLocale.comments.commentCount_one;
    if (count === 2) return hebrewLocale.comments.commentCount_two;
    return hebrewLocale.comments.commentCount_many.replace('{count}', count.toString());
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <IconMessage className="h-5 w-5 text-emerald-600" />
            <span>{hebrewLocale.comments.title}</span>
            <span className="text-sm font-normal text-muted-foreground">
              ({getCommentCountText(totalCount)})
            </span>
          </CardTitle>

          {/* Sort Dropdown */}
          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[180px]">
              <IconSortDescending className="h-4 w-4 ml-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">
                {hebrewLocale.comments.sortRecent}
              </SelectItem>
              <SelectItem value="most_helpful">
                {hebrewLocale.comments.sortMostHelpful}
              </SelectItem>
              <SelectItem value="oldest">
                {hebrewLocale.comments.sortOldest}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Loading State */}
        {loading && comments.length === 0 && (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-emerald-600" />
              <span>{hebrewLocale.comments.loadingComments}</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex items-center justify-center py-8">
            <p className="text-sm text-destructive">
              {hebrewLocale.comments.errorLoadingComments}
            </p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && comments.length === 0 && (
          <div className="text-center py-8 space-y-2">
            <IconMessage className="h-12 w-12 mx-auto text-gray-300" />
            <p className="text-gray-600 dark:text-gray-400">
              {hebrewLocale.comments.noComments}
            </p>
            <p className="text-sm text-muted-foreground">
              {hebrewLocale.comments.beFirstToComment}
            </p>
          </div>
        )}

        {/* Comments List */}
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            guideSlug={guideSlug}
          />
        ))}

        {/* Load More Button */}
        {hasMore && (
          <div className="flex justify-center pt-4">
            <Button
              variant="outline"
              onClick={loadMore}
              disabled={loading}
              className="w-full md:w-auto"
            >
              {loading ? hebrewLocale.comments.submitting : hebrewLocale.comments.loadMore}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

