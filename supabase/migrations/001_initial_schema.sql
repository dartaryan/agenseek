-- ============================================
-- BMAD Learning Hub (Agenseek) Database Schema
-- Migration 001: Initial Schema - All Tables
-- PostgreSQL + Supabase
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLE: profiles
-- Extends Supabase auth.users
-- ============================================

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  
  -- Onboarding data
  role TEXT, -- selected role
  interests TEXT[] DEFAULT '{}', -- array of topics
  experience_level TEXT CHECK (experience_level IN ('beginner', 'intermediate', 'advanced')),
  
  -- Preferences
  theme TEXT DEFAULT 'light' CHECK (theme IN ('light', 'dark', 'system')),
  language TEXT DEFAULT 'he' CHECK (language IN ('he')), -- future: 'en'
  
  -- Status
  completed_onboarding BOOLEAN DEFAULT false,
  onboarded_at TIMESTAMP WITH TIME ZONE,
  
  -- Admin
  is_admin BOOLEAN DEFAULT false,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLE: user_progress
-- Tracks reading progress per guide
-- ============================================

CREATE TABLE public.user_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Guide identification
  guide_slug TEXT NOT NULL, -- e.g., 'developers', 'quick-start'
  guide_category TEXT NOT NULL, -- 'core', 'roles', 'agents', etc.
  
  -- Progress tracking
  completed BOOLEAN DEFAULT false,
  progress_percent INTEGER DEFAULT 0 CHECK (progress_percent >= 0 AND progress_percent <= 100),
  last_position TEXT, -- heading ID or scroll position
  time_spent_seconds INTEGER DEFAULT 0,
  
  -- Timestamps
  last_read_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(user_id, guide_slug)
);

-- ============================================
-- TABLE: user_notes
-- Rich text notes linked to guides
-- ============================================

CREATE TABLE public.user_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Content
  guide_slug TEXT, -- nullable for standalone notes
  title TEXT NOT NULL,
  content JSONB NOT NULL, -- Tiptap JSON format
  tags TEXT[] DEFAULT '{}',
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLE: user_tasks
-- Task management with sub-tasks
-- ============================================

CREATE TABLE public.user_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Task details
  guide_slug TEXT, -- nullable for standalone tasks
  parent_task_id UUID REFERENCES user_tasks(id) ON DELETE CASCADE, -- for sub-tasks
  title TEXT NOT NULL,
  description TEXT,
  
  -- Status
  status TEXT DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'done')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
  position INTEGER DEFAULT 0, -- for custom ordering
  
  -- Timestamps
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLE: guide_comments
-- Comments and Q&A on guides
-- ============================================

CREATE TABLE public.guide_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  guide_slug TEXT NOT NULL,
  
  -- Threading
  parent_comment_id UUID REFERENCES guide_comments(id) ON DELETE CASCADE, -- for replies
  
  -- Content
  content TEXT NOT NULL, -- markdown supported
  is_question BOOLEAN DEFAULT false,
  is_solution BOOLEAN DEFAULT false, -- for answers to questions
  
  -- Engagement
  helpful_count INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLE: comment_votes
-- Track "helpful" votes on comments
-- ============================================

CREATE TABLE public.comment_votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  comment_id UUID NOT NULL REFERENCES guide_comments(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints: one vote per user per comment
  UNIQUE(user_id, comment_id)
);

-- ============================================
-- TABLE: guide_stats
-- Aggregate statistics per guide
-- ============================================

CREATE TABLE public.guide_stats (
  guide_slug TEXT PRIMARY KEY,
  
  -- View metrics
  view_count INTEGER DEFAULT 0,
  unique_viewers INTEGER DEFAULT 0,
  
  -- Engagement
  helpful_votes INTEGER DEFAULT 0,
  not_helpful_votes INTEGER DEFAULT 0,
  
  -- Performance
  avg_time_spent_seconds INTEGER DEFAULT 0,
  completion_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  
  -- Timestamp
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLE: user_activity
-- Activity log for analytics
-- ============================================

CREATE TABLE public.user_activity (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Activity details
  activity_type TEXT NOT NULL, -- 'view_guide', 'complete_guide', 'create_note', etc.
  target_slug TEXT, -- guide_slug or resource ID
  metadata JSONB, -- additional data
  
  -- Timestamp
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLE: guide_bookmarks
-- User bookmarks for guides
-- ============================================

CREATE TABLE public.guide_bookmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  guide_slug TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints: one bookmark per user per guide
  UNIQUE(user_id, guide_slug)
);

