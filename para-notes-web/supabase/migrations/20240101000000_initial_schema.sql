-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types
CREATE TYPE para_category AS ENUM ('projects', 'areas', 'resources', 'archive');
CREATE TYPE item_status AS ENUM ('active', 'completed', 'archived');
CREATE TYPE priority_level AS ENUM ('low', 'medium', 'high');
CREATE TYPE review_frequency AS ENUM ('daily', 'weekly', 'monthly', 'quarterly');
CREATE TYPE resource_type AS ENUM ('article', 'book', 'video', 'course', 'tool', 'other');

-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login_at TIMESTAMP WITH TIME ZONE
);

-- Create para_items table
CREATE TABLE para_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    category para_category NOT NULL,
    status item_status DEFAULT 'active',
    priority priority_level DEFAULT 'medium',
    due_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tags TEXT[] DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    
    -- Project specific fields
    deadline TIMESTAMP WITH TIME ZONE,
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    parent_area_id UUID REFERENCES para_items(id) ON DELETE SET NULL,
    next_actions TEXT[] DEFAULT '{}',
    waiting_for TEXT,
    
    -- Area specific fields
    standards TEXT[] DEFAULT '{}',
    review_frequency review_frequency,
    last_reviewed TIMESTAMP WITH TIME ZONE,
    
    -- Resource specific fields
    url TEXT,
    type resource_type,
    author TEXT,
    source TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    
    -- Archive specific fields
    archived_at TIMESTAMP WITH TIME ZONE,
    reason TEXT,
    original_category para_category
);

-- Create notes table
CREATE TABLE notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category para_category NOT NULL,
    para_item_id UUID REFERENCES para_items(id) ON DELETE SET NULL,
    tags TEXT[] DEFAULT '{}',
    is_encrypted BOOLEAN DEFAULT FALSE,
    is_pinned BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    version INTEGER DEFAULT 1,
    metadata JSONB DEFAULT '{}'
);

-- Create indexes for better performance
CREATE INDEX idx_para_items_user_id ON para_items(user_id);
CREATE INDEX idx_para_items_category ON para_items(category);
CREATE INDEX idx_para_items_status ON para_items(status);
CREATE INDEX idx_para_items_created_at ON para_items(created_at);
CREATE INDEX idx_para_items_updated_at ON para_items(updated_at);
CREATE INDEX idx_para_items_tags ON para_items USING GIN(tags);

CREATE INDEX idx_notes_user_id ON notes(user_id);
CREATE INDEX idx_notes_category ON notes(category);
CREATE INDEX idx_notes_para_item_id ON notes(para_item_id);
CREATE INDEX idx_notes_created_at ON notes(created_at);
CREATE INDEX idx_notes_updated_at ON notes(updated_at);
CREATE INDEX idx_notes_tags ON notes USING GIN(tags);
CREATE INDEX idx_notes_is_pinned ON notes(is_pinned);

-- Create full-text search indexes
CREATE INDEX idx_para_items_title_search ON para_items USING GIN(to_tsvector('english', title));
CREATE INDEX idx_para_items_description_search ON para_items USING GIN(to_tsvector('english', description));

CREATE INDEX idx_notes_title_search ON notes USING GIN(to_tsvector('english', title));
CREATE INDEX idx_notes_content_search ON notes USING GIN(to_tsvector('english', content));

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_para_items_updated_at BEFORE UPDATE ON para_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notes_updated_at BEFORE UPDATE ON notes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create RLS (Row Level Security) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE para_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Para items policies
CREATE POLICY "Users can view own para items" ON para_items
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own para items" ON para_items
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own para items" ON para_items
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own para items" ON para_items
    FOR DELETE USING (auth.uid() = user_id);

-- Notes policies
CREATE POLICY "Users can view own notes" ON notes
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own notes" ON notes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own notes" ON notes
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own notes" ON notes
    FOR DELETE USING (auth.uid() = user_id);

-- Create functions for common operations
CREATE OR REPLACE FUNCTION get_user_para_items(user_uuid UUID, item_category para_category DEFAULT NULL)
RETURNS TABLE (
    id UUID,
    title TEXT,
    description TEXT,
    category para_category,
    status item_status,
    priority priority_level,
    due_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    tags TEXT[],
    metadata JSONB
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        pi.id,
        pi.title,
        pi.description,
        pi.category,
        pi.status,
        pi.priority,
        pi.due_date,
        pi.created_at,
        pi.updated_at,
        pi.tags,
        pi.metadata
    FROM para_items pi
    WHERE pi.user_id = user_uuid
    AND (item_category IS NULL OR pi.category = item_category)
    ORDER BY pi.updated_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION search_notes(user_uuid UUID, search_query TEXT)
RETURNS TABLE (
    id UUID,
    title TEXT,
    content TEXT,
    category para_category,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    rank REAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        n.id,
        n.title,
        n.content,
        n.category,
        n.created_at,
        n.updated_at,
        ts_rank(
            to_tsvector('english', n.title || ' ' || n.content),
            plainto_tsquery('english', search_query)
        ) as rank
    FROM notes n
    WHERE n.user_id = user_uuid
    AND (
        to_tsvector('english', n.title || ' ' || n.content) @@ plainto_tsquery('english', search_query)
        OR n.title ILIKE '%' || search_query || '%'
        OR n.content ILIKE '%' || search_query || '%'
    )
    ORDER BY rank DESC, n.updated_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
