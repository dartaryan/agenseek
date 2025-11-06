# Story 1.10: Set Up Development Scripts and Code Quality Tools

**Epic:** Epic 1 - Project Foundation & Infrastructure  
**Sprint:** Sprint 1 (Week 1)  
**Story Points:** 1  
**Priority:** P0 (Critical)  
**Status:** Ready

---

## User Story

**As a** developer,  
**I want** code quality tools configured (linting, formatting, type checking),  
**So that** code is consistent and catches errors early.

---

## Acceptance Criteria

**Given** the project is set up  
**When** I configure code quality tools  
**Then**:
- ESLint configured with TypeScript rules
- Prettier configured for code formatting
- `package.json` includes scripts: dev, build, preview, lint, lint:fix, type-check, format
- Create `.prettierrc.json` with semi, single quotes, tab width 2, trailing comma es5
- VS Code workspace settings recommend extensions

**And** running `npm run lint` shows no errors
**And** running `npm run type-check` shows no type errors

---

## Dependencies

**Prerequisites:**
- Story 1.9 (Deployment)

---

**Story ID:** SEEK-1.10

