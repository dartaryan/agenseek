# Agenseek V2 - Project Vision

**To:** Mary
**From:** Ben
**Date:** November 12, 2025
**Subject:** Agenseek V2 - New Features & Improvements

---

## Current Status

Agenseek V1 is essentially **complete (95% done)** and the website is working well! We're now planning V2 to add new features and polish the remaining items.

---

## Agenseek V2 - What We're Building

### 1. Questions Management System
**Goal:** Track who asked questions

We need a system to see who asked which questions in the platform. This will help us understand user engagement and provide better support.

### 2. Guide Content Management System (CMS)
**Goal:** Easy way to add, edit, and manage guides

All our guides are built on the same JSON structure. We need an admin interface where we can:

- **Add new guides** by:
  - Dropping a JSON file
  - Pasting JSON directly
  - Using a form/editor interface

- **Edit existing guides** when there are:
  - Errors that need fixing
  - Content updates needed
  - Changes to be made

- **Track edit history:**
  - Every edited guide will show a note that it has been edited
  - A dedicated page will display all edits with:
    - What was changed
    - When it was changed (dates)
    - Who made the change (author)

### 3. Bug Fixes

**a) Report Bug Feature**
- Currently not working
- Needs to be fixed and functional

**b) Image Upload**
- Add capability for users to upload their own images
- Should work smoothly in the interface

**c) Notes - Related Guides Dropdown**
- When writing a note, the dropdown of related guides is currently not working
- Needs to be fixed so users can properly link guides

### 4. Dark Mode
**Goal:** Full beautiful dark green theme

- Complete dark mode implementation across the entire website
- Dark green color scheme (aligned with Agenseek branding)
- Fully designed and beautifully implemented
- Should work on all pages and components

### 5. Mobile App (Under Consideration)
**Goal:** Turn Agenseek into a downloadable mobile app

We're exploring the possibility of making Agenseek available as a mobile app that users can download to their phones. This could be:

- **Progressive Web App (PWA)** - Installable from the browser, works offline, feels native
- **Native Mobile App** - iOS and Android apps built with React Native or similar
- **Both** - PWA for easy distribution + native apps for app stores

This would give users:
- App icon on their home screen
- Offline access to guides
- Native mobile experience
- Push notifications (for progress reminders, new content, etc.)
- Better mobile performance

**Note:** This needs research to determine the best approach (PWA vs native vs both) and will be explored during the discovery phase.

---

## Project Approach

We're using **BMad Method** for this project, which means:

1. **Brainstorming** - Explore ideas for features (especially the Guide CMS, dark mode, and mobile app)
2. **Research** - Technical research for implementations (JSON validation, image uploads, dark mode libraries, mobile app options: PWA vs native)
3. **PRD** - Document all requirements clearly
4. **UX Design** - Design the dark mode theme and Guide CMS interface
5. **Architecture** - Plan how V2 integrates with the existing V1 codebase
6. **Implementation** - Build it story by story

---

## Why These Features Matter

- **Questions Management** → Better user insights and support
- **Guide CMS** → Easy content management without technical knowledge, full audit trail
- **Bug Fixes** → Polish the user experience
- **Dark Mode** → Modern, accessible, beautiful interface option
- **Mobile App** → Wider accessibility, offline learning, native mobile experience for users on-the-go

---

## Next Steps

We're currently in the **Discovery Phase** - brainstorming and researching the best approaches for these features.

After that, we'll create detailed requirements, design the interfaces, and start building!

---

**Questions or feedback?** Let's discuss!

— Ben

