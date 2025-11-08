# 🔧 Deployment Fix: Apply Avatar Migration

**Issue:** Build failing due to missing avatar columns in profiles table
**Root Cause:** Migration file exists but was never applied to production database
**Impact:** Blocks all deployments until fixed

---

## Option 1: Apply Migration via Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Run this SQL:

```sql
-- Add avatar configuration to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS avatar_style VARCHAR(50) DEFAULT 'avataaars',
ADD COLUMN IF NOT EXISTS avatar_seed VARCHAR(100),
ADD COLUMN IF NOT EXISTS avatar_options JSONB DEFAULT '{}'::jsonb;

-- Add comments for documentation
COMMENT ON COLUMN profiles.avatar_style IS 'DiceBear avatar style (avataaars, bottts, lorelei, personas)';
COMMENT ON COLUMN profiles.avatar_seed IS 'Seed string for generating consistent avatar (typically user ID)';
COMMENT ON COLUMN profiles.avatar_options IS 'JSON configuration for avatar colors and accessories';

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_profiles_avatar_style ON profiles(avatar_style);
```

4. Click **Run**
5. Verify columns were added: `SELECT avatar_style, avatar_seed, avatar_options FROM profiles LIMIT 1;`

---

## Option 2: Apply Migration via Supabase CLI

If you have Supabase CLI set up:

```bash
# Link to your project (if not already linked)
npx supabase link --project-ref YOUR_PROJECT_REF

# Push the migration
npx supabase db push
```

---

## Option 3: Quick Fix - Comment Out Avatar Code (Temporary)

If you need to deploy immediately and deal with avatars later, you can temporarily comment out avatar-related code. However, this will break avatar functionality.

**NOT RECOMMENDED** - Better to apply the migration properly.

---

## Verify Fix

After applying the migration:

1. **Check database:**
   ```sql
   SELECT column_name, data_type, column_default
   FROM information_schema.columns
   WHERE table_name = 'profiles'
   AND column_name IN ('avatar_style', 'avatar_seed', 'avatar_options');
   ```

2. **Rebuild locally:**
   ```bash
   npm run build
   ```

3. **Redeploy to Vercel:**
   - Push to main branch OR
   - Trigger manual deployment in Vercel dashboard

---

## Why This Happened

The avatar migration file was created during Story 0.3 but:
- Was never applied to the production Supabase database
- Only existed locally or was applied to local dev environment
- TypeScript expects these columns based on the types, but they don't exist in production

---

## After Fix - Story 9.4 Will Deploy Successfully

Once the avatar columns exist in the database, the build will pass and Story 9.4's User Engagement Report will be live at `/admin/engagement`.

**Story 9.4 code is correct** ✅ - This is purely a database schema sync issue from an earlier story.

