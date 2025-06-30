alter table "public"."points" drop constraint "points_points_check";

alter table "public"."points" drop column "points";

alter table "public"."points" add column "note" text;

alter table "public"."points" add column "value" integer not null;

alter table "public"."users" add column "displayname" text not null;

CREATE UNIQUE INDEX users_displayname_key ON public.users USING btree (displayname);

alter table "public"."users" add constraint "users_displayname_key" UNIQUE using index "users_displayname_key";

alter table "public"."points" add constraint "points_points_check" CHECK ((value >= 0)) not valid;

alter table "public"."points" validate constraint "points_points_check";


