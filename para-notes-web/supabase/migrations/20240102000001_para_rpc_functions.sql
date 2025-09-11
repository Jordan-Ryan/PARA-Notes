-- PARA RPC Functions
-- This migration creates all the RPC functions for PARA operations

-- Function to create initial PARA root structure
CREATE OR REPLACE FUNCTION create_initial_para_root()
RETURNS JSON AS $$
DECLARE
    user_id UUID;
    projects_folder_id UUID;
    areas_folder_id UUID;
    resources_folder_id UUID;
    archive_folder_id UUID;
    result JSON;
BEGIN
    -- Get current user ID
    user_id := auth.uid();
    
    IF user_id IS NULL THEN
        RAISE EXCEPTION 'User not authenticated';
    END IF;
    
    -- Create Projects folder
    INSERT INTO folders (user_id, name, description, para_category, sort_index)
    VALUES (user_id, 'Projects', 'Active projects with deadlines', 'projects', 1)
    RETURNING id INTO projects_folder_id;
    
    -- Create Areas folder
    INSERT INTO folders (user_id, name, description, para_category, sort_index)
    VALUES (user_id, 'Areas', 'Ongoing areas of responsibility', 'areas', 2)
    RETURNING id INTO areas_folder_id;
    
    -- Create Resources folder
    INSERT INTO folders (user_id, name, description, para_category, sort_index)
    VALUES (user_id, 'Resources', 'Reference materials and knowledge', 'resources', 3)
    RETURNING id INTO resources_folder_id;
    
    -- Create Archive folder
    INSERT INTO folders (user_id, name, description, para_category, sort_index)
    VALUES (user_id, 'Archive', 'Completed projects and inactive items', 'archive', 4)
    RETURNING id INTO archive_folder_id;
    
    -- Return the created folder structure
    result := json_build_object(
        'projects_folder_id', projects_folder_id,
        'areas_folder_id', areas_folder_id,
        'resources_folder_id', resources_folder_id,
        'archive_folder_id', archive_folder_id,
        'success', true
    );
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to suggest PARA placement for notes
CREATE OR REPLACE FUNCTION para_suggest(note_title TEXT, note_preview TEXT DEFAULT '')
RETURNS TABLE (
    suggested_category para_category,
    confidence_score REAL,
    reasoning TEXT,
    suggested_folder_id UUID,
    suggested_folder_name TEXT
) AS $$
DECLARE
    user_id UUID;
    search_text TEXT;
BEGIN
    user_id := auth.uid();
    
    IF user_id IS NULL THEN
        RAISE EXCEPTION 'User not authenticated';
    END IF;
    
    search_text := LOWER(COALESCE(note_title, '') || ' ' || COALESCE(note_preview, ''));
    
    RETURN QUERY
    WITH suggestions AS (
        -- Project indicators
        SELECT 
            'projects'::para_category as suggested_category,
            CASE 
                WHEN search_text ~ 'project|deadline|due|launch|release|milestone|sprint|phase' THEN 0.9
                WHEN search_text ~ 'plan|strategy|roadmap|timeline|schedule' THEN 0.7
                WHEN search_text ~ 'goal|objective|target|aim' THEN 0.6
                ELSE 0.3
            END as confidence_score,
            CASE 
                WHEN search_text ~ 'project|deadline|due|launch|release|milestone|sprint|phase' THEN 'Contains project-related keywords'
                WHEN search_text ~ 'plan|strategy|roadmap|timeline|schedule' THEN 'Contains planning keywords'
                WHEN search_text ~ 'goal|objective|target|aim' THEN 'Contains goal-oriented keywords'
                ELSE 'General project context'
            END as reasoning,
            f.id as suggested_folder_id,
            f.name as suggested_folder_name
        FROM folders f
        WHERE f.user_id = para_suggest.user_id 
        AND f.para_category = 'projects'
        AND f.parent_id IS NULL
        
        UNION ALL
        
        -- Area indicators
        SELECT 
            'areas'::para_category as suggested_category,
            CASE 
                WHEN search_text ~ 'area|responsibility|maintain|manage|oversee|review' THEN 0.9
                WHEN search_text ~ 'process|workflow|system|procedure|standard' THEN 0.8
                WHEN search_text ~ 'health|fitness|finance|career|family|personal' THEN 0.7
                ELSE 0.3
            END as confidence_score,
            CASE 
                WHEN search_text ~ 'area|responsibility|maintain|manage|oversee|review' THEN 'Contains area-related keywords'
                WHEN search_text ~ 'process|workflow|system|procedure|standard' THEN 'Contains process keywords'
                WHEN search_text ~ 'health|fitness|finance|career|family|personal' THEN 'Contains life area keywords'
                ELSE 'General area context'
            END as reasoning,
            f.id as suggested_folder_id,
            f.name as suggested_folder_name
        FROM folders f
        WHERE f.user_id = para_suggest.user_id 
        AND f.para_category = 'areas'
        AND f.parent_id IS NULL
        
        UNION ALL
        
        -- Resource indicators
        SELECT 
            'resources'::para_category as suggested_category,
            CASE 
                WHEN search_text ~ 'reference|book|article|video|course|tutorial|guide|manual' THEN 0.9
                WHEN search_text ~ 'learn|study|research|documentation|knowledge|info' THEN 0.8
                WHEN search_text ~ 'tool|template|checklist|resource|material' THEN 0.7
                ELSE 0.3
            END as confidence_score,
            CASE 
                WHEN search_text ~ 'reference|book|article|video|course|tutorial|guide|manual' THEN 'Contains reference keywords'
                WHEN search_text ~ 'learn|study|research|documentation|knowledge|info' THEN 'Contains learning keywords'
                WHEN search_text ~ 'tool|template|checklist|resource|material' THEN 'Contains resource keywords'
                ELSE 'General resource context'
            END as reasoning,
            f.id as suggested_folder_id,
            f.name as suggested_folder_name
        FROM folders f
        WHERE f.user_id = para_suggest.user_id 
        AND f.para_category = 'resources'
        AND f.parent_id IS NULL
        
        UNION ALL
        
        -- Archive indicators
        SELECT 
            'archive'::para_category as suggested_category,
            CASE 
                WHEN search_text ~ 'completed|finished|done|archived|old|past|previous' THEN 0.9
                WHEN search_text ~ 'completed|finished|done|archived|old|past|previous' THEN 0.7
                ELSE 0.2
            END as confidence_score,
            CASE 
                WHEN search_text ~ 'completed|finished|done|archived|old|past|previous' THEN 'Contains completion keywords'
                ELSE 'General archive context'
            END as reasoning,
            f.id as suggested_folder_id,
            f.name as suggested_folder_name
        FROM folders f
        WHERE f.user_id = para_suggest.user_id 
        AND f.para_category = 'archive'
        AND f.parent_id IS NULL
    )
    SELECT 
        s.suggested_category,
        s.confidence_score,
        s.reasoning,
        s.suggested_folder_id,
        s.suggested_folder_name
    FROM suggestions s
    WHERE s.confidence_score > 0.2
    ORDER BY s.confidence_score DESC
    LIMIT 3;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to move notes to PARA folders with validation
CREATE OR REPLACE FUNCTION move_note_to_para(note_id UUID, target_folder_id UUID)
RETURNS JSON AS $$
DECLARE
    user_id UUID;
    note_record RECORD;
    target_folder_record RECORD;
    result JSON;
BEGIN
    user_id := auth.uid();
    
    IF user_id IS NULL THEN
        RAISE EXCEPTION 'User not authenticated';
    END IF;
    
    -- Get note details
    SELECT * INTO note_record
    FROM notes
    WHERE id = note_id AND user_id = move_note_to_para.user_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Note not found or access denied';
    END IF;
    
    -- Get target folder details
    SELECT * INTO target_folder_record
    FROM folders
    WHERE id = target_folder_id AND user_id = move_note_to_para.user_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Target folder not found or access denied';
    END IF;
    
    -- Validate the move (basic validation)
    IF note_record.folder_id = target_folder_id THEN
        result := json_build_object(
            'success', false,
            'message', 'Note is already in the target folder',
            'note_id', note_id,
            'folder_id', target_folder_id
        );
        RETURN result;
    END IF;
    
    -- Update the note
    UPDATE notes
    SET folder_id = target_folder_id,
        updated_at = NOW()
    WHERE id = note_id;
    
    -- Log the guidance event
    INSERT INTO guidance_events (user_id, note_id, suggested_category, accepted, rule_id)
    VALUES (user_id, note_id, target_folder_record.para_category, true, 'manual_move');
    
    result := json_build_object(
        'success', true,
        'message', 'Note moved successfully',
        'note_id', note_id,
        'folder_id', target_folder_id,
        'folder_name', target_folder_record.name,
        'para_category', target_folder_record.para_category
    );
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to complete a project and move it to archive
CREATE OR REPLACE FUNCTION complete_project(project_folder_id UUID)
RETURNS JSON AS $$
DECLARE
    user_id UUID;
    project_folder RECORD;
    archive_folder_id UUID;
    result JSON;
    moved_notes_count INTEGER;
BEGIN
    user_id := auth.uid();
    
    IF user_id IS NULL THEN
        RAISE EXCEPTION 'User not authenticated';
    END IF;
    
    -- Get project folder details
    SELECT * INTO project_folder
    FROM folders
    WHERE id = project_folder_id 
    AND user_id = complete_project.user_id
    AND para_category = 'projects';
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Project folder not found or access denied';
    END IF;
    
    -- Find or create archive folder
    SELECT id INTO archive_folder_id
    FROM folders
    WHERE user_id = complete_project.user_id
    AND para_category = 'archive'
    AND parent_id IS NULL
    LIMIT 1;
    
    IF archive_folder_id IS NULL THEN
        -- Create archive folder if it doesn't exist
        INSERT INTO folders (user_id, name, description, para_category, sort_index)
        VALUES (user_id, 'Archive', 'Completed projects and inactive items', 'archive', 4)
        RETURNING id INTO archive_folder_id;
    END IF;
    
    -- Create archived project folder in archive
    INSERT INTO folders (user_id, name, description, parent_id, para_category, sort_index)
    VALUES (
        user_id, 
        project_folder.name || ' (Completed)', 
        'Archived project: ' || COALESCE(project_folder.description, ''),
        archive_folder_id,
        'archive',
        0
    )
    RETURNING id INTO archive_folder_id;
    
    -- Move all notes from project to archive
    UPDATE notes
    SET folder_id = archive_folder_id,
        updated_at = NOW()
    WHERE folder_id = project_folder_id;
    
    GET DIAGNOSTICS moved_notes_count = ROW_COUNT;
    
    -- Update project folder to archived status
    UPDATE folders
    SET para_category = 'archive',
        parent_id = archive_folder_id,
        name = project_folder.name || ' (Completed)',
        updated_at = NOW()
    WHERE id = project_folder_id;
    
    result := json_build_object(
        'success', true,
        'message', 'Project completed and moved to archive',
        'project_folder_id', project_folder_id,
        'archive_folder_id', archive_folder_id,
        'moved_notes_count', moved_notes_count
    );
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function for full-text search with ranking
CREATE OR REPLACE FUNCTION search_notes(
    search_query TEXT,
    para_category_filter para_category DEFAULT NULL,
    folder_id_filter UUID DEFAULT NULL,
    limit_count INTEGER DEFAULT 50
)
RETURNS TABLE (
    id UUID,
    title TEXT,
    content TEXT,
    folder_id UUID,
    folder_name TEXT,
    para_category para_category,
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    rank REAL
) AS $$
DECLARE
    user_id UUID;
BEGIN
    user_id := auth.uid();
    
    IF user_id IS NULL THEN
        RAISE EXCEPTION 'User not authenticated';
    END IF;
    
    RETURN QUERY
    SELECT 
        n.id,
        n.title,
        n.content,
        n.folder_id,
        f.name as folder_name,
        f.para_category,
        n.tags,
        n.created_at,
        n.updated_at,
        ts_rank(
            to_tsvector('english', n.title || ' ' || COALESCE(n.content, '')),
            plainto_tsquery('english', search_query)
        ) as rank
    FROM notes n
    LEFT JOIN folders f ON n.folder_id = f.id
    WHERE n.user_id = search_notes.user_id
    AND (
        to_tsvector('english', n.title || ' ' || COALESCE(n.content, '')) @@ plainto_tsquery('english', search_query)
        OR n.title ILIKE '%' || search_query || '%'
        OR n.content ILIKE '%' || search_query || '%'
        OR search_query = ANY(n.tags)
    )
    AND (para_category_filter IS NULL OR f.para_category = para_category_filter)
    AND (folder_id_filter IS NULL OR n.folder_id = folder_id_filter)
    ORDER BY rank DESC, n.updated_at DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get folder hierarchy
CREATE OR REPLACE FUNCTION get_folder_hierarchy(user_folder_id UUID DEFAULT NULL)
RETURNS TABLE (
    id UUID,
    name TEXT,
    description TEXT,
    para_category para_category,
    parent_id UUID,
    path TEXT,
    sort_index INTEGER,
    level INTEGER,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
) AS $$
DECLARE
    user_id UUID;
BEGIN
    user_id := auth.uid();
    
    IF user_id IS NULL THEN
        RAISE EXCEPTION 'User not authenticated';
    END IF;
    
    RETURN QUERY
    WITH RECURSIVE folder_tree AS (
        -- Base case: root folders
        SELECT 
            f.id,
            f.name,
            f.description,
            f.para_category,
            f.parent_id,
            f.path::TEXT,
            f.sort_index,
            0 as level,
            f.created_at,
            f.updated_at
        FROM folders f
        WHERE f.user_id = get_folder_hierarchy.user_id
        AND f.parent_id IS NULL
        AND (user_folder_id IS NULL OR f.id = user_folder_id)
        
        UNION ALL
        
        -- Recursive case: child folders
        SELECT 
            f.id,
            f.name,
            f.description,
            f.para_category,
            f.parent_id,
            f.path::TEXT,
            f.sort_index,
            ft.level + 1,
            f.created_at,
            f.updated_at
        FROM folders f
        JOIN folder_tree ft ON f.parent_id = ft.id
        WHERE f.user_id = get_folder_hierarchy.user_id
    )
    SELECT 
        ft.id,
        ft.name,
        ft.description,
        ft.para_category,
        ft.parent_id,
        ft.path,
        ft.sort_index,
        ft.level,
        ft.created_at,
        ft.updated_at
    FROM folder_tree ft
    ORDER BY ft.level, ft.sort_index, ft.name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get notes count by folder
CREATE OR REPLACE FUNCTION get_folder_notes_count()
RETURNS TABLE (
    folder_id UUID,
    folder_name TEXT,
    para_category para_category,
    notes_count BIGINT
) AS $$
DECLARE
    user_id UUID;
BEGIN
    user_id := auth.uid();
    
    IF user_id IS NULL THEN
        RAISE EXCEPTION 'User not authenticated';
    END IF;
    
    RETURN QUERY
    SELECT 
        f.id as folder_id,
        f.name as folder_name,
        f.para_category,
        COUNT(n.id) as notes_count
    FROM folders f
    LEFT JOIN notes n ON f.id = n.folder_id
    WHERE f.user_id = get_folder_notes_count.user_id
    GROUP BY f.id, f.name, f.para_category
    ORDER BY f.sort_index, f.name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
