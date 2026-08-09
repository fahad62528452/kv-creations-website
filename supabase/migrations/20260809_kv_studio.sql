-- KV Creations studio documents
create table if not exists public.kv_studio_documents (
  id text primary key,
  doc_type text not null check (doc_type in ('quotation', 'invoice')),
  number text not null default '',
  payload jsonb not null,
  client_name text not null default '',
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists kv_studio_documents_updated_at_idx
  on public.kv_studio_documents (updated_at desc);

create table if not exists public.kv_studio_firm (
  id text primary key default 'default',
  payload jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.kv_studio_documents enable row level security;
alter table public.kv_studio_firm enable row level security;

drop policy if exists "kv_studio_documents_anon_all" on public.kv_studio_documents;
create policy "kv_studio_documents_anon_all"
  on public.kv_studio_documents
  for all
  to anon, authenticated
  using (true)
  with check (true);

drop policy if exists "kv_studio_firm_anon_all" on public.kv_studio_firm;
create policy "kv_studio_firm_anon_all"
  on public.kv_studio_firm
  for all
  to anon, authenticated
  using (true)
  with check (true);

grant all on table public.kv_studio_documents to anon, authenticated, service_role;
grant all on table public.kv_studio_firm to anon, authenticated, service_role;
