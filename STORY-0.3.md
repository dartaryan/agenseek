# Story 0.3: User Avatar Picture Selection

**Epic:** Side Stories (0.x - On-the-Go Enhancements)
**Story Points:** 3
**Priority:** P2 (Medium)
**Dependencies:** None

---

## User Story

As a user,
I want to choose and customize my avatar picture,
So that I can personalize my profile and have a unique visual identity in the app.

---

## Business Context

**Current State:**
- Users have no avatar customization
- Profile pictures are either default or missing
- No visual personalization options

**Impact:**
- Less engaging user experience
- No user identity visualization
- Generic profile appearance

**Solution:**
- Integrate free avatar library with extensive collection
- Allow users to select from hundreds of avatar styles
- Provide customization options
- Show avatar in profile and throughout app

---

## Recommended Avatar Library

**DiceBear Avatars** (https://www.dicebear.com/)

**Why DiceBear:**
- ✅ 100% free and open source
- ✅ Huge collection (20+ avatar styles)
- ✅ No API key required
- ✅ Customizable colors, backgrounds, accessories
- ✅ SVG-based (scalable and lightweight)
- ✅ Works offline (can be self-hosted)
- ✅ TypeScript support
- ✅ Active maintenance

**Popular Styles:**
- `avataaars` - Cartoon faces (like Bitmoji)
- `bottts` - Cute robots
- `identicon` - Geometric patterns
- `initials` - Letter-based
- `lorelei` - Illustrated faces
- `personas` - Diverse human faces
- `pixel-art` - Retro 8-bit style

**Alternative:** Boring Avatars (https://boringavatars.com/) - simpler, abstract designs

---

## Acceptance Criteria

### Given I am a logged-in user
### When I visit my profile page
### Then I should be able to:

1. **Avatar Display:**
   - ✅ See my current avatar prominently on profile page
   - ✅ Avatar shown in sidebar/header when logged in
   - ✅ Avatar shown in settings page
   - ✅ Default avatar if none selected
   - ✅ Consistent sizing across all locations

2. **Avatar Selection Interface:**
   - ✅ "Change Avatar" button on profile page
   - ✅ Opens modal/dialog with avatar selector
   - ✅ Grid display of avatar style options (8-12 styles)
   - ✅ Preview current selection
   - ✅ Easy navigation between styles
   - ✅ Save and Cancel buttons

3. **Avatar Customization:**
   - ✅ Select avatar style (avataaars, bottts, lorelei, etc.)
   - ✅ Customize colors (background, primary, secondary)
   - ✅ Customize accessories (if style supports)
   - ✅ Real-time preview of changes
   - ✅ Reset to default option

4. **Save & Persist:**
   - ✅ Save avatar selection to user profile
   - ✅ Store avatar configuration in database
   - ✅ Avatar persists across sessions
   - ✅ Avatar updates immediately in all UI locations
   - ✅ Show success toast on save

5. **Performance:**
   - ✅ Fast loading of avatar previews
   - ✅ Efficient SVG rendering
   - ✅ No flickering on page load
   - ✅ Lazy loading for avatar selector grid

6. **Accessibility:**
   - ✅ Avatar has alt text
   - ✅ Keyboard navigation in selector
   - ✅ Focus management in modal
   - ✅ Screen reader announcements

---

## Technical Implementation

### Step 1: Install DiceBear Library

**Command:**
```bash
npm install @dicebear/core @dicebear/collection
```

**Or for specific styles:**
```bash
npm install @dicebear/core @dicebear/avataaars @dicebear/bottts @dicebear/lorelei @dicebear/personas
```

---

### Step 2: Add Avatar Configuration to Database

**File:** `supabase/migrations/YYYYMMDD_add_avatar_config.sql` (NEW FILE)

**Create:**
```sql
-- Add avatar configuration to profiles table
ALTER TABLE profiles
ADD COLUMN avatar_style VARCHAR(50) DEFAULT 'avataaars',
ADD COLUMN avatar_seed VARCHAR(100),
ADD COLUMN avatar_options JSONB DEFAULT '{}'::jsonb;

-- Comment for documentation
COMMENT ON COLUMN profiles.avatar_style IS 'DiceBear avatar style (avataaars, bottts, lorelei, etc.)';
COMMENT ON COLUMN profiles.avatar_seed IS 'Seed string for generating consistent avatar';
COMMENT ON COLUMN profiles.avatar_options IS 'JSON configuration for avatar colors and accessories';

-- Index for performance
CREATE INDEX idx_profiles_avatar_style ON profiles(avatar_style);
```

---

### Step 3: Create Avatar Generator Utility

**File:** `src/lib/avatar.ts` (NEW FILE)

**Create:**
```typescript
import { createAvatar } from '@dicebear/core';
import * as avataaars from '@dicebear/avataaars';
import * as bottts from '@dicebear/bottts';
import * as lorelei from '@dicebear/lorelei';
import * as personas from '@dicebear/personas';

export type AvatarStyle = 'avataaars' | 'bottts' | 'lorelei' | 'personas';

export interface AvatarConfig {
  style: AvatarStyle;
  seed: string;
  options?: Record<string, any>;
}

const styleCollections = {
  avataaars,
  bottts,
  lorelei,
  personas,
};

/**
 * Generate avatar SVG string
 */
export function generateAvatar(config: AvatarConfig): string {
  const collection = styleCollections[config.style];

  const avatar = createAvatar(collection, {
    seed: config.seed,
    ...config.options,
  });

  return avatar.toString();
}

/**
 * Generate avatar data URL for img src
 */
export function generateAvatarDataUrl(config: AvatarConfig): string {
  const svg = generateAvatar(config);
  const encoded = encodeURIComponent(svg);
  return `data:image/svg+xml,${encoded}`;
}

/**
 * Get default avatar config for a user
 */
export function getDefaultAvatarConfig(userId: string): AvatarConfig {
  return {
    style: 'avataaars',
    seed: userId, // Use user ID as seed for consistent default
    options: {},
  };
}

/**
 * Available avatar styles with labels
 */
export const avatarStyles: Array<{ value: AvatarStyle; label: string; labelHe: string }> = [
  { value: 'avataaars', label: 'Cartoon Faces', labelHe: 'פרצופים מצוירים' },
  { value: 'bottts', label: 'Robots', labelHe: 'רובוטים' },
  { value: 'lorelei', label: 'Illustrated Faces', labelHe: 'פרצופים מאוירים' },
  { value: 'personas', label: 'Diverse Faces', labelHe: 'פרצופים מגוונים' },
];
```

---

### Step 4: Create Avatar Component

**File:** `src/components/ui/user-avatar.tsx` (NEW FILE)

**Create:**
```typescript
import { useMemo } from 'react';
import { generateAvatarDataUrl, type AvatarConfig, getDefaultAvatarConfig } from '@/lib/avatar';
import { cn } from '@/lib/utils';

interface UserAvatarProps {
  config?: AvatarConfig | null;
  userId?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-20 h-20',
  xl: 'w-32 h-32',
};

/**
 * User avatar component that renders DiceBear avatar
 */
export function UserAvatar({ config, userId, size = 'md', className }: UserAvatarProps) {
  const avatarConfig = useMemo(() => {
    if (config) return config;
    if (userId) return getDefaultAvatarConfig(userId);
    return getDefaultAvatarConfig('default');
  }, [config, userId]);

  const avatarUrl = useMemo(() => {
    return generateAvatarDataUrl(avatarConfig);
  }, [avatarConfig]);

  return (
    <div
      className={cn(
        'rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0',
        sizeClasses[size],
        className
      )}
    >
      <img
        src={avatarUrl}
        alt="אווטר משתמש"
        className="w-full h-full"
        loading="lazy"
      />
    </div>
  );
}
```

---

### Step 5: Create Avatar Selector Component

**File:** `src/components/avatar-selector.tsx` (NEW FILE)

**Create:**
```typescript
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { UserAvatar } from '@/components/ui/user-avatar';
import { avatarStyles, type AvatarStyle, type AvatarConfig } from '@/lib/avatar';
import { IconCheck } from '@tabler/icons-react';

interface AvatarSelectorProps {
  open: boolean;
  onClose: () => void;
  currentConfig: AvatarConfig;
  onSave: (config: AvatarConfig) => void;
  userId: string;
}

/**
 * Avatar selector modal for choosing and customizing avatar
 */
export function AvatarSelector({
  open,
  onClose,
  currentConfig,
  onSave,
  userId,
}: AvatarSelectorProps) {
  const [selectedStyle, setSelectedStyle] = useState<AvatarStyle>(currentConfig.style);
  const [previewConfig, setPreviewConfig] = useState<AvatarConfig>(currentConfig);

  const handleStyleChange = (style: AvatarStyle) => {
    setSelectedStyle(style);
    setPreviewConfig({
      style,
      seed: userId,
      options: {},
    });
  };

  const handleSave = () => {
    onSave(previewConfig);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>בחר אווטר</DialogTitle>
        </DialogHeader>

        {/* Preview */}
        <div className="flex flex-col items-center gap-4 py-6">
          <UserAvatar config={previewConfig} size="xl" />
          <p className="text-sm text-gray-500">תצוגה מקדימה</p>
        </div>

        {/* Style Selection */}
        <div className="space-y-4">
          <Label>סגנון אווטר</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {avatarStyles.map((style) => (
              <button
                key={style.value}
                onClick={() => handleStyleChange(style.value)}
                className={`relative p-4 border-2 rounded-lg transition-all hover:border-emerald-300 ${
                  selectedStyle === style.value
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <UserAvatar
                  config={{ style: style.value, seed: userId, options: {} }}
                  size="lg"
                  className="mx-auto"
                />
                <p className="text-xs mt-2 text-center">{style.labelHe}</p>
                {selectedStyle === style.value && (
                  <div className="absolute top-2 right-2">
                    <IconCheck className="w-5 h-5 text-emerald-500" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end pt-4">
          <Button variant="outline" onClick={onClose}>
            ביטול
          </Button>
          <Button onClick={handleSave}>
            שמור אווטר
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

---

### Step 6: Update Profile Page

**File:** `src/app/profile/index.tsx`

**Add:**
```typescript
import { useState } from 'react';
import { UserAvatar } from '@/components/ui/user-avatar';
import { AvatarSelector } from '@/components/avatar-selector';
import { Button } from '@/components/ui/button';
import { IconEdit } from '@tabler/icons-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import type { AvatarConfig } from '@/lib/avatar';

// In component:
const [showAvatarSelector, setShowAvatarSelector] = useState(false);
const [avatarConfig, setAvatarConfig] = useState<AvatarConfig | null>(null);

// Fetch avatar config from profile
useEffect(() => {
  async function loadAvatar() {
    const { data } = await supabase
      .from('profiles')
      .select('avatar_style, avatar_seed, avatar_options')
      .eq('id', user.id)
      .single();

    if (data?.avatar_style) {
      setAvatarConfig({
        style: data.avatar_style,
        seed: data.avatar_seed || user.id,
        options: data.avatar_options || {},
      });
    }
  }
  loadAvatar();
}, [user.id]);

// Save avatar
const handleSaveAvatar = async (config: AvatarConfig) => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({
        avatar_style: config.style,
        avatar_seed: config.seed,
        avatar_options: config.options,
      })
      .eq('id', user.id);

    if (error) throw error;

    setAvatarConfig(config);
    toast({
      title: 'האווטר עודכן בהצלחה',
      description: 'האווטר שלך שונה',
    });
  } catch (error) {
    console.error('Error saving avatar:', error);
    toast({
      variant: 'destructive',
      title: 'שגיאה בשמירת אווטר',
      description: 'אנא נסה שוב',
    });
  }
};

// In JSX:
<div className="flex items-center gap-4">
  <UserAvatar config={avatarConfig} userId={user.id} size="xl" />
  <Button
    variant="outline"
    size="sm"
    onClick={() => setShowAvatarSelector(true)}
  >
    <IconEdit className="w-4 h-4" />
    שנה אווטר
  </Button>
</div>

<AvatarSelector
  open={showAvatarSelector}
  onClose={() => setShowAvatarSelector(false)}
  currentConfig={avatarConfig || getDefaultAvatarConfig(user.id)}
  onSave={handleSaveAvatar}
  userId={user.id}
/>
```

---

### Step 7: Update Sidebar to Show Avatar

**File:** `src/components/layout/Sidebar.tsx`

**Add:**
```typescript
import { UserAvatar } from '@/components/ui/user-avatar';

// Load avatar config (same as profile page)

// In user section:
<div className="flex items-center gap-3">
  <UserAvatar config={avatarConfig} userId={user.id} size="md" />
  <div>
    <p className="font-medium">{profile?.display_name}</p>
    <p className="text-sm text-gray-500">{user.email}</p>
  </div>
</div>
```

---

### Step 8: Update Hebrew Locale

**File:** `src/lib/locale/he.ts`

**Add:**
```typescript
avatar: {
  change: 'שנה אווטר',
  select: 'בחר אווטר',
  preview: 'תצוגה מקדימה',
  save: 'שמור אווטר',
  cancel: 'ביטול',
  success: 'האווטר עודכן בהצלחה',
  error: 'שגיאה בשמירת אווטר',
  styles: {
    avataaars: 'פרצופים מצוירים',
    bottts: 'רובוטים',
    lorelei: 'פרצופים מאוירים',
    personas: 'פרצופים מגוונים',
  },
},
```

---

## Definition of Done

- [ ] DiceBear library installed
- [ ] Database migration for avatar config created and applied
- [ ] Avatar utility functions created
- [ ] UserAvatar component created
- [ ] AvatarSelector component created
- [ ] Profile page updated with avatar display and selector
- [ ] Sidebar updated to show user avatar
- [ ] Settings page shows avatar
- [ ] Avatar persists across sessions
- [ ] All avatar styles work correctly
- [ ] Hebrew translations added
- [ ] Responsive design on mobile
- [ ] Accessibility features implemented
- [ ] No console errors
- [ ] Build completes with no errors
- [ ] Manual testing passes

---

## Related Files

**Created:**
- `src/lib/avatar.ts` - Avatar generation utilities
- `src/components/ui/user-avatar.tsx` - Avatar display component
- `src/components/avatar-selector.tsx` - Avatar selector modal
- `supabase/migrations/YYYYMMDD_add_avatar_config.sql` - Database migration

**Modified:**
- `src/app/profile/index.tsx` - Add avatar selector
- `src/components/layout/Sidebar.tsx` - Show user avatar
- `src/app/settings/index.tsx` - Show avatar
- `src/lib/locale/he.ts` - Add translations

---

## Estimated Effort

**Story Points:** 3

**Breakdown:**
- Install library and setup: 15 min
- Database migration: 20 min
- Avatar utility functions: 30 min
- UserAvatar component: 30 min
- AvatarSelector component: 1 hour
- Profile page integration: 30 min
- Sidebar integration: 20 min
- Settings integration: 15 min
- Testing all styles: 30 min
- Accessibility testing: 20 min
- Mobile testing: 20 min

**Total:** ~5 hours

---

## Success Metrics

**User Experience:**
- Users can easily customize their avatar
- Avatar selection is fun and engaging
- Consistent avatar display across app

**Technical:**
- Fast avatar generation
- Efficient SVG rendering
- Smooth user experience

---

**Created:** November 8, 2025
**Author:** BMad Master
**Status:** Ready to Implement

