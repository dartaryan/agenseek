import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { submitComment, renderMarkdown } from '@/lib/actions/comments';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import { hebrewLocale } from '@/lib/locale/he';

interface CommentFormProps {
  guideSlug: string;
  parentCommentId?: string | null;
  parentAuthorName?: string | null;
  onSuccess?: (commentId: string) => void;
  onCancel?: () => void;
}

export function CommentForm({
  guideSlug,
  parentCommentId,
  parentAuthorName,
  onSuccess,
  onCancel,
}: CommentFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [content, setContent] = useState('');
  const [isQuestion, setIsQuestion] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isReply = !!parentCommentId;
  const MAX_CHARS = 5000;
  const charCount = content.length;
  const isOverLimit = charCount > MAX_CHARS;
  const isNearLimit = charCount > 4500;
  const isEmpty = content.trim().length === 0;

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const newHeight = Math.min(textareaRef.current.scrollHeight, 400);
      textareaRef.current.style.height = `${newHeight}px`;
    }
  }, [content]);

  // Character counter color
  const getCharCountColor = () => {
    if (isOverLimit) return 'text-destructive';
    if (isNearLimit) return 'text-orange-500';
    return 'text-muted-foreground';
  };

  // Handle submit
  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: 'שגיאה',
        description: hebrewLocale.comments.errorNotAuthenticated || 'יש להתחבר כדי לפרסם תגובה',
        variant: 'destructive',
      });
      return;
    }

    if (isEmpty || isOverLimit) {
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await submitComment({
        userId: user.id,
        guideSlug,
        content,
        isQuestion,
        parentCommentId,
      });

      if (result.success && result.commentId) {
        // Show success toast
        toast({
          title: 'הצלחה',
          description: isReply
            ? hebrewLocale.comments.replyPosted
            : hebrewLocale.comments.commentPosted,
        });

        // Clear form
        setContent('');
        setIsQuestion(false);
        setActiveTab('write');

        // Call success callback
        if (onSuccess) {
          onSuccess(result.commentId);
        }
      } else {
        toast({
          title: 'שגיאה',
          description: result.error || hebrewLocale.comments.errorPostingComment,
          variant: 'destructive',
        });
      }
    } catch (err) {
      console.error('Error submitting comment:', err);
      toast({
        title: 'שגיאה',
        description: hebrewLocale.comments.errorPostingComment,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setContent('');
    setIsQuestion(false);
    setActiveTab('write');
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className="space-y-4 border rounded-lg p-4 bg-card">
      {/* Reply to indicator */}
      {isReply && parentAuthorName && (
        <div className="text-sm text-muted-foreground">
          {hebrewLocale.comments.replyingTo.replace('{name}', parentAuthorName)}
        </div>
      )}

      {/* Write/Preview Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'write' | 'preview')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="write">{hebrewLocale.comments.write}</TabsTrigger>
          <TabsTrigger value="preview">{hebrewLocale.comments.preview}</TabsTrigger>
        </TabsList>

        {/* Write Tab */}
        <TabsContent value="write" className="space-y-4">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
            placeholder={
              isReply
                ? hebrewLocale.comments.writeReply
                : hebrewLocale.comments.writeComment
            }
            className="w-full min-h-[100px] resize-none overflow-y-auto p-3 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent disabled:opacity-50"
            disabled={isSubmitting}
          />

          {/* Markdown Formatting Guide */}
          <div>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-between"
              type="button"
              onClick={() => setIsGuideOpen(!isGuideOpen)}
            >
              <span className="text-sm">{hebrewLocale.comments.markdownGuide}</span>
              {isGuideOpen ? (
                <IconChevronUp className="h-4 w-4" />
              ) : (
                <IconChevronDown className="h-4 w-4" />
              )}
            </Button>
            {isGuideOpen && (
              <div className="space-y-2 pt-2">
                <div className="text-sm text-muted-foreground space-y-1 bg-muted/50 p-3 rounded-md">
                  <div className="flex justify-between items-center">
                    <code className="text-xs">**טקסט מודגש**</code>
                    <span className="font-bold">טקסט מודגש</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <code className="text-xs">*טקסט נטוי*</code>
                    <span className="italic">טקסט נטוי</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <code className="text-xs">`קוד`</code>
                    <code className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs">
                      קוד
                    </code>
                  </div>
                  <div className="flex justify-between items-center">
                    <code className="text-xs">[קישור](URL)</code>
                    <span className="text-emerald-600 underline">קישור</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Preview Tab */}
        <TabsContent value="preview" className="space-y-4">
          <div
            className="min-h-[100px] p-4 border rounded-md bg-muted/50 prose prose-sm max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{
              __html: content
                ? renderMarkdown(content)
                : `<p class="text-muted-foreground">${hebrewLocale.comments.noPreview}</p>`,
            }}
          />
        </TabsContent>
      </Tabs>

      {/* Controls Row */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        {/* Comment/Question Toggle (only for top-level comments) */}
        {!isReply && (
          <div className="flex gap-2">
            <Button
              type="button"
              variant={!isQuestion ? 'default' : 'outline'}
              size="sm"
              onClick={() => setIsQuestion(false)}
              disabled={isSubmitting}
            >
              {hebrewLocale.comments.comment}
            </Button>
            <Button
              type="button"
              variant={isQuestion ? 'default' : 'outline'}
              size="sm"
              onClick={() => setIsQuestion(true)}
              disabled={isSubmitting}
              className={
                isQuestion
                  ? 'bg-orange-500 hover:bg-orange-600'
                  : 'border-orange-500 text-orange-500 hover:bg-orange-500/10'
              }
            >
              {hebrewLocale.comments.question}
            </Button>
          </div>
        )}

        {/* Character Counter */}
        <div className={`text-sm ${getCharCountColor()}`}>
          {hebrewLocale.comments.characterCount
            .replace('{current}', charCount.toString())
            .replace('{max}', MAX_CHARS.toString())}
        </div>

        {/* Submit/Cancel Buttons */}
        <div className="flex gap-2 mr-auto">
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isEmpty || isOverLimit || isSubmitting}
            size="sm"
          >
            {isSubmitting
              ? hebrewLocale.comments.submitting
              : isReply
              ? hebrewLocale.comments.submitReply
              : isQuestion
              ? hebrewLocale.comments.submitQuestion
              : hebrewLocale.comments.submitComment}
          </Button>
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
              size="sm"
            >
              {hebrewLocale.comments.cancel}
            </Button>
          )}
        </div>
      </div>

      {/* Error Messages */}
      {isOverLimit && (
        <p className="text-sm text-destructive">
          {hebrewLocale.comments.characterLimitExceeded}
        </p>
      )}
    </div>
  );
}

