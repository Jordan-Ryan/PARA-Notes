-- Performance Indexes and Additional Optimizations
-- This migration adds additional indexes for better query performance

-- Ensure trigram extension is available before creating trigram indexes
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_notes_user_folder_updated 
ON notes(user_id, folder_id, updated_at DESC);


CREATE INDEX IF NOT EXISTS idx_folders_user_category_sort 
ON folders(user_id, para_category, sort_index);

CREATE INDEX IF NOT EXISTS idx_guidance_events_user_created 
ON guidance_events(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_templates_user_type 
ON templates(user_id, template_type);

CREATE INDEX IF NOT EXISTS idx_reviews_user_due 
ON reviews(user_id, due_on) WHERE completed_at IS NULL;

-- Partial indexes for common filters
CREATE INDEX IF NOT EXISTS idx_notes_encrypted 
ON notes(user_id, updated_at DESC) WHERE is_encrypted = true;

CREATE INDEX IF NOT EXISTS idx_notes_unencrypted 
ON notes(user_id, updated_at DESC) WHERE is_encrypted = false;

CREATE INDEX IF NOT EXISTS idx_folders_root 
ON folders(user_id, para_category, sort_index) WHERE parent_id IS NULL;

CREATE INDEX IF NOT EXISTS idx_reviews_pending 
ON reviews(user_id, due_on) WHERE completed_at IS NULL;

-- Indexes for text search optimization
CREATE INDEX IF NOT EXISTS idx_notes_title_trgm 
ON notes USING GIN(title gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_notes_content_trgm 
ON notes USING GIN(content gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_folders_name_trgm 
ON folders USING GIN(name gin_trgm_ops);

-- (pg_trgm already ensured above)

-- Indexes for JSONB queries
CREATE INDEX IF NOT EXISTS idx_profiles_settings_gin 
ON profiles USING GIN(settings);

-- Indexes for array operations
CREATE INDEX IF NOT EXISTS idx_notes_tags_gin 
ON notes USING GIN(tags);

-- (Removed date(created_at)/date(updated_at) indexes due to immutability)

-- Indexes for folder hierarchy queries
CREATE INDEX IF NOT EXISTS idx_folders_path_ops 
ON folders USING GIST(path);

-- Indexes for attachment queries
CREATE INDEX IF NOT EXISTS idx_attachments_note_created 
ON attachments(note_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_attachments_mime_size 
ON attachments(mime_type, size);

-- Statistics update for better query planning
ANALYZE users;
ANALYZE profiles;
ANALYZE folders;
ANALYZE notes;
ANALYZE attachments;
ANALYZE guidance_events;
ANALYZE templates;
ANALYZE reviews;

-- Create function to get table statistics
CREATE OR REPLACE FUNCTION get_table_stats()
RETURNS TABLE (
    table_name TEXT,
    row_count BIGINT,
    table_size TEXT,
    index_size TEXT,
    total_size TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        schemaname||'.'||tablename as table_name,
        n_tup_ins - n_tup_del as row_count,
        pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as table_size,
        pg_size_pretty(pg_indexes_size(schemaname||'.'||tablename)) as index_size,
        pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as total_size
    FROM pg_stat_user_tables
    WHERE schemaname = 'public'
    ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to analyze query performance
CREATE OR REPLACE FUNCTION analyze_query_performance(query_text TEXT)
RETURNS TABLE (
    plan_line TEXT,
    cost REAL,
    rows BIGINT,
    width INTEGER
) AS $$
BEGIN
    RETURN QUERY
    EXECUTE 'EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT) ' || query_text;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get slow queries
CREATE OR REPLACE FUNCTION get_slow_queries()
RETURNS TABLE (
    query TEXT,
    calls BIGINT,
    total_time DOUBLE PRECISION,
    mean_time DOUBLE PRECISION,
    rows BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        query,
        calls,
        total_time,
        mean_time,
        rows
    FROM pg_stat_statements
    WHERE mean_time > 1000 -- Queries taking more than 1 second on average
    ORDER BY mean_time DESC
    LIMIT 20;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to vacuum and analyze tables
CREATE OR REPLACE FUNCTION maintenance_vacuum()
RETURNS TABLE (
    table_name TEXT,
    vacuumed BOOLEAN,
    analyzed BOOLEAN
) AS $$
DECLARE
    table_record RECORD;
BEGIN
    -- Get all user tables
    FOR table_record IN
        SELECT tablename
        FROM pg_tables
        WHERE schemaname = 'public'
    LOOP
        -- Vacuum the table
        EXECUTE 'VACUUM ANALYZE ' || table_record.tablename;

        -- Assign OUT parameters and emit a row
        table_name := table_record.tablename;
        vacuumed := true;
        analyzed := true;
        RETURN NEXT;
    END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
