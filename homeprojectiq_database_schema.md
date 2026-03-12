# HomeProjectIQ Database Schema

## Overview

This document defines the database schema for HomeProjectIQ using **Supabase Postgres** as the system of record.

The schema is designed to support:

- User and household management
- Property and home system records
- AI diagnostics and guided repairs
- Toolbox and repair readiness
- Social tool lending
- Home Capability Score
- Home Risk Radar
- Timeline, documents, and records
- Notifications, alerts, and recommendations

This file includes:

- Core tables
- Key relationships
- Suggested indexes
- Row-level security approach
- Migration guidance

---

# Schema Design Principles

1. **Multi-tenant by household**
   - A user belongs to one or more households.
   - A household owns one or more properties.
   - Most downstream records are scoped through a property and therefore a household.

2. **Property-centric data model**
   - Diagnostics, projects, systems, maintenance, and records all attach to a property.

3. **Structured AI outputs**
   - AI outputs are stored as normalized structured records, not only free text.

4. **Stateful guided repair**
   - Guided repairs require persistent session, step, checkpoint, and message state.

5. **Extensible intelligence layer**
   - Risk, capability, recommendations, and alerts are stored separately so models can evolve.

---

# Suggested Enum Strategy

Use either:
- Postgres enums for stable values, or
- text columns + CHECK constraints for flexibility during rapid iteration

For early-stage product development, using `text` + application validation is often easier.

---

# Core Entity Relationship Summary

```text
users
 └── household_members
      └── households
           └── properties
                ├── property_zones
                ├── systems
                │    └── system_components
                ├── maintenance_tasks
                ├── scans
                │    ├── scan_images
                │    └── diagnoses
                │         └── diagnosis_evidence
                ├── projects
                │    ├── project_steps
                │    ├── project_materials
                │    ├── project_required_tools
                │    └── guided_sessions
                │         ├── guided_step_checkpoints
                │         │    └── guided_checkpoint_images
                │         └── guided_messages
                ├── timeline_events
                ├── documents
                ├── receipts
                ├── warranties
                ├── inspections
                ├── capability_scores
                ├── risk_scores
                ├── alerts
                └── recommendations

users
 ├── user_tools
 ├── handy_profiles
 ├── friendships
 ├── tool_loans
 ├── user_badges
 └── leaderboard_entries
``` 

---

# SQL Schema

## Extensions

```sql
create extension if not exists pgcrypto;
create extension if not exists citext;
```

---

## 1. Users and Households

### users

```sql
create table public.users (
  id uuid primary key default gen_random_uuid(),
  email citext unique not null,
  full_name text,
  avatar_url text,
  time_zone text,
  hourly_time_value numeric(10,2),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

### households

```sql
create table public.households (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references public.users(id) on delete restrict,
  name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

### household_members

```sql
create table public.household_members (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  role text not null,
  created_at timestamptz not null default now(),
  unique (household_id, user_id)
);
```

Suggested roles:
- owner
- member
- viewer

Indexes:

```sql
create index idx_household_members_user_id on public.household_members(user_id);
create index idx_household_members_household_id on public.household_members(household_id);
```

---

## 2. Properties and Zones

### properties

```sql
create table public.properties (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  nickname text,
  address_line_1 text,
  address_line_2 text,
  city text,
  state text,
  postal_code text,
  country text,
  latitude numeric(10,7),
  longitude numeric(10,7),
  year_built integer,
  square_feet integer,
  property_type text,
  climate_zone text,
  ownership_start_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

Indexes:

```sql
create index idx_properties_household_id on public.properties(household_id);
create index idx_properties_city_state on public.properties(city, state);
```

### property_zones

```sql
create table public.property_zones (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  zone_type text not null,
  name text not null,
  floor_level text,
  notes text,
  created_at timestamptz not null default now()
);
```

Examples of `zone_type`:
- kitchen
- bathroom
- attic
- basement
- deck
- roof
- garage
- exterior

Indexes:

```sql
create index idx_property_zones_property_id on public.property_zones(property_id);
```

---

## 3. Systems and Components

### systems

```sql
create table public.systems (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  zone_id uuid references public.property_zones(id) on delete set null,
  system_type text not null,
  name text,
  brand text,
  model text,
  serial_number text,
  install_date date,
  expected_lifespan_years integer,
  current_condition_score integer,
  status text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

Suggested `system_type` values:
- roof
- hvac
- plumbing
- electrical
- water_heater
- foundation
- windows
- appliance
- exterior

Indexes:

```sql
create index idx_systems_property_id on public.systems(property_id);
create index idx_systems_zone_id on public.systems(zone_id);
create index idx_systems_system_type on public.systems(system_type);
```

### system_components

```sql
create table public.system_components (
  id uuid primary key default gen_random_uuid(),
  system_id uuid not null references public.systems(id) on delete cascade,
  component_type text not null,
  name text,
  install_date date,
  condition_score integer,
  notes text,
  created_at timestamptz not null default now()
);
```

Indexes:

```sql
create index idx_system_components_system_id on public.system_components(system_id);
```

### system_readings

```sql
create table public.system_readings (
  id uuid primary key default gen_random_uuid(),
  system_id uuid not null references public.systems(id) on delete cascade,
  reading_type text not null,
  reading_value numeric,
  unit text,
  source text,
  metadata jsonb,
  recorded_at timestamptz not null default now()
);
```

Indexes:

```sql
create index idx_system_readings_system_id on public.system_readings(system_id);
create index idx_system_readings_recorded_at on public.system_readings(recorded_at desc);
```

---

## 4. Maintenance

### maintenance_tasks

```sql
create table public.maintenance_tasks (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  system_id uuid references public.systems(id) on delete set null,
  zone_id uuid references public.property_zones(id) on delete set null,
  title text not null,
  description text,
  task_type text,
  frequency_type text,
  frequency_value integer,
  due_date date,
  last_completed_at timestamptz,
  status text not null default 'upcoming',
  priority text,
  estimated_diy_cost_min numeric(10,2),
  estimated_diy_cost_max numeric(10,2),
  estimated_time_minutes integer,
  created_by text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

Suggested `status`:
- upcoming
- due
- overdue
- completed
- skipped

Indexes:

```sql
create index idx_maintenance_tasks_property_id on public.maintenance_tasks(property_id);
create index idx_maintenance_tasks_due_date on public.maintenance_tasks(due_date);
create index idx_maintenance_tasks_status on public.maintenance_tasks(status);
```

---

## 5. Diagnostics

### issue_types

```sql
create table public.issue_types (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  category text,
  description text,
  default_severity text,
  created_at timestamptz not null default now()
);
```

### scans

```sql
create table public.scans (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  zone_id uuid references public.property_zones(id) on delete set null,
  user_id uuid not null references public.users(id) on delete restrict,
  scan_type text not null,
  status text not null default 'created',
  user_note text,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  metadata jsonb
);
```

Suggested `scan_type`:
- issue_photo
- guided_walkthrough
- emergency
- seasonal_check
- inspection

Indexes:

```sql
create index idx_scans_property_id on public.scans(property_id);
create index idx_scans_user_id on public.scans(user_id);
create index idx_scans_started_at on public.scans(started_at desc);
```

### scan_images

```sql
create table public.scan_images (
  id uuid primary key default gen_random_uuid(),
  scan_id uuid not null references public.scans(id) on delete cascade,
  image_url text not null,
  image_order integer,
  captured_at timestamptz,
  metadata jsonb,
  created_at timestamptz not null default now()
);
```

Indexes:

```sql
create index idx_scan_images_scan_id on public.scan_images(scan_id);
```

### diagnoses

```sql
create table public.diagnoses (
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
```

Indexes:

```sql
create index idx_diagnoses_scan_id on public.diagnoses(scan_id);
create index idx_diagnoses_issue_type_id on public.diagnoses(issue_type_id);
create index idx_diagnoses_created_at on public.diagnoses(created_at desc);
```

### diagnosis_evidence

```sql
create table public.diagnosis_evidence (
  id uuid primary key default gen_random_uuid(),
  diagnosis_id uuid not null references public.diagnoses(id) on delete cascade,
  evidence_type text not null,
  description text,
  confidence_score numeric(5,4),
  source_region jsonb,
  created_at timestamptz not null default now()
);
```

Indexes:

```sql
create index idx_diagnosis_evidence_diagnosis_id on public.diagnosis_evidence(diagnosis_id);
```

---

## 6. Projects and Guided Repair

### projects

```sql
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  diagnosis_id uuid references public.diagnoses(id) on delete set null,
  system_id uuid references public.systems(id) on delete set null,
  zone_id uuid references public.property_zones(id) on delete set null,
  title text not null,
  description text,
  project_type text,
  status text not null default 'planned',
  diy_or_pro text,
  estimated_cost_min numeric(10,2),
  estimated_cost_max numeric(10,2),
  actual_cost numeric(10,2),
  estimated_time_minutes integer,
  actual_time_minutes integer,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

Indexes:

```sql
create index idx_projects_property_id on public.projects(property_id);
create index idx_projects_diagnosis_id on public.projects(diagnosis_id);
create index idx_projects_status on public.projects(status);
```

### project_steps

```sql
create table public.project_steps (
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
```

Indexes:

```sql
create index idx_project_steps_project_id on public.project_steps(project_id);
```

### project_materials

```sql
create table public.project_materials (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  name text not null,
  quantity numeric,
  unit text,
  estimated_cost numeric(10,2),
  purchase_url text,
  created_at timestamptz not null default now()
);
```

Indexes:

```sql
create index idx_project_materials_project_id on public.project_materials(project_id);
```

### guided_sessions

```sql
create table public.guided_sessions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete restrict,
  status text not null default 'active',
  current_step_order integer,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (project_id)
);
```

Indexes:

```sql
create index idx_guided_sessions_project_id on public.guided_sessions(project_id);
create index idx_guided_sessions_user_id on public.guided_sessions(user_id);
```

### guided_step_checkpoints

```sql
create table public.guided_step_checkpoints (
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
```

Indexes:

```sql
create index idx_guided_step_checkpoints_session_id on public.guided_step_checkpoints(guided_session_id);
create index idx_guided_step_checkpoints_step_id on public.guided_step_checkpoints(project_step_id);
```

### guided_checkpoint_images

```sql
create table public.guided_checkpoint_images (
  id uuid primary key default gen_random_uuid(),
  guided_step_checkpoint_id uuid not null references public.guided_step_checkpoints(id) on delete cascade,
  image_url text not null,
  image_order integer,
  metadata jsonb,
  created_at timestamptz not null default now()
);
```

Indexes:

```sql
create index idx_guided_checkpoint_images_checkpoint_id on public.guided_checkpoint_images(guided_step_checkpoint_id);
```

### guided_messages

```sql
create table public.guided_messages (
  id uuid primary key default gen_random_uuid(),
  guided_session_id uuid not null references public.guided_sessions(id) on delete cascade,
  sender_type text not null,
  message text not null,
  message_type text,
  metadata jsonb,
  created_at timestamptz not null default now()
);
```

Indexes:

```sql
create index idx_guided_messages_session_id on public.guided_messages(guided_session_id);
create index idx_guided_messages_created_at on public.guided_messages(created_at);
```

---

## 7. Toolbox and Tools

### tools

```sql
create table public.tools (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text,
  sub_category text,
  brand text,
  model text,
  typical_use_cases text[],
  created_at timestamptz not null default now()
);
```

Indexes:

```sql
create index idx_tools_name on public.tools(name);
create index idx_tools_category on public.tools(category);
```

### user_tools

```sql
create table public.user_tools (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  tool_id uuid not null references public.tools(id) on delete cascade,
  quantity integer not null default 1,
  condition text,
  storage_location text,
  is_lendable boolean not null default true,
  purchase_date date,
  purchase_price numeric(10,2),
  last_used_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, tool_id)
);
```

Indexes:

```sql
create index idx_user_tools_user_id on public.user_tools(user_id);
create index idx_user_tools_tool_id on public.user_tools(tool_id);
create index idx_user_tools_lendable on public.user_tools(is_lendable);
```

### project_required_tools

```sql
create table public.project_required_tools (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  tool_id uuid not null references public.tools(id) on delete cascade,
  is_required boolean not null default true,
  notes text,
  created_at timestamptz not null default now(),
  unique (project_id, tool_id)
);
```

Indexes:

```sql
create index idx_project_required_tools_project_id on public.project_required_tools(project_id);
```

---

## 8. Social Network and Lending

### handy_profiles

```sql
create table public.handy_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.users(id) on delete cascade,
  handy_level integer not null default 1,
  handy_score integer not null default 0,
  bio text,
  favorite_project_type text,
  lender_reliability_score numeric(5,2),
  borrower_reliability_score numeric(5,2),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

### friendships

```sql
create table public.friendships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  friend_user_id uuid not null references public.users(id) on delete cascade,
  status text not null,
  created_at timestamptz not null default now(),
  unique (user_id, friend_user_id),
  check (user_id <> friend_user_id)
);
```

Indexes:

```sql
create index idx_friendships_user_id on public.friendships(user_id);
create index idx_friendships_friend_user_id on public.friendships(friend_user_id);
```

### tool_loans

```sql
create table public.tool_loans (
  id uuid primary key default gen_random_uuid(),
  tool_owner_user_id uuid not null references public.users(id) on delete cascade,
  borrower_user_id uuid not null references public.users(id) on delete cascade,
  user_tool_id uuid not null references public.user_tools(id) on delete cascade,
  loaned_at timestamptz not null default now(),
  due_back_at timestamptz,
  returned_at timestamptz,
  status text not null default 'active',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (tool_owner_user_id <> borrower_user_id)
);
```

Indexes:

```sql
create index idx_tool_loans_owner on public.tool_loans(tool_owner_user_id);
create index idx_tool_loans_borrower on public.tool_loans(borrower_user_id);
create index idx_tool_loans_status on public.tool_loans(status);
create index idx_tool_loans_due_back_at on public.tool_loans(due_back_at);
```

### badges

```sql
create table public.badges (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  description text,
  badge_type text,
  created_at timestamptz not null default now()
);
```

### user_badges

```sql
create table public.user_badges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  badge_id uuid not null references public.badges(id) on delete cascade,
  awarded_at timestamptz not null default now(),
  reason text,
  unique (user_id, badge_id)
);
```

### leaderboard_entries

```sql
create table public.leaderboard_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  leaderboard_type text not null,
  period_start date not null,
  period_end date not null,
  score integer not null default 0,
  rank integer,
  metadata jsonb,
  created_at timestamptz not null default now()
);
```

Indexes:

```sql
create index idx_leaderboard_entries_user_id on public.leaderboard_entries(user_id);
create index idx_leaderboard_entries_type_period on public.leaderboard_entries(leaderboard_type, period_start, period_end);
```

---

## 9. Timeline and Records

### timeline_events

```sql
create table public.timeline_events (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  system_id uuid references public.systems(id) on delete set null,
  event_type text not null,
  title text not null,
  description text,
  event_date timestamptz not null,
  source text,
  metadata jsonb,
  created_at timestamptz not null default now()
);
```

Indexes:

```sql
create index idx_timeline_events_property_id on public.timeline_events(property_id);
create index idx_timeline_events_event_date on public.timeline_events(event_date desc);
```

### documents

```sql
create table public.documents (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  system_id uuid references public.systems(id) on delete set null,
  document_type text not null,
  title text not null,
  file_url text not null,
  uploaded_by uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now()
);
```

Indexes:

```sql
create index idx_documents_property_id on public.documents(property_id);
create index idx_documents_project_id on public.documents(project_id);
```

### receipts

```sql
create table public.receipts (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  merchant_name text,
  amount numeric(10,2),
  purchase_date date,
  file_url text,
  created_at timestamptz not null default now()
);
```

Indexes:

```sql
create index idx_receipts_property_id on public.receipts(property_id);
```

### warranties

```sql
create table public.warranties (
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
```

### inspections

```sql
create table public.inspections (
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
```

Indexes:

```sql
create index idx_inspections_property_id on public.inspections(property_id);
create index idx_inspections_date on public.inspections(inspection_date desc);
```

---

## 10. Intelligence Outputs

### capability_scores

```sql
create table public.capability_scores (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  overall_score integer not null,
  tool_readiness_score integer,
  repair_experience_score integer,
  system_knowledge_score integer,
  maintenance_discipline_score integer,
  emergency_preparedness_score integer,
  score_version text,
  metadata jsonb,
  generated_at timestamptz not null default now()
);
```

Indexes:

```sql
create index idx_capability_scores_property_id on public.capability_scores(property_id);
create index idx_capability_scores_generated_at on public.capability_scores(generated_at desc);
```

### risk_scores

```sql
create table public.risk_scores (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  system_id uuid references public.systems(id) on delete cascade,
  risk_level text not null,
  risk_score integer,
  time_to_failure_estimate text,
  reason_summary text,
  score_version text,
  metadata jsonb,
  generated_at timestamptz not null default now()
);
```

Indexes:

```sql
create index idx_risk_scores_property_id on public.risk_scores(property_id);
create index idx_risk_scores_system_id on public.risk_scores(system_id);
create index idx_risk_scores_generated_at on public.risk_scores(generated_at desc);
```

### alerts

```sql
create table public.alerts (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  alert_type text not null,
  severity text not null,
  title text not null,
  message text not null,
  related_system_id uuid references public.systems(id) on delete set null,
  related_task_id uuid references public.maintenance_tasks(id) on delete set null,
  related_diagnosis_id uuid references public.diagnoses(id) on delete set null,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  dismissed_at timestamptz
);
```

Indexes:

```sql
create index idx_alerts_property_id on public.alerts(property_id);
create index idx_alerts_status on public.alerts(status);
create index idx_alerts_created_at on public.alerts(created_at desc);
```

### recommendations

```sql
create table public.recommendations (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  recommendation_type text not null,
  title text not null,
  description text,
  priority text,
  estimated_savings numeric(10,2),
  estimated_cost numeric(10,2),
  related_system_id uuid references public.systems(id) on delete set null,
  metadata jsonb,
  created_at timestamptz not null default now()
);
```

Indexes:

```sql
create index idx_recommendations_property_id on public.recommendations(property_id);
create index idx_recommendations_priority on public.recommendations(priority);
```

---

# Suggested Triggers

## updated_at Trigger Function

```sql
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
```

Apply this trigger to tables with `updated_at`.

Example:

```sql
create trigger trg_users_updated_at
before update on public.users
for each row execute function public.set_updated_at();
```

Repeat for:
- users
- households
- properties
- systems
- maintenance_tasks
- projects
- guided_sessions
- guided_step_checkpoints
- user_tools
- handy_profiles
- tool_loans

---

# Row-Level Security Strategy

Enable RLS on all user-facing tables.

```sql
alter table public.users enable row level security;
alter table public.households enable row level security;
alter table public.household_members enable row level security;
alter table public.properties enable row level security;
```

Continue for all user-facing tables.

## Access Model

A user can access a row if:
- they are directly the owner of the row, or
- the row belongs to a property in a household they belong to, or
- the row represents a social/tool relationship involving them

---

## Example Helper View or Function

A helper function is useful:

```sql
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
```

You may also want a helper to test property access:

```sql
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
```

---

## Example RLS Policies

### properties

```sql
create policy "users can view household properties"
on public.properties
for select
using (public.can_access_property(id));
```

```sql
create policy "users can insert properties for their household"
on public.properties
for insert
with check (
  exists (
    select 1
    from public.household_members hm
    where hm.household_id = household_id
      and hm.user_id = auth.uid()
      and hm.role in ('owner', 'member')
  )
);
```

### projects

```sql
create policy "users can view projects for accessible properties"
on public.projects
for select
using (public.can_access_property(property_id));
```

### scans

```sql
create policy "users can view scans for accessible properties"
on public.scans
for select
using (public.can_access_property(property_id));
```

### user_tools

```sql
create policy "users can manage their own tools"
on public.user_tools
for all
using (user_id = auth.uid())
with check (user_id = auth.uid());
```

### tool_loans

```sql
create policy "participants can view tool loans"
on public.tool_loans
for select
using (
  tool_owner_user_id = auth.uid()
  or borrower_user_id = auth.uid()
);
```

### friendships

```sql
create policy "users can view their friendships"
on public.friendships
for select
using (
  user_id = auth.uid()
  or friend_user_id = auth.uid()
);
```

---

# Seed Data Recommendations

For demo/development, create seed data for:

- 1 user
- 1 household
- 1 property
- 6–8 zones
- 5–8 systems
- 3 maintenance tasks
- 2 diagnoses
- 2 projects
- 1 guided repair session
- 10 common tools
- 1 friend
- 1 tool loan
- 1 capability score
- 3 risk scores
- 3 recommendations

This allows realistic UI and workflow testing immediately.

---

# Suggested Migration Order

Apply migrations in this order:

1. extensions
2. users / households / household_members
3. properties / zones
4. systems / components / readings
5. maintenance
6. issue_types / scans / scan_images / diagnoses / evidence
7. projects / steps / materials
8. guided repair tables
9. tools / user_tools / project_required_tools
10. social tables
11. timeline / documents / receipts / warranties / inspections
12. capability_scores / risk_scores / alerts / recommendations
13. trigger functions
14. indexes
15. RLS enablement and policies
16. seed data

---

# Performance Notes

1. Add indexes on all major foreign keys.
2. Add descending date indexes for dashboards and timelines.
3. Consider materialized views later for:
   - latest capability score by property
   - latest risk score by property/system
   - active alerts summary
4. If social network grows, geospatial search may later require PostGIS.

---

# Future Schema Expansions

Potential future tables:

- contractor_requests
- contractor_quotes
- affiliate_products
- home_walkthrough_models
- insurance_claims
- neighborhood_tool_libraries
- recurring_challenges
- notification_deliveries

These should be added later rather than in MVP.

---

# Final Notes

This schema is designed to support a phased build:

- Start with diagnostics, projects, property records, and dashboard
- Add toolbox intelligence next
- Add guided repair state and checkpoints
- Add scoring and risk systems
- Add social lending and neighborhood intelligence later

The schema is intentionally structured so that AI outputs become durable product data that can power dashboards, notifications, scoring systems, and future automation.
