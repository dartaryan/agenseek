-- Migration: Create bug_reports table for user bug reporting
-- Story: 11.2 - Footer Redesign & Credits
-- Date: 2025-11-09

-- Create bug_reports table
CREATE TABLE IF NOT EXISTS bug_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  title TEXT NOT NULL CHECK (char_length(title) >= 10),
  description TEXT NOT NULL CHECK (char_length(description) >= 20 AND char_length(description) <= 500),
  location TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'resolved', 'closed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,
  admin_notes TEXT,
  CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Add comment for documentation
COMMENT ON TABLE bug_reports IS 'Stores user-reported bugs and issues with status tracking';
COMMENT ON COLUMN bug_reports.user_id IS 'User who reported the bug (nullable for anonymous reports)';
COMMENT ON COLUMN bug_reports.email IS 'Contact email for bug reporter';
COMMENT ON COLUMN bug_reports.title IS 'Short title describing the bug (min 10 chars)';
COMMENT ON COLUMN bug_reports.description IS 'Detailed description of the bug (20-500 chars)';
COMMENT ON COLUMN bug_reports.location IS 'Page or location where bug occurred (optional)';
COMMENT ON COLUMN bug_reports.status IS 'Bug report status: new, in_progress, resolved, closed';
COMMENT ON COLUMN bug_reports.admin_notes IS 'Internal admin notes about the bug (not visible to users)';

-- Enable RLS
ALTER TABLE bug_reports ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone (authenticated or not) can submit bug reports
CREATE POLICY "Anyone can submit bug report"
ON bug_reports
FOR INSERT
TO public
WITH CHECK (true);

-- Policy: Users can view their own bug reports
CREATE POLICY "Users can view their own bug reports"
ON bug_reports
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Policy: Admins can view all bug reports
CREATE POLICY "Admins can view all bug reports"
ON bug_reports
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Policy: Admins can update bug reports (status, admin notes, resolved_at)
CREATE POLICY "Admins can update bug reports"
ON bug_reports
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Policy: Admins can delete bug reports (for spam/duplicates)
CREATE POLICY "Admins can delete bug reports"
ON bug_reports
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Indexes for performance
CREATE INDEX idx_bug_reports_status ON bug_reports(status);
CREATE INDEX idx_bug_reports_created_at ON bug_reports(created_at DESC);
CREATE INDEX idx_bug_reports_user_id ON bug_reports(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX idx_bug_reports_email ON bug_reports(email);

-- Function to automatically set resolved_at when status changes to resolved
CREATE OR REPLACE FUNCTION set_bug_report_resolved_at()
RETURNS TRIGGER AS $$
BEGIN
  -- If status is being changed to 'resolved' and resolved_at is null, set it
  IF NEW.status = 'resolved' AND OLD.status != 'resolved' AND NEW.resolved_at IS NULL THEN
    NEW.resolved_at = NOW();
  END IF;

  -- If status is changed away from resolved, clear resolved_at
  IF NEW.status != 'resolved' AND OLD.status = 'resolved' THEN
    NEW.resolved_at = NULL;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the function
CREATE TRIGGER trigger_bug_report_resolved_at
BEFORE UPDATE ON bug_reports
FOR EACH ROW
EXECUTE FUNCTION set_bug_report_resolved_at();

-- Add to admin action log when bug reports are created/updated
CREATE OR REPLACE FUNCTION log_bug_report_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    -- Log new bug report submission
    INSERT INTO admin_action_log (
      admin_id,
      action,
      target_type,
      target_id,
      metadata
    ) VALUES (
      NEW.user_id, -- Can be null for anonymous reports
      'bug_report_submitted',
      'bug_report',
      NEW.id,
      jsonb_build_object(
        'title', NEW.title,
        'email', NEW.email,
        'location', NEW.location
      )
    );
  ELSIF (TG_OP = 'UPDATE' AND OLD.status != NEW.status) THEN
    -- Log status changes (typically by admin)
    INSERT INTO admin_action_log (
      admin_id,
      action,
      target_type,
      target_id,
      metadata
    ) VALUES (
      auth.uid(), -- Admin making the change
      'bug_report_status_changed',
      'bug_report',
      NEW.id,
      jsonb_build_object(
        'old_status', OLD.status,
        'new_status', NEW.status,
        'title', NEW.title,
        'reporter_email', NEW.email
      )
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for audit logging
CREATE TRIGGER trigger_log_bug_report_changes
AFTER INSERT OR UPDATE ON bug_reports
FOR EACH ROW
EXECUTE FUNCTION log_bug_report_changes();

