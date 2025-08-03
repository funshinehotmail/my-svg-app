/*
  # Create Admin Content Management Schema

  1. New Tables
    - `admin_users`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `role` (text) - admin, super_admin
      - `permissions` (jsonb) - specific permissions
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `narrative_flows`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `category` (text) - business, education, marketing, etc.
      - `page_order` (jsonb) - array of page IDs in order
      - `metadata` (jsonb) - additional flow data
      - `is_active` (boolean)
      - `created_by` (uuid, references admin_users)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `page_layouts`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `layout_type` (text) - title_content, two_column, three_column, etc.
      - `layout_config` (jsonb) - column definitions, sizing, etc.
      - `preview_image` (text) - URL to preview image
      - `is_active` (boolean)
      - `created_by` (uuid, references admin_users)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `visual_metaphors`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `metaphor_type` (text) - bridge, signpost, tree, pyramid, etc.
      - `svg_content` (text) - SVG markup
      - `svg_url` (text) - URL to SVG file
      - `tags` (text[]) - searchable tags
      - `ai_description` (text) - detailed description for AI matching
      - `usage_context` (text) - when to use this metaphor
      - `color_variants` (jsonb) - different color schemes
      - `is_active` (boolean)
      - `created_by` (uuid, references admin_users)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `smart_icons`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `category` (text) - business, tech, people, objects, etc.
      - `svg_content` (text) - SVG markup
      - `svg_url` (text) - URL to SVG file
      - `tags` (text[]) - searchable tags
      - `ai_description` (text) - detailed description for AI matching
      - `keywords` (text[]) - keywords for search
      - `size_variants` (jsonb) - different sizes available
      - `style_variants` (jsonb) - outline, filled, etc.
      - `is_active` (boolean)
      - `created_by` (uuid, references admin_users)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `page_compositions`
      - `id` (uuid, primary key)
      - `narrative_flow_id` (uuid, references narrative_flows)
      - `page_layout_id` (uuid, references page_layouts)
      - `visual_metaphor_id` (uuid, references visual_metaphors, optional)
      - `page_index` (integer) - order in flow
      - `title` (text)
      - `content_blocks` (jsonb) - rich text content blocks
      - `icon_placements` (jsonb) - smart icon positions and configs
      - `styling` (jsonb) - colors, fonts, spacing
      - `is_active` (boolean)
      - `created_by` (uuid, references admin_users)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `svg_imports`
      - `id` (uuid, primary key)
      - `source` (text) - svgrepo, custom, etc.
      - `source_id` (text) - external ID from source
      - `source_url` (text) - original URL
      - `name` (text)
      - `description` (text)
      - `svg_content` (text)
      - `tags` (text[])
      - `license` (text)
      - `imported_by` (uuid, references admin_users)
      - `imported_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Admin users can manage all content
    - Regular users can only view active content
    - Super admins have full access
    
  3. Indexes
    - Performance indexes for searches and lookups
    - Full-text search on descriptions and tags
    - Category and type filtering
*/

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  role text NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  permissions jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create narrative_flows table
CREATE TABLE IF NOT EXISTS narrative_flows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  category text NOT NULL DEFAULT 'general',
  page_order jsonb DEFAULT '[]'::jsonb,
  metadata jsonb DEFAULT '{}'::jsonb,
  is_active boolean DEFAULT true,
  created_by uuid REFERENCES admin_users(id) NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create page_layouts table
CREATE TABLE IF NOT EXISTS page_layouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  layout_type text NOT NULL DEFAULT 'title_content',
  layout_config jsonb DEFAULT '{}'::jsonb,
  preview_image text,
  is_active boolean DEFAULT true,
  created_by uuid REFERENCES admin_users(id) NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create visual_metaphors table
CREATE TABLE IF NOT EXISTS visual_metaphors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  metaphor_type text NOT NULL,
  svg_content text,
  svg_url text,
  tags text[] DEFAULT '{}',
  ai_description text NOT NULL,
  usage_context text,
  color_variants jsonb DEFAULT '[]'::jsonb,
  is_active boolean DEFAULT true,
  created_by uuid REFERENCES admin_users(id) NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create smart_icons table
CREATE TABLE IF NOT EXISTS smart_icons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  category text NOT NULL DEFAULT 'general',
  svg_content text,
  svg_url text,
  tags text[] DEFAULT '{}',
  ai_description text NOT NULL,
  keywords text[] DEFAULT '{}',
  size_variants jsonb DEFAULT '[]'::jsonb,
  style_variants jsonb DEFAULT '[]'::jsonb,
  is_active boolean DEFAULT true,
  created_by uuid REFERENCES admin_users(id) NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create page_compositions table
CREATE TABLE IF NOT EXISTS page_compositions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  narrative_flow_id uuid REFERENCES narrative_flows(id) ON DELETE CASCADE NOT NULL,
  page_layout_id uuid REFERENCES page_layouts(id) NOT NULL,
  visual_metaphor_id uuid REFERENCES visual_metaphors(id),
  page_index integer NOT NULL DEFAULT 0,
  title text NOT NULL DEFAULT 'Untitled Page',
  content_blocks jsonb DEFAULT '[]'::jsonb,
  icon_placements jsonb DEFAULT '[]'::jsonb,
  styling jsonb DEFAULT '{}'::jsonb,
  is_active boolean DEFAULT true,
  created_by uuid REFERENCES admin_users(id) NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(narrative_flow_id, page_index)
);

-- Create svg_imports table
CREATE TABLE IF NOT EXISTS svg_imports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source text NOT NULL DEFAULT 'svgrepo',
  source_id text,
  source_url text,
  name text NOT NULL,
  description text,
  svg_content text NOT NULL,
  tags text[] DEFAULT '{}',
  license text,
  imported_by uuid REFERENCES admin_users(id) NOT NULL,
  imported_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE narrative_flows ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_layouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE visual_metaphors ENABLE ROW LEVEL SECURITY;
ALTER TABLE smart_icons ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_compositions ENABLE ROW LEVEL SECURITY;
ALTER TABLE svg_imports ENABLE ROW LEVEL SECURITY;

-- Admin users policies
CREATE POLICY "Super admins can manage admin users"
  ON admin_users
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au 
      WHERE au.user_id = auth.uid() AND au.role = 'super_admin'
    )
  );

CREATE POLICY "Admin users can view themselves"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Narrative flows policies
CREATE POLICY "Admins can manage narrative flows"
  ON narrative_flows
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au 
      WHERE au.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view active narrative flows"
  ON narrative_flows
  FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Page layouts policies
CREATE POLICY "Admins can manage page layouts"
  ON page_layouts
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au 
      WHERE au.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view active page layouts"
  ON page_layouts
  FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Visual metaphors policies
CREATE POLICY "Admins can manage visual metaphors"
  ON visual_metaphors
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au 
      WHERE au.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view active visual metaphors"
  ON visual_metaphors
  FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Smart icons policies
CREATE POLICY "Admins can manage smart icons"
  ON smart_icons
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au 
      WHERE au.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view active smart icons"
  ON smart_icons
  FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Page compositions policies
CREATE POLICY "Admins can manage page compositions"
  ON page_compositions
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au 
      WHERE au.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view active page compositions"
  ON page_compositions
  FOR SELECT
  TO authenticated
  USING (is_active = true);

-- SVG imports policies
CREATE POLICY "Admins can manage SVG imports"
  ON svg_imports
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au 
      WHERE au.user_id = auth.uid()
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_admin_users_user_id ON admin_users(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON admin_users(role);

CREATE INDEX IF NOT EXISTS idx_narrative_flows_category ON narrative_flows(category);
CREATE INDEX IF NOT EXISTS idx_narrative_flows_active ON narrative_flows(is_active);
CREATE INDEX IF NOT EXISTS idx_narrative_flows_created_by ON narrative_flows(created_by);

CREATE INDEX IF NOT EXISTS idx_page_layouts_type ON page_layouts(layout_type);
CREATE INDEX IF NOT EXISTS idx_page_layouts_active ON page_layouts(is_active);

CREATE INDEX IF NOT EXISTS idx_visual_metaphors_type ON visual_metaphors(metaphor_type);
CREATE INDEX IF NOT EXISTS idx_visual_metaphors_active ON visual_metaphors(is_active);
CREATE INDEX IF NOT EXISTS idx_visual_metaphors_tags ON visual_metaphors USING gin(tags);

CREATE INDEX IF NOT EXISTS idx_smart_icons_category ON smart_icons(category);
CREATE INDEX IF NOT EXISTS idx_smart_icons_active ON smart_icons(is_active);
CREATE INDEX IF NOT EXISTS idx_smart_icons_tags ON smart_icons USING gin(tags);
CREATE INDEX IF NOT EXISTS idx_smart_icons_keywords ON smart_icons USING gin(keywords);

CREATE INDEX IF NOT EXISTS idx_page_compositions_flow ON page_compositions(narrative_flow_id);
CREATE INDEX IF NOT EXISTS idx_page_compositions_layout ON page_compositions(page_layout_id);
CREATE INDEX IF NOT EXISTS idx_page_compositions_metaphor ON page_compositions(visual_metaphor_id);
CREATE INDEX IF NOT EXISTS idx_page_compositions_order ON page_compositions(narrative_flow_id, page_index);

CREATE INDEX IF NOT EXISTS idx_svg_imports_source ON svg_imports(source);
CREATE INDEX IF NOT EXISTS idx_svg_imports_tags ON svg_imports USING gin(tags);

-- Create full-text search indexes
CREATE INDEX IF NOT EXISTS idx_narrative_flows_search 
  ON narrative_flows 
  USING gin(to_tsvector('english', name || ' ' || description));

CREATE INDEX IF NOT EXISTS idx_visual_metaphors_search 
  ON visual_metaphors 
  USING gin(to_tsvector('english', name || ' ' || description || ' ' || ai_description));

CREATE INDEX IF NOT EXISTS idx_smart_icons_search 
  ON smart_icons 
  USING gin(to_tsvector('english', name || ' ' || description || ' ' || ai_description));

-- Add updated_at triggers
CREATE TRIGGER update_admin_users_updated_at
  BEFORE UPDATE ON admin_users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_narrative_flows_updated_at
  BEFORE UPDATE ON narrative_flows
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_page_layouts_updated_at
  BEFORE UPDATE ON page_layouts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_visual_metaphors_updated_at
  BEFORE UPDATE ON visual_metaphors
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_smart_icons_updated_at
  BEFORE UPDATE ON smart_icons
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_page_compositions_updated_at
  BEFORE UPDATE ON page_compositions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default page layouts
INSERT INTO page_layouts (name, description, layout_type, layout_config, created_by) 
SELECT 
  'Title and Content',
  'Simple layout with title and rich text content',
  'title_content',
  '{"columns": [{"type": "title", "width": "100%"}, {"type": "content", "width": "100%"}]}'::jsonb,
  au.id
FROM admin_users au 
WHERE au.role = 'super_admin' 
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO page_layouts (name, description, layout_type, layout_config, created_by) 
SELECT 
  'Two Column',
  'Two equal columns for balanced content',
  'two_column',
  '{"columns": [{"type": "content", "width": "50%"}, {"type": "content", "width": "50%"}]}'::jsonb,
  au.id
FROM admin_users au 
WHERE au.role = 'super_admin' 
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO page_layouts (name, description, layout_type, layout_config, created_by) 
SELECT 
  'Three Column',
  'Three equal columns for detailed breakdowns',
  'three_column',
  '{"columns": [{"type": "content", "width": "33%"}, {"type": "content", "width": "33%"}, {"type": "content", "width": "33%"}]}'::jsonb,
  au.id
FROM admin_users au 
WHERE au.role = 'super_admin' 
LIMIT 1
ON CONFLICT DO NOTHING;
