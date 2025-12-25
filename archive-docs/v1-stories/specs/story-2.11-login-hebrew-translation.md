# Story 2.11: Comprehensive Hebrew Localization for Authentication Flows

Status: drafted

## Story

As a Hebrew-speaking user,
I want all authentication-related content (login, registration, password reset, OAuth) fully translated to Hebrew,
So that I can use the authentication system in my native language with complete clarity.

## Acceptance Criteria

### Login Page (`/auth/login`)

**Given** I am on the login page
**When** I view the interface
**Then**:
- Form labels display in Hebrew:
  - "אימייל" (Email)
  - "סיסמה" (Password)
- Buttons display in Hebrew:
  - "התחבר" (Login)
  - "זכור אותי" (Remember me)
- Links display in Hebrew:
  - "שכחת סיסמה?" (Forgot password?)
  - "אין לך חשבון? הירשם" (Don't have an account? Register)
- Placeholders display in Hebrew:
  - "הזן את האימייל שלך" (Enter your email)
  - "הזן סיסמה" (Enter password)

### Registration Page (`/auth/register`)

**Given** I am on the registration page
**When** I view the interface
**Then**:
- Form labels display in Hebrew:
  - "שם מלא" (Full name)
  - "אימייל" (Email)
  - "סיסמה" (Password)
  - "אמת סיסמה" (Confirm password)
- Button displays: "הירשם" (Register)
- Link displays: "כבר יש לך חשבון? התחבר" (Already have an account? Login)
- Password strength indicator displays:
  - "חלשה" (Weak)
  - "בינונית" (Medium)
  - "חזקה" (Strong)

### Password Reset Page (`/auth/reset-password`)

**Given** I am on the password reset page
**When** I view the interface
**Then**:
- Heading: "איפוס סיסמה" (Reset Password)
- Label: "אימייל" (Email)
- Button: "שלח קישור לאיפוס" (Send reset link)
- Success message: "בדוק את האימייל שלך לקבלת קישור לאיפוס" (Check your email for reset link)

### OAuth Integration

**Given** I see the OAuth button
**When** viewing the authentication page
**Then** the button text displays: "התחבר עם Google" (Sign in with Google)

### Error Messages

**Given** I encounter authentication errors
**When** errors occur
**Then** error messages display in Hebrew:
- "אימייל או סיסמה שגויים" (Invalid email or password)
- "האימייל כבר קיים" (Email already exists)
- "הסיסמאות לא תואמות" (Passwords don't match)
- "הסיסמה חייבת להכיל לפחות 8 תווים" (Password must be at least 8 characters)

### Loading and Success States

**And** all validation error messages appear in Hebrew
**And** all success toast notifications appear in Hebrew
**And** loading states show Hebrew text: "טוען..." (Loading...)

## Tasks / Subtasks

- [ ] Extend Hebrew locale file (AC: All sections)
  - [ ] Create `auth` section in `src/lib/locale/he.ts`
  - [ ] Add login page strings
  - [ ] Add registration page strings
  - [ ] Add password reset strings
  - [ ] Add OAuth strings
  - [ ] Add error message strings
  - [ ] Add loading/success state strings
  - [ ] Export typed interface for auth locale
- [ ] Update Login Page component (AC: Login)
  - [ ] Import auth locale
  - [ ] Replace all hardcoded English text
  - [ ] Update form labels
  - [ ] Update button text
  - [ ] Update link text
  - [ ] Update placeholder text
  - [ ] Test RTL layout
- [ ] Update Registration Page component (AC: Registration)
  - [ ] Import auth locale
  - [ ] Replace all hardcoded English text
  - [ ] Update form labels
  - [ ] Update password strength indicator
  - [ ] Update button and link text
  - [ ] Test form validation with Hebrew messages
- [ ] Update Password Reset component (AC: Password Reset)
  - [ ] Import auth locale
  - [ ] Replace heading and labels
  - [ ] Update button text
  - [ ] Update success message
  - [ ] Test email flow
- [ ] Update OAuth component (AC: OAuth)
  - [ ] Update Google OAuth button text
  - [ ] Ensure icon + text alignment works in RTL
- [ ] Create Hebrew validation schemas (AC: Error Messages)
  - [ ] Create Zod schemas with Hebrew error messages
  - [ ] Update login form validation
  - [ ] Update registration form validation
  - [ ] Update password reset validation
  - [ ] Test all error states
- [ ] Update toast notifications (AC: Loading/Success)
  - [ ] Configure toast library with Hebrew locale
  - [ ] Update success messages
  - [ ] Update error messages
  - [ ] Update loading messages
- [ ] Testing and verification (AC: All)
  - [ ] Manual test all auth flows
  - [ ] Verify zero English text in auth pages
  - [ ] Test RTL layout on mobile and desktop
  - [ ] Test keyboard navigation
  - [ ] Verify accessibility with screen reader

## Dev Notes

### Architecture Patterns
- Extend existing `src/lib/locale/he.ts` following established pattern from Story 1.11
- Use centralized locale strings for maintainability
- Ensure type safety with TypeScript interfaces
- Follow RTL design patterns from Tailwind config

### Source Tree Components to Touch
- `src/lib/locale/he.ts` - Add auth section
- `src/pages/auth/LoginPage.tsx` - Update all text
- `src/pages/auth/RegisterPage.tsx` - Update all text
- `src/pages/auth/ResetPasswordPage.tsx` - Update all text
- `src/components/auth/OAuthButton.tsx` - Update button text
- `src/lib/validation/authSchemas.ts` - Create with Hebrew error messages

### Testing Standards Summary
- Manual testing of all auth flows
- Visual regression testing for RTL layouts
- Validation error message testing
- Cross-browser testing (Chrome, Firefox, Safari)
- Mobile responsiveness testing

### References
- Locale pattern: [Source: docs/stories/story-1.11-hebrew-localization.md#Technical-Implementation]
- Auth pages: [Source: docs/epics.md#Epic-2-Stories-2.1-2.4]
- Zod validation: [Source: docs/architecture.md#Form-Validation]

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List

