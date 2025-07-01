-- Add displayname to users
alter table "public"."users" add column "displayname" text not null;

create unique index users_displayname_key on public.users using btree (displayname);

alter table "public"."users" add constraint "users_displayname_key" unique using index "users_displayname_key";

-- Rename points → value
alter table "public"."points" drop constraint "points_points_check";
alter table "public"."points" drop column "points";
alter table "public"."points" add column "value" integer not null;
alter table "public"."points" add column "note" text;
alter table "public"."points" add constraint "points_points_check" check ((value >= 0)) not valid;
alter table "public"."points" validate constraint "points_points_check";

-- Push subscriptions table
create table public.push_subscriptions (
  user_id uuid primary key references auth.users (id) on delete cascade,
  endpoint text not null,
  keys jsonb not null,
  created_at timestamp with time zone default now()
);
