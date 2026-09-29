-- Quarkions: pedidos de diagnóstico vindos do site.
-- Rodar no SQL Editor do projeto Supabase da Quarkions.

create table if not exists public.diagnosticos (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  nome text not null,
  email text not null,
  whatsapp text not null,
  clinica text not null,
  cidade text,
  tipo_clinica text,
  volume_leads text,
  canais text[],
  maior_dor text,
  usa_crm text,
  origem text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  pagina text,
  consentimento boolean not null,
  status text default 'novo'
);

create index if not exists diagnosticos_created_at_idx on public.diagnosticos (created_at desc);

-- RLS ligado e nenhuma política: anon e authenticated não leem nem escrevem.
-- Só o servidor do site, com a service role key, insere e lê.
alter table public.diagnosticos enable row level security;
