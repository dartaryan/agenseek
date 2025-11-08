# 🚀 NEXT STORY: Story 9.4 - Build User Engagement Report

**Updated:** November 8, 2025

---

## ✅ Story 9.3 Complete!

Admins can now view comprehensive content analytics! Features include:

- **Guide performance table** with all guides showing:
  - Views and unique viewers
  - Average time spent
  - Completion rate
  - Helpful votes and comments count
  - Color-coded engagement level (high/medium/low)
- **Engagement summary cards** displaying:
  - Total notes, tasks, and comments
  - Average session duration
- **Category performance bar chart** showing:
  - Total views per category
  - Average completion rate per category
- **Filter by category** dropdown
- **Sort by any metric** (views, unique viewers, time, completion rate, votes, comments)
- **Export to CSV** functionality
- **Responsive layout** for mobile, tablet, desktop
- **Hebrew localization** throughout

**Completion File:** See `STORY-9.3-COMPLETE.md` for full details.

**Epic 9 Status:** 3/6 stories complete (50%)

---

## 📍 Next Story to Implement

### **Story 9.4: Build User Engagement Report**

**Epic:** 9 - Admin Analytics & Management
**Priority:** P0
**Sprint:** 12
**Story Points:** 3
**Dependencies:** Story 9.3 Complete ✅

---

## 🎯 Story 9.4 Overview

Implement a comprehensive user engagement report with segmentation, funnel analysis, activity heatmap, and cohort tracking. This helps admins understand user behavior patterns and identify at-risk users.

### User Story

**As an admin,**
**I want to view detailed user engagement reports with segmentation and funnel analysis,**
**So that I can identify engaged users, at-risk users, and understand user behavior patterns.**

---

## 📋 Acceptance Criteria

### User Segmentation

**Given** I navigate to /admin/engagement
**When** page loads
**Then:**

- [ ] Displays 4 user segments:
  - **Highly Engaged:** 70%+ progress
  - **Moderately Engaged:** 30-70% progress
  - **Low Engagement:** <30% progress (but onboarded)
  - **At Risk:** Never completed onboarding
- [ ] Each segment shows:
  - Count of users
  - Percentage of total users
  - Card with color coding (green/yellow/orange/red)

### Engagement Funnel

**Given** I view the engagement report
**When** funnel section loads
**Then:**

- [ ] Displays funnel stages:
  1. Registered (total users)
  2. Onboarded (completed wizard)
  3. First Guide (viewed at least 1 guide)
  4. Active User (completed 5+ guides)
  5. Power User (completed all core guides)
- [ ] Each stage shows:
  - Count of users
  - Percentage of total
  - Drop-off rate from previous stage
- [ ] Visual funnel chart
- [ ] Color coding for drop-off rates (green <20%, yellow 20-40%, red >40%)

### Activity Heatmap

**Given** I view the engagement report
**When** heatmap section loads
**Then:**

- [ ] Displays heatmap with:
  - X-axis: Days of week (Sunday-Saturday)
  - Y-axis: Hours of day (0-23)
  - Cell color intensity: Activity level
- [ ] Tooltip on hover shows:
  - Day and hour
  - Number of active users
  - Number of guide views
- [ ] Legend explaining color scale

### Cohort Analysis

**Given** I view the engagement report
**When** cohort section loads
**Then:**

- [ ] Displays cohorts by registration month
- [ ] Each cohort shows:
  - Month name (e.g., "ינואר 2025")
  - Number of users registered
  - Current average progress
  - Retention rate (% still active)
- [ ] Table sortable by month or metrics
- [ ] Color coding for retention (green >60%, yellow 30-60%, red <30%)

### Export Functionality

**Given** I want to take action on segments
**When** I click export
**Then:**

- [ ] Can export user list for each segment as CSV
- [ ] CSV includes: name, email, progress %, last active date
- [ ] Filename includes segment name and date

---

## 🔨 Implementation Plan

### 1. Create Engagement Actions

**File:** `src/lib/actions/admin.ts`

**New Types:**
```typescript
export interface UserSegmentation {
  highlyEngaged: { count: number; percentage: number; };
  moderatelyEngaged: { count: number; percentage: number; };
  lowEngagement: { count: number; percentage: number; };
  atRisk: { count: number; percentage: number; };
}

export interface EngagementFunnelStage {
  stage: string;
  count: number;
  percentage: number;
  dropOffRate: number;
}

export interface ActivityHeatmapData {
  day: number;
  hour: number;
  activeUsers: number;
  guideViews: number;
}

export interface CohortData {
  month: string;
  usersRegistered: number;
  avgProgress: number;
  retentionRate: number;
}
```

**New Functions:**
```typescript
fetchUserSegmentation(): Promise<UserSegmentation>
fetchEngagementFunnel(): Promise<EngagementFunnelStage[]>
fetchActivityHeatmap(): Promise<ActivityHeatmapData[]>
fetchCohortAnalysis(): Promise<CohortData[]>
exportSegmentUsers(segment: string): Promise<void>
```

### 2. Create Engagement Report Page

**File:** `src/app/admin/engagement.tsx`

**Sections:**
1. Header with title and export options
2. Segmentation cards (4 cards in grid)
3. Engagement funnel (visual funnel chart)
4. Activity heatmap (recharts heatmap)
5. Cohort analysis table

### 3. Add Route

**File:** `src/app/routes.tsx`

Add to admin children:
```typescript
{
  path: 'engagement',
  element: <UserEngagementReportPage />,
}
```

### 4. Add Hebrew Locale Strings

**File:** `src/lib/locale/he.ts`

Add to `admin` section:
```typescript
engagement: {
  title: string;
  subtitle: string;
  userSegmentation: string;
  highlyEngaged: string;
  moderatelyEngaged: string;
  lowEngagement: string;
  atRisk: string;
  engagementFunnel: string;
  registered: string;
  onboarded: string;
  firstGuide: string;
  activeUser: string;
  powerUser: string;
  dropOffRate: string;
  activityHeatmap: string;
  cohortAnalysis: string;
  registrationMonth: string;
  usersRegistered: string;
  avgProgress: string;
  retentionRate: string;
  exportSegment: string;
}
```

### 5. Update Sidebar Navigation

Add "דוח מעורבות משתמשים" link to admin section.

---

## 🎨 UI/UX Considerations

### Segmentation Cards
- 4 cards in grid (2x2 on mobile, 4x1 on desktop)
- Color coding: Green (high), Yellow (moderate), Orange (low), Red (at risk)
- Large count number, percentage below
- Icon for each segment

### Funnel Chart
- Visual funnel using recharts or custom CSS
- Each stage progressively narrower
- Labels inside or next to funnel
- Drop-off percentages between stages
- Color coding for alarming drop-offs

### Activity Heatmap
- 7 columns (days) x 24 rows (hours)
- Color gradient: white (low) → emerald (high)
- Tooltip on hover
- Legend showing scale
- RTL consideration for day labels

### Cohort Table
- Sortable columns
- Color-coded retention rates
- Expand row to show user details optional
- Export button per cohort

---

## 🧪 Testing Scenarios

### Happy Path - Segmentation
1. Admin views engagement report
2. **Expected:**
   - 4 segment cards display correctly
   - Numbers add up to total users
   - Percentages total 100%

### Happy Path - Funnel
1. Admin views funnel
2. **Expected:**
   - 5 stages display in order
   - Each stage shows correct count
   - Drop-off rates calculated correctly
   - Visual funnel renders

### Happy Path - Heatmap
1. Admin views heatmap
2. **Expected:**
   - Heatmap displays 7x24 grid
   - Color intensity reflects activity
   - Tooltip shows details on hover

### Happy Path - Cohort
1. Admin views cohort analysis
2. **Expected:**
   - Cohorts grouped by month
   - Metrics calculated correctly
   - Sortable by columns

### Export Segment
1. Admin clicks export on "At Risk" segment
2. **Expected:**
   - CSV downloaded
   - Contains user list with details
   - Filename includes segment and date

---

## 🔐 Security & Validation

### Server-Side
- Admin-only access (RLS policy)
- Data aggregation respects user privacy
- Export includes only necessary fields

### Client-Side
- Admin check before rendering
- Loading states
- Error handling

---

## ✅ Definition of Done

Before marking story complete:

- [ ] User segmentation displays correctly
- [ ] Engagement funnel visualized
- [ ] Activity heatmap rendered
- [ ] Cohort analysis table functional
- [ ] Export CSV works for each segment
- [ ] Hebrew localization complete
- [ ] Route added to admin section
- [ ] Sidebar navigation updated
- [ ] No TypeScript errors
- [ ] No linter errors
- [ ] Responsive on mobile, tablet, desktop
- [ ] RTL layout correct
- [ ] Manual testing passed

---

## 🚀 Ready to Implement!

Story 9.3 complete with content analytics. Story 9.4 will provide deep insights into user engagement patterns and help identify users who need support.

**Let's build user engagement insights! 📊**
