-- Tool Loans table: track lending/borrowing of tools
create table if not exists public.tool_loans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  tool_id text not null,
  tool_name text not null,
  tool_emoji text not null default '🔧',
  borrower_name text not null,
  lent_date timestamptz not null default now(),
  return_date timestamptz,
  due_date timestamptz,
  status text not null default 'out' check (status in ('out', 'returned', 'overdue')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Indexes
create index if not exists idx_tool_loans_user_id on public.tool_loans(user_id);
create index if not exists idx_tool_loans_status on public.tool_loans(status);

-- RLS
alter table public.tool_loans enable row level security;

create policy "Users can view their own loans"
  on public.tool_loans for select
  using (auth.uid() = user_id);

create policy "Users can insert their own loans"
  on public.tool_loans for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own loans"
  on public.tool_loans for update
  using (auth.uid() = user_id);

create policy "Users can delete their own loans"
  on public.tool_loans for delete
  using (auth.uid() = user_id);

-- Auto-update updated_at
create or replace trigger set_tool_loans_updated_at
  before update on public.tool_loans
  for each row
  execute function public.set_updated_at();
