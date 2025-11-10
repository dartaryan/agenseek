/**
 * Bookmarks Page - Story 11.9
 *
 * Display all user's bookmarked guides with:
 * - List of bookmarked guides as cards
 * - Bookmark date (when added)
 * - Remove bookmark option
 * - Empty state when no bookmarks
 * - Sort options (recent, alphabetical, category)
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconBookmarkOff, IconClock, IconTag, IconBook } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { getBookmarks, removeBookmark, type Bookmark } from '@/lib/bookmarks';
import { guideCatalog } from '@/lib/guide-catalog';
import { toast } from '@/hooks/use-toast';

type GuideWithBookmark = {
  id: string;
  title: string;
  category: string;
  difficulty?: string;
  estimatedMinutes?: number;
  description?: string;
  bookmarkedAt: string;
};

type SortOption = 'recent' | 'alphabetical' | 'category';

export function BookmarksPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [bookmarkedGuides, setBookmarkedGuides] = useState<GuideWithBookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [removingId, setRemovingId] = useState<string | null>(null);

  // Load bookmarks
  useEffect(() => {
    if (!user) return;

    const loadBookmarks = async () => {
      setLoading(true);
      try {
        const userBookmarks = await getBookmarks(user.id);
        setBookmarks(userBookmarks);

        // Join with guide catalog
        const guidesWithBookmarks: GuideWithBookmark[] = userBookmarks
          .map((bookmark) => {
            const guide = guideCatalog.find((g) => g.id === bookmark.guide_slug);
            if (!guide) return null;
            return {
              id: guide.id,
              title: guide.title,
              category: guide.category,
              difficulty: guide.difficulty,
              estimatedMinutes: guide.estimatedMinutes,
              description: guide.description,
              bookmarkedAt: bookmark.created_at,
            };
          })
          .filter((g): g is GuideWithBookmark => g !== null);

        setBookmarkedGuides(guidesWithBookmarks);
      } catch (error) {
        console.error('Error loading bookmarks:', error);
        toast({
          title: 'שגיאה',
          description: 'לא הצלחנו לטעון את המועדפים',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    loadBookmarks();
  }, [user]);

  // Sort guides
  const sortedGuides = [...bookmarkedGuides].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.bookmarkedAt).getTime() - new Date(a.bookmarkedAt).getTime();
      case 'alphabetical':
        return a.title.localeCompare(b.title, 'he');
      case 'category':
        return a.category.localeCompare(b.category, 'he');
      default:
        return 0;
    }
  });

  // Handle remove bookmark
  const handleRemoveBookmark = async (guideSlug: string) => {
    if (!user || removingId) return;

    setRemovingId(guideSlug);

    try {
      await removeBookmark(user.id, guideSlug);

      // Update local state
      setBookmarks((prev) => prev.filter((b) => b.guide_slug !== guideSlug));
      setBookmarkedGuides((prev) => prev.filter((g) => g.id !== guideSlug));

      toast({
        title: 'הוסר מהמועדפים',
        description: 'המדריך הוסר מרשימת המועדפים שלך',
      });
    } catch (error) {
      console.error('Error removing bookmark:', error);
      toast({
        title: 'שגיאה',
        description: 'לא הצלחנו להסיר את הסימניה',
        variant: 'destructive',
      });
    } finally {
      setRemovingId(null);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('he-IL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Get category label
  const getCategoryLabel = (category: string) => {
    const categoryMap: Record<string, string> = {
      core: 'ליבה',
      roles: 'תפקידים',
      agents: 'סוכנים',
      workflows: 'תהליכי עבודה',
      practical: 'מעשי',
      faq: 'שאלות נפוצות',
      onboarding: 'התחלה',
    };
    return categoryMap[category] || category;
  };

  // Get difficulty label
  const getDifficultyLabel = (difficulty?: string) => {
    const difficultyMap: Record<string, string> = {
      beginner: 'מתחיל',
      intermediate: 'בינוני',
      advanced: 'מתקדם',
    };
    return difficulty ? difficultyMap[difficulty] || difficulty : '';
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">טוען מועדפים...</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (bookmarkedGuides.length === 0) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-12">
        <div className="text-center space-y-6 mt-12">
          <div className="flex justify-center">
            <IconBook className="w-24 h-24 text-muted-foreground opacity-50" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">אין לך מועדפים עדיין</h1>
            <p className="text-muted-foreground text-lg">
              שמור מדריכים למועדפים כדי לגשת אליהם בקלות בעתיד
            </p>
          </div>
          <div className="text-muted-foreground space-y-2">
            <p>לשמירת מדריך למועדפים:</p>
            <ul className="space-y-1 text-sm">
              <li>לחץ על כפתור הסימניה בעת קריאת מדריך</li>
              <li>או השתמש בקיצור המקלדת <kbd className="px-2 py-1 bg-secondary rounded">B</kbd></li>
            </ul>
          </div>
          <Button onClick={() => navigate('/guides')} className="mt-6">
            עבור לספריית המדריכים
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">המועדפים שלי</h1>
        <p className="text-muted-foreground">
          {bookmarkedGuides.length} {bookmarkedGuides.length === 1 ? 'מדריך שמור' : 'מדריכים שמורים'}
        </p>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="text-sm text-muted-foreground">
            מיון לפי:
          </label>
          <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
            <SelectTrigger id="sort" className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">נוספו לאחרונה</SelectItem>
              <SelectItem value="alphabetical">אלפביתי</SelectItem>
              <SelectItem value="category">קטגוריה</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button variant="outline" onClick={() => navigate('/guides')}>
          חזרה לספרייה
        </Button>
      </div>

      {/* Bookmarked Guides Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sortedGuides.map((guide) => (
          <Card
            key={guide.id}
            className="group hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate(`/guides/${guide.id}`)}
          >
            <CardContent className="p-6">
              {/* Guide Info */}
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-emerald-600 transition-colors">
                  {guide.title}
                </h3>
                {guide.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{guide.description}</p>
                )}
              </div>

              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground mb-4">
                {/* Category */}
                <div className="flex items-center gap-1">
                  <IconTag className="w-4 h-4" />
                  <span>{getCategoryLabel(guide.category)}</span>
                </div>

                {/* Difficulty */}
                {guide.difficulty && (
                  <div className="px-2 py-1 bg-secondary rounded text-xs">
                    {getDifficultyLabel(guide.difficulty)}
                  </div>
                )}

                {/* Estimated time */}
                {guide.estimatedMinutes && (
                  <div className="flex items-center gap-1">
                    <IconClock className="w-4 h-4" />
                    <span>{guide.estimatedMinutes} דקות</span>
                  </div>
                )}
              </div>

              {/* Bookmarked date and remove button */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <span className="text-xs text-muted-foreground">
                  נשמר ב-{formatDate(guide.bookmarkedAt)}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveBookmark(guide.id);
                  }}
                  disabled={removingId === guide.id}
                >
                  <IconBookmarkOff className="w-4 h-4" />
                  <span>הסר</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default BookmarksPage;

