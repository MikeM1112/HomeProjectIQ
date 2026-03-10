-- Quote requests: users can request pro quotes from a diagnosis
create table if not exists public.quote_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  title text not null,
  category_id text not null,
  estimated_pro_lo integer, -- cents
  estimated_pro_hi integer, -- cents
  estimated_diy_lo integer, -- cents
  estimated_diy_hi integer, -- cents
  materials_json jsonb default '[]'::jsonb,
  tools_json jsonb default '[]'::jsonb,
  call_script text default '',
  zip_code text not null,
  preferred_timeline text not null default 'flexible'
    check (preferred_timeline in ('asap', 'this_week', 'this_month', 'flexible')),
  contact_preference text not null default 'in_app'
    check (contact_preference in ('in_app', 'email', 'phone')),
  contact_phone text,
  notes text,
  status text not null default 'pending'
    check (status in ('pending', 'matched', 'quoted', 'accepted', 'expired', 'cancelled')),
  bid_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Indexes
create index if not exists idx_quote_requests_user_id on public.quote_requests(user_id);
create index if not exists idx_quote_requests_status on public.quote_requests(status);

-- RLS
alter table public.quote_requests enable row level security;

create policy "Users can view own quote requests"
  on public.quote_requests for select
  using (auth.uid() = user_id);

create policy "Users can create own quote requests"
  on public.quote_requests for insert
  with check (auth.uid() = user_id);

create policy "Users can update own quote requests"
  on public.quote_requests for update
  using (auth.uid() = user_id);

-- Auto-update updated_at
create or replace function public.set_quote_request_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_quote_requests_updated_at
  before update on public.quote_requests
  for each row execute function public.set_quote_request_updated_at();
