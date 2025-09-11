-- Storage Policies for Attachments
-- This migration creates storage policies for file attachments

-- Create storage bucket for attachments
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'attachments',
    'attachments',
    false,
    10485760, -- 10MB limit
    ARRAY[
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'application/pdf',
        'text/plain',
        'text/markdown',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'application/zip',
        'application/x-zip-compressed',
        'audio/mpeg',
        'audio/wav',
        'video/mp4',
        'video/quicktime'
    ]
) ON CONFLICT (id) DO NOTHING;

-- Storage policy: Users can view their own attachments
CREATE POLICY "Users can view own attachments" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'attachments' AND
        EXISTS (
            SELECT 1 FROM attachments a
            JOIN notes n ON a.note_id = n.id
            WHERE a.storage_path = storage.objects.name
            AND n.user_id = auth.uid()
        )
    );

-- Storage policy: Users can upload their own attachments
CREATE POLICY "Users can upload own attachments" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'attachments' AND
        auth.uid() IS NOT NULL
    );

-- Storage policy: Users can update their own attachments
CREATE POLICY "Users can update own attachments" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'attachments' AND
        EXISTS (
            SELECT 1 FROM attachments a
            JOIN notes n ON a.note_id = n.id
            WHERE a.storage_path = storage.objects.name
            AND n.user_id = auth.uid()
        )
    );

-- Storage policy: Users can delete their own attachments
CREATE POLICY "Users can delete own attachments" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'attachments' AND
        EXISTS (
            SELECT 1 FROM attachments a
            JOIN notes n ON a.note_id = n.id
            WHERE a.storage_path = storage.objects.name
            AND n.user_id = auth.uid()
        )
    );

-- Function to clean up orphaned attachments
CREATE OR REPLACE FUNCTION cleanup_orphaned_attachments()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER := 0;
    attachment_record RECORD;
BEGIN
    -- Find attachments that don't have corresponding notes
    FOR attachment_record IN
        SELECT a.id, a.storage_path
        FROM attachments a
        LEFT JOIN notes n ON a.note_id = n.id
        WHERE n.id IS NULL
    LOOP
        -- Delete from storage
        DELETE FROM storage.objects
        WHERE bucket_id = 'attachments' 
        AND name = attachment_record.storage_path;
        
        -- Delete from attachments table
        DELETE FROM attachments WHERE id = attachment_record.id;
        
        deleted_count := deleted_count + 1;
    END LOOP;
    
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get signed URL for attachment
CREATE OR REPLACE FUNCTION get_attachment_url(attachment_id UUID)
RETURNS TEXT AS $$
DECLARE
    user_id UUID;
    attachment_record RECORD;
    signed_url TEXT;
BEGIN
    user_id := auth.uid();
    
    IF user_id IS NULL THEN
        RAISE EXCEPTION 'User not authenticated';
    END IF;
    
    -- Get attachment details
    SELECT a.storage_path, n.user_id
    INTO attachment_record
    FROM attachments a
    JOIN notes n ON a.note_id = n.id
    WHERE a.id = attachment_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Attachment not found';
    END IF;
    
    IF attachment_record.user_id != user_id THEN
        RAISE EXCEPTION 'Access denied';
    END IF;
    
    -- Generate signed URL (this would typically be done in the application layer)
    -- For now, return the storage path
    signed_url := 'https://your-supabase-url.supabase.co/storage/v1/object/sign/attachments/' || attachment_record.storage_path;
    
    RETURN signed_url;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to validate file upload
CREATE OR REPLACE FUNCTION validate_file_upload(
    file_name TEXT,
    file_size BIGINT,
    mime_type TEXT
)
RETURNS JSON AS $$
DECLARE
    user_id UUID;
    max_size BIGINT := 10485760; -- 10MB
    allowed_types TEXT[] := ARRAY[
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'application/pdf',
        'text/plain',
        'text/markdown',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'application/zip',
        'application/x-zip-compressed',
        'audio/mpeg',
        'audio/wav',
        'video/mp4',
        'video/quicktime'
    ];
    result JSON;
BEGIN
    user_id := auth.uid();
    
    IF user_id IS NULL THEN
        RAISE EXCEPTION 'User not authenticated';
    END IF;
    
    -- Validate file size
    IF file_size > max_size THEN
        result := json_build_object(
            'valid', false,
            'error', 'File size exceeds 10MB limit',
            'max_size', max_size,
            'file_size', file_size
        );
        RETURN result;
    END IF;
    
    -- Validate MIME type
    IF mime_type NOT IN (SELECT unnest(allowed_types)) THEN
        result := json_build_object(
            'valid', false,
            'error', 'File type not allowed',
            'allowed_types', allowed_types,
            'file_type', mime_type
        );
        RETURN result;
    END IF;
    
    -- Validate file name
    IF file_name IS NULL OR length(trim(file_name)) = 0 THEN
        result := json_build_object(
            'valid', false,
            'error', 'File name is required'
        );
        RETURN result;
    END IF;
    
    result := json_build_object(
        'valid', true,
        'message', 'File upload validation passed'
    );
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
