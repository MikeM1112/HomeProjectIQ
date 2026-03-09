-- Atomic XP increment function (prevents race conditions)
CREATE OR REPLACE FUNCTION increment_xp(
  p_user_id uuid,
  p_amount integer
)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
  UPDATE profiles
  SET
    xp = COALESCE(xp, 0) + p_amount,
    total_xp = COALESCE(total_xp, 0) + p_amount,
    last_active_at = now()
  WHERE id = p_user_id;
$$;

-- Atomic XP decrement function (for reversals on delete)
CREATE OR REPLACE FUNCTION decrement_xp(
  p_user_id uuid,
  p_amount integer
)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
  UPDATE profiles
  SET
    xp = GREATEST(0, COALESCE(xp, 0) - p_amount),
    total_xp = GREATEST(0, COALESCE(total_xp, 0) - p_amount)
  WHERE id = p_user_id;
$$;

-- Atomic savings increment
CREATE OR REPLACE FUNCTION increment_savings(
  p_user_id uuid,
  p_amount integer
)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
  UPDATE profiles
  SET total_savings = COALESCE(total_savings, 0) + p_amount
  WHERE id = p_user_id;
$$;

-- Atomic savings decrement
CREATE OR REPLACE FUNCTION decrement_savings(
  p_user_id uuid,
  p_amount integer
)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
  UPDATE profiles
  SET total_savings = GREATEST(0, COALESCE(total_savings, 0) - p_amount)
  WHERE id = p_user_id;
$$;

-- RLS: Prevent users from updating their own role
-- Drop existing update policy if it allows role changes
DO $$
BEGIN
  -- Enable RLS on profiles if not already
  ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

  -- Users can read their own profile
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'profiles_select_own'
  ) THEN
    CREATE POLICY profiles_select_own ON profiles
      FOR SELECT USING (auth.uid() = id);
  END IF;

  -- Users can update their own profile EXCEPT role field
  -- We achieve this by allowing update but using a trigger to prevent role changes
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'profiles_update_own'
  ) THEN
    CREATE POLICY profiles_update_own ON profiles
      FOR UPDATE USING (auth.uid() = id);
  END IF;

  -- Users can insert their own profile (for signup)
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'profiles_insert_own'
  ) THEN
    CREATE POLICY profiles_insert_own ON profiles
      FOR INSERT WITH CHECK (auth.uid() = id);
  END IF;
END
$$;

-- Trigger to prevent users from changing their own role
CREATE OR REPLACE FUNCTION prevent_role_self_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- If role is being changed and the caller is not using the service role key
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    -- Check if this is a regular user (not service role)
    IF auth.uid() = NEW.id THEN
      NEW.role := OLD.role; -- Silently revert the role change
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS prevent_role_change ON profiles;
CREATE TRIGGER prevent_role_change
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION prevent_role_self_update();
