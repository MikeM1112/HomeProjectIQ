-- Migration 008: Platform Architecture Extension
-- Adds 16 new tables for the full 9-domain HomeProjectIQ platform

-- ============================================================
-- 1. HOUSEHOLDS
-- ============================================================
create table if not exists public.households (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.households enable row level security;

create policy "Users can view their households"
  on public.households for select
  using (id in (select household_id from public.household_members where user_id = auth.uid()));

create policy "Users can create households"
  on public.households for insert
  with check (created_by = auth.uid());

create policy "Household owners can update"
  on public.households for update
  using (created_by = auth.uid());

-- ============================================================
-- 2. HOUSEHOLD_MEMBERS
-- ============================================================
create table if not exists public.household_members (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'member' check (role in ('owner', 'admin', 'member')),
  joined_at timestamptz not null default now(),
  unique(household_id, user_id)
);

alter table public.household_members enable row level security;

create policy "Members can view their household members"
  on public.household_members for select
  using (household_id in (select household_id from public.household_members hm where hm.user_id = auth.uid()));

create policy "Users can join households"
  on public.household_members for insert
  with check (user_id = auth.uid());

create policy "Owners can manage members"
  on public.household_members for update
  using (household_id in (select household_id from public.household_members hm where hm.user_id = auth.uid() and hm.role = 'owner'));

create policy "Owners can remove members"
  on public.household_members for delete
  using (household_id in (select household_id from public.household_members hm where hm.user_id = auth.uid() and hm.role = 'owner') or user_id = auth.uid());

-- ============================================================
-- 3. PROPERTIES
-- ============================================================
create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  name text not null,
  address text,
  home_type text not null default 'single_family',
  year_built integer,
  square_footage integer,
  lot_size_sqft integer,
  floors integer default 1,
  bedrooms integer,
  bathrooms numeric(3,1),
  photo_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.properties enable row level security;

create policy "Members can view their properties"
  on public.properties for select
  using (household_id in (select household_id from public.household_members where user_id = auth.uid()));

create policy "Members can create properties"
  on public.properties for insert
  with check (household_id in (select household_id from public.household_members where user_id = auth.uid()));

create policy "Members can update properties"
  on public.properties for update
  using (household_id in (select household_id from public.household_members where user_id = auth.uid()));

create policy "Owners can delete properties"
  on public.properties for delete
  using (household_id in (select household_id from public.household_members where user_id = auth.uid() and role = 'owner'));

-- ============================================================
-- 4. PROPERTY_ZONES
-- ============================================================
create table if not exists public.property_zones (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  name text not null,
  zone_type text not null default 'interior' check (zone_type in ('interior', 'exterior', 'garage', 'yard', 'roof', 'basement', 'attic')),
  floor_number integer,
  notes text,
  created_at timestamptz not null default now()
);

alter table public.property_zones enable row level security;

create policy "Members can view zones"
  on public.property_zones for select
  using (property_id in (
    select p.id from public.properties p
    join public.household_members hm on hm.household_id = p.household_id
    where hm.user_id = auth.uid()
  ));

create policy "Members can manage zones"
  on public.property_zones for insert
  with check (property_id in (
    select p.id from public.properties p
    join public.household_members hm on hm.household_id = p.household_id
    where hm.user_id = auth.uid()
  ));

create policy "Members can update zones"
  on public.property_zones for update
  using (property_id in (
    select p.id from public.properties p
    join public.household_members hm on hm.household_id = p.household_id
    where hm.user_id = auth.uid()
  ));

create policy "Members can delete zones"
  on public.property_zones for delete
  using (property_id in (
    select p.id from public.properties p
    join public.household_members hm on hm.household_id = p.household_id
    where hm.user_id = auth.uid()
  ));

-- ============================================================
-- 5. SYSTEMS (Home systems: HVAC, plumbing, electrical, etc.)
-- ============================================================
create table if not exists public.systems (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  name text not null,
  system_type text not null check (system_type in ('hvac', 'plumbing', 'electrical', 'roofing', 'foundation', 'appliance', 'exterior', 'interior', 'landscaping', 'security', 'other')),
  brand text,
  model text,
  install_date date,
  warranty_expiry date,
  expected_lifespan_years integer,
  condition text default 'good' check (condition in ('excellent', 'good', 'fair', 'poor', 'critical')),
  last_serviced_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.systems enable row level security;

create policy "Members can view systems"
  on public.systems for select
  using (property_id in (
    select p.id from public.properties p
    join public.household_members hm on hm.household_id = p.household_id
    where hm.user_id = auth.uid()
  ));

create policy "Members can manage systems"
  on public.systems for insert
  with check (property_id in (
    select p.id from public.properties p
    join public.household_members hm on hm.household_id = p.household_id
    where hm.user_id = auth.uid()
  ));

create policy "Members can update systems"
  on public.systems for update
  using (property_id in (
    select p.id from public.properties p
    join public.household_members hm on hm.household_id = p.household_id
    where hm.user_id = auth.uid()
  ));

create policy "Members can delete systems"
  on public.systems for delete
  using (property_id in (
    select p.id from public.properties p
    join public.household_members hm on hm.household_id = p.household_id
    where hm.user_id = auth.uid()
  ));

-- ============================================================
-- 6. SYSTEM_COMPONENTS
-- ============================================================
create table if not exists public.system_components (
  id uuid primary key default gen_random_uuid(),
  system_id uuid not null references public.systems(id) on delete cascade,
  name text not null,
  component_type text,
  brand text,
  model text,
  serial_number text,
  install_date date,
  warranty_expiry date,
  condition text default 'good' check (condition in ('excellent', 'good', 'fair', 'poor', 'critical')),
  notes text,
  created_at timestamptz not null default now()
);

alter table public.system_components enable row level security;

create policy "Members can view components"
  on public.system_components for select
  using (system_id in (
    select s.id from public.systems s
    join public.properties p on p.id = s.property_id
    join public.household_members hm on hm.household_id = p.household_id
    where hm.user_id = auth.uid()
  ));

create policy "Members can manage components"
  on public.system_components for insert
  with check (system_id in (
    select s.id from public.systems s
    join public.properties p on p.id = s.property_id
    join public.household_members hm on hm.household_id = p.household_id
    where hm.user_id = auth.uid()
  ));

create policy "Members can update components"
  on public.system_components for update
  using (system_id in (
    select s.id from public.systems s
    join public.properties p on p.id = s.property_id
    join public.household_members hm on hm.household_id = p.household_id
    where hm.user_id = auth.uid()
  ));

create policy "Members can delete components"
  on public.system_components for delete
  using (system_id in (
    select s.id from public.systems s
    join public.properties p on p.id = s.property_id
    join public.household_members hm on hm.household_id = p.household_id
    where hm.user_id = auth.uid()
  ));

-- ============================================================
-- 7. GUIDED_SESSIONS
-- ============================================================
create table if not exists public.guided_sessions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'active' check (status in ('active', 'paused', 'completed', 'abandoned')),
  current_step integer not null default 1,
  total_steps integer not null default 1,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  paused_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.guided_sessions enable row level security;

create policy "Users can view own sessions"
  on public.guided_sessions for select
  using (user_id = auth.uid());

create policy "Users can create sessions"
  on public.guided_sessions for insert
  with check (user_id = auth.uid());

create policy "Users can update own sessions"
  on public.guided_sessions for update
  using (user_id = auth.uid());

-- ============================================================
-- 8. STEP_CHECKPOINTS
-- ============================================================
create table if not exists public.step_checkpoints (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.guided_sessions(id) on delete cascade,
  step_number integer not null,
  title text not null,
  instructions text,
  photo_url text,
  ai_validation_status text default 'pending' check (ai_validation_status in ('pending', 'passed', 'failed', 'skipped')),
  ai_feedback text,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.step_checkpoints enable row level security;

create policy "Users can view own checkpoints"
  on public.step_checkpoints for select
  using (session_id in (select id from public.guided_sessions where user_id = auth.uid()));

create policy "Users can create checkpoints"
  on public.step_checkpoints for insert
  with check (session_id in (select id from public.guided_sessions where user_id = auth.uid()));

create policy "Users can update own checkpoints"
  on public.step_checkpoints for update
  using (session_id in (select id from public.guided_sessions where user_id = auth.uid()));

-- ============================================================
-- 9. PROJECT_REQUIRED_TOOLS
-- ============================================================
create table if not exists public.project_required_tools (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  tool_id text not null,
  tool_name text not null,
  is_owned boolean default false,
  is_borrowable boolean default false,
  source text check (source in ('owned', 'borrow', 'purchase', 'rent', null)),
  created_at timestamptz not null default now()
);

alter table public.project_required_tools enable row level security;

create policy "Users can view project tools"
  on public.project_required_tools for select
  using (project_id in (select id from public.projects where user_id = auth.uid()));

create policy "Users can manage project tools"
  on public.project_required_tools for insert
  with check (project_id in (select id from public.projects where user_id = auth.uid()));

create policy "Users can update project tools"
  on public.project_required_tools for update
  using (project_id in (select id from public.projects where user_id = auth.uid()));

create policy "Users can delete project tools"
  on public.project_required_tools for delete
  using (project_id in (select id from public.projects where user_id = auth.uid()));

-- ============================================================
-- 10. HANDY_PROFILES
-- ============================================================
create table if not exists public.handy_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade unique,
  display_name text,
  bio text,
  skills text[] default '{}',
  rating numeric(3,2) default 0,
  total_reviews integer default 0,
  tools_lent_count integer default 0,
  repairs_helped integer default 0,
  is_available boolean default true,
  latitude double precision,
  longitude double precision,
  neighborhood text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.handy_profiles enable row level security;

create policy "Anyone can view handy profiles"
  on public.handy_profiles for select
  using (true);

create policy "Users can create own profile"
  on public.handy_profiles for insert
  with check (user_id = auth.uid());

create policy "Users can update own profile"
  on public.handy_profiles for update
  using (user_id = auth.uid());

-- ============================================================
-- 11. TIMELINE_EVENTS
-- ============================================================
create table if not exists public.timeline_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  property_id uuid references public.properties(id) on delete set null,
  project_id uuid references public.projects(id) on delete set null,
  event_type text not null check (event_type in ('repair', 'maintenance', 'inspection', 'purchase', 'warranty', 'incident', 'upgrade', 'other')),
  title text not null,
  description text,
  cost numeric(10,2),
  photo_urls text[] default '{}',
  metadata jsonb default '{}',
  event_date timestamptz not null default now(),
  created_at timestamptz not null default now()
);

alter table public.timeline_events enable row level security;

create policy "Users can view own events"
  on public.timeline_events for select
  using (user_id = auth.uid());

create policy "Users can create events"
  on public.timeline_events for insert
  with check (user_id = auth.uid());

create policy "Users can update own events"
  on public.timeline_events for update
  using (user_id = auth.uid());

create policy "Users can delete own events"
  on public.timeline_events for delete
  using (user_id = auth.uid());

-- ============================================================
-- 12. DOCUMENTS
-- ============================================================
create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  property_id uuid references public.properties(id) on delete set null,
  document_type text not null check (document_type in ('receipt', 'warranty', 'manual', 'inspection_report', 'insurance', 'permit', 'contract', 'photo', 'other')),
  title text not null,
  description text,
  file_url text not null,
  file_type text,
  file_size integer,
  metadata jsonb default '{}',
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.documents enable row level security;

create policy "Users can view own documents"
  on public.documents for select
  using (user_id = auth.uid());

create policy "Users can create documents"
  on public.documents for insert
  with check (user_id = auth.uid());

create policy "Users can update own documents"
  on public.documents for update
  using (user_id = auth.uid());

create policy "Users can delete own documents"
  on public.documents for delete
  using (user_id = auth.uid());

-- ============================================================
-- 13. CAPABILITY_SCORES
-- ============================================================
create table if not exists public.capability_scores (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  property_id uuid references public.properties(id) on delete set null,
  overall_score integer not null default 0 check (overall_score >= 0 and overall_score <= 100),
  tool_readiness integer default 0,
  repair_experience integer default 0,
  maintenance_completion integer default 0,
  documentation_score integer default 0,
  emergency_preparedness integer default 0,
  capability_level text default 'beginner' check (capability_level in ('beginner', 'developing', 'capable', 'proficient', 'expert')),
  suggestions jsonb default '[]',
  calculated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

alter table public.capability_scores enable row level security;

create policy "Users can view own scores"
  on public.capability_scores for select
  using (user_id = auth.uid());

create policy "Users can create scores"
  on public.capability_scores for insert
  with check (user_id = auth.uid());

-- ============================================================
-- 14. RISK_SCORES
-- ============================================================
create table if not exists public.risk_scores (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  property_id uuid references public.properties(id) on delete set null,
  system_id uuid references public.systems(id) on delete set null,
  system_type text not null,
  risk_level text not null default 'low' check (risk_level in ('low', 'moderate', 'high', 'critical')),
  risk_score integer not null default 0 check (risk_score >= 0 and risk_score <= 100),
  failure_probability numeric(5,2),
  estimated_repair_cost numeric(10,2),
  time_to_failure_days integer,
  contributing_factors jsonb default '[]',
  calculated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

alter table public.risk_scores enable row level security;

create policy "Users can view own risk scores"
  on public.risk_scores for select
  using (user_id = auth.uid());

create policy "Users can create risk scores"
  on public.risk_scores for insert
  with check (user_id = auth.uid());

-- ============================================================
-- 15. ALERTS
-- ============================================================
create table if not exists public.alerts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  property_id uuid references public.properties(id) on delete set null,
  alert_type text not null check (alert_type in ('risk', 'maintenance', 'warranty', 'weather', 'system', 'recommendation')),
  severity text not null default 'info' check (severity in ('info', 'warning', 'urgent', 'critical')),
  title text not null,
  message text not null,
  action_url text,
  is_read boolean default false,
  is_dismissed boolean default false,
  metadata jsonb default '{}',
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.alerts enable row level security;

create policy "Users can view own alerts"
  on public.alerts for select
  using (user_id = auth.uid());

create policy "System can create alerts"
  on public.alerts for insert
  with check (user_id = auth.uid());

create policy "Users can update own alerts"
  on public.alerts for update
  using (user_id = auth.uid());

create policy "Users can delete own alerts"
  on public.alerts for delete
  using (user_id = auth.uid());

-- ============================================================
-- 16. RECOMMENDATIONS
-- ============================================================
create table if not exists public.recommendations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  property_id uuid references public.properties(id) on delete set null,
  recommendation_type text not null check (recommendation_type in ('preventative', 'upgrade', 'repair', 'maintenance', 'efficiency', 'safety')),
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high', 'urgent')),
  title text not null,
  description text not null,
  estimated_cost_lo numeric(10,2),
  estimated_cost_hi numeric(10,2),
  estimated_savings numeric(10,2),
  difficulty text check (difficulty in ('easy', 'moderate', 'hard', 'professional')),
  is_completed boolean default false,
  is_dismissed boolean default false,
  metadata jsonb default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.recommendations enable row level security;

create policy "Users can view own recommendations"
  on public.recommendations for select
  using (user_id = auth.uid());

create policy "System can create recommendations"
  on public.recommendations for insert
  with check (user_id = auth.uid());

create policy "Users can update own recommendations"
  on public.recommendations for update
  using (user_id = auth.uid());

-- ============================================================
-- INDEXES for common queries
-- ============================================================
create index if not exists idx_household_members_user on public.household_members(user_id);
create index if not exists idx_household_members_household on public.household_members(household_id);
create index if not exists idx_properties_household on public.properties(household_id);
create index if not exists idx_property_zones_property on public.property_zones(property_id);
create index if not exists idx_systems_property on public.systems(property_id);
create index if not exists idx_system_components_system on public.system_components(system_id);
create index if not exists idx_guided_sessions_project on public.guided_sessions(project_id);
create index if not exists idx_guided_sessions_user on public.guided_sessions(user_id);
create index if not exists idx_step_checkpoints_session on public.step_checkpoints(session_id);
create index if not exists idx_project_required_tools_project on public.project_required_tools(project_id);
create index if not exists idx_handy_profiles_user on public.handy_profiles(user_id);
create index if not exists idx_timeline_events_user on public.timeline_events(user_id);
create index if not exists idx_timeline_events_property on public.timeline_events(property_id);
create index if not exists idx_timeline_events_date on public.timeline_events(event_date desc);
create index if not exists idx_documents_user on public.documents(user_id);
create index if not exists idx_documents_property on public.documents(property_id);
create index if not exists idx_capability_scores_user on public.capability_scores(user_id);
create index if not exists idx_risk_scores_user on public.risk_scores(user_id);
create index if not exists idx_risk_scores_property on public.risk_scores(property_id);
create index if not exists idx_alerts_user_unread on public.alerts(user_id) where is_read = false;
create index if not exists idx_recommendations_user on public.recommendations(user_id);

-- ============================================================
-- UPDATED_AT TRIGGERS
-- ============================================================
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_households_updated_at before update on public.households for each row execute function public.set_updated_at();
create trigger set_properties_updated_at before update on public.properties for each row execute function public.set_updated_at();
create trigger set_systems_updated_at before update on public.systems for each row execute function public.set_updated_at();
create trigger set_guided_sessions_updated_at before update on public.guided_sessions for each row execute function public.set_updated_at();
create trigger set_handy_profiles_updated_at before update on public.handy_profiles for each row execute function public.set_updated_at();
create trigger set_documents_updated_at before update on public.documents for each row execute function public.set_updated_at();
create trigger set_recommendations_updated_at before update on public.recommendations for each row execute function public.set_updated_at();
