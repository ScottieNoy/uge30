create type "public"."jersey_category" as enum ('gyldne_blaerer', 'sprinter', 'flydende_haand', 'førertroje', 'maane', 'prikket', 'punkttroje', 'ungdom');

create type "public"."subcategory" as enum ('beer', 'wine', 'vodka', 'funnel', 'shot', 'beerpong', 'cornhole', 'dart', 'billiard', 'stigegolf', 'bonus', 'other');

create table "public"."points" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "category" jersey_category not null,
    "subcategory" subcategory not null,
    "points" integer not null,
    "submitted_by" uuid,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."points" enable row level security;

create table "public"."users" (
    "id" uuid not null,
    "firstname" text not null,
    "lastname" text not null,
    "emoji" text,
    "is_admin" boolean default false,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."users" enable row level security;

CREATE UNIQUE INDEX points_pkey ON public.points USING btree (id);

CREATE UNIQUE INDEX users_pkey ON public.users USING btree (id);

alter table "public"."points" add constraint "points_pkey" PRIMARY KEY using index "points_pkey";

alter table "public"."users" add constraint "users_pkey" PRIMARY KEY using index "users_pkey";

alter table "public"."points" add constraint "points_points_check" CHECK ((points >= 0)) not valid;

alter table "public"."points" validate constraint "points_points_check";

alter table "public"."points" add constraint "points_submitted_by_fkey" FOREIGN KEY (submitted_by) REFERENCES users(id) not valid;

alter table "public"."points" validate constraint "points_submitted_by_fkey";

alter table "public"."points" add constraint "points_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE not valid;

alter table "public"."points" validate constraint "points_user_id_fkey";

alter table "public"."users" add constraint "users_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) not valid;

alter table "public"."users" validate constraint "users_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.update_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin
  new.updated_at = now();
  return new;
end;
$function$
;

create or replace view "public"."users_with_display_name" as  SELECT users.id,
    users.firstname,
    users.lastname,
    users.emoji,
    users.is_admin,
    users.created_at,
    users.updated_at,
    ((users.emoji || ' '::text) || users.firstname) AS display_name
   FROM users;


grant delete on table "public"."points" to "anon";

grant insert on table "public"."points" to "anon";

grant references on table "public"."points" to "anon";

grant select on table "public"."points" to "anon";

grant trigger on table "public"."points" to "anon";

grant truncate on table "public"."points" to "anon";

grant update on table "public"."points" to "anon";

grant delete on table "public"."points" to "authenticated";

grant insert on table "public"."points" to "authenticated";

grant references on table "public"."points" to "authenticated";

grant select on table "public"."points" to "authenticated";

grant trigger on table "public"."points" to "authenticated";

grant truncate on table "public"."points" to "authenticated";

grant update on table "public"."points" to "authenticated";

grant delete on table "public"."points" to "service_role";

grant insert on table "public"."points" to "service_role";

grant references on table "public"."points" to "service_role";

grant select on table "public"."points" to "service_role";

grant trigger on table "public"."points" to "service_role";

grant truncate on table "public"."points" to "service_role";

grant update on table "public"."points" to "service_role";

grant delete on table "public"."users" to "anon";

grant insert on table "public"."users" to "anon";

grant references on table "public"."users" to "anon";

grant select on table "public"."users" to "anon";

grant trigger on table "public"."users" to "anon";

grant truncate on table "public"."users" to "anon";

grant update on table "public"."users" to "anon";

grant delete on table "public"."users" to "authenticated";

grant insert on table "public"."users" to "authenticated";

grant references on table "public"."users" to "authenticated";

grant select on table "public"."users" to "authenticated";

grant trigger on table "public"."users" to "authenticated";

grant truncate on table "public"."users" to "authenticated";

grant update on table "public"."users" to "authenticated";

grant delete on table "public"."users" to "service_role";

grant insert on table "public"."users" to "service_role";

grant references on table "public"."users" to "service_role";

grant select on table "public"."users" to "service_role";

grant trigger on table "public"."users" to "service_role";

grant truncate on table "public"."users" to "service_role";

grant update on table "public"."users" to "service_role";

create policy "Users can read their own data"
on "public"."users"
as permissive
for select
to public
using ((auth.uid() = id));


CREATE TRIGGER set_updated_at_points BEFORE UPDATE ON public.points FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at();


