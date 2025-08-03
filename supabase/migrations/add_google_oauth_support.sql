/*
  # Add Google OAuth Support

  1. Updates
    - Update admin_users table to handle OAuth users
    - Add profile information fields for Google users
    - Create function to auto-create admin users from OAuth

  2. Security
    - Maintain existing RLS policies
    - Add policy for OAuth user creation
    - Ensure admin role assignment works with OAuth users

  3. Functions
    - Auto-create admin user on first OAuth login
    - Sync profile data from Google
*/

-- Add profile fields to admin_users table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'admin_users' AND column_name = 'full_name'
  ) THEN
    ALTER TABLE admin_users ADD COLUMN full_name text;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'admin_users' AND column_name = 'avatar_url'
  ) THEN
    ALTER TABLE admin_users ADD COLUMN avatar_url text;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'admin_users' AND column_name = 'email'
  ) THEN
    ALTER TABLE admin_users ADD COLUMN email text;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'admin_users' AND column_name = 'provider'
  ) THEN
    ALTER TABLE admin_users ADD COLUMN provider text DEFAULT 'email';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'admin_users' AND column_name = 'is_auto_created'
  ) THEN
    ALTER TABLE admin_users ADD COLUMN is_auto_created boolean DEFAULT false;
  END IF;
END $$;

-- Create function to handle OAuth user creation
CREATE OR REPLACE FUNCTION handle_oauth_admin_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if this is a Google OAuth user
  IF NEW.raw_app_meta_data->>'provider' = 'google' THEN
    -- Auto-create admin user for Google OAuth users
    INSERT INTO public.admin_users (
      user_id,
      email,
      full_name,
      avatar_url,
      provider,
      role,
      is_auto_created,
      permissions
    ) VALUES (
      NEW.id,
      NEW.email,
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'avatar_url',
      'google',
      'admin',
      true,
      '[]'::jsonb
    )
    ON CONFLICT (user_id) DO UPDATE SET
      email = EXCLUDED.email,
      full_name = EXCLUDED.full_name,
      avatar_url = EXCLUDED.avatar_url,
      updated_at = now();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for OAuth user handling
DROP TRIGGER IF EXISTS on_auth_user_created_oauth ON auth.users;
CREATE TRIGGER on_auth_user_created_oauth
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_oauth_admin_user();

-- Update RLS policies to handle OAuth users
CREATE POLICY "OAuth users can create admin profile"
  ON admin_users
  FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid() AND 
    is_auto_created = true AND
    provider = 'google'
  );

-- Create index for OAuth lookups
CREATE INDEX IF NOT EXISTS idx_admin_users_provider ON admin_users(provider);
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
