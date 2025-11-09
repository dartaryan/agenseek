-- Journey Achievements - Story 0.10.3
-- NOTE: No migration needed!
--
-- Achievement definitions are stored in CODE (src/lib/achievements.ts), not in the database.
-- The database only has 'user_achievements' table which tracks which users earned which badges.
--
-- Journey Achievement IDs (defined in code):
-- - 'journey_core_complete' - מסע מתחיל (Complete all Core guides) - 10 points
-- - 'journey_recommended_complete' - מסע מומחה (Complete all Recommended guides) - 25 points
-- - 'journey_interests_complete' - מסע מלומד (Complete all Interests guides) - 25 points
-- - 'journey_master' - אמן המסע (Complete all 4 phases) - 100 points
--
-- These will be automatically inserted into 'user_achievements' when users complete phases.
-- See: src/lib/achievements.ts -> awardPhaseAchievement()

-- No SQL to run - this file is for documentation only.

