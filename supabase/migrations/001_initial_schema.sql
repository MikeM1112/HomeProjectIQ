-- HomeProjectIQ Initial Schema
-- Tables: profiles, projects, logbook_entries, toolbox_items, friendships, feature_flags

-- ============================================================
-- HELPER: updated_at trigger function
-- ============================================================
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- PROFILES
-- ============================================================
CREATE TABLE profiles (
  id             UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username       TEXT UNIQUE,
  display_name   TEXT,
  avatar_url     TEXT,
  role           TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  xp             INTEGER NOT NULL DEFAULT 0,
  total_xp       INTEGER NOT NULL DEFAULT 0,
  level          INTEGER NOT NULL DEFAULT 1 CHECK (level BETWEEN 1 AND 5),
  total_savings  INTEGER NOT NULL DEFAULT 0,
  streak         INTEGER NOT NULL DEFAULT 0,
  last_active_at TIMESTAMPTZ,
  skills         JSONB NOT NULL DEFAULT '{}'::JSONB,
  badges         TEXT[] NOT NULL DEFAULT '{}',
  onboarding_completed_at TIMESTAMPTZ,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"   ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can delete own profile" ON profiles FOR DELETE USING (auth.uid() = id);

CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'display_name', 'Homeowner')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- PROJECTS
-- ============================================================
CREATE TABLE projects (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  category_id      TEXT NOT NULL,
  title            TEXT NOT NULL,
  confidence       NUMERIC NOT NULL DEFAULT 0,
  verdict          TEXT NOT NULL CHECK (verdict IN ('diy_easy', 'diy_caution', 'hire_pro')),
  intake_answers   JSONB NOT NULL DEFAULT '{}'::JSONB,
  status           TEXT NOT NULL DEFAULT 'planning' CHECK (status IN ('planning', 'in_progress', 'completed', 'hired_pro')),
  estimated_diy_lo INTEGER,
  estimated_diy_hi INTEGER,
  estimated_pro_lo INTEGER,
  estimated_pro_hi INTEGER,
  actual_cost      INTEGER,
  xp_awarded       INTEGER NOT NULL DEFAULT 0,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at     TIMESTAMPTZ
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own projects"   ON projects FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own projects" ON projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own projects" ON projects FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own projects" ON projects FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER set_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- ============================================================
-- LOGBOOK ENTRIES
-- ============================================================
CREATE TABLE logbook_entries (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  project_id  UUID REFERENCES projects(id) ON DELETE SET NULL,
  title       TEXT NOT NULL,
  category_id TEXT NOT NULL,
  notes       TEXT,
  cost        INTEGER,
  labor_type  TEXT NOT NULL CHECK (labor_type IN ('diy', 'hired_pro', 'warranty')),
  photo_urls  TEXT[] NOT NULL DEFAULT '{}',
  xp_awarded  INTEGER NOT NULL DEFAULT 0,
  repair_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE logbook_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own logbook"   ON logbook_entries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own logbook" ON logbook_entries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own logbook" ON logbook_entries FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own logbook" ON logbook_entries FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER set_logbook_entries_updated_at
  BEFORE UPDATE ON logbook_entries
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- ============================================================
-- TOOLBOX ITEMS
-- ============================================================
CREATE TABLE toolbox_items (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id   UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  tool_id   TEXT NOT NULL,
  tool_name TEXT NOT NULL,
  category  TEXT NOT NULL,
  notes     TEXT,
  added_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, tool_id)
);

ALTER TABLE toolbox_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own toolbox"   ON toolbox_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own toolbox" ON toolbox_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own toolbox" ON toolbox_items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own toolbox" ON toolbox_items FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- FRIENDSHIPS
-- ============================================================
CREATE TABLE friendships (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id  UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  addressee_id  UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status        TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'blocked')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (requester_id, addressee_id)
);

ALTER TABLE friendships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own friendships" ON friendships FOR SELECT
  USING (auth.uid() = requester_id OR auth.uid() = addressee_id);
CREATE POLICY "Users can insert own friendships" ON friendships FOR INSERT
  WITH CHECK (auth.uid() = requester_id);
CREATE POLICY "Users can update own friendships" ON friendships FOR UPDATE
  USING (auth.uid() = requester_id OR auth.uid() = addressee_id);
CREATE POLICY "Users can delete own friendships" ON friendships FOR DELETE
  USING (auth.uid() = requester_id);

CREATE TRIGGER set_friendships_updated_at
  BEFORE UPDATE ON friendships
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- ============================================================
-- FEATURE FLAGS
-- ============================================================
CREATE TABLE feature_flags (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  flag_name   TEXT NOT NULL UNIQUE,
  is_enabled  BOOLEAN NOT NULL DEFAULT false,
  description TEXT,
  updated_by  UUID REFERENCES profiles(id),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE feature_flags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read flags" ON feature_flags FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can update flags" ON feature_flags FOR UPDATE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE TRIGGER set_feature_flags_updated_at
  BEFORE UPDATE ON feature_flags
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Seed feature flags
INSERT INTO feature_flags (flag_name, description, is_enabled) VALUES
  ('ENABLE_AFFILIATE_LINKS',       'Show affiliate tracking on buy buttons',          false),
  ('ENABLE_FEATURED_PROS',         'Show featured contractor cards on Hire Pro tab',   false),
  ('ENABLE_CATEGORY_SPONSORS',     'Show sponsor attribution on category headers',     false),
  ('ENABLE_PRO_LEAD_GEN',          'Enable lead generation for professional services', false),
  ('ENABLE_BUSINESS_SUBSCRIPTIONS','Enable paid business subscription tier',           false),
  ('ENABLE_ANALYTICS_EXPORT',      'Enable analytics data export for partners',        false),
  ('ENABLE_API_PARTNER_ACCESS',    'Enable API access for integration partners',       false),
  ('ENABLE_AGGREGATE_INSIGHTS',    'Enable aggregate insight dashboards',              false);
