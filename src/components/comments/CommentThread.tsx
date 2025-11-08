import { useState } from 'react';
import { useComments } from '@/hooks/useComments';
import { CommentItem } from './CommentItem';
import { CommentForm } from './CommentForm';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IconMessage, IconSortDescending, IconPlus, IconFilter } from '@tabler/icons-react';
import { hebrewLocale } from '@/lib/locale/he';
import type { CommentSort } from '@/types/comments';

interface CommentThreadProps {
  guideSlug: string;
}

export function CommentThread({ guideSlug }: CommentThreadProps) {
  const [sortBy, setSortBy] = useState<CommentSort>('recent');
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [showQuestionsOnly, setShowQuestionsOnly] = useState(false);
  const { comments, loading, error, hasMore, loadMore, refresh, totalCount } = useComments(
    guideSlug,
    sortBy,
    showQuestionsOnly
  );

  const handleSortChange = (value: string) => {
    setSortBy(value as CommentSort);
  };

  const handleCommentSuccess = (commentId: string) => {
    setShowCommentForm(false);
    refresh();

    // Scroll to new comment after a short delay to allow for rendering
    setTimeout(() => {
      const commentElement = document.getElementById(`comment-${commentId}`);
      if (commentElement) {
        commentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  const handleVoteChange = () => {
    // Refresh comments to re-sort when voting (especially for "most helpful" sort)
    if (sortBy === 'most_helpful') {
      refresh();
    }
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
        <div className="flex items-center justify-between flex-wrap gap-3">
          <CardTitle className="flex items-center gap-2">
            <IconMessage className="h-5 w-5 text-emerald-600" />
            <span>{hebrewLocale.comments.title}</span>
            <span className="text-sm font-normal text-muted-foreground">
              ({getCommentCountText(totalCount)})
            </span>
          </CardTitle>

          <div className="flex items-center gap-2">
            {/* Q&A Filter Toggle */}
            <Button
              variant={showQuestionsOnly ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowQuestionsOnly(!showQuestionsOnly)}
              className={`gap-1 h-9 ${
                showQuestionsOnly
                  ? 'bg-orange-500 hover:bg-orange-600 text-white'
                  : ''
              }`}
            >
              <IconFilter className="h-4 w-4" />
              <span className="text-xs">
                {showQuestionsOnly ? hebrewLocale.comments.allComments : hebrewLocale.comments.onlyQuestions}
              </span>
            </Button>

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
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Add Comment Button/Form */}
        <div>
          {!showCommentForm ? (
            <Button
              onClick={() => setShowCommentForm(true)}
              className="w-full"
              variant="outline"
            >
              <IconPlus className="h-4 w-4 ml-2" />
              {hebrewLocale.comments.addComment}
            </Button>
          ) : (
            <CommentForm
              guideSlug={guideSlug}
              onSuccess={handleCommentSuccess}
              onCancel={() => setShowCommentForm(false)}
            />
          )}
        </div>

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
            onVoteChange={handleVoteChange}
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

