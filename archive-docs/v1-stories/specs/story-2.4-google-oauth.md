# Story 2.4: Build Google OAuth Integration

**Epic:** Epic 2 - User Authentication & Personalized Onboarding
**Sprint:** 2 (Week 2)
**Story Points:** 3
**Priority:** P1 (High)
**Dependencies:** Story 2.1 (Login Page), Story 1.6 (Supabase Auth Configuration)

---

## User Story

As a new user,
I want to sign in with my Google account,
So that I can quickly access the platform without creating a new password.

---

## Business Context

**Current State:**
- ❌ Google OAuth button is commented out in login.tsx
- ❌ signInWithProvider function is disabled
- ❌ Users can only register with email/password
- ❌ Friction in signup process

**Impact:**
- Higher friction for new users
- Lower conversion rates
- More password reset requests
- Missing industry-standard authentication option

**Solution:**
- Enable Google OAuth sign-in
- Configure Supabase OAuth provider
- Implement OAuth callback handling
- Provide seamless "Sign in with Google" experience

---

## Acceptance Criteria

### Given I am a new or returning user
### When I visit the login or registration page
### Then I should see:

1. **Google Sign-In Button:**
   - ✅ "Sign in with Google" button visible on login page
   - ✅ "Sign up with Google" button visible on registration page
   - ✅ Button uses Google brand guidelines (colors, logo)
   - ✅ Button displays IconBrandGoogle from Tabler Icons
   - ✅ Button has proper Hebrew text: "התחבר עם Google" / "הירשם עם Google"
   - ✅ Button is properly styled and accessible
   - ✅ Button shows loading state during OAuth flow

2. **OAuth Flow:**
   - ✅ Click "Sign in with Google" → opens Google consent screen
   - ✅ User authorizes access → redirected back to app
   - ✅ App receives OAuth tokens from Supabase
   - ✅ User is authenticated automatically
   - ✅ New users: Profile is created in profiles table
   - ✅ Returning users: Existing profile is used
   - ✅ User is redirected based on onboarding status:
     - Not onboarded → `/onboarding`
     - Onboarded → `/dashboard`

3. **Supabase Configuration:**
   - ✅ Google OAuth provider enabled in Supabase project
   - ✅ OAuth redirect URLs configured correctly
   - ✅ Client ID and Client Secret configured
   - ✅ OAuth scopes configured (email, profile)
   - ✅ Callback URL handling implemented

4. **Profile Creation for OAuth Users:**
   - ✅ On first OAuth sign-in, create profile record
   - ✅ Extract display_name from Google profile
   - ✅ Extract email from Google account
   - ✅ Set completed_onboarding = false (require onboarding)
   - ✅ Set created_at timestamp
   - ✅ Handle case where profile creation fails gracefully

5. **Error Handling:**
   - ✅ User cancels OAuth → show appropriate message
   - ✅ OAuth fails → show error toast with retry option
   - ✅ Network error → show error message
   - ✅ Email already exists with different provider → show clear error
   - ✅ No console errors during happy path
   - ✅ Graceful degradation if Google OAuth unavailable

6. **Security:**
   - ✅ OAuth tokens stored securely (httpOnly cookies via Supabase)
   - ✅ CSRF protection enabled (Supabase handles)
   - ✅ No sensitive data exposed in client-side code
   - ✅ OAuth redirect URLs whitelisted in Supabase

7. **User Experience:**
   - ✅ Seamless transition from OAuth consent to app
   - ✅ Loading state during OAuth redirect
   - ✅ Success toast message after successful sign-in
   - ✅ Clear separation between email/password and OAuth options
   - ✅ "OR" divider between authentication methods

---

## Technical Implementation

### Step 1: Configure Google OAuth in Supabase

**Action: Supabase Dashboard**

1. Go to Supabase Dashboard → Authentication → Providers
2. Enable Google provider
3. Configure OAuth:
   - **Authorization URL:** (provided by Supabase)
   - **Token URL:** (provided by Supabase)
   - **Redirect URL:** Copy from Supabase (e.g., `https://your-project.supabase.co/auth/v1/callback`)
4. Get Google OAuth credentials:
   - Visit [Google Cloud Console](https://console.cloud.google.com/)
   - Create new OAuth 2.0 Client ID (or use existing)
   - Set authorized redirect URIs: `https://your-project.supabase.co/auth/v1/callback`
   - Copy Client ID and Client Secret
5. Paste credentials into Supabase Google provider settings
6. Save configuration

**Scopes:**
- `https://www.googleapis.com/auth/userinfo.email`
- `https://www.googleapis.com/auth/userinfo.profile`

---

### Step 2: Implement signInWithProvider Function

**File:** `src/lib/auth.ts`

**Add/Uncomment:**
```typescript
/**
 * Sign in with OAuth provider (Google)
 */
export async function signInWithProvider(provider: 'google') {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });

  if (error) throw error;
  return data;
}
```

**Notes:**
- `redirectTo`: Where user returns after OAuth consent
- `access_type: 'offline'`: Get refresh token
- `prompt: 'consent'`: Always show consent screen (ensures fresh tokens)

---

### Step 3: Create OAuth Callback Page

**File:** `src/app/auth/callback.tsx` (NEW FILE)

**Create:**
```typescript
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { IconLoader2 } from '@tabler/icons-react';

/**
 * OAuth Callback Handler
 *
 * This page is where users land after authorizing with Google.
 * Supabase automatically exchanges the code for tokens.
 * We check onboarding status and redirect accordingly.
 */
export function OAuthCallbackPage() {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    async function handleCallback() {
      try {
        // Get session (Supabase handles token exchange automatically)
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) throw sessionError;

        if (!session) {
          throw new Error('לא נמצאה הפעלת חשבון');
        }

        // Get user profile to check onboarding status
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('completed_onboarding')
          .eq('id', session.user.id)
          .single();

        if (profileError) {
          // Profile might not exist yet - this is okay for first sign-in
          // It will be created by database trigger or onboarding flow
          console.warn('Profile not found, redirecting to onboarding', profileError);
          navigate('/onboarding', { replace: true });
          return;
        }

        // Redirect based on onboarding status
        if (profile?.completed_onboarding) {
          toast({
            title: 'התחברת בהצלחה!',
            description: 'ברוך הבא חזרה',
          });
          navigate('/dashboard', { replace: true });
        } else {
          navigate('/onboarding', { replace: true });
        }
      } catch (error) {
        console.error('OAuth callback error:', error);
        toast({
          variant: 'destructive',
          title: 'שגיאה בהתחברות',
          description: error instanceof Error ? error.message : 'אירעה שגיאה לא צפויה',
        });
        navigate('/auth/login', { replace: true });
      }
    }

    handleCallback();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <IconLoader2 className="w-12 h-12 animate-spin text-emerald-500 mx-auto mb-4" />
        <p className="text-lg text-gray-600 dark:text-gray-400">מתחבר...</p>
        <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
          אנא המתן בזמן שאנחנו מסיימים את ההתחברות
        </p>
      </div>
    </div>
  );
}
```

---

### Step 4: Add Callback Route

**File:** `src/app/routes.tsx`

**Add route:**
```typescript
import { OAuthCallbackPage } from './auth/callback';

// In routes configuration:
{
  path: '/auth/callback',
  element: <OAuthCallbackPage />,
},
```

---

### Step 5: Update Login Page - Enable Google OAuth

**File:** `src/app/auth/login.tsx`

**Changes:**

1. **Uncomment imports:**
```typescript
import { IconBrandGoogle } from '@tabler/icons-react';
import { signInWithProvider } from '../../lib/auth';
```

2. **Uncomment state:**
```typescript
const [isGoogleLoading, setIsGoogleLoading] = useState(false);
```

3. **Uncomment handler:**
```typescript
const handleGoogleSignIn = async () => {
  try {
    setIsGoogleLoading(true);
    await signInWithProvider('google');
    // Note: User will be redirected to Google, then back to /auth/callback
    // No toast here - callback page will show success message
  } catch (error) {
    console.error('Google sign-in error:', error);
    toast({
      variant: 'destructive',
      title: 'שגיאה בהתחברות עם Google',
      description: error instanceof Error ? error.message : 'אירעה שגיאה לא צפויה',
    });
    setIsGoogleLoading(false);
  }
};
```

4. **Uncomment Google button (around line 200):**
```typescript
{/* Google OAuth */}
<Button
  type="button"
  variant="outline"
  size="lg"
  onClick={handleGoogleSignIn}
  disabled={isLoading || isGoogleLoading}
  className="w-full gap-2"
>
  {isGoogleLoading ? (
    <IconLoader2 className="w-5 h-5 animate-spin" />
  ) : (
    <IconBrandGoogle className="w-5 h-5" />
  )}
  {he.googleSignIn}
</Button>

{/* Divider */}
<div className="relative">
  <div className="absolute inset-0 flex items-center">
    <span className="w-full border-t border-gray-300 dark:border-gray-600" />
  </div>
  <div className="relative flex justify-center text-sm">
    <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
      או
    </span>
  </div>
</div>
```

---

### Step 6: Update Registration Page - Enable Google OAuth

**File:** `src/app/auth/register.tsx`

**Apply same changes as login.tsx:**
1. Import IconBrandGoogle and signInWithProvider
2. Add isGoogleLoading state
3. Add handleGoogleSignIn handler
4. Uncomment Google sign-up button
5. Update Hebrew text to: "הירשם עם Google"

---

### Step 7: Update Hebrew Locale

**File:** `src/lib/locale/he.ts`

**Add/Update:**
```typescript
export const hebrewLocale = {
  auth: {
    // ... existing translations
    googleSignIn: 'התחבר עם Google',
    googleSignUp: 'הירשם עם Google',
    oauthDivider: 'או',
    oauthError: 'שגיאה בהתחברות עם Google',
    oauthSuccess: 'התחברת בהצלחה!',
    oauthRedirecting: 'מתחבר...',
  },
  // ...
};
```

---

### Step 8: Database Trigger for OAuth Profile Creation

**File:** `supabase/migrations/XXX_oauth_profile_trigger.sql` (NEW FILE)

**Create:**
```sql
-- Trigger to automatically create profile for OAuth users
-- This ensures profile exists even if onboarding is skipped

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users insert
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

**Notes:**
- This trigger creates a profile automatically when a user signs up via OAuth
- Extracts display_name from Google profile metadata
- Uses email as fallback for display_name
- `ON CONFLICT DO NOTHING` prevents errors if profile already exists

---

### Step 9: Test OAuth Flow

**Manual Testing:**

1. **Local Development:**
   ```bash
   npm run dev
   # Note: OAuth redirect URLs in Supabase must include http://localhost:5173/auth/callback
   ```

2. **Test New User Sign-Up:**
   - Visit http://localhost:5173/auth/login
   - Click "Sign in with Google"
   - Authorize with Google account (use test account)
   - Verify redirect to /onboarding
   - Complete onboarding
   - Verify redirect to /dashboard
   - Check Supabase: profiles table should have new record

3. **Test Returning User Sign-In:**
   - Sign out
   - Visit /auth/login
   - Click "Sign in with Google"
   - Authorize (should be instant if still logged into Google)
   - Verify redirect to /dashboard (skip onboarding)
   - Check console: no errors

4. **Test Error Cases:**
   - Click Google button, then cancel consent → should show error toast
   - Disable network, click Google button → should handle gracefully
   - Sign in with Google account that has no email permission → should show error

5. **Test Security:**
   - Check browser DevTools → Application → Cookies
   - Verify auth tokens are httpOnly
   - Verify no sensitive data in localStorage
   - Check Network tab: OAuth tokens not exposed

---

### Step 10: Update Environment Variables (if needed)

**File:** `.env.local`

**Ensure configured:**
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
# No Google credentials needed on client side - Supabase handles it
```

**File:** `README.md` or `.env.example`

**Document OAuth setup:**
```markdown
## OAuth Configuration

### Google OAuth Setup
1. Go to Supabase Dashboard → Authentication → Providers
2. Enable Google provider
3. Follow Supabase instructions to create Google OAuth credentials
4. Set redirect URL: `https://your-project.supabase.co/auth/v1/callback`
5. Configure authorized domains in Google Cloud Console
```

---

## Technical Notes

### OAuth Flow Sequence

1. **User clicks "Sign in with Google"**
   - `signInWithProvider('google')` is called
   - Supabase redirects to Google consent screen

2. **User authorizes on Google**
   - Google redirects back to Supabase callback URL
   - Supabase exchanges authorization code for tokens
   - Supabase redirects to app callback page (`/auth/callback`)

3. **App callback page handles redirect**
   - Extracts session from Supabase
   - Checks profile for onboarding status
   - Redirects to `/onboarding` or `/dashboard`

4. **Database trigger creates profile**
   - If new user, trigger creates profile record
   - Extracts name from Google metadata
   - Sets completed_onboarding = false

### Security Considerations

- **Tokens:** Stored in httpOnly cookies (Supabase handles)
- **CSRF:** Protected by Supabase (state parameter)
- **Scopes:** Only request email and profile (minimal)
- **Redirect URLs:** Whitelist exact URLs in Supabase
- **Error Handling:** Never expose sensitive error details to user

### Supabase OAuth vs Auth0 / Firebase

**Why Supabase OAuth is sufficient:**
- Built-in OAuth provider support
- Automatic token management
- Works with existing RLS policies
- No additional cost
- Simple configuration

**When you might need Auth0/Firebase:**
- Need enterprise SSO (SAML)
- Need MFA enforcement at provider level
- Need custom OAuth providers not supported by Supabase

---

## Definition of Done

- [ ] Google OAuth enabled in Supabase project
- [ ] Google Cloud Console OAuth credentials configured
- [ ] `signInWithProvider` function implemented
- [ ] OAuth callback page created
- [ ] Callback route added to routes.tsx
- [ ] Login page Google button enabled
- [ ] Registration page Google button enabled
- [ ] Hebrew translations added for OAuth UI
- [ ] Database trigger for profile creation tested
- [ ] Happy path tested: new user sign-up via Google
- [ ] Happy path tested: returning user sign-in via Google
- [ ] Error cases tested: cancel consent, network error
- [ ] Security verified: tokens are httpOnly, no sensitive data exposed
- [ ] No console errors during OAuth flow
- [ ] Documentation updated with OAuth setup instructions
- [ ] Build completes with no errors
- [ ] Manual testing on dev environment passes
- [ ] Code reviewed and approved

---

## Related Files

**Modified:**
- `src/lib/auth.ts` - Add signInWithProvider function
- `src/app/auth/login.tsx` - Enable Google sign-in button
- `src/app/auth/register.tsx` - Enable Google sign-up button
- `src/lib/locale/he.ts` - Add OAuth translations
- `src/app/routes.tsx` - Add callback route

**Created:**
- `src/app/auth/callback.tsx` - OAuth callback handler
- `supabase/migrations/XXX_oauth_profile_trigger.sql` - Database trigger

**Configuration:**
- Supabase Dashboard → Authentication → Providers → Google
- Google Cloud Console → OAuth credentials

---

## Estimated Effort

**Story Points:** 3

**Breakdown:**
- Supabase OAuth configuration: 30 min
- Google Cloud Console setup: 30 min
- Implement signInWithProvider: 15 min
- Create callback page: 30 min
- Enable login page button: 15 min
- Enable registration page button: 15 min
- Database trigger: 20 min
- Testing (happy path): 30 min
- Testing (error cases): 20 min
- Security verification: 15 min
- Documentation: 15 min

**Total:** ~4 hours

---

## Success Metrics

**User Experience:**
- Reduced signup friction (no password required)
- Faster authentication (one-click sign-in)
- Industry-standard option available

**Technical:**
- Zero OAuth-related errors in production
- 100% successful OAuth callback handling
- Proper profile creation for all OAuth users

**Business:**
- Increase conversion rate by 20-30% (industry standard for OAuth)
- Reduce password reset requests
- Improve user satisfaction

---

**Created:** November 8, 2025
**Author:** Dev Agent (Amelia)
**Status:** Ready to Implement

