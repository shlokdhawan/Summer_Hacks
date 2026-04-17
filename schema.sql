create extension if not exists "uuid-ossp";

create table if not exists messages (
  id uuid primary key default uuid_generate_v4(),
  source text not null,
  source_message_id text not null,
  thread_id text,
  sender_handle text,
  sender_display text,
  recipient_handle text,
  subject text,
  body_text text,
  body_html text,
  created_at timestamptz not null default now(),

  -- AI enrichment
  category text,
  priority_score int,
  summary text,
  needs_reply boolean,
  suggested_replies jsonb
);

create unique index if not exists messages_source_dedupe
  on messages(source, source_message_id);

