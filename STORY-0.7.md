# Story 0.7: Real-time Avatar Update Reflection

**Epic:** Side Stories (0.x - On-the-Go Enhancements)
**Story Points:** 1
**Priority:** P2 (Medium)
**Dependencies:** Story 0.3 Complete ✅

---

## User Story

As a user,
I want to see my avatar change immediately after updating it in my profile,
So that I have instant visual confirmation that my changes were saved successfully.

---

## Business Context

**Current State:**
- User can update avatar in Profile page
- Avatar saves successfully to database
- Avatar does NOT update immediately in the UI
- User must refresh page manually to see new avatar
- Header/Sidebar avatar may show old version
- Cached avatar data not invalidated

**Impact:**
- Confusing user experience (did my change save?)
- Requires manual page refresh to see changes
- Inconsistent state between UI and database
- Poor perception of application responsiveness
- Users may try to update multiple times thinking it failed

**Solution:**
- Invalidate avatar cache immediately after update
- Update avatar in all visible UI locations instantly
- Provide visual feedback during update process
- Ensure avatar state syncs across all components
- Add success toast confirmation

---

## Acceptance Criteria

### 1. Avatar Updates Immediately After Save

**Given I am on the Profile page**
**When I select a new avatar and save**
**Then:**

- ✅ Avatar in Profile page updates immediately (no refresh needed)
- ✅ Avatar in Header updates immediately
- ✅ Avatar in Sidebar (if visible) updates immediately
- ✅ Avatar in any other visible component updates immediately
- ✅ Loading state shown during save process
- ✅ Success toast displayed: "האווטר עודכן בהצלחה" (Avatar updated successfully)
- ✅ No flickering or layout shift during update

### 2. Cache Invalidation

**Given avatar is cached for performance**
**When avatar is updated**
**Then:**

- ✅ Browser cache invalidated for avatar SVG/image
- ✅ React Query cache invalidated (if used)
- ✅ Local state updated across all components
- ✅ No stale avatar data served from cache
- ✅ Avatar URL includes cache-busting parameter if needed

### 3. Multi-Component Synchronization

**Given avatar appears in multiple places**
**When avatar is updated**
**Then all instances update simultaneously:**

- ✅ Profile page main avatar display
- ✅ Header user menu avatar
- ✅ Sidebar user profile section (if exists)
- ✅ Settings page avatar preview
- ✅ Any modal or dropdown showing user info
- ✅ User posts/comments (if applicable)

### 4. User Feedback During Update

**Given user is updating avatar**
**Then:**

- ✅ "Save" button shows loading spinner during save
- ✅ Avatar selector disabled during save
- ✅ Loading overlay on current avatar during save
- ✅ Button text changes to "שומר..." (Saving...)
- ✅ Success toast appears after successful save
- ✅ Error toast appears if save fails with retry option

### 5. Error Handling

**Given avatar update fails**
**Then:**

- ✅ Error toast displays: "שגיאה בעדכון האווטר" (Error updating avatar)
- ✅ Previous avatar remains displayed
- ✅ User can retry save operation
- ✅ Error logged to console for debugging
- ✅ No partial state updates (all or nothing)

---

## Technical Implementation

### Step 1: Identify Avatar State Management

**Files to check:**
- `src/app/profile/index.tsx` - Profile page with avatar selector
- `src/components/avatar-selector.tsx` - Avatar selection component
- `src/components/layout/Header.tsx` - Header with user avatar
- `src/components/layout/Sidebar.tsx` - Sidebar with user avatar
- `src/hooks/useUser.ts` or similar - User data hook
- `src/lib/supabase.ts` - Supabase client

**Determine:**
- How is avatar data fetched?
- Where is avatar state stored? (Context, Redux, React Query, Zustand?)
- Which components display the avatar?
- How is avatar updated in database?

---

### Step 2: Create User Context/Hook for Global State

**File:** `src/contexts/UserContext.tsx` (if doesn't exist)

```typescript
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { AvatarConfig } from '@/lib/avatar';

interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_style: string | null;
  avatar_seed: string | null;
  avatar_options: Record<string, any> | null;
  // ... other profile fields
}

interface UserContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
  updateAvatar: (config: AvatarConfig) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }

    return data;
  };

  const refreshProfile = async () => {
    if (!user) return;
    const profileData = await fetchProfile(user.id);
    if (profileData) {
      setProfile(profileData);
    }
  };

  const updateAvatar = async (config: AvatarConfig) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { error } = await supabase
      .from('profiles')
      .update({
        avatar_style: config.style,
        avatar_seed: config.seed,
        avatar_options: config.options || {},
      })
      .eq('id', user.id);

    if (error) {
      throw error;
    }

    // CRITICAL: Immediately update local state
    setProfile((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        avatar_style: config.style,
        avatar_seed: config.seed,
        avatar_options: config.options || {},
      };
    });
  };

  useEffect(() => {
    // Initialize auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id).then((profileData) => {
          if (profileData) {
            setProfile(profileData);
          }
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });

    // Listen to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id).then((profileData) => {
          if (profileData) {
            setProfile(profileData);
          }
        });
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <UserContext.Provider
      value={{ user, profile, loading, refreshProfile, updateAvatar }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
}
```

**File:** `src/app/layout.tsx`

**Wrap app with UserProvider:**
```typescript
import { UserProvider } from '@/contexts/UserContext';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <body>
        <ThemeProvider>
          <UserProvider>
            {children}
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

---

### Step 3: Update Profile Page to Use Context

**File:** `src/app/profile/index.tsx`

```typescript
'use client';

import { useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import { AvatarSelector } from '@/components/avatar-selector';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { IconCheck, IconX } from '@tabler/icons-react';
import { AvatarConfig } from '@/lib/avatar';

export default function ProfilePage() {
  const { user, profile, updateAvatar } = useUser();
  const { toast } = useToast();
  const [selectedAvatar, setSelectedAvatar] = useState<AvatarConfig | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const currentAvatar: AvatarConfig = {
    style: (profile?.avatar_style as any) || 'avataaars',
    seed: profile?.avatar_seed || user?.id || 'default',
    options: profile?.avatar_options || {},
  };

  const handleSaveAvatar = async () => {
    if (!selectedAvatar) return;

    setIsSaving(true);

    try {
      // Update avatar using context method
      await updateAvatar(selectedAvatar);

      // Show success toast
      toast({
        title: 'האווטר עודכן בהצלחה',
        description: 'השינויים נשמרו',
        variant: 'default',
        icon: <IconCheck className="w-5 h-5 text-green-500" />,
      });

      // Reset selection
      setSelectedAvatar(null);
    } catch (error) {
      console.error('Error updating avatar:', error);

      // Show error toast
      toast({
        title: 'שגיאה בעדכון האווטר',
        description: 'אנא נסה שוב',
        variant: 'destructive',
        icon: <IconX className="w-5 h-5" />,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">פרופיל</h1>

      <Card>
        <CardHeader>
          <CardTitle>בחר אווטר</CardTitle>
          <CardDescription>התאם אישית את התמונה שלך</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Show current avatar with loading state */}
          <div className="mb-6">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              האווטר הנוכחי שלך:
            </p>
            <div className="relative inline-block">
              <UserAvatar config={currentAvatar} size="xl" />
              {isSaving && (
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
                </div>
              )}
            </div>
          </div>

          {/* Avatar selector */}
          <AvatarSelector
            userId={user?.id || ''}
            initialConfig={currentAvatar}
            onChange={setSelectedAvatar}
            disabled={isSaving}
          />
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleSaveAvatar}
            disabled={!selectedAvatar || isSaving}
            className="w-full"
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2" />
                שומר...
              </>
            ) : (
              'שמור שינויים'
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
```

---

### Step 4: Update Header to Use Context

**File:** `src/components/layout/Header.tsx`

```typescript
'use client';

import { useUser } from '@/contexts/UserContext';
import { UserAvatar } from '@/components/ui/user-avatar';
import { AvatarConfig } from '@/lib/avatar';

export function Header() {
  const { user, profile } = useUser();

  const avatarConfig: AvatarConfig = {
    style: (profile?.avatar_style as any) || 'avataaars',
    seed: profile?.avatar_seed || user?.id || 'default',
    options: profile?.avatar_options || {},
  };

  return (
    <header className="...">
      {/* Other header content */}

      {/* User menu with avatar */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2">
            {/* Avatar updates automatically when profile context changes */}
            <UserAvatar config={avatarConfig} size="sm" />
            <span>{profile?.full_name || 'משתמש'}</span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {/* Menu items */}
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
```

---

### Step 5: Update Sidebar to Use Context

**File:** `src/components/layout/Sidebar.tsx`

```typescript
'use client';

import { useUser } from '@/contexts/UserContext';
import { UserAvatar } from '@/components/ui/user-avatar';
import { AvatarConfig } from '@/lib/avatar';

export function Sidebar() {
  const { user, profile } = useUser();

  const avatarConfig: AvatarConfig = {
    style: (profile?.avatar_style as any) || 'avataaars',
    seed: profile?.avatar_seed || user?.id || 'default',
    options: profile?.avatar_options || {},
  };

  return (
    <aside className="...">
      {/* User profile section */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-3">
          {/* Avatar updates automatically */}
          <UserAvatar config={avatarConfig} size="md" />
          <div>
            <p className="font-medium">{profile?.full_name || 'משתמש'}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Navigation items */}
    </aside>
  );
}
```

---

### Step 6: Add Cache Busting for Avatar SVGs

**File:** `src/components/ui/user-avatar.tsx`

```typescript
import { useMemo } from 'react';
import { createAvatar } from '@dicebear/core';
import { AvatarConfig } from '@/lib/avatar';

interface UserAvatarProps {
  config: AvatarConfig;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function UserAvatar({ config, size = 'md', className }: UserAvatarProps) {
  // Generate avatar with cache-busting timestamp
  const avatarSvg = useMemo(() => {
    const styleCollection = getStyleCollection(config.style);
    const avatar = createAvatar(styleCollection, {
      seed: config.seed,
      ...config.options,
    });

    return avatar.toString();
  }, [config.style, config.seed, config.options]);

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  return (
    <div
      className={cn(
        'rounded-full overflow-hidden',
        sizeClasses[size],
        className
      )}
      dangerouslySetInnerHTML={{ __html: avatarSvg }}
    />
  );
}
```

**Key point:** `useMemo` will regenerate avatar when config changes, ensuring fresh render.

---

### Step 7: Add Toast Notifications

**File:** `src/hooks/use-toast.ts` (if doesn't exist, create or verify)

```typescript
import { toast as sonnerToast } from 'sonner';

export function useToast() {
  return {
    toast: ({
      title,
      description,
      variant = 'default',
      icon,
    }: {
      title: string;
      description?: string;
      variant?: 'default' | 'destructive';
      icon?: React.ReactNode;
    }) => {
      if (variant === 'destructive') {
        sonnerToast.error(title, {
          description,
          icon,
        });
      } else {
        sonnerToast.success(title, {
          description,
          icon,
        });
      }
    },
  };
}
```

**File:** `src/app/layout.tsx`

**Add Toaster component:**
```typescript
import { Toaster } from 'sonner';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <body>
        <ThemeProvider>
          <UserProvider>
            {children}
            <Toaster position="top-center" richColors dir="rtl" />
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

---

### Step 8: Test Avatar Update Flow

**Test checklist:**

```markdown
## Avatar Update Testing

### Profile Page
- [ ] Change avatar style
- [ ] Change avatar seed
- [ ] Click "Save"
- [ ] Loading state shows (spinner, disabled button)
- [ ] Avatar on profile page updates immediately
- [ ] Success toast appears

### Header
- [ ] Avatar in header updates immediately (no refresh)
- [ ] Avatar in user dropdown updates

### Sidebar
- [ ] Avatar in sidebar updates immediately (no refresh)

### Settings Page
- [ ] Navigate to Settings
- [ ] New avatar is shown (not old cached version)

### Page Refresh
- [ ] Refresh page after avatar update
- [ ] New avatar persists (saved to database)

### Error Handling
- [ ] Disconnect network
- [ ] Try to save avatar
- [ ] Error toast shows
- [ ] Previous avatar remains
- [ ] Reconnect and retry - should work
```

---

## Definition of Done

- [ ] UserContext created with avatar update method
- [ ] Profile page uses UserContext for avatar updates
- [ ] Header uses UserContext and reflects avatar changes immediately
- [ ] Sidebar uses UserContext and reflects avatar changes immediately
- [ ] Settings page (if showing avatar) reflects changes
- [ ] Loading state shown during avatar save
- [ ] Success toast appears after successful save
- [ ] Error toast appears if save fails
- [ ] No page refresh required to see changes
- [ ] Avatar state synchronized across all components
- [ ] No flickering or layout shift during update
- [ ] Cache properly invalidated
- [ ] TypeScript errors resolved
- [ ] Linter errors resolved
- [ ] Build completes successfully
- [ ] Manual testing passed on all components

---

## Related Files

**Created:**
- `src/contexts/UserContext.tsx` - Global user state with avatar update

**Modified:**
- `src/app/layout.tsx` - Add UserProvider wrapper
- `src/app/profile/index.tsx` - Use context for avatar updates
- `src/components/layout/Header.tsx` - Use context for avatar display
- `src/components/layout/Sidebar.tsx` - Use context for avatar display
- `src/components/ui/user-avatar.tsx` - Ensure proper memoization
- `src/hooks/use-toast.ts` - Toast notification hook

**Reference:**
- `src/lib/avatar.ts` - Avatar generation utilities
- `STORY-0.3-COMPLETE.md` - Original avatar implementation

---

## Estimated Effort

**Story Points:** 1

**Breakdown:**
- Create UserContext: 30 min
- Update Profile page: 20 min
- Update Header component: 10 min
- Update Sidebar component: 10 min
- Add toast notifications: 15 min
- Test avatar update flow: 20 min
- Handle edge cases and errors: 15 min
- Visual QA: 10 min

**Total:** ~2 hours

---

## Success Metrics

**User Experience:**
- Avatar updates instantly without page refresh
- Clear visual feedback during save process
- Confirmation that changes were saved
- Consistent avatar across all UI locations

**Technical:**
- Proper state management with React Context
- Cache invalidation working correctly
- No stale data displayed
- Clean error handling

---

## Testing Scenarios

### Happy Path - Avatar Update
1. User on Profile page
2. User selects new avatar (different style and seed)
3. User clicks "Save"
4. **Expected:**
   - Button shows "שומר..." with spinner
   - After 1-2 seconds, success toast appears
   - Profile page avatar updates to new selection
   - Header avatar updates to new selection
   - Sidebar avatar updates to new selection
   - Button returns to normal state

### Happy Path - Multi-Component Sync
1. User updates avatar on Profile page
2. **Expected:**
   - Profile page: new avatar
   - Navigate to Dashboard
   - Header: new avatar
   - Sidebar: new avatar
   - Navigate to Settings
   - Settings: new avatar
   - All locations show same new avatar

### Happy Path - Persistence
1. User updates avatar
2. User closes browser
3. User reopens browser and logs in
4. **Expected:**
   - New avatar loads from database
   - Shown in all locations
   - No reversion to old avatar

### Edge Case - Network Failure
1. User updates avatar
2. Network disconnects before save completes
3. **Expected:**
   - Error toast: "שגיאה בעדכון האווטר"
   - Previous avatar still displayed
   - User can retry when network restored

### Edge Case - Rapid Changes
1. User selects avatar A
2. User immediately selects avatar B
3. User clicks Save
4. **Expected:**
   - Only avatar B is saved
   - No race condition issues
   - Avatar B shown in all locations

---

**Created:** November 9, 2025
**Author:** BMad Master
**Status:** Ready to Implement

