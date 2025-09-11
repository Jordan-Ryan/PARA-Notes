-- Seed data for PARA Notes development
-- This file contains sample data for testing and development

-- Insert sample user (this would typically be handled by Supabase Auth)
INSERT INTO users (id, email, created_at, updated_at)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'demo@paranotes.com',
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- Insert user profile
INSERT INTO profiles (user_id, display_name, settings, created_at, updated_at)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'Demo User',
    '{
        "theme": "system",
        "default_para_category": "projects",
        "auto_save": true,
        "encryption_enabled": false,
        "sync_enabled": true,
        "notifications": {
            "email": true,
            "push": true,
            "review_reminders": true
        },
        "editor": {
            "font_size": 16,
            "font_family": "Inter",
            "line_height": 1.6,
            "auto_save_interval": 30000
        }
    }'::jsonb,
    NOW(),
    NOW()
) ON CONFLICT (user_id) DO NOTHING;

-- Create initial PARA structure
SELECT create_initial_para_root();

-- Get the created folder IDs
WITH para_folders AS (
    SELECT id, para_category, name
    FROM folders
    WHERE user_id = '00000000-0000-0000-0000-000000000001'
    AND parent_id IS NULL
)
-- Insert sample subfolders
INSERT INTO folders (user_id, name, description, parent_id, para_category, sort_index)
SELECT 
    '00000000-0000-0000-0000-000000000001',
    subfolder_name,
    subfolder_description,
    pf.id,
    pf.para_category,
    subfolder_sort
FROM para_folders pf
CROSS JOIN (
    VALUES 
        ('Q1 Website Redesign', 'Complete website overhaul with new design system', 1),
        ('Mobile App Launch', 'Launch mobile app for iOS and Android', 2),
        ('Marketing Campaign', 'Q1 marketing campaign for new features', 3)
) AS projects(subfolder_name, subfolder_description, subfolder_sort)
WHERE pf.para_category = 'projects'

UNION ALL

SELECT 
    '00000000-0000-0000-0000-000000000001',
    subfolder_name,
    subfolder_description,
    pf.id,
    pf.para_category,
    subfolder_sort
FROM para_folders pf
CROSS JOIN (
    VALUES 
        ('Health & Fitness', 'Personal health and fitness maintenance', 1),
        ('Career Development', 'Professional growth and skill development', 2),
        ('Financial Planning', 'Budget, investments, and financial goals', 3)
) AS areas(subfolder_name, subfolder_description, subfolder_sort)
WHERE pf.para_category = 'areas'

UNION ALL

SELECT 
    '00000000-0000-0000-0000-000000000001',
    subfolder_name,
    subfolder_description,
    pf.id,
    pf.para_category,
    subfolder_sort
FROM para_folders pf
CROSS JOIN (
    VALUES 
        ('Design Resources', 'UI/UX design tools and inspiration', 1),
        ('Development Tools', 'Coding tools, libraries, and frameworks', 2),
        ('Learning Materials', 'Courses, tutorials, and documentation', 3)
) AS resources(subfolder_name, subfolder_description, subfolder_sort)
WHERE pf.para_category = 'resources';

-- Insert sample notes
WITH project_folders AS (
    SELECT id, name
    FROM folders
    WHERE user_id = '00000000-0000-0000-0000-000000000001'
    AND para_category = 'projects'
    AND parent_id IS NOT NULL
    LIMIT 1
)
INSERT INTO notes (user_id, folder_id, title, content, tags, created_at, updated_at)
SELECT 
    '00000000-0000-0000-0000-000000000001',
    pf.id,
    note_title,
    note_content,
    note_tags,
    NOW() - INTERVAL '1 day' * random() * 30,
    NOW() - INTERVAL '1 hour' * random() * 24
FROM project_folders pf
CROSS JOIN (
    VALUES 
        ('Project Kickoff Meeting', '## Meeting Notes

**Date:** Today
**Attendees:** Team leads, stakeholders

### Agenda
- Project scope review
- Timeline discussion
- Resource allocation
- Next steps

### Key Decisions
- Launch date: March 31st
- Team size: 5 developers
- Budget approved for additional tools

### Action Items
- [ ] Create project timeline
- [ ] Set up development environment
- [ ] Schedule weekly standups', ARRAY['meeting', 'project', 'planning']),
        
        ('Technical Architecture', '## System Architecture

### Frontend
- Next.js 14 with App Router
- TypeScript for type safety
- Tailwind CSS for styling

### Backend
- Supabase for database and auth
- PostgreSQL with RLS
- Real-time subscriptions

### Deployment
- Vercel for frontend
- Supabase for backend
- GitHub Actions for CI/CD

### Security
- Row Level Security (RLS)
- JWT authentication
- Optional E2EE for sensitive data', ARRAY['architecture', 'technical', 'documentation']),
        
        ('User Research Findings', '## Research Summary

### Methodology
- 15 user interviews
- 2 focus groups
- Online survey (200+ responses)

### Key Insights
1. Users struggle with note organization
2. PARA method is highly valued
3. Mobile access is critical
4. Search functionality is essential

### Recommendations
- Implement smart categorization
- Prioritize mobile experience
- Add advanced search features
- Create onboarding flow', ARRAY['research', 'user-insights', 'product']),
        
        ('Design System Guidelines', '## Design Principles

### Colors
- Primary: #3B82F6 (Blue)
- Secondary: #10B981 (Green)
- Accent: #F59E0B (Amber)

### Typography
- Headings: Inter Bold
- Body: Inter Regular
- Code: JetBrains Mono

### Spacing
- Base unit: 4px
- Scale: 4, 8, 12, 16, 24, 32, 48, 64

### Components
- Consistent button styles
- Standardized form inputs
- Unified card layouts', ARRAY['design', 'system', 'guidelines']),
        
        ('Sprint Planning', '## Sprint 1 Planning

### Goals
- Set up development environment
- Implement basic note creation
- Add folder organization
- Create user authentication

### User Stories
1. As a user, I want to create notes
2. As a user, I want to organize notes in folders
3. As a user, I want to search my notes
4. As a user, I want to sync across devices

### Tasks
- [ ] Set up Supabase project
- [ ] Create database schema
- [ ] Implement auth flow
- [ ] Build note editor
- [ ] Add folder management
- [ ] Implement search
- [ ] Set up real-time sync', ARRAY['sprint', 'planning', 'agile'])
) AS notes(note_title, note_content, note_tags);

-- Insert sample templates
INSERT INTO templates (user_id, template_type, name, content, is_default, created_at, updated_at)
VALUES 
    ('00000000-0000-0000-0000-000000000001', 'meeting', 'Meeting Notes', '# Meeting Notes

**Date:** {{date}}
**Attendees:** {{attendees}}
**Duration:** {{duration}}

## Agenda
- 
- 
- 

## Discussion Points
- 
- 
- 

## Decisions Made
- 
- 
- 

## Action Items
- [ ] 
- [ ] 
- [ ] 

## Next Steps
- 
- 
- ', true, NOW(), NOW()),

    ('00000000-0000-0000-0000-000000000001', 'project', 'Project Plan', '# {{project_name}}

## Overview
{{project_description}}

## Goals
- 
- 
- 

## Timeline
- **Start Date:** {{start_date}}
- **End Date:** {{end_date}}
- **Key Milestones:**
  - 
  - 
  - 

## Resources
- **Team:** {{team_members}}
- **Budget:** {{budget}}
- **Tools:** {{tools}}

## Risks & Mitigation
- **Risk:** 
  - **Mitigation:** 

## Success Metrics
- 
- 
- ', true, NOW(), NOW()),

    ('00000000-0000-0000-0000-000000000001', 'note', 'Daily Journal', '# {{date}} - Daily Journal

## What went well today?
- 
- 
- 

## What could be improved?
- 
- 
- 

## Key learnings
- 
- 
- 

## Tomorrow''s priorities
- [ ] 
- [ ] 
- [ ] 

## Gratitude
- 
- 
- ', true, NOW(), NOW()),

    ('00000000-0000-0000-0000-000000000001', 'review', 'Area Review', '# {{area_name}} - Review

**Review Date:** {{review_date}}
**Frequency:** {{frequency}}

## Current Status
{{current_status}}

## What''s working well?
- 
- 
- 

## What needs attention?
- 
- 
- 

## Standards & Processes
- 
- 
- 

## Goals for next period
- 
- 
- 

## Action Items
- [ ] 
- [ ] 
- [ ] ', true, NOW(), NOW());

-- Insert sample guidance events
INSERT INTO guidance_events (user_id, note_id, suggested_category, accepted, rule_id, created_at)
SELECT 
    '00000000-0000-0000-0000-000000000001',
    n.id,
    'projects',
    true,
    'project_keywords',
    n.created_at + INTERVAL '5 minutes'
FROM notes n
WHERE n.title ILIKE '%project%' OR n.title ILIKE '%meeting%'
LIMIT 3;

-- Insert sample reviews
INSERT INTO reviews (user_id, area_folder_id, due_on, completed_at, notes, created_at, updated_at)
SELECT 
    '00000000-0000-0000-0000-000000000001',
    f.id,
    NOW() + INTERVAL '7 days',
    NULL,
    'Monthly review of health and fitness goals',
    NOW(),
    NOW()
FROM folders f
WHERE f.user_id = '00000000-0000-0000-0000-000000000001'
AND f.para_category = 'areas'
AND f.name = 'Health & Fitness'
LIMIT 1;

-- Insert sample attachments (metadata only, no actual files)
INSERT INTO attachments (note_id, storage_path, mime_type, size, created_at)
SELECT 
    n.id,
    'attachments/' || n.id || '/meeting-notes.pdf',
    'application/pdf',
    1024000,
    n.created_at + INTERVAL '1 hour'
FROM notes n
WHERE n.title ILIKE '%meeting%'
LIMIT 2;

-- Update folder paths (this would normally be done by triggers)
UPDATE folders 
SET path = id::text::ltree
WHERE parent_id IS NULL;

UPDATE folders 
SET path = parent_path || id::text::ltree
FROM (
    SELECT id, path as parent_path 
    FROM folders 
    WHERE parent_id IS NULL
) parent_folders
WHERE folders.parent_id = parent_folders.id;

-- Update folder paths for nested folders
UPDATE folders 
SET path = parent_path || id::text::ltree
FROM (
    SELECT f1.id, f2.path as parent_path
    FROM folders f1
    JOIN folders f2 ON f1.parent_id = f2.id
    WHERE f1.parent_id IS NOT NULL
) parent_folders
WHERE folders.parent_id = parent_folders.id
AND folders.path IS NULL;