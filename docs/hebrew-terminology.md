# Hebrew Terminology Standards

**Created:** November 9, 2025
**Last Updated:** November 9, 2025 (Story 11.4)
**Status:** Active

---

## Overview

This document defines the official Hebrew terminology standards for the Agenseek application. Following these standards ensures consistent, professional, and natural Hebrew throughout the application.

---

## AI Agents / אגנטים → סוכנים

### ❌ DO NOT USE

**English transliterations** (unprofessional, inconsistent):
- אייגנט
- אגנט
- אייג'נט
- אגנטים
- אייגנטים

### ✅ CORRECT USAGE

Use proper Hebrew terminology:

#### Singular Forms
- **סוכן** (sochen) - Singular agent (masculine/neutral)
  - Use for: Generic reference, masculine/neutral contexts
  - Default form in most cases
  - Example: "הסוכן מבצע משימות" (The agent executes tasks)

- **סוכנת** (sochenet) - Singular agent (feminine)
  - Use for: Specifically feminine agents (rare usage)
  - Example: "סוכנת העיצוב" (The design agent - feminine)

#### Plural Forms
- **סוכנים** (sochanim) - Plural agents (masculine/mixed)
  - Use for: Multiple agents, mixed gender groups
  - Default plural form
  - Example: "צוות של סוכנים" (A team of agents)

- **סוכנות** (sochanot) - Plural agents (all-feminine)
  - Use for: All-feminine group of agents (very rare)

#### Construct State (Smichut)
- **סוכן ה...** (sochen ha-) - "The agent of..."
- **סוכני ה...** (sochney ha-) - "The agents of..."
- Example: "סוכני הפיתוח" (The development agents)

---

## Usage Examples

### Common Phrases

| Context | Hebrew | English |
|---------|--------|---------|
| AI agent | סוכן AI | AI agent |
| Development agent | סוכן פיתוח | Development agent |
| Multiple agents | סוכנים שונים | Different agents |
| The agent executes | הסוכן מבצע | The agent executes |
| Working with agents | עבודה עם סוכנים | Working with agents |
| The agents team | צוות הסוכנים | The agents team |
| BMAD agents | סוכני BMAD | BMAD agents |
| Agent system | מערכת סוכנים | Agent system |
| Select an agent | בחר סוכן | Select an agent |
| Available agents | סוכנים זמינים | Available agents |

### In Sentences

**Good:**
- "הסוכן מבצע את המשימה באופן אוטומטי"
- "צוות הסוכנים עובד יחד"
- "בחר סוכן מהרשימה"
- "סוכני BMAD מספקים פתרונות מקצועיים"

**Bad:**
- ❌ "האגנט מבצע את המשימה"
- ❌ "צוות האגנטים עובד יחד"
- ❌ "בחר אייגנט מהרשימה"

---

## Grammar Rules

### Definite Article (ה)
- Without article: "סוכן" (agent)
- With article: "הסוכן" (the agent)
- Plural: "הסוכנים" (the agents)

### Possession
- My agent: "הסוכן שלי"
- Your agent: "הסוכן שלך"
- Our agents: "הסוכנים שלנו"

### Adjective Agreement
- Good agent: "סוכן טוב" (masculine)
- Good agents: "סוכנים טובים" (masculine plural)
- Many agents: "סוכנים רבים"

### Construct State
- Agent of BMAD: "סוכן של BMAD" or "סוכן BMAD"
- Agents of the team: "סוכני הצוות"
- Development agent: "סוכן הפיתוח"

---

## Why "סוכן" is Correct

The Hebrew word **"סוכן"** (sochen) is the proper professional term meaning:
1. Agent (in computing/AI context)
2. Representative
3. Broker

### Used In:
- Software development literature
- Hebrew AI documentation
- Professional/business contexts
- Academic publications

### Transliterations are:
- ❌ Informal
- ❌ Unprofessional
- ❌ Not standard Hebrew
- ❌ Confusing (multiple spellings)
- ❌ Poor for searchability

---

## Implementation History

### Story 11.4 - November 9, 2025
**Hebrew Terminology Standardization**
- Replaced ~615 occurrences across 37 JSON guide files
- Updated TypeScript type definitions
- Verified zero occurrences of old terms in `src/`
- All user-facing content now uses proper Hebrew

---

## For Content Writers

### When Writing New Content:

1. **Always use "סוכן/סוכנים"** - Never use English transliterations
2. **Check grammar** - Ensure proper plural/singular agreement
3. **Use construct state correctly** - "סוכני BMAD" not "סוכנים של BMAD" (both correct, but construct is more natural)
4. **Maintain definite articles** - "הסוכן" when referring to a specific agent
5. **Be consistent** - Use the same form throughout a section

### Search Before Publishing:

Before committing content, verify no old terminology:
```bash
# PowerShell:
Get-ChildItem -Path src -Recurse -Include *.json,*.ts,*.tsx | Select-String "אייגנט|אגנט|אייג'נט"

# Should return: No matches
```

---

## Future Considerations

### Other Terms to Standardize

Consider reviewing these for proper Hebrew vs. transliterations:
- Workflows (וורקפלואים - transliteration, consider: תהליכי עבודה?)
- Dashboard (דשבורד - transliteration, consider: לוח מחוונים?)
- Onboarding (און בורדינג - transliteration, consider: הטמעה?)

**Note:** Not all transliterations need replacement - some are widely accepted in Hebrew tech terminology. Evaluate case-by-case.

---

## Questions or Clarifications?

For questions about Hebrew terminology:
1. Check this guide first
2. Consult with Hebrew-speaking team members
3. When in doubt, use standard Hebrew dictionaries or professional Hebrew tech resources
4. Report unclear cases to improve this guide

---

**Maintained by:** Agenseek Development Team
**Reference:** Story 11.4 - Hebrew Terminology Standardization
**Document Version:** 1.0

