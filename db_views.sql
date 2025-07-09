-- Overall Leader per Jersey
create or replace view public.v_jersey_overall_leaders as
select
  j.id as jersey_id,
  j.name as jersey_name,
  j.emoji as jersey_emoji,
  u.id as user_id,
  u.displayname,
  sum(p.value) as total_points
from jerseys j
join point_jerseys pj on pj.jersey_id = j.id
join points p on p.id = pj.point_id
join users u on u.id = p.user_id
group by j.id, j.name, j.emoji, u.id, u.displayname
having sum(p.value) = (
  select max(total)
  from (
    select sum(p2.value) as total
    from point_jerseys pj2
    join points p2 on p2.id = pj2.point_id
    where pj2.jersey_id = j.id
    group by p2.user_id
  ) as sub
);

-- Full Leaderboard Per Jersey (with stage)
create or replace view public.v_jersey_leaderboards as
select
  j.id as jersey_id,
  j.name as jersey_name,
  s.id as stage_id,
  s.name as stage_name,
  u.id as user_id,
  u.displayname,
  sum(p.value) as total_points
from point_jerseys pj
join jerseys j on j.id = pj.jersey_id
join points p on p.id = pj.point_id
join users u on u.id = p.user_id
left join stages s on s.id = p.stage_id
group by j.id, j.name, s.id, s.name, u.id, u.displayname
order by j.name, total_points desc;

--  Latest Activities (Logged Points)
create or replace view public.v_latest_activities as
select
  p.id as point_id,
  u.id as user_id,
  u.displayname,
  u.is_admin,
  p.value,
  p.note,
  p.created_at,
  s.name as stage_name,
  array_agg(distinct j.name) as jerseys
from points p
join users u on u.id = p.submitted_by
left join stages s on s.id = p.stage_id
left join point_jerseys pj on pj.point_id = p.id
left join jerseys j on j.id = pj.jersey_id
group by p.id, u.id, p.value, p.note, p.created_at, s.name
order by p.created_at desc;


-- User Progression Over Time (for charts)
create or replace view public.v_user_progression as
with base as (
  select
    u.id as user_id,
    u.displayname,
    j.id as jersey_id,
    j.name as jersey_name,
    s.id as stage_id,
    s.name as stage_name,
    s.date as stage_date,
    sum(p.value) as points_in_stage
  from point_jerseys pj
  join points p on p.id = pj.point_id
  join users u on u.id = p.user_id
  join jerseys j on j.id = pj.jersey_id
  left join stages s on s.id = p.stage_id
  group by u.id, u.displayname, j.id, j.name, s.id, s.name, s.date
),
progression as (
  select
    *,
    sum(points_in_stage) over (
      partition by user_id, jersey_id
      order by stage_date
      rows between unbounded preceding and current row
    ) as cumulative_points
  from base
)
select * from progression order by user_id, jersey_id, stage_date;

-- Enable RLS + Add Select Policies
grant select on public.v_jersey_overall_leaders to authenticated;
grant select on public.v_jersey_leaderboards to authenticated;
grant select on public.v_latest_activities to authenticated;
grant select on public.v_user_progression to authenticated;
