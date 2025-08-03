/*
  # Create Presentations Schema

  1. New Tables
    - `presentations`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `title` (text)
      - `description` (text, optional)
      - `content_input` (jsonb) - Original content input
      - `content_analysis` (jsonb) - AI analysis results
      - `visual_suggestions` (jsonb) - Generated visual suggestions
      - `selected_suggestion_id` (text, optional)
      - `selected_theme` (text, optional)
      - `status` (text) - draft, processing, completed, error
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `presentation_pages`
      - `id` (uuid, primary key)
      - `presentation_id` (uuid, references presentations)
      - `page_index` (integer) - Order of the page
      - `title` (text)
      - `content` (text) - HTML content
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `ai_analysis_cache`
      - `id` (uuid, primary key)
      - `content_hash` (text, unique) - Hash of input content
      - `analysis_result` (jsonb) - Cached AI analysis
      - `created_at` (timestamp)
      - `expires_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Users can only access their own presentations
    - AI analysis cache is shared but read-only for users
    
  3. Indexes
    - Performance indexes for common queries
    - Full-text search on presentation content
*/

-- Create presentations table
CREATE TABLE IF NOT EXISTS presentations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL DEFAULT 'Untitled Presentation',
  description text,
  content_input jsonb,
  content_analysis jsonb,
  visual_suggestions jsonb DEFAULT '[]'::jsonb,
  selected_suggestion_id text,
  selected_theme text,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'processing', 'completed', 'error')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create presentation_pages table
CREATE TABLE IF NOT EXISTS presentation_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  presentation_id uuid REFERENCES presentations(id) ON DELETE CASCADE NOT NULL,
  page_index integer NOT NULL DEFAULT 0,
  title text NOT NULL DEFAULT 'Untitled Slide',
  content text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(presentation_id, page_index)
);

-- Create AI analysis cache table
CREATE TABLE IF NOT EXISTS ai_analysis_cache (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_hash text UNIQUE NOT NULL,
  analysis_result jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz DEFAULT (now() + interval '7 days')
);

-- Enable Row Level Security
ALTER TABLE presentations ENABLE ROW LEVEL SECURITY;
ALTER TABLE presentation_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_analysis_cache ENABLE ROW LEVEL SECURITY;

-- Presentations policies
CREATE POLICY "Users can view own presentations"
  ON presentations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own presentations"
  ON presentations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own presentations"
  ON presentations
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own presentations"
  ON presentations
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Presentation pages policies
CREATE POLICY "Users can view own presentation pages"
  ON presentation_pages
  FOR SELECT
  TO authenticated
  USING (
    presentation_id IN (
      SELECT id FROM presentations WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create pages for own presentations"
  ON presentation_pages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    presentation_id IN (
      SELECT id FROM presentations WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update pages for own presentations"
  ON presentation_pages
  FOR UPDATE
  TO authenticated
  USING (
    presentation_id IN (
      SELECT id FROM presentations WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    presentation_id IN (
      SELECT id FROM presentations WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete pages for own presentations"
  ON presentation_pages
  FOR DELETE
  TO authenticated
  USING (
    presentation_id IN (
      SELECT id FROM presentations WHERE user_id = auth.uid()
    )
  );

-- AI analysis cache policies (read-only for authenticated users)
CREATE POLICY "Authenticated users can read AI analysis cache"
  ON ai_analysis_cache
  FOR SELECT
  TO authenticated
  USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_presentations_user_id ON presentations(user_id);
CREATE INDEX IF NOT EXISTS idx_presentations_status ON presentations(status);
CREATE INDEX IF NOT EXISTS idx_presentations_created_at ON presentations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_presentation_pages_presentation_id ON presentation_pages(presentation_id);
CREATE INDEX IF NOT EXISTS idx_presentation_pages_order ON presentation_pages(presentation_id, page_index);
CREATE INDEX IF NOT EXISTS idx_ai_analysis_cache_hash ON ai_analysis_cache(content_hash);
CREATE INDEX IF NOT EXISTS idx_ai_analysis_cache_expires ON ai_analysis_cache(expires_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_presentations_updated_at
  BEFORE UPDATE ON presentations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_presentation_pages_updated_at
  BEFORE UPDATE ON presentation_pages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create full-text search index for presentations
CREATE INDEX IF NOT EXISTS idx_presentations_search 
  ON presentations 
  USING gin(to_tsvector('english', title || ' ' || COALESCE(description, '')));
