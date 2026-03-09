-- HomeProjectIQ Outcome Tracking & Data Flywheel
-- Adds outcome tracking to projects, locale/currency to profiles, and outcome stats view

-- ============================================================
-- PROJECTS: Outcome tracking columns
-- ============================================================
ALTER TABLE projects ADD COLUMN IF NOT EXISTS outcome_status text CHECK (outcome_status IN ('success', 'partial', 'failed')) DEFAULT NULL;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS outcome_actual_cost numeric DEFAULT NULL;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS outcome_actual_hours numeric DEFAULT NULL;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS outcome_difficulty text CHECK (outcome_difficulty IN ('easier', 'as_expected', 'harder')) DEFAULT NULL;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS outcome_complications text DEFAULT NULL;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS outcome_would_diy_again boolean DEFAULT NULL;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS outcome_photos text[] DEFAULT '{}';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS outcome_submitted_at timestamptz DEFAULT NULL;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS ai_photo_url text DEFAULT NULL;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS ai_description text DEFAULT NULL;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS assessment_mode text CHECK (assessment_mode IN ('category', 'ai_photo')) DEFAULT 'category';

-- ============================================================
-- PROFILES: Locale, currency, and units columns
-- ============================================================
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS locale text DEFAULT 'en';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS currency text DEFAULT 'USD';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS units text CHECK (units IN ('metric', 'imperial')) DEFAULT 'imperial';

-- ============================================================
-- VIEW: Aggregated assessment outcome statistics
-- ============================================================
CREATE OR REPLACE VIEW assessment_outcome_stats AS
SELECT
  category_id,
  verdict,
  COUNT(*) as total_assessments,
  COUNT(outcome_status) as total_outcomes,
  COUNT(*) FILTER (WHERE outcome_status = 'success') as success_count,
  COUNT(*) FILTER (WHERE outcome_status = 'partial') as partial_count,
  COUNT(*) FILTER (WHERE outcome_status = 'failed') as failed_count,
  AVG(outcome_actual_cost) FILTER (WHERE outcome_actual_cost IS NOT NULL) as avg_actual_cost,
  AVG(outcome_actual_hours) FILTER (WHERE outcome_actual_hours IS NOT NULL) as avg_actual_hours,
  AVG(confidence) as avg_confidence
FROM projects
GROUP BY category_id, verdict;
