# Dev Agent Prompt: Execute 0.X Story Series

## 🎯 Objective

Execute all pending 0.X "on-the-go" stories in sequential order, from Story 0.5 through Story 0.13. These are ad-hoc enhancements and fixes that need attention but weren't part of the original epic planning.

## 📋 Story List (Execute in Order)

1. **Story 0.5** (3 points, ~4.5h) - Expand Avatar Collection & Add Onboarding Avatar Selection
2. ~~**Story 0.6** (3 points, ~8h) - Dark Mode Full Implementation~~ **[NOT DOING NOW]**
3. **Story 0.7** (1 point, ~2h) - Real-time Avatar Update Reflection
4. **Story 0.8** (2 points, ~6.5h) - Admin Pages Mobile Responsiveness
5. **Story 0.9** (5 points, ~7.5h) - Implement Settings Page Features
6. **Story 0.10** (5 points, 6-9 days) - My Learning Journey (מסלול הלמידה שלי)
7. **Story 0.11** (2 points, ~1.5h) - Documentation Organization & Archive
8. **Story 0.12** (1 point, ~2h) - Remove Console Logs from Codebase
9. **Story 0.13** (1 point, ~1.5h) - Create BMAD Installation Guide Access Point

**Total:** 20 points, ~2-3 weeks (Story 0.6 postponed)

## 🔄 Workflow for Each Story

For **EACH** story, follow this exact workflow:

### 1. Load Story
```
- Read complete story file: STORY-0.X.md
- Verify status is "Ready for Implementation"
- Review ALL acceptance criteria
- Review technical notes
- Check dependencies
- Understand Definition of Done
```

### 2. Implement
```
- Create/modify files per acceptance criteria
- Follow existing code patterns
- Use TypeScript strict mode
- Use Tabler Icons (NO emojis) [[memory:10875022]]
- Use Varela Round font [[memory:10875021]]
- Ensure RTL support for Hebrew
- PowerShell: use ; not && for chaining [[memory:10949385]]
```

### 3. Test
```
- Run linter (npm run lint)
- Run build (npm run build)
- Manual testing:
  - All acceptance criteria
  - Desktop + mobile
  - RTL layout
  - Dark mode (if applicable)
  - Keyboard navigation
- Verify no regressions
```

### 4. Complete
```
- Verify ALL acceptance criteria met
- Verify ALL Definition of Done items complete
- Create STORY-0.X-COMPLETE.md:
  - Summary of changes
  - Files modified/created
  - Testing performed
  - Screenshots (if UI changes)
- Update NEXT-STORY.md
- Update IMPLEMENTATION-STATUS.md (if needed)
```

### 5. Move to Next Story
```
- Proceed to next story in sequence
- DO NOT skip ahead
```

## ⚠️ Critical Guidelines

### Code Quality
- ✅ No emojis - use Tabler Icons instead
- ✅ Varela Round font for all text
- ✅ TypeScript strict mode must pass
- ✅ Zero ESLint warnings
- ✅ RTL support for all Hebrew content
- ✅ PowerShell: use semicolons (;) not &&

### Implementation Principles
1. **Follow acceptance criteria exactly** - don't invent features
2. **Reuse existing components** - don't rebuild from scratch
3. **Test thoroughly** - don't cheat or skip tests
4. **Complete before moving on** - one story at a time
5. **Execute continuously** - don't pause unless blocked

### Continuous Execution
> Work through the ENTIRE story without pausing. Don't stop at "milestones" - keep going until complete (all ACs satisfied, all tasks checked, all tests passing 100%). Only stop if you hit a blocker that requires external input.

## 🚀 Getting Started

```bash
# Step 1: Activate dev agent
@bmad/bmm/agents/dev

# Step 2: Load and execute first story
*develop-story
# Then load: STORY-0.5.md

# Step 3: Upon completion, move to next story
# Load: STORY-0.6.md
# Repeat until all 9 stories complete
```

## 📊 Story Details Quick Reference

### Story 0.5: Avatar Expansion & Onboarding
- Add 4 new DiceBear styles (8 total)
- Add avatar selection as Step 2 in onboarding
- Update to 6-step onboarding flow
- Change term to "און בורדינג"

### ~~Story 0.6: Dark Mode~~ [NOT DOING NOW]
- ~~Fix dark mode toggle functionality~~
- ~~Implement dark mode for ALL pages (including auth)~~
- ~~Theme persistence across sessions~~
- ~~WCAG AA contrast compliance~~

### Story 0.7: Avatar Real-time Update
- Create UserContext for global avatar state
- Update avatar immediately across all components
- No page refresh needed
- Cache invalidation

### Story 0.8: Admin Mobile Responsiveness
- Responsive admin dashboard
- Mobile-friendly navigation (hamburger menu)
- Card-based or scrollable tables
- All admin pages work on mobile

### Story 0.9: Settings Implementation
- Notification preferences (email, in-app)
- Appearance settings (theme, density, font-size)
- Privacy settings (visibility, analytics)
- Language settings (locale, date format)
- Data export (GDPR compliance)

### Story 0.10: Learning Journey
- Visual roadmap with 4 phases
- Phase-based progression (Core → Recommended → Interests → Optional)
- Gamification (confetti, achievements)
- `/journey` page with phase cards

### Story 0.11: Documentation Organization
- Create `docs/archive/` structure
- Move all COMPLETE stories to archive
- Organize by epic/sprint
- Clean up project root (~80% file reduction)

### Story 0.12: Console Log Cleanup
- Remove all debug console.log statements
- Keep only intentional error logging
- Add ESLint rule to prevent future logs
- Replace with proper error handling (toasts)

### Story 0.13: Installation Guide Access
- Make `docs/how-to-install.md` accessible in app
- Convert to JSON guide format
- Add to guides system or create dedicated page
- Featured/prominent placement

## 📝 After Completing ALL Stories

### Final Verification
- [ ] All 9 STORY-0.X-COMPLETE.md files exist
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] Build succeeds
- [ ] All features tested
- [ ] Mobile responsive verified
- [ ] RTL layout verified
- [ ] Dark mode verified
- [ ] Repository cleaned (after 0.11)
- [ ] Console logs removed (after 0.12)
- [ ] Installation guide accessible (after 0.13)

### Result
After completing this series, the Agenseek project will have:
- ✨ Enhanced user experience (avatar expansion, learning journey)
- 🌙 Full dark mode support
- 📱 Mobile-responsive admin pages
- ⚙️ Complete settings functionality
- 📚 Clean, organized documentation
- 🧹 Professional, clean codebase
- 📖 Accessible installation guide

## 📖 Reference Documents

- **Full Execution Plan:** `STORY-0.X-EXECUTION-PLAN.md`
- **Dev Agent Rules:** `.cursor/rules/bmad/bmm/agents/dev.mdc`
- **Project Status:** `IMPLEMENTATION-STATUS.md`
- **Story Files:** `STORY-0.5.md` through `STORY-0.13.md`

---

**Instructions:** Give this prompt to the dev agent along with `@bmad/bmm/agents/dev` to begin execution. The dev agent will work through each story systematically until all 9 stories are complete.

---

**Created by:** BMad Master
**Date:** November 9, 2025
**Purpose:** Dev Agent Execution of 0.X Story Series

