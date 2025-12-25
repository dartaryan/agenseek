# Story 0.12: Remove Console Logs from Codebase

**Status:** 📋 Ready for Implementation
**Type:** On-the-Go Story (Code Quality / Technical Debt)
**Priority:** P2 - Nice to Have
**Sprint:** TBD | **Points:** 1 (Small)
**Created:** November 9, 2025

---

## 🎯 Problem Statement

**Current Issue:**

The codebase contains `console.log()` statements scattered throughout:
- Debug logs left from development
- Test output that's no longer needed
- Potentially sensitive data being logged
- Console clutter in production builds

**Impact:**
- Unprofessional console output in production
- Potential performance impact (though minimal)
- Harder to find legitimate errors in console
- Possible information leakage
- ESLint warnings may exist

---

## 📖 User Story

**As a developer maintaining Agenseek,**
**I want to remove all unnecessary console.log statements,**
**So that the production console is clean, professional, and only shows intentional logging.**

---

## ✅ Acceptance Criteria

### 1. Find All Console Logs

**Given** console.log statements exist in the codebase
**When** searching for them
**Then:**

- [ ] Run search for `console.log` across all `.ts`, `.tsx`, `.js`, `.jsx` files
- [ ] Document all occurrences with file path and line number
- [ ] Categorize each as:
  - **Remove** - Debug/test log no longer needed
  - **Keep** - Intentional error logging or critical info
  - **Replace** - Should use proper error handling instead

---

### 2. Search Patterns to Check

**Given** various console methods exist
**When** performing cleanup
**Then:**

- [ ] Search for and review each:
  - `console.log(`
  - `console.warn(`
  - `console.error(`
  - `console.info(`
  - `console.debug(`
  - `console.trace(`
  - `console.table(`

**Handling Guidelines:**
- `console.error()` - Often legitimate, review case-by-case
- `console.warn()` - May be intentional, review case-by-case
- `console.log()` - Usually debug only, remove unless justified
- `console.info()` - Review, usually can remove
- `console.debug()` - Remove (should use proper debugging tools)
- `console.trace()` - Remove (debug only)
- `console.table()` - Remove (debug only)

---

### 3. Remove Debug Logs

**Given** console logs are categorized
**When** removing unnecessary logs
**Then:**

- [ ] All debug `console.log()` statements removed
- [ ] All test-related console output removed
- [ ] No console logs in:
  - Component render functions (unless error handling)
  - Event handlers (unless error handling)
  - Data transformation utilities
  - API response handlers (unless errors)
  - Effect hooks (unless critical debugging needed)

---

### 4. Keep Intentional Logging

**Given** some logging is intentional
**When** performing cleanup
**Then:**

- [ ] Keep legitimate error logging:
  - Critical errors in try-catch blocks
  - API failure responses
  - Authentication errors
  - Database connection issues
  - Unexpected state errors

- [ ] Consider replacing with proper error handling:
  - Use toast notifications for user-facing errors
  - Use error boundaries for React errors
  - Use Sentry/logging service for production errors (future enhancement)

**Example - KEEP THIS:**
```typescript
try {
  await supabase.from('users').insert(data);
} catch (error) {
  console.error('Failed to insert user:', error); // ✓ Keep - legitimate error
  toast.error('Failed to save user');
}
```

**Example - REMOVE THIS:**
```typescript
const handleClick = () => {
  console.log('Button clicked'); // ✗ Remove - debug log
  setCount(count + 1);
};
```

---

### 5. Review Common Problem Areas

**Given** certain files commonly have debug logs
**When** cleaning up
**Then:**

- [ ] Check and clean these directories:
  - `src/app/` - All page components
  - `src/components/` - All UI components
  - `src/lib/` - Utility functions
  - `src/hooks/` - Custom React hooks
  - `src/contexts/` - Context providers
  - `src/services/` - API services

---

### 6. Replace with Proper Error Handling

**Given** some console.logs are used for error tracking
**When** finding them
**Then:**

- [ ] Replace error console.logs with:
  - User-facing toast notifications (for user errors)
  - Error boundaries (for React component errors)
  - Return error states (for function errors)
  - Throw proper errors (for critical failures)

**Before:**
```typescript
const fetchData = async () => {
  const { data, error } = await supabase.from('guides').select();
  if (error) {
    console.log('Error fetching guides:', error); // ✗ Not helpful to user
  }
  return data;
};
```

**After:**
```typescript
const fetchData = async () => {
  const { data, error } = await supabase.from('guides').select();
  if (error) {
    toast.error('Failed to load guides. Please try again.');
    throw new Error(`Failed to fetch guides: ${error.message}`);
  }
  return data;
};
```

---

### 7. Check for Template Literals

**Given** console logs may use template literals
**When** searching
**Then:**

- [ ] Search for variations:
  - `` console.log(`...`) ``
  - `console.log('...')`
  - `console.log("...")`
  - `console.log({...})`
  - Multi-line console logs

---

### 8. Verify No Leftover Comments

**Given** developers may comment out console logs
**When** cleaning up
**Then:**

- [ ] Search for commented console logs:
  - `// console.log(...)`
  - `/* console.log(...) */`
- [ ] Remove commented-out console statements
- [ ] Keep only legitimately helpful comments

---

### 9. Update ESLint Configuration

**Given** we want to prevent future console logs
**When** configuring linting
**Then:**

- [ ] Check `eslint.config.js` for console rules
- [ ] Consider adding rule:

```javascript
rules: {
  'no-console': ['warn', { 
    allow: ['error', 'warn'] // Allow console.error and console.warn
  }],
}
```

- [ ] This will warn on `console.log()` but allow intentional `console.error()`
- [ ] Run `npm run lint` to verify no new console warnings

---

### 10. Document Logging Policy

**Given** team needs guidance on logging
**When** cleanup is complete
**Then:**

- [ ] Create or update development guidelines document
- [ ] Document when to use:
  - Toast notifications (user-facing errors/success)
  - console.error() (critical errors in dev/staging)
  - Error boundaries (React component errors)
  - Proper logging service (future: Sentry, LogRocket, etc.)

---

## 🔧 Technical Implementation

### Search Commands

**PowerShell (Windows):**
```powershell
# Find all console.log occurrences
Get-ChildItem -Path src -Recurse -Filter *.tsx | Select-String "console.log"
Get-ChildItem -Path src -Recurse -Filter *.ts | Select-String "console.log"

# Find all console methods
Get-ChildItem -Path src -Recurse -Filter *.tsx | Select-String "console\."
```

**Alternative: Use grep tool in Cursor:**
- Pattern: `console\.`
- Type: `tsx` and `ts`
- Path: `src/`

### Automated Removal (Optional)

**Using sed (if available):**
```bash
# Remove lines containing only console.log
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i '/^\s*console\.log/d'
```

**Recommendation:** Do manual review first - automated removal can be dangerous.

---

## 🧪 Testing Checklist

### Pre-Cleanup Audit

- [ ] Run search for all `console.` occurrences
- [ ] Document count and locations
- [ ] Review each occurrence
- [ ] Categorize as REMOVE/KEEP/REPLACE

### Post-Cleanup Verification

- [ ] Re-run search for `console.log` → should find 0 or documented keeps
- [ ] Run `npm run lint` → no console warnings
- [ ] Run `npm run build` → successful build
- [ ] Test app in browser → no unexpected console output
- [ ] Test error scenarios → legitimate errors still logged

### Manual Testing

- [ ] Open dev tools console
- [ ] Navigate through app:
  - Dashboard
  - Guides library
  - Guide reader
  - Progress page
  - Profile/Settings
  - Notes (if implemented)
- [ ] Verify console is clean (only expected errors/warnings if any)
- [ ] Trigger error scenarios:
  - Failed API call
  - Invalid form submission
  - Network disconnection
- [ ] Verify proper error handling (toasts, not just console logs)

---

## ✅ Definition of Done

Before marking story complete, verify:

### Code Quality
- [ ] All unnecessary console.log statements removed
- [ ] Only intentional error logging remains
- [ ] ESLint passes with no console warnings
- [ ] TypeScript builds without errors
- [ ] No commented-out console statements

### Testing
- [ ] Manual app testing shows clean console
- [ ] Error handling still works properly
- [ ] No functionality broken by removals
- [ ] Build succeeds

### Documentation
- [ ] Logging policy documented (if needed)
- [ ] Team aware of console logging guidelines
- [ ] ESLint rule configured (optional but recommended)

---

## 📊 Success Metrics

**Code Quality Improvements:**
- Number of console.log statements removed: [count after audit]
- ESLint warnings reduced to 0 for console usage
- Professional console output in production

**Maintainability:**
- Easier to spot legitimate errors in console
- Future PRs can enforce no-console rule
- Cleaner, more professional codebase

---

## 🚀 Implementation Plan

### Phase 1: Audit (15 min)
1. Search for all console occurrences
2. Document locations and count
3. Categorize each occurrence
4. Create removal checklist

### Phase 2: Removal (30-45 min)
1. Remove all debug console.log statements
2. Remove test/development logs
3. Review and clean commented console logs
4. Keep only legitimate error logging

### Phase 3: Improvement (15 min)
1. Replace some console.errors with proper error handling
2. Add toast notifications where appropriate
3. Improve error messages

### Phase 4: Verification (15 min)
1. Run linter
2. Test build
3. Manual app testing
4. Verify console is clean

### Phase 5: Prevention (10 min)
1. Update ESLint config
2. Document logging policy
3. Run lint to confirm

**Total Estimated Time:** 1.5-2 hours

---

## 📝 Notes & Considerations

### Common Patterns to Remove

```typescript
// ✗ Remove these patterns:
console.log('Component mounted');
console.log('State updated:', state);
console.log('API response:', response);
console.log({ data, loading, error });
console.log('TODO: remove this log');
console.log('DEBUG:', variable);
console.log('---'); // Separator logs
```

### Patterns to Consider Keeping

```typescript
// ✓ These may be legitimate (review case-by-case):
console.error('Critical error in authentication:', error);
console.warn('Deprecated API used, migrate to v2');
console.error('Database connection failed:', connectionError);
```

### Future Enhancement: Logging Service

Consider adding a proper logging service in the future:
- **Sentry** - Error tracking and monitoring
- **LogRocket** - Session replay + console logs
- **Datadog** - Full observability platform
- **Custom Logger** - Wrapper around console with environment checks

For now, focus on clean console output and proper error handling via toasts and UI feedback.

---

## 🔗 Related Stories & Dependencies

### Depends On:
- None (standalone cleanup task)

### Blocks:
- None (does not block other work)

### Related Tasks:
- Story 0.11 - Documentation Organization
- Story 0.13 - BMAD Installation Guide Location

### Future Enhancements:
- Add Sentry for error tracking
- Implement structured logging
- Add LogRocket for session replay

---

**Created by:** Ben
**Date:** November 9, 2025
**Story Type:** On-the-Go Code Quality (0.X series)
**Estimated Effort:** 1 story point (~1.5-2 hours)

---

_Clean console = clean code. Let's make it professional!_

