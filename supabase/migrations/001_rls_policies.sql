-- Enable RLS on all tables
-- Run this after prisma db push

-- Organizations
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their organization" ON organizations
  FOR SELECT USING (
    id IN (SELECT organization_id FROM users WHERE supabase_id = auth.uid()::text)
  );

-- Users
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view members of their org" ON users
  FOR SELECT USING (
    organization_id IN (SELECT organization_id FROM users WHERE supabase_id = auth.uid()::text)
  );
CREATE POLICY "Users can update their own record" ON users
  FOR UPDATE USING (supabase_id = auth.uid()::text);

-- Contacts
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Org members can view contacts" ON contacts
  FOR ALL USING (
    organization_id IN (SELECT organization_id FROM users WHERE supabase_id = auth.uid()::text)
  );

-- Accounts
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Org members can view accounts" ON accounts
  FOR ALL USING (
    organization_id IN (SELECT organization_id FROM users WHERE supabase_id = auth.uid()::text)
  );

-- Deals
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Org members can view deals" ON deals
  FOR ALL USING (
    organization_id IN (SELECT organization_id FROM users WHERE supabase_id = auth.uid()::text)
  );

-- Activities
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Org members can view activities" ON activities
  FOR ALL USING (
    organization_id IN (SELECT organization_id FROM users WHERE supabase_id = auth.uid()::text)
  );

-- Pipelines
ALTER TABLE pipelines ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Org members can view pipelines" ON pipelines
  FOR ALL USING (
    organization_id IN (SELECT organization_id FROM users WHERE supabase_id = auth.uid()::text)
  );

-- Pipeline stages
ALTER TABLE pipeline_stages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Org members can view stages" ON pipeline_stages
  FOR ALL USING (
    pipeline_id IN (
      SELECT id FROM pipelines WHERE organization_id IN (
        SELECT organization_id FROM users WHERE supabase_id = auth.uid()::text
      )
    )
  );

-- Tags
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Org members can manage tags" ON tags
  FOR ALL USING (
    organization_id IN (SELECT organization_id FROM users WHERE supabase_id = auth.uid()::text)
  );

-- Seed default pipeline for new organizations
CREATE OR REPLACE FUNCTION create_default_pipeline(org_id TEXT)
RETURNS void AS $$
DECLARE
  pipeline_id TEXT;
BEGIN
  INSERT INTO pipelines (id, name, organization_id)
  VALUES (gen_random_uuid()::text, 'Sales Pipeline', org_id)
  RETURNING id INTO pipeline_id;

  INSERT INTO pipeline_stages (id, name, "order", color, probability, pipeline_id) VALUES
    (gen_random_uuid()::text, 'Lead',         1, '#94a3b8', 10,  pipeline_id),
    (gen_random_uuid()::text, 'Qualified',    2, '#60a5fa', 25,  pipeline_id),
    (gen_random_uuid()::text, 'Proposal',     3, '#a78bfa', 50,  pipeline_id),
    (gen_random_uuid()::text, 'Negotiation',  4, '#fb923c', 75,  pipeline_id),
    (gen_random_uuid()::text, 'Closed Won',   5, '#34d399', 100, pipeline_id),
    (gen_random_uuid()::text, 'Closed Lost',  6, '#f87171', 0,   pipeline_id);
END;
$$ LANGUAGE plpgsql;
