
-- === Enable UUID Generation ===
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- === Users ===
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  firstname VARCHAR,
  lastname VARCHAR,
  emoji VARCHAR,
  displayname VARCHAR,
  is_admin BOOLEAN DEFAULT FALSE,
  role VARCHAR DEFAULT 'user',
  avatar_url VARCHAR,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- === Posts ===
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  images TEXT[],
  content TEXT,
  pinned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- === Comments ===
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- === Likes ===
CREATE TABLE likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (user_id, post_id)
);

-- === Shares ===
CREATE TABLE shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (user_id, post_id) -- prevent duplicate shares per user
);

-- === Chat Messages ===
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- === Stages ===
CREATE TABLE stages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR,
  date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- === Events ===
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stage_id UUID REFERENCES stages(id) ON DELETE CASCADE,
  title VARCHAR,
  description TEXT,
  emoji VARCHAR,
  location VARCHAR,
  time TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- === Jerseys ===
CREATE TABLE jerseys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR UNIQUE,
  description TEXT,
  color VARCHAR,
  emoji VARCHAR,
  is_overall BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- === Points ===
CREATE TABLE points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category VARCHAR,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  submitted_by UUID REFERENCES users(id),
  stage_id UUID REFERENCES stages(id),
  value INTEGER,
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- === Point to Jersey Mapping ===
CREATE TABLE point_jerseys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  point_id UUID REFERENCES points(id) ON DELETE CASCADE,
  jersey_id UUID REFERENCES jerseys(id) ON DELETE CASCADE,
  UNIQUE (point_id, jersey_id)
);

-- === User Jerseys (Current Holders) ===
CREATE TABLE user_jerseys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  jersey_id UUID REFERENCES jerseys(id) ON DELETE CASCADE,
  awarded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (jersey_id)
);

-- === Jersey Transfer History ===
CREATE TABLE user_jerseys_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  jersey_id UUID REFERENCES jerseys(id) ON DELETE CASCADE,
  awarded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reason TEXT
);

-- === Stage Podiums ===
CREATE TABLE stage_podiums (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stage_id UUID REFERENCES stages(id) ON DELETE CASCADE,
  jersey_id UUID REFERENCES jerseys(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  rank INTEGER NOT NULL,
  UNIQUE (stage_id, jersey_id, rank)
);

-- === Teams ===
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR UNIQUE NOT NULL,
  color VARCHAR,
  emoji VARCHAR,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- === User Teams ===
CREATE TABLE user_teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (user_id, team_id)
);

-- === Push Subscriptions ===
CREATE TABLE push_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  endpoint TEXT,
  keys JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- === ROW LEVEL SECURITY POLICIES ===

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE points ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view all profiles" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON users FOR INSERT WITH CHECK (auth.uid() = id);

-- Posts policies  
CREATE POLICY "Anyone can view posts" ON posts FOR SELECT USING (true);
CREATE POLICY "Users can create posts" ON posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own posts" ON posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own posts" ON posts FOR DELETE USING (auth.uid() = user_id);

-- Comments policies
CREATE POLICY "Anyone can view comments" ON comments FOR SELECT USING (true);
CREATE POLICY "Users can create comments" ON comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own comments" ON comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own comments" ON comments FOR DELETE USING (auth.uid() = user_id);

-- Likes policies
CREATE POLICY "Anyone can view likes" ON likes FOR SELECT USING (true);
CREATE POLICY "Users can create likes" ON likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own likes" ON likes FOR DELETE USING (auth.uid() = user_id);

-- === Shares Policies ===
CREATE POLICY "Anyone can view shares" ON shares FOR SELECT USING (true);
CREATE POLICY "Users can share posts" ON shares FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can remove their own share" ON shares FOR DELETE USING (auth.uid() = user_id);

-- Chat messages policies
CREATE POLICY "Anyone can view chat messages" ON chat_messages FOR SELECT USING (true);
CREATE POLICY "Users can create chat messages" ON chat_messages FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Points policies (admin can manage, users can view)
CREATE POLICY "Anyone can view points" ON points FOR SELECT USING (true);
CREATE POLICY "Admins can manage points" ON points FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true)
);

-- User teams policies
CREATE POLICY "Anyone can view user teams" ON user_teams FOR SELECT USING (true);
CREATE POLICY "Users can join teams" ON user_teams FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Push subscriptions policies
CREATE POLICY "Users can manage own push subscriptions" ON push_subscriptions FOR ALL USING (auth.uid() = user_id);

-- Public read policies for reference tables
ALTER TABLE stages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view stages" ON stages FOR SELECT USING (true);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view events" ON events FOR SELECT USING (true);

ALTER TABLE jerseys ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view jerseys" ON jerseys FOR SELECT USING (true);

ALTER TABLE point_jerseys ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view point jerseys" ON point_jerseys FOR SELECT USING (true);

ALTER TABLE user_jerseys ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view user jerseys" ON user_jerseys FOR SELECT USING (true);

ALTER TABLE user_jerseys_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view user jerseys history" ON user_jerseys_history FOR SELECT USING (true);

ALTER TABLE stage_podiums ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view stage podiums" ON stage_podiums FOR SELECT USING (true);

ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view teams" ON teams FOR SELECT USING (true);

-- === TRIGGER FUNCTIONS ===

-- Trigger Function for Jersey Updates
CREATE OR REPLACE FUNCTION handle_points_insert()
RETURNS TRIGGER AS $$
DECLARE
  jersey_rec RECORD;
  current_holder UUID;
  top_users RECORD;
  rank_counter INT := 1;
BEGIN
  FOR jersey_rec IN
    SELECT j.id, j.is_overall FROM point_jerseys pj
    JOIN jerseys j ON pj.jersey_id = j.id
    WHERE pj.point_id = NEW.id
  LOOP
    rank_counter := 1;

    FOR top_users IN
      SELECT p.user_id, SUM(p.value) AS total
      FROM points p
      JOIN point_jerseys pj ON pj.point_id = p.id
      WHERE pj.jersey_id = jersey_rec.id
        AND (p.stage_id = NEW.stage_id OR NEW.stage_id IS NULL)
      GROUP BY p.user_id
      ORDER BY total DESC
      LIMIT 3
    LOOP
      INSERT INTO stage_podiums (id, stage_id, jersey_id, user_id, rank)
      VALUES (gen_random_uuid(), NEW.stage_id, jersey_rec.id, top_users.user_id, rank_counter)
      ON CONFLICT (stage_id, jersey_id, rank) DO UPDATE
        SET user_id = EXCLUDED.user_id;

      rank_counter := rank_counter + 1;
    END LOOP;

    SELECT user_id INTO current_holder
    FROM user_jerseys
    WHERE jersey_id = jersey_rec.id;

    SELECT p.user_id INTO top_users
    FROM points p
    JOIN point_jerseys pj ON pj.point_id = p.id
    WHERE pj.jersey_id = jersey_rec.id
      AND (p.stage_id = NEW.stage_id OR NEW.stage_id IS NULL)
    GROUP BY p.user_id
    ORDER BY SUM(p.value) DESC
    LIMIT 1;

    IF current_holder = top_users.user_id THEN
      CONTINUE;
    END IF;

    IF current_holder IS NOT NULL THEN
      INSERT INTO user_jerseys_history (id, user_id, jersey_id, awarded_at, reason)
      VALUES (gen_random_uuid(), current_holder, jersey_rec.id, NOW(), 'Jersey transferred');
    END IF;

    DELETE FROM user_jerseys WHERE jersey_id = jersey_rec.id;

    INSERT INTO user_jerseys (id, user_id, jersey_id, awarded_at)
    VALUES (gen_random_uuid(), top_users.user_id, jersey_rec.id, NOW());
  END LOOP;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger on Points
DROP TRIGGER IF EXISTS after_points_insert ON points;
CREATE TRIGGER after_points_insert
AFTER INSERT ON points
FOR EACH ROW
EXECUTE FUNCTION handle_points_insert();

-- Handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, displayname, firstname, lastname, created_at)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'displayname', NEW.email),
    NEW.raw_user_meta_data->>'firstname',
    NEW.raw_user_meta_data->>'lastname',
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- === INDEXES FOR PERFORMANCE ===
CREATE INDEX IF NOT EXISTS users_displayname_idx ON users(displayname);
CREATE INDEX IF NOT EXISTS users_role_idx ON users(role);
CREATE INDEX IF NOT EXISTS posts_user_id_idx ON posts(user_id);
CREATE INDEX IF NOT EXISTS posts_created_at_idx ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS comments_post_id_idx ON comments(post_id);
CREATE INDEX IF NOT EXISTS likes_post_id_idx ON likes(post_id);
CREATE INDEX IF NOT EXISTS shares_post_id_idx ON shares(post_id);
CREATE INDEX IF NOT EXISTS points_user_id_idx ON points(user_id);
CREATE INDEX IF NOT EXISTS points_stage_id_idx ON points(stage_id);
CREATE INDEX IF NOT EXISTS chat_messages_created_at_idx ON chat_messages(created_at DESC);



-- Add images column to chat_messages table to store image URLs from storage
ALTER TABLE chat_messages ADD COLUMN images TEXT[];

-- Enable realtime for chat_messages if not already enabled
ALTER TABLE chat_messages REPLICA IDENTITY FULL;

-- Add chat_messages to realtime publication if not already added
-- (This might already exist, but it's safe to run)
DROP PUBLICATION IF EXISTS supabase_realtime;
CREATE PUBLICATION supabase_realtime FOR ALL TABLES;



-- Create the chat-images storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('chat-images', 'chat-images', true);

-- Create storage policies for the chat-images bucket
CREATE POLICY "Anyone can view chat images" ON storage.objects
FOR SELECT USING (bucket_id = 'chat-images');

CREATE POLICY "Authenticated users can upload chat images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'chat-images' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can update their own chat images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'chat-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own chat images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'chat-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);



-- === MISSING STORAGE BUCKET ===
-- Create avatars bucket for user profile images (if you plan to use it)
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for avatars bucket
CREATE POLICY "Anyone can view avatars" ON storage.objects
FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Authenticated users can upload avatars" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'avatars' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can update their own avatars" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own avatars" ON storage.objects
FOR DELETE USING (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- === MISSING SAMPLE DATA ===
-- Insert sample jerseys
INSERT INTO jerseys (id, name, description, color, emoji, is_overall) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Yellow Jersey', 'Overall leader', '#FFD700', '🟡', true),
('550e8400-e29b-41d4-a716-446655440002', 'Green Jersey', 'Sprint points leader', '#00FF00', '🟢', false),
('550e8400-e29b-41d4-a716-446655440003', 'Polka Dot Jersey', 'Mountain points leader', '#FF69B4', '🔴', false),
('550e8400-e29b-41d4-a716-446655440004', 'White Jersey', 'Best young rider', '#FFFFFF', '⚪', false)
ON CONFLICT (id) DO NOTHING;

-- Insert sample teams
INSERT INTO teams (id, name, color, emoji) VALUES
('550e8400-e29b-41d4-a716-446655440011', 'Team Alpha', '#FF0000', '🔴'),
('550e8400-e29b-41d4-a716-446655440012', 'Team Beta', '#0000FF', '🔵'),
('550e8400-e29b-41d4-a716-446655440013', 'Team Gamma', '#00FF00', '🟢'),
('550e8400-e29b-41d4-a716-446655440014', 'Team Delta', '#FFFF00', '🟡')
ON CONFLICT (id) DO NOTHING;

-- Insert sample stages
INSERT INTO stages (id, name, date) VALUES
('550e8400-e29b-41d4-a716-446655440021', 'Stage 1: The Prologue', '2024-07-06'),
('550e8400-e29b-41d4-a716-446655440022', 'Stage 2: Flat Sprint', '2024-07-07'),
('550e8400-e29b-41d4-a716-446655440023', 'Stage 3: Mountain Stage', '2024-07-08'),
('550e8400-e29b-41d4-a716-446655440024', 'Stage 4: Time Trial', '2024-07-09')
ON CONFLICT (id) DO NOTHING;

-- Insert sample events
INSERT INTO events (id, stage_id, title, description, emoji, location, time) VALUES
('550e8400-e29b-41d4-a716-446655440031', '550e8400-e29b-41d4-a716-446655440021', 'Opening Ceremony', 'Grand start of the festival', '🎉', 'Main Square', '2024-07-06 09:00:00'),
('550e8400-e29b-41d4-a716-446655440032', '550e8400-e29b-41d4-a716-446655440022', 'Sprint Challenge', 'High-speed sprint section', '💨', 'City Center', '2024-07-07 14:00:00'),
('550e8400-e29b-41d4-a716-446655440033', '550e8400-e29b-41d4-a716-446655440023', 'Mountain Climb', 'Epic mountain ascent', '⛰️', 'Alpine Pass', '2024-07-08 11:00:00'),
('550e8400-e29b-41d4-a716-446655440034', '550e8400-e29b-41d4-a716-446655440024', 'Final Ceremony', 'Awards and celebration', '🏆', 'Victory Podium', '2024-07-09 17:00:00')
ON CONFLICT (id) DO NOTHING;

-- === MISSING ADDITIONAL INDEXES FOR PERFORMANCE ===
CREATE INDEX IF NOT EXISTS user_jerseys_user_id_idx ON user_jerseys(user_id);
CREATE INDEX IF NOT EXISTS user_jerseys_jersey_id_idx ON user_jerseys(jersey_id);
CREATE INDEX IF NOT EXISTS user_teams_user_id_idx ON user_teams(user_id);
CREATE INDEX IF NOT EXISTS user_teams_team_id_idx ON user_teams(team_id);
CREATE INDEX IF NOT EXISTS events_stage_id_idx ON events(stage_id);
CREATE INDEX IF NOT EXISTS events_time_idx ON events(time);
CREATE INDEX IF NOT EXISTS point_jerseys_point_id_idx ON point_jerseys(point_id);
CREATE INDEX IF NOT EXISTS point_jerseys_jersey_id_idx ON point_jerseys(jersey_id);

-- === ENABLE REALTIME FOR OTHER TABLES ===
-- Enable realtime for posts (for social feed updates)
ALTER TABLE posts REPLICA IDENTITY FULL;
ALTER TABLE comments REPLICA IDENTITY FULL;
ALTER TABLE likes REPLICA IDENTITY FULL;

-- === ADD MISSING CONSTRAINTS ===
-- Add constraint to ensure jersey names are not empty
ALTER TABLE jerseys ADD CONSTRAINT jerseys_name_not_empty CHECK (name IS NOT NULL AND trim(name) != '');

-- Add constraint to ensure team names are not empty  
ALTER TABLE teams ADD CONSTRAINT teams_name_not_empty CHECK (name IS NOT NULL AND trim(name) != '');

-- Add constraint to ensure stage names are not empty
ALTER TABLE stages ADD CONSTRAINT stages_name_not_empty CHECK (name IS NOT NULL AND trim(name) != '');

-- Add constraint for rank values in stage_podiums
ALTER TABLE stage_podiums ADD CONSTRAINT stage_podiums_rank_valid CHECK (rank > 0 AND rank <= 10);



