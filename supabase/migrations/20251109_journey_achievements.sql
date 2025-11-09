-- Journey Achievements Migration - Story 0.10.3
-- Add achievements for completing learning journey phases

-- Insert journey phase completion achievements
INSERT INTO achievements (id, title, description, icon, category, points, requirement_type, requirement_value) VALUES
('journey_core_complete', 'מסע מתחיל', 'השלמת את כל מדריכי הליבה', 'IconBook', 'learning', 10, 'guides_completed', '{"phase":"core","percentage":100}'),
('journey_recommended_complete', 'מסע מומחה', 'השלמת את כל המדריכים המומלצים', 'IconStar', 'learning', 25, 'guides_completed', '{"phase":"recommended","percentage":100}'),
('journey_interests_complete', 'מסע מלומד', 'השלמת את כל מדריכי תחומי העניין', 'IconHeart', 'learning', 25, 'guides_completed', '{"phase":"interests","percentage":100}'),
('journey_master', 'אמן המסע', 'השלמת את כל 4 השלבים במסלול הלמידה', 'IconTrophy', 'learning', 100, 'guides_completed', '{"phase":"all","percentage":100}')
ON CONFLICT (id) DO NOTHING;

-- Verify achievements were inserted
-- SELECT * FROM achievements WHERE id LIKE 'journey%';

