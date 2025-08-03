# Database Schema Extensions for AI Integration

## AI-Enhanced Table Structures

### Enhanced `smart_icons` Table
```sql
-- Add AI-generated metadata columns
ALTER TABLE smart_icons ADD COLUMN IF NOT EXISTS ai_tags text[] DEFAULT '{}';
ALTER TABLE smart_icons ADD COLUMN IF NOT EXISTS ai_description text;
ALTER TABLE smart_icons ADD COLUMN IF NOT EXISTS visual_features jsonb;
ALTER TABLE smart_icons ADD COLUMN IF NOT EXISTS similarity_hash text;
ALTER TABLE smart_icons ADD COLUMN IF NOT EXISTS ai_confidence_score float;
```

### Enhanced `page_layouts` Table
```sql
-- Add AI effectiveness scoring
ALTER TABLE page_layouts ADD COLUMN IF NOT EXISTS effectiveness_score float;
ALTER TABLE page_layouts ADD COLUMN IF NOT EXISTS usage_analytics jsonb;
ALTER TABLE page_layouts ADD COLUMN IF NOT EXISTS ai_recommendations jsonb;
ALTER TABLE page_layouts ADD COLUMN IF NOT EXISTS content_suitability text[];
```

### Enhanced `presentations` Table
```sql
-- Add AI analysis results
ALTER TABLE presentations ADD COLUMN IF NOT EXISTS ai_quality_score float;
ALTER TABLE presentations ADD COLUMN IF NOT EXISTS content_analysis jsonb;
ALTER TABLE presentations ADD COLUMN IF NOT EXISTS suggested_improvements jsonb;
ALTER TABLE presentations ADD COLUMN IF NOT EXISTS visual_coherence_score float;
```

### New AI Processing Tables
```sql
-- AI processing queue
CREATE TABLE ai_processing_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type text NOT NULL,
  entity_id uuid NOT NULL,
  processing_type text NOT NULL,
  status text CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  priority integer DEFAULT 5,
  created_at timestamptz DEFAULT now(),
  started_at timestamptz,
  completed_at timestamptz,
  error_message text,
  result_data jsonb
);

-- AI model performance tracking
CREATE TABLE ai_model_performance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  model_name text NOT NULL,
  model_version text NOT NULL,
  processing_type text NOT NULL,
  accuracy_score float,
  processing_time_ms integer,
  feedback_score float,
  created_at timestamptz DEFAULT now()
);

-- User AI interaction feedback
CREATE TABLE ai_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  entity_type text NOT NULL,
  entity_id uuid NOT NULL,
  ai_suggestion_id text,
  feedback_type text CHECK (feedback_type IN ('helpful', 'not_helpful', 'incorrect')),
  feedback_details text,
  created_at timestamptz DEFAULT now()
);
```

## AI Integration Indexes
```sql
-- Performance indexes for AI queries
CREATE INDEX IF NOT EXISTS idx_smart_icons_ai_tags ON smart_icons USING GIN (ai_tags);
CREATE INDEX IF NOT EXISTS idx_smart_icons_visual_features ON smart_icons USING GIN (visual_features);
CREATE INDEX IF NOT EXISTS idx_presentations_ai_quality ON presentations (ai_quality_score);
CREATE INDEX IF NOT EXISTS idx_ai_processing_queue_status ON ai_processing_queue (status, priority);
```

## Row Level Security for AI Data
```sql
-- AI processing queue access
CREATE POLICY "Admin users can manage AI queue"
  ON ai_processing_queue
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE user_id = auth.uid() 
      AND status = 'active'
    )
  );

-- AI feedback access
CREATE POLICY "Users can manage own AI feedback"
  ON ai_feedback
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());
```
