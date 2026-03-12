-- Migration 009: Database Schema Extension
-- Adds tables from homeprojectiq_database_schema.md not covered by prior migrations.
-- New tables: issue_types, scans, scan_images, diagnoses, diagnosis_evidence,
--   project_steps, project_materials, guided_step_checkpoints, guided_checkpoint_images,
--   guided_messages, tools, system_readings, badges, user_badges, leaderboard_entries,
--   receipts, warranties, inspections
-- Also adds helper functions and missing indexes.

-- ============================================================
-- EXTENSIONS
-- ============================================================
create extension if not exists citext;

-- ============================================================
-- HELPER FUNCTIONS
-- ============================================================
create or replace function public.is_household_member(target_household_id uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.household_members hm
    where hm.household_id = target_household_id
      and hm.user_id = auth.uid()
  );
$$;

create or replace function public.can_access_property(target_property_id uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.properties p
    join public.household_members hm on hm.household_id = p.household_id
    where p.id = target_property_id
      and hm.user_id = auth.uid()
  );
$$;

-- ============================================================
-- 1. ISSUE_TYPES (diagnostic issue catalog)
-- ============================================================
create table if not exists public.issue_types (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  category text,
  description text,
  default_severity text,
  created_at timestamptz not null default now()
);

alter table public.issue_types enable row level security;

create policy "Anyone can view issue types"
  on public.issue_types for select
  using (true);

-- ============================================================
-- 2. SCANS (photo-based issue scanning)
-- ============================================================
create table if not exists public.scans (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  zone_id uuid references public.property_zones(id) on delete set null,
  user_id uuid not null references auth.users(id) on delete restrict,
  scan_type text not null,
  status text not null default 'created',
  user_note text,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  metadata jsonb
);

alter table public.scans enable row level security;

create policy "Users can view scans for accessible properties"
  on public.scans for select
  using (public.can_access_property(property_id));

create policy "Users can create scans"
  on public.scans for insert
  with check (user_id = auth.uid() and public.can_access_property(property_id));

create policy "Users can update own scans"
  on public.scans for update
  using (user_id = auth.uid());

create index if not exists idx_scans_property_id on public.scans(property_id);
create index if not exists idx_scans_user_id on public.scans(user_id);
create index if not exists idx_scans_started_at on public.scans(started_at desc);

-- ============================================================
-- 3. SCAN_IMAGES
-- ============================================================
create table if not exists public.scan_images (
  id uuid primary key default gen_random_uuid(),
  scan_id uuid not null references public.scans(id) on delete cascade,
  image_url text not null,
  image_order integer,
  captured_at timestamptz,
  metadata jsonb,
  created_at timestamptz not null default now()
);

alter table public.scan_images enable row level security;

create policy "Users can view scan images via scan access"
  on public.scan_images for select
  using (scan_id in (
    select s.id from public.scans s where public.can_access_property(s.property_id)
  ));

create policy "Users can create scan images"
  on public.scan_images for insert
  with check (scan_id in (
    select s.id from public.scans s where s.user_id = auth.uid()
  ));

create index if not exists idx_scan_images_scan_id on public.scan_images(scan_id);

-- ============================================================
-- 4. DIAGNOSES (AI diagnosis results)
-- ============================================================
create table if not exists public.diagnoses (
  id uuid primary key default gen_random_uuid(),
  scan_id uuid not null references public.scans(id) on delete cascade,
  issue_type_id uuid references public.issue_types(id) on delete set null,
  title text not null,
  summary text,
  confidence_score numeric(5,4),
  severity text,
  urgency text,
  risk_if_ignored text,
  recommended_action text,
  diy_possible boolean,
  estimated_diy_cost_min numeric(10,2),
  estimated_diy_cost_max numeric(10,2),
  estimated_pro_cost_min numeric(10,2),
  estimated_pro_cost_max numeric(10,2),
  estimated_time_minutes integer,
  skill_level text,
  status text,
  created_at timestamptz not null default now()
);

alter table public.diagnoses enable row level security;

create policy "Users can view diagnoses via scan access"
  on public.diagnoses for select
  using (scan_id in (
    select s.id from public.scans s where public.can_access_property(s.property_id)
  ));

create policy "System can create diagnoses"
  on public.diagnoses for insert
  with check (scan_id in (
    select s.id from public.scans s where s.user_id = auth.uid()
  ));

create index if not exists idx_diagnoses_scan_id on public.diagnoses(scan_id);
create index if not exists idx_diagnoses_issue_type_id on public.diagnoses(issue_type_id);
create index if not exists idx_diagnoses_created_at on public.diagnoses(created_at desc);

-- ============================================================
-- 5. DIAGNOSIS_EVIDENCE
-- ============================================================
create table if not exists public.diagnosis_evidence (
  id uuid primary key default gen_random_uuid(),
  diagnosis_id uuid not null references public.diagnoses(id) on delete cascade,
  evidence_type text not null,
  description text,
  confidence_score numeric(5,4),
  source_region jsonb,
  created_at timestamptz not null default now()
);

alter table public.diagnosis_evidence enable row level security;

create policy "Users can view evidence via diagnosis access"
  on public.diagnosis_evidence for select
  using (diagnosis_id in (
    select d.id from public.diagnoses d
    join public.scans s on s.id = d.scan_id
    where public.can_access_property(s.property_id)
  ));

create index if not exists idx_diagnosis_evidence_diagnosis_id on public.diagnosis_evidence(diagnosis_id);

-- ============================================================
-- 6. PROJECT_STEPS
-- ============================================================
create table if not exists public.project_steps (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  step_order integer not null,
  title text not null,
  description text,
  safety_note text,
  expected_visual_state text,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  unique (project_id, step_order)
);

alter table public.project_steps enable row level security;

create policy "Users can view project steps"
  on public.project_steps for select
  using (project_id in (select id from public.projects where user_id = auth.uid()));

create policy "Users can create project steps"
  on public.project_steps for insert
  with check (project_id in (select id from public.projects where user_id = auth.uid()));

create policy "Users can update project steps"
  on public.project_steps for update
  using (project_id in (select id from public.projects where user_id = auth.uid()));

create policy "Users can delete project steps"
  on public.project_steps for delete
  using (project_id in (select id from public.projects where user_id = auth.uid()));

create index if not exists idx_project_steps_project_id on public.project_steps(project_id);

-- ============================================================
-- 7. PROJECT_MATERIALS
-- ============================================================
create table if not exists public.project_materials (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  name text not null,
  quantity numeric,
  unit text,
  estimated_cost numeric(10,2),
  purchase_url text,
  created_at timestamptz not null default now()
);

alter table public.project_materials enable row level security;

create policy "Users can view project materials"
  on public.project_materials for select
  using (project_id in (select id from public.projects where user_id = auth.uid()));

create policy "Users can create project materials"
  on public.project_materials for insert
  with check (project_id in (select id from public.projects where user_id = auth.uid()));

create policy "Users can update project materials"
  on public.project_materials for update
  using (project_id in (select id from public.projects where user_id = auth.uid()));

create policy "Users can delete project materials"
  on public.project_materials for delete
  using (project_id in (select id from public.projects where user_id = auth.uid()));

create index if not exists idx_project_materials_project_id on public.project_materials(project_id);

-- ============================================================
-- 8. GUIDED_STEP_CHECKPOINTS (detailed step validation)
-- ============================================================
create table if not exists public.guided_step_checkpoints (
  id uuid primary key default gen_random_uuid(),
  guided_session_id uuid not null references public.guided_sessions(id) on delete cascade,
  project_step_id uuid not null references public.project_steps(id) on delete cascade,
  checkpoint_type text,
  status text,
  ai_feedback text,
  confidence_score numeric(5,4),
  requires_reroute boolean not null default false,
  safety_flag boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.guided_step_checkpoints enable row level security;

create policy "Users can view own step checkpoints"
  on public.guided_step_checkpoints for select
  using (guided_session_id in (select id from public.guided_sessions where user_id = auth.uid()));

create policy "Users can create step checkpoints"
  on public.guided_step_checkpoints for insert
  with check (guided_session_id in (select id from public.guided_sessions where user_id = auth.uid()));

create policy "Users can update own step checkpoints"
  on public.guided_step_checkpoints for update
  using (guided_session_id in (select id from public.guided_sessions where user_id = auth.uid()));

create index if not exists idx_guided_step_checkpoints_session_id on public.guided_step_checkpoints(guided_session_id);
create index if not exists idx_guided_step_checkpoints_step_id on public.guided_step_checkpoints(project_step_id);

-- ============================================================
-- 9. GUIDED_CHECKPOINT_IMAGES
-- ============================================================
create table if not exists public.guided_checkpoint_images (
  id uuid primary key default gen_random_uuid(),
  guided_step_checkpoint_id uuid not null references public.guided_step_checkpoints(id) on delete cascade,
  image_url text not null,
  image_order integer,
  metadata jsonb,
  created_at timestamptz not null default now()
);

alter table public.guided_checkpoint_images enable row level security;

create policy "Users can view own checkpoint images"
  on public.guided_checkpoint_images for select
  using (guided_step_checkpoint_id in (
    select gsc.id from public.guided_step_checkpoints gsc
    join public.guided_sessions gs on gs.id = gsc.guided_session_id
    where gs.user_id = auth.uid()
  ));

create policy "Users can create checkpoint images"
  on public.guided_checkpoint_images for insert
  with check (guided_step_checkpoint_id in (
    select gsc.id from public.guided_step_checkpoints gsc
    join public.guided_sessions gs on gs.id = gsc.guided_session_id
    where gs.user_id = auth.uid()
  ));

create index if not exists idx_guided_checkpoint_images_checkpoint_id on public.guided_checkpoint_images(guided_step_checkpoint_id);

-- ============================================================
-- 10. GUIDED_MESSAGES (chat in guided sessions)
-- ============================================================
create table if not exists public.guided_messages (
  id uuid primary key default gen_random_uuid(),
  guided_session_id uuid not null references public.guided_sessions(id) on delete cascade,
  sender_type text not null,
  message text not null,
  message_type text,
  metadata jsonb,
  created_at timestamptz not null default now()
);

alter table public.guided_messages enable row level security;

create policy "Users can view own session messages"
  on public.guided_messages for select
  using (guided_session_id in (select id from public.guided_sessions where user_id = auth.uid()));

create policy "Users can create session messages"
  on public.guided_messages for insert
  with check (guided_session_id in (select id from public.guided_sessions where user_id = auth.uid()));

create index if not exists idx_guided_messages_session_id on public.guided_messages(guided_session_id);
create index if not exists idx_guided_messages_created_at on public.guided_messages(created_at);

-- ============================================================
-- 11. TOOLS (canonical tool catalog)
-- ============================================================
create table if not exists public.tools (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text,
  sub_category text,
  brand text,
  model text,
  typical_use_cases text[],
  created_at timestamptz not null default now()
);

alter table public.tools enable row level security;

create policy "Anyone can view tools"
  on public.tools for select
  using (true);

create index if not exists idx_tools_name on public.tools(name);
create index if not exists idx_tools_category on public.tools(category);

-- ============================================================
-- 12. SYSTEM_READINGS (sensor/condition data)
-- ============================================================
create table if not exists public.system_readings (
  id uuid primary key default gen_random_uuid(),
  system_id uuid not null references public.systems(id) on delete cascade,
  reading_type text not null,
  reading_value numeric,
  unit text,
  source text,
  metadata jsonb,
  recorded_at timestamptz not null default now()
);

alter table public.system_readings enable row level security;

create policy "Members can view system readings"
  on public.system_readings for select
  using (system_id in (
    select s.id from public.systems s
    join public.properties p on p.id = s.property_id
    join public.household_members hm on hm.household_id = p.household_id
    where hm.user_id = auth.uid()
  ));

create policy "Members can create system readings"
  on public.system_readings for insert
  with check (system_id in (
    select s.id from public.systems s
    join public.properties p on p.id = s.property_id
    join public.household_members hm on hm.household_id = p.household_id
    where hm.user_id = auth.uid()
  ));

create index if not exists idx_system_readings_system_id on public.system_readings(system_id);
create index if not exists idx_system_readings_recorded_at on public.system_readings(recorded_at desc);

-- ============================================================
-- 13. BADGES (badge definitions)
-- ============================================================
create table if not exists public.badges (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  description text,
  badge_type text,
  created_at timestamptz not null default now()
);

alter table public.badges enable row level security;

create policy "Anyone can view badges"
  on public.badges for select
  using (true);

-- ============================================================
-- 14. USER_BADGES
-- ============================================================
create table if not exists public.user_badges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  badge_id uuid not null references public.badges(id) on delete cascade,
  awarded_at timestamptz not null default now(),
  reason text,
  unique (user_id, badge_id)
);

alter table public.user_badges enable row level security;

create policy "Users can view own badges"
  on public.user_badges for select
  using (user_id = auth.uid());

create policy "System can award badges"
  on public.user_badges for insert
  with check (user_id = auth.uid());

create index if not exists idx_user_badges_user_id on public.user_badges(user_id);

-- ============================================================
-- 15. LEADERBOARD_ENTRIES
-- ============================================================
create table if not exists public.leaderboard_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  leaderboard_type text not null,
  period_start date not null,
  period_end date not null,
  score integer not null default 0,
  rank integer,
  metadata jsonb,
  created_at timestamptz not null default now()
);

alter table public.leaderboard_entries enable row level security;

create policy "Anyone can view leaderboard"
  on public.leaderboard_entries for select
  using (true);

create policy "System can create entries"
  on public.leaderboard_entries for insert
  with check (user_id = auth.uid());

create index if not exists idx_leaderboard_entries_user_id on public.leaderboard_entries(user_id);
create index if not exists idx_leaderboard_entries_type_period on public.leaderboard_entries(leaderboard_type, period_start, period_end);

-- ============================================================
-- 16. RECEIPTS
-- ============================================================
create table if not exists public.receipts (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  merchant_name text,
  amount numeric(10,2),
  purchase_date date,
  file_url text,
  created_at timestamptz not null default now()
);

alter table public.receipts enable row level security;

create policy "Members can view receipts"
  on public.receipts for select
  using (public.can_access_property(property_id));

create policy "Members can create receipts"
  on public.receipts for insert
  with check (public.can_access_property(property_id));

create policy "Members can update receipts"
  on public.receipts for update
  using (public.can_access_property(property_id));

create policy "Members can delete receipts"
  on public.receipts for delete
  using (public.can_access_property(property_id));

create index if not exists idx_receipts_property_id on public.receipts(property_id);

-- ============================================================
-- 17. WARRANTIES
-- ============================================================
create table if not exists public.warranties (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  system_id uuid references public.systems(id) on delete set null,
  provider text,
  coverage_type text,
  start_date date,
  end_date date,
  document_id uuid references public.documents(id) on delete set null,
  notes text,
  created_at timestamptz not null default now()
);

alter table public.warranties enable row level security;

create policy "Members can view warranties"
  on public.warranties for select
  using (public.can_access_property(property_id));

create policy "Members can create warranties"
  on public.warranties for insert
  with check (public.can_access_property(property_id));

create policy "Members can update warranties"
  on public.warranties for update
  using (public.can_access_property(property_id));

create policy "Members can delete warranties"
  on public.warranties for delete
  using (public.can_access_property(property_id));

create index if not exists idx_warranties_property_id on public.warranties(property_id);

-- ============================================================
-- 18. INSPECTIONS
-- ============================================================
create table if not exists public.inspections (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  inspection_type text not null,
  performed_by text,
  inspection_date date not null,
  summary text,
  score integer,
  document_id uuid references public.documents(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.inspections enable row level security;

create policy "Members can view inspections"
  on public.inspections for select
  using (public.can_access_property(property_id));

create policy "Members can create inspections"
  on public.inspections for insert
  with check (public.can_access_property(property_id));

create policy "Members can update inspections"
  on public.inspections for update
  using (public.can_access_property(property_id));

create policy "Members can delete inspections"
  on public.inspections for delete
  using (public.can_access_property(property_id));

create index if not exists idx_inspections_property_id on public.inspections(property_id);
create index if not exists idx_inspections_date on public.inspections(inspection_date desc);

-- ============================================================
-- UPDATED_AT TRIGGERS for new tables
-- ============================================================
create trigger set_guided_step_checkpoints_updated_at
  before update on public.guided_step_checkpoints
  for each row execute function public.set_updated_at();

-- ============================================================
-- SEED DATA: Common issue types
-- ============================================================
insert into public.issue_types (code, name, category, default_severity) values
  ('leak_pipe', 'Leaking Pipe', 'plumbing', 'high'),
  ('leak_faucet', 'Dripping Faucet', 'plumbing', 'low'),
  ('clog_drain', 'Clogged Drain', 'plumbing', 'medium'),
  ('toilet_running', 'Running Toilet', 'plumbing', 'medium'),
  ('circuit_trip', 'Tripped Circuit Breaker', 'electrical', 'medium'),
  ('outlet_dead', 'Dead Outlet', 'electrical', 'medium'),
  ('light_flicker', 'Flickering Lights', 'electrical', 'high'),
  ('hvac_no_heat', 'No Heat', 'hvac', 'critical'),
  ('hvac_no_cool', 'No Cooling', 'hvac', 'high'),
  ('hvac_noise', 'Unusual HVAC Noise', 'hvac', 'medium'),
  ('roof_leak', 'Roof Leak', 'roofing', 'critical'),
  ('gutter_clog', 'Clogged Gutters', 'roofing', 'low'),
  ('window_draft', 'Drafty Window', 'exterior', 'low'),
  ('door_stuck', 'Stuck Door', 'interior', 'low'),
  ('wall_crack', 'Wall Crack', 'foundation', 'high'),
  ('mold_visible', 'Visible Mold', 'interior', 'critical'),
  ('appliance_leak', 'Appliance Leak', 'appliance', 'high'),
  ('water_heater_issue', 'Water Heater Problem', 'plumbing', 'high')
on conflict (code) do nothing;

-- ============================================================
-- SEED DATA: Common badges
-- ============================================================
insert into public.badges (code, name, description, badge_type) values
  ('first_fix', 'First Fix', 'Completed your first DIY repair', 'milestone'),
  ('tool_collector', 'Tool Collector', 'Added 10+ tools to your toolbox', 'achievement'),
  ('handy_helper', 'Handy Helper', 'Lent a tool to a neighbor', 'social'),
  ('streak_7', 'Week Warrior', 'Maintained a 7-day activity streak', 'streak'),
  ('streak_30', 'Monthly Master', 'Maintained a 30-day activity streak', 'streak'),
  ('diag_10', 'Diagnostic Pro', 'Ran 10 AI diagnoses', 'milestone'),
  ('savings_500', 'Money Saver', 'Saved $500+ by doing it yourself', 'financial'),
  ('savings_1000', 'Savings Star', 'Saved $1,000+ by doing it yourself', 'financial'),
  ('maintenance_king', 'Maintenance King', 'Completed all seasonal maintenance tasks', 'achievement'),
  ('home_scholar', 'Home Scholar', 'Reached Expert capability level', 'milestone')
on conflict (code) do nothing;
