-- Complete PARA Notes Database Schema
-- This migration creates the full database schema for the PARA notes application

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "ltree";

-- para_category already exists from initial schema
-- Create remaining enums if not present
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'template_type') THEN
    CREATE TYPE template_type AS ENUM ('note', 'project', 'area', 'resource', 'meeting', 'review');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'review_frequency') THEN
    CREATE TYPE review_frequency AS ENUM ('daily', 'weekly', 'monthly', 'quarterly', 'yearly');
  END IF;
END $$;

-- Drop existing tables if they exist (for clean migration)
DROP TABLE IF EXISTS attachments CASCADE;
DROP TABLE IF EXISTS guidance_events CASCADE;
DROP TABLE IF EXISTS templates CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS notes CASCADE;
DROP TABLE IF EXISTS folders CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create users table (extends Supabase auth.users)
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create profiles table for user settings and preferences
CREATE TABLE profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    display_name TEXT,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create folders table for hierarchical PARA organization
CREATE TABLE folders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    parent_id UUID REFERENCES folders(id) ON DELETE CASCADE,
    para_category para_category NOT NULL,
    path LTREE, -- For hierarchical queries
    sort_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure unique folder names within the same parent
    UNIQUE(user_id, parent_id, name)
);

-- Create notes table
CREATE TABLE notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    folder_id UUID REFERENCES folders(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    content TEXT,
    encrypted_content TEXT, -- For E2EE when enabled
    is_encrypted BOOLEAN DEFAULT FALSE,
    tags TEXT[] DEFAULT '{}',
    version INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create attachments table for file storage
CREATE TABLE attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    note_id UUID NOT NULL REFERENCES notes(id) ON DELETE CASCADE,
    storage_path TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    size BIGINT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create guidance_events table for AI suggestions
CREATE TABLE guidance_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    note_id UUID REFERENCES notes(id) ON DELETE CASCADE,
    suggested_category para_category NOT NULL,
    accepted BOOLEAN,
    rule_id TEXT, -- Reference to the rule that triggered the suggestion
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create templates table
CREATE TABLE templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    template_type template_type NOT NULL,
    name TEXT NOT NULL,
    content TEXT NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure unique template names per user and type
    UNIQUE(user_id, template_type, name)
);

-- Create reviews table for area maintenance
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    area_folder_id UUID NOT NULL REFERENCES folders(id) ON DELETE CASCADE,
    due_on TIMESTAMP WITH TIME ZONE NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_folders_user_id ON folders(user_id);
CREATE INDEX idx_folders_parent_id ON folders(parent_id);
CREATE INDEX idx_folders_para_category ON folders(para_category);
CREATE INDEX idx_folders_path ON folders USING GIST(path);
CREATE INDEX idx_folders_sort_index ON folders(sort_index);

CREATE INDEX idx_notes_user_id ON notes(user_id);
CREATE INDEX idx_notes_folder_id ON notes(folder_id);
CREATE INDEX idx_notes_created_at ON notes(created_at);
CREATE INDEX idx_notes_updated_at ON notes(updated_at);
CREATE INDEX idx_notes_tags ON notes USING GIN(tags);
CREATE INDEX idx_notes_is_encrypted ON notes(is_encrypted);

CREATE INDEX idx_attachments_note_id ON attachments(note_id);
CREATE INDEX idx_attachments_mime_type ON attachments(mime_type);

CREATE INDEX idx_guidance_events_user_id ON guidance_events(user_id);
CREATE INDEX idx_guidance_events_note_id ON guidance_events(note_id);
CREATE INDEX idx_guidance_events_created_at ON guidance_events(created_at);

CREATE INDEX idx_templates_user_id ON templates(user_id);
CREATE INDEX idx_templates_type ON templates(template_type);
CREATE INDEX idx_templates_is_default ON templates(is_default);

CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_area_folder_id ON reviews(area_folder_id);
CREATE INDEX idx_reviews_due_on ON reviews(due_on);
CREATE INDEX idx_reviews_completed_at ON reviews(completed_at);

-- Create full-text search indexes
CREATE INDEX idx_notes_title_search ON notes USING GIN(to_tsvector('english', title));
CREATE INDEX idx_notes_content_search ON notes USING GIN(to_tsvector('english', COALESCE(content, '')));
CREATE INDEX idx_folders_name_search ON folders USING GIN(to_tsvector('english', name));
CREATE INDEX idx_folders_description_search ON folders USING GIN(to_tsvector('english', COALESCE(description, '')));

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at 
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_folders_updated_at 
    BEFORE UPDATE ON folders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notes_updated_at 
    BEFORE UPDATE ON notes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_templates_updated_at 
    BEFORE UPDATE ON templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at 
    BEFORE UPDATE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to update folder paths
CREATE OR REPLACE FUNCTION update_folder_path()
RETURNS TRIGGER AS $$
DECLARE
    parent_path LTREE;
BEGIN
    IF NEW.parent_id IS NULL THEN
        NEW.path = NEW.id::TEXT::LTREE;
    ELSE
        SELECT path INTO parent_path FROM folders WHERE id = NEW.parent_id;
        NEW.path = parent_path || NEW.id::TEXT::LTREE;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update folder paths
CREATE TRIGGER update_folder_path_trigger
    BEFORE INSERT OR UPDATE ON folders
    FOR EACH ROW EXECUTE FUNCTION update_folder_path();

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE guidance_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for profiles table
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own profile" ON profiles
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for folders table
CREATE POLICY "Users can view own folders" ON folders
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own folders" ON folders
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own folders" ON folders
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own folders" ON folders
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for notes table
CREATE POLICY "Users can view own notes" ON notes
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own notes" ON notes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own notes" ON notes
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own notes" ON notes
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for attachments table
CREATE POLICY "Users can view own attachments" ON attachments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM notes 
            WHERE notes.id = attachments.note_id 
            AND notes.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert own attachments" ON attachments
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM notes 
            WHERE notes.id = attachments.note_id 
            AND notes.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update own attachments" ON attachments
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM notes 
            WHERE notes.id = attachments.note_id 
            AND notes.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete own attachments" ON attachments
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM notes 
            WHERE notes.id = attachments.note_id 
            AND notes.user_id = auth.uid()
        )
    );

-- RLS Policies for guidance_events table
CREATE POLICY "Users can view own guidance events" ON guidance_events
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own guidance events" ON guidance_events
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own guidance events" ON guidance_events
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own guidance events" ON guidance_events
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for templates table
CREATE POLICY "Users can view own templates" ON templates
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own templates" ON templates
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own templates" ON templates
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own templates" ON templates
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for reviews table
CREATE POLICY "Users can view own reviews" ON reviews
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own reviews" ON reviews
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews" ON reviews
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reviews" ON reviews
    FOR DELETE USING (auth.uid() = user_id);
