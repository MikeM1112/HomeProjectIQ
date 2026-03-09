-- Transactional XP: Composite functions that wrap data writes + XP changes
-- in a single database transaction (PL/pgSQL functions are implicitly transactional)

-- ============================================================
-- Create project + award XP atomically
-- ============================================================
CREATE OR REPLACE FUNCTION create_project_with_xp(
  p_user_id uuid,
  p_category_id text,
  p_title text,
  p_confidence numeric,
  p_verdict text,
  p_intake_answers jsonb,
  p_estimated_diy_lo integer DEFAULT NULL,
  p_estimated_diy_hi integer DEFAULT NULL,
  p_estimated_pro_lo integer DEFAULT NULL,
  p_estimated_pro_hi integer DEFAULT NULL,
  p_xp_amount integer DEFAULT 0,
  p_assessment_mode text DEFAULT 'category'
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_project_id uuid;
BEGIN
  INSERT INTO projects (
    user_id, category_id, title, confidence, verdict,
    intake_answers, estimated_diy_lo, estimated_diy_hi,
    estimated_pro_lo, estimated_pro_hi, xp_awarded, assessment_mode
  ) VALUES (
    p_user_id, p_category_id, p_title, p_confidence, p_verdict,
    p_intake_answers, p_estimated_diy_lo, p_estimated_diy_hi,
    p_estimated_pro_lo, p_estimated_pro_hi, p_xp_amount, p_assessment_mode
  )
  RETURNING id INTO v_project_id;

  IF p_xp_amount > 0 THEN
    UPDATE profiles
    SET
      xp = COALESCE(xp, 0) + p_xp_amount,
      total_xp = COALESCE(total_xp, 0) + p_xp_amount,
      last_active_at = now()
    WHERE id = p_user_id;
  END IF;

  RETURN v_project_id;
END;
$$;

-- ============================================================
-- Create logbook entry + award XP + increment savings atomically
-- ============================================================
CREATE OR REPLACE FUNCTION create_logbook_with_xp(
  p_user_id uuid,
  p_title text,
  p_category_id text,
  p_repair_date date,
  p_labor_type text,
  p_xp_amount integer,
  p_cost integer DEFAULT NULL,
  p_notes text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_entry_id uuid;
BEGIN
  INSERT INTO logbook_entries (
    user_id, title, category_id, repair_date, labor_type,
    cost, notes, xp_awarded
  ) VALUES (
    p_user_id, p_title, p_category_id, p_repair_date, p_labor_type,
    p_cost, p_notes, p_xp_amount
  )
  RETURNING id INTO v_entry_id;

  -- Award XP
  IF p_xp_amount > 0 THEN
    UPDATE profiles
    SET
      xp = COALESCE(xp, 0) + p_xp_amount,
      total_xp = COALESCE(total_xp, 0) + p_xp_amount,
      last_active_at = now()
    WHERE id = p_user_id;
  END IF;

  -- Increment savings for DIY entries with cost
  IF p_labor_type = 'diy' AND p_cost IS NOT NULL AND p_cost > 0 THEN
    UPDATE profiles
    SET total_savings = COALESCE(total_savings, 0) + p_cost
    WHERE id = p_user_id;
  END IF;

  RETURN v_entry_id;
END;
$$;

-- ============================================================
-- Delete logbook entry + reverse XP + decrement savings atomically
-- ============================================================
CREATE OR REPLACE FUNCTION delete_logbook_with_xp(
  p_user_id uuid,
  p_entry_id uuid
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_xp_awarded integer;
  v_cost integer;
  v_labor_type text;
BEGIN
  -- Fetch entry data before deletion
  SELECT xp_awarded, cost, labor_type
  INTO v_xp_awarded, v_cost, v_labor_type
  FROM logbook_entries
  WHERE id = p_entry_id AND user_id = p_user_id;

  IF NOT FOUND THEN
    RETURN false;
  END IF;

  -- Delete the entry
  DELETE FROM logbook_entries
  WHERE id = p_entry_id AND user_id = p_user_id;

  -- Reverse XP
  IF v_xp_awarded > 0 THEN
    UPDATE profiles
    SET
      xp = GREATEST(0, COALESCE(xp, 0) - v_xp_awarded),
      total_xp = GREATEST(0, COALESCE(total_xp, 0) - v_xp_awarded)
    WHERE id = p_user_id;
  END IF;

  -- Reverse savings for DIY entries
  IF v_labor_type = 'diy' AND v_cost IS NOT NULL AND v_cost > 0 THEN
    UPDATE profiles
    SET total_savings = GREATEST(0, COALESCE(total_savings, 0) - v_cost)
    WHERE id = p_user_id;
  END IF;

  RETURN true;
END;
$$;

-- ============================================================
-- Update outcome + award XP atomically (first submission only)
-- ============================================================
CREATE OR REPLACE FUNCTION submit_outcome_with_xp(
  p_user_id uuid,
  p_project_id uuid,
  p_outcome_status text,
  p_xp_amount integer,
  p_outcome_actual_cost integer DEFAULT NULL,
  p_outcome_actual_hours numeric DEFAULT NULL,
  p_outcome_difficulty text DEFAULT NULL,
  p_outcome_complications text DEFAULT NULL,
  p_outcome_would_diy_again boolean DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_already_submitted boolean;
  v_xp_awarded integer := 0;
BEGIN
  -- Check ownership and prior submission
  SELECT outcome_submitted_at IS NOT NULL
  INTO v_already_submitted
  FROM projects
  WHERE id = p_project_id AND user_id = p_user_id;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'not_found');
  END IF;

  -- Update the project
  UPDATE projects
  SET
    outcome_status = p_outcome_status,
    outcome_actual_cost = p_outcome_actual_cost,
    outcome_actual_hours = p_outcome_actual_hours,
    outcome_difficulty = p_outcome_difficulty,
    outcome_complications = p_outcome_complications,
    outcome_would_diy_again = p_outcome_would_diy_again,
    outcome_submitted_at = now()
  WHERE id = p_project_id AND user_id = p_user_id;

  -- Award XP only on first submission
  IF NOT v_already_submitted AND p_xp_amount > 0 THEN
    v_xp_awarded := p_xp_amount;
    UPDATE profiles
    SET
      xp = COALESCE(xp, 0) + v_xp_awarded,
      total_xp = COALESCE(total_xp, 0) + v_xp_awarded,
      last_active_at = now()
    WHERE id = p_user_id;
  END IF;

  RETURN jsonb_build_object('xp_awarded', v_xp_awarded);
END;
$$;
