# Story 11.4: Hebrew Terminology Standardization - Agent → Sochen

**Status:** 📋 Ready for Implementation  
**Type:** Content Quality / Localization  
**Priority:** P1 - High  
**Sprint:** TBD | **Points:** 5 (Large)  
**Created:** November 9, 2025  

---

## 🎯 Problem Statement

**Current Issue:**

Throughout the Hebrew content, the English word "agent" is transliterated in various Hebrew spellings instead of using the proper Hebrew term:

**Current (Incorrect) Variations:**
- אייגנט (eygent)
- אגנט (agent)
- אייג'נט (eyg'ent)
- אייגנטים (plural)
- אגנטים (plural)

**Should Be:**
- **סוכן** (sochen) - singular, masculine
- **סוכנת** (sochenet) - singular, feminine (if needed)
- **סוכנים** (sochanim) - plural, masculine/mixed
- **סוכנות** (sochanot) - plural, feminine (if needed)

**Impact:**
- **Unprofessional**: Using English transliterations instead of Hebrew
- **Inconsistent**: Multiple spellings create confusion
- **Poor UX**: Doesn't feel like a Hebrew-first application
- **Searchability**: Users might search for "סוכן" and find nothing
- **Brand Quality**: Reflects poorly on content quality

---

## 📖 User Story

**As a Hebrew-speaking user,**  
**I want proper Hebrew terminology throughout the app,**  
**So that the content feels professional, natural, and properly localized.**

---

## ✅ Acceptance Criteria

### 1. Comprehensive Content Audit

**Given** "agent" appears in various forms  
**When** auditing all Hebrew content  
**Then:**

- [ ] Search for ALL variations of "agent" in Hebrew:
  - `אייגנט`
  - `אגנט`
  - `אייג'נט`
  - `אגנטים`
  - `אייגנטים`
  - Any other transliterations

- [ ] Document ALL occurrences with:
  - File path
  - Line number
  - Context (surrounding text)
  - Recommended replacement

- [ ] Create replacement checklist

**Files to Audit:**
- `src/lib/locale/he.ts` - Hebrew locale file
- `src/content/locale/he/**/*.json` - All Hebrew guide content
- `public/content/**/*.json` - Public guide content
- Any markdown files with Hebrew content
- Database seed files with Hebrew text
- README files in Hebrew

---

### 2. Define Hebrew Terminology Standards

**Given** need for consistent terminology  
**When** replacing "agent"  
**Then:**

#### Singular Forms:
- **סוכן** (sochen) - Use for:
  - Generic reference: "The agent..."
  - Masculine/neutral: "סוכן הפיתוח" (Development agent)
  - Default form in most cases

- **סוכנת** (sochenet) - Use for:
  - Feminine: "סוכנת העיצוב" (Design agent - feminine)
  - When specifically referring to feminine agent
  - Rare usage (most agents neutral/masculine)

#### Plural Forms:
- **סוכנים** (sochanim) - Use for:
  - Multiple agents
  - Mixed gender groups
  - Default plural: "צוות של סוכנים"

- **סוכנות** (sochanot) - Use for:
  - All-feminine group of agents
  - Very rare usage

#### Construct State (Smichut):
- **סוכן ה...** (sochen ha-) - "The agent of..."
- **סוכני ה...** (sochney ha-) - "The agents of..."
- Example: "סוכני הפיתוח" (The development agents)

---

### 3. Context-Aware Replacements

**Given** different contexts require different grammar  
**When** replacing terms  
**Then:**

Ensure replacements maintain proper Hebrew grammar:

#### Example Replacements:

| Original (Wrong) | Context | Correct Replacement |
|---|---|---|
| "אייגנט פיתוח" | Development agent | "סוכן פיתוח" |
| "אגנטים שונים" | Different agents | "סוכנים שונים" |
| "האייגנט מבצע" | The agent executes | "הסוכן מבצע" |
| "עבודה עם אגנטים" | Working with agents | "עבודה עם סוכנים" |
| "אייגנט AI" | AI agent | "סוכן AI" |
| "צוות האגנטים" | The agents team | "צוות הסוכנים" |

#### Grammar Rules:
- Maintain definite article (ה): "האייגנט" → "הסוכן"
- Maintain plural agreements: "אגנטים רבים" → "סוכנים רבים"
- Maintain possession: "האגנט שלי" → "הסוכן שלי"
- Maintain construct state: "אגנטי BMAD" → "סוכני BMAD"

---

### 4. Update Locale File

**Given** `src/lib/locale/he.ts` is the main locale source  
**When** updating terminology  
**Then:**

- [ ] Find all "agent" references
- [ ] Replace with proper Hebrew:
  - `agent` → `סוכן`
  - `agents` → `סוכנים`
  - `agentName` → `שם הסוכן`
  - `selectAgent` → `בחר סוכן`
  - `availableAgents` → `סוכנים זמינים`

- [ ] Ensure all references consistent
- [ ] Check TypeScript interfaces for any comments
- [ ] Update JSDoc comments if they reference "agent"

**Example Changes:**

```typescript
// BEFORE:
export const hebrewLocale: LocaleStrings = {
  agents: {
    title: 'אגנטים',
    description: 'עבוד עם אגנטים שונים',
    selectAgent: 'בחר אגנט',
    availableAgents: 'אגנטים זמינים',
  }
};

// AFTER:
export const hebrewLocale: LocaleStrings = {
  agents: {
    title: 'סוכנים',
    description: 'עבוד עם סוכנים שונים',
    selectAgent: 'בחר סוכן',
    availableAgents: 'סוכנים זמינים',
  }
};
```

---

### 5. Update Guide Content

**Given** guide content may reference agents  
**When** updating guide JSON files  
**Then:**

- [ ] Search all guide JSON files in `src/content/locale/he/`
- [ ] Find paragraphs, headings, lists mentioning "agent"
- [ ] Replace with contextually correct Hebrew
- [ ] Maintain proper markdown formatting
- [ ] Ensure grammar correctness

**Files to Check:**
- `src/content/locale/he/guides/**/*.json`
- All guide categories: core, workflows, agents, roles, etc.

**Example:**

```json
// BEFORE:
{
  "type": "paragraph",
  "content": "האגנט מבצע משימות אוטומטיות"
}

// AFTER:
{
  "type": "paragraph",
  "content": "הסוכן מבצע משימות אוטומטיות"
}
```

---

### 6. Update Public Content

**Given** public content folder exists  
**When** updating terminology  
**Then:**

- [ ] Check `public/content/**/*.json`
- [ ] Update any "agent" references
- [ ] Ensure consistency with main content

---

### 7. Search All Hebrew Files

**Given** terminology could appear anywhere  
**When** performing thorough search  
**Then:**

Use grep/search to find ALL occurrences:

```powershell
# PowerShell search commands:

# Find all variations of "agent" in Hebrew files
Get-ChildItem -Recurse -Include *.ts,*.tsx,*.json,*.md | Select-String "אייגנט|אגנט|אייג'נט"

# Count occurrences
(Get-ChildItem -Recurse -Include *.ts,*.tsx,*.json,*.md | Select-String "אייגנט|אגנט|אייג'נט").Count

# List files containing the term
Get-ChildItem -Recurse -Include *.ts,*.tsx,*.json,*.md | Select-String "אייגנט|אגנט|אייג'נט" | Select-Object -Unique Path
```

- [ ] Run searches for each variation
- [ ] Document all files requiring changes
- [ ] Create checklist of files to update

---

### 8. Database Content Check

**Given** database may contain Hebrew content  
**When** checking database  
**Then:**

- [ ] Check if any database tables have Hebrew text with "agent"
- [ ] Check seed files: `supabase/seed.sql` (if exists)
- [ ] Check migrations with INSERT statements
- [ ] Update any hardcoded Hebrew strings in database

**Tables to Check:**
- `guides` table (if Hebrew content stored)
- `categories` table (Hebrew names)
- `achievements` table (Hebrew descriptions)
- Any table with `description` or `title` fields

---

### 9. Update Documentation

**Given** documentation may reference terminology  
**When** updating docs  
**Then:**

- [ ] Check `docs/**/*.md` for Hebrew content
- [ ] Update any "agent" references
- [ ] Update glossary/terminology sections if they exist
- [ ] Add note about using "סוכן" not "אייגנט"

---

### 10. Verify Replacements

**Given** replacements have been made  
**When** verifying correctness  
**Then:**

- [ ] Re-run searches to ensure all variations removed
- [ ] Check that replacements maintain proper Hebrew grammar
- [ ] Verify no half-translations (e.g., "סוכן agent")
- [ ] Ensure consistent usage throughout app
- [ ] Have native Hebrew speaker review (if possible)

---

### 11. Test Content Display

**Given** content has been updated  
**When** viewing in app  
**Then:**

- [ ] All UI elements display "סוכן/סוכנים"
- [ ] Guide content uses correct terminology
- [ ] No English transliterations visible
- [ ] Grammar reads naturally
- [ ] Search functionality works with new terms

---

### 12. Create Terminology Guide

**Given** future content will be added  
**When** documenting standards  
**Then:**

- [ ] Create or update `docs/hebrew-terminology.md`
- [ ] Document the change: "אייגנט" → "סוכן"
- [ ] Provide examples and grammar rules
- [ ] Add to onboarding for content writers

**Example Documentation:**

```markdown
# Hebrew Terminology Standards

## AI Agents

### ❌ DO NOT USE:
- אייגנט
- אגנט  
- אייג'נט
- אגנטים

### ✅ CORRECT USAGE:
- **סוכן** (sochen) - Singular agent
- **סוכנים** (sochanim) - Plural agents
- **סוכן AI** - AI agent
- **סוכני BMAD** - BMAD agents

### Examples:
- "הסוכן מבצע את המשימה" - The agent executes the task
- "צוות הסוכנים עובד יחד" - The team of agents works together
- "בחר סוכן מהרשימה" - Select an agent from the list
```

---

## 🔧 Technical Implementation

### Search Strategy

#### Step 1: Find All Occurrences

```powershell
# PowerShell commands:

# Search TypeScript/TSX files
Get-ChildItem -Path src -Recurse -Include *.ts,*.tsx | Select-String "אייגנט|אגנט"

# Search JSON files
Get-ChildItem -Path src -Recurse -Include *.json | Select-String "אייגנט|אגנט"

# Search markdown files
Get-ChildItem -Recurse -Include *.md | Select-String "אייגנט|אגנט"

# Generate file list
Get-ChildItem -Path src -Recurse -Include *.ts,*.tsx,*.json | Select-String "אייגנט|אגנט" | Select-Object Path -Unique | Out-File "files-to-update.txt"
```

#### Step 2: Systematic Replacement

For each file:
1. Open file
2. Find all occurrences (Ctrl+F)
3. Replace contextually:
   - Check surrounding grammar
   - Ensure singular/plural correct
   - Maintain definite articles
4. Save and mark as complete

---

### Files Priority List

**High Priority (User-Facing):**
1. `src/lib/locale/he.ts` - Main locale file
2. `src/content/locale/he/**/*.json` - Guide content
3. UI component strings

**Medium Priority:**
4. Documentation files
5. Database seed files

**Low Priority:**
6. Comments in code
7. Old/archived content

---

### Replacement Script (Optional)

**Warning**: Automated replacement can break grammar. Manual review recommended.

```powershell
# Careful: This replaces ALL occurrences
# Better to do manual replacement with review

$files = Get-ChildItem -Path src -Recurse -Include *.json

foreach ($file in $files) {
  $content = Get-Content $file.FullName -Raw -Encoding UTF8
  $content = $content -replace 'אייגנט(?!ים)', 'סוכן'  # Singular
  $content = $content -replace 'אייגנטים', 'סוכנים'   # Plural
  $content = $content -replace 'אגנט(?!ים)', 'סוכן'    # Singular alt
  $content = $content -replace 'אגנטים', 'סוכנים'     # Plural alt
  Set-Content $file.FullName $content -Encoding UTF8
}
```

**Recommendation**: DON'T run automated script. Do manual replacement with context review.

---

## 🧪 Testing Checklist

### Search Verification
- [ ] Search for "אייגנט" returns 0 results in src/
- [ ] Search for "אגנט" returns 0 results in src/
- [ ] Search for "אייג'נט" returns 0 results in src/
- [ ] Only "סוכן/סוכנים" appears in Hebrew content

### Content Display Testing
- [ ] Dashboard: Correct terminology
- [ ] Guides library: Correct terminology
- [ ] Guide reader: Correct terminology
- [ ] UI labels: Correct terminology
- [ ] Tooltips: Correct terminology
- [ ] Help text: Correct terminology

### Grammar Testing
- [ ] All replacements grammatically correct
- [ ] Definite articles preserved (ה)
- [ ] Plural forms correct
- [ ] Construct state correct
- [ ] Natural Hebrew phrasing

### Search Functionality
- [ ] Searching for "סוכן" finds relevant content
- [ ] Searching for "אייגנט" finds nothing (no old term)
- [ ] Guide search works with new terminology

### Visual Testing
- [ ] All text displays correctly (no encoding issues)
- [ ] RTL layout still correct
- [ ] No broken formatting
- [ ] Mobile display correct

---

## ✅ Definition of Done

Before marking story complete, verify:

### Content Updated
- [ ] Locale file (`he.ts`) updated
- [ ] All guide JSON files updated
- [ ] All UI strings updated
- [ ] Public content updated
- [ ] Database content updated (if applicable)

### Quality Assurance
- [ ] Zero occurrences of "אייגנט", "אגנט", "אייג'נט" remain
- [ ] All replacements grammatically correct
- [ ] Native Hebrew review completed (if possible)
- [ ] No encoding/display issues

### Documentation
- [ ] Terminology guide created/updated
- [ ] Change documented for future reference
- [ ] Team aware of new standard

### Testing
- [ ] Manual review of key pages
- [ ] Search functionality verified
- [ ] No visual regressions
- [ ] Mobile testing passed

---

## 📊 Success Metrics

**Terminology Consistency:**
- 100% of "agent" references use "סוכן/סוכנים"
- Zero English transliterations in Hebrew content

**Content Quality:**
- Native speakers confirm natural Hebrew phrasing
- Professional terminology throughout
- Improved searchability

**Expected Replacement Count:**
- Estimated: 50-150 occurrences across all files
- Actual: [Document after completion]

---

## 🚀 Implementation Plan

### Phase 1: Audit & Discovery (1 hour)
1. Run comprehensive searches
2. Document all occurrences with context
3. Create file-by-file checklist
4. Estimate total replacements needed

### Phase 2: Locale File Update (30 min)
1. Update `src/lib/locale/he.ts`
2. Replace all "agent" strings
3. Test build
4. Verify UI updates

### Phase 3: Guide Content Update (2 hours)
1. Update guide JSON files (largest effort)
2. File-by-file replacement with grammar check
3. Verify no broken JSON
4. Test guide display

### Phase 4: Remaining Files (1 hour)
1. Update public content
2. Update documentation
3. Update any database content
4. Final search verification

### Phase 5: Testing & Documentation (30 min)
1. Comprehensive testing
2. Create terminology guide
3. Document changes
4. Final review

**Total Estimated Time:** 5-6 hours (5 points)

---

## 📝 Notes & Considerations

### Hebrew Grammar Notes

**Definite Article (ה):**
- "agent" → "סוכן"
- "the agent" → "הסוכן"

**Possession:**
- "my agent" → "הסוכן שלי"
- "your agent" → "הסוכן שלך"

**Adjective Agreement:**
- "good agent" → "סוכן טוב" (masculine)
- "good agents" → "סוכנים טובים" (masculine plural)

**Common Phrases:**
- "AI agent" → "סוכן AI" or "סוכן בינה מלאכותית"
- "the agents system" → "מערכת הסוכנים"
- "agent-based" → "מבוסס-סוכנים"

### Why "סוכן" is Correct

The Hebrew word "סוכן" (sochen) means:
1. Agent (in computing/AI context)
2. Representative
3. Broker

It's the proper, professional Hebrew term used in:
- Software development
- AI literature in Hebrew
- Professional/business contexts

Transliterations like "אייגנט" are:
- Informal
- Unprofessional
- Not standard Hebrew
- Confusing (multiple spellings)

---

## 🔗 Related Stories & Dependencies

### Depends On:
- None (standalone content update)

### Blocks:
- Future content quality
- Professional localization

### Related:
- Story 11.3 - RTL layout (both improve Hebrew UX)
- Hebrew-only policy enforcement

### Future Considerations:
- Review other English transliterations that should use Hebrew
- Consider full terminology audit for other tech terms

---

**Created by:** Ben Akiva  
**Date:** November 9, 2025  
**Story Type:** Content Quality / Localization (Epic 11)  
**Estimated Effort:** 5 story points (~5-6 hours)  

---

*Making Agenseek truly Hebrew-first with professional, natural terminology!*

