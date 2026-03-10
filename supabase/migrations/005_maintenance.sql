-- Maintenance Engine: recurring tasks, seasonal reminders, home system tracking
-- Migration 005

-- ============================================================
-- Home profiles: store home type and system info for task filtering
-- ============================================================
CREATE TABLE IF NOT EXISTS home_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  home_type TEXT NOT NULL DEFAULT 'house', -- house, condo, townhouse
  home_age TEXT NOT NULL DEFAULT '10-25',  -- new, 1-10, 10-25, 25-50, 50+
  heating_type TEXT NOT NULL DEFAULT 'gas', -- gas, electric, heat_pump, oil
  has_ac BOOLEAN DEFAULT true,
  has_chimney BOOLEAN DEFAULT false,
  has_septic BOOLEAN DEFAULT false,
  has_sump_pump BOOLEAN DEFAULT false,
  has_garage BOOLEAN DEFAULT true,
  has_deck BOOLEAN DEFAULT true,
  has_yard BOOLEAN DEFAULT true,
  setup_completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- Maintenance tasks: user-specific task instances with tracking
-- ============================================================
CREATE TABLE IF NOT EXISTS maintenance_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  task_id TEXT NOT NULL,         -- references MaintenanceTaskDef.id
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  frequency TEXT NOT NULL,       -- monthly, quarterly, seasonal, annual
  season TEXT,                   -- spring, summer, fall, winter, year_round
  importance TEXT NOT NULL DEFAULT 'recommended', -- critical, important, recommended
  last_completed_at TIMESTAMPTZ,
  next_due_at TIMESTAMPTZ,
  is_dismissed BOOLEAN DEFAULT false,
  snoozed_until TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),

  -- Prevent duplicate task_id per user
  UNIQUE(user_id, task_id)
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_maintenance_tasks_user_id ON maintenance_tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_tasks_next_due ON maintenance_tasks(next_due_at);
CREATE INDEX IF NOT EXISTS idx_maintenance_tasks_user_due ON maintenance_tasks(user_id, next_due_at)
  WHERE is_dismissed = false;

-- ============================================================
-- RLS Policies: users see only their own data
-- ============================================================
ALTER TABLE home_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_tasks ENABLE ROW LEVEL SECURITY;

-- Home profiles
CREATE POLICY "Users can view own home profile"
  ON home_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own home profile"
  ON home_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own home profile"
  ON home_profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Maintenance tasks
CREATE POLICY "Users can view own maintenance tasks"
  ON maintenance_tasks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own maintenance tasks"
  ON maintenance_tasks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own maintenance tasks"
  ON maintenance_tasks FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own maintenance tasks"
  ON maintenance_tasks FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================
-- Complete maintenance task + award XP atomically
-- ============================================================
CREATE OR REPLACE FUNCTION complete_maintenance_task(
  p_user_id uuid,
  p_task_id uuid,
  p_xp_amount integer DEFAULT 15,
  p_next_due_at timestamptz DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_task maintenance_tasks%ROWTYPE;
BEGIN
  -- Fetch and verify ownership
  SELECT * INTO v_task
  FROM maintenance_tasks
  WHERE id = p_task_id AND user_id = p_user_id;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'not_found');
  END IF;

  -- Update the task
  UPDATE maintenance_tasks
  SET
    last_completed_at = now(),
    next_due_at = COALESCE(p_next_due_at, now() + CASE frequency
      WHEN 'monthly' THEN interval '30 days'
      WHEN 'quarterly' THEN interval '90 days'
      WHEN 'seasonal' THEN interval '90 days'
      WHEN 'annual' THEN interval '365 days'
      ELSE interval '90 days'
    END),
    snoozed_until = NULL,
    updated_at = now()
  WHERE id = p_task_id AND user_id = p_user_id;

  -- Award XP
  IF p_xp_amount > 0 THEN
    UPDATE profiles
    SET
      xp = COALESCE(xp, 0) + p_xp_amount,
      total_xp = COALESCE(total_xp, 0) + p_xp_amount,
      last_active_at = now()
    WHERE id = p_user_id;
  END IF;

  RETURN jsonb_build_object('xp_awarded', p_xp_amount);
END;
$$;
