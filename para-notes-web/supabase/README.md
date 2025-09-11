# PARA Notes - Supabase Configuration

This directory contains the complete Supabase configuration for the PARA Notes application, including database schema, RLS policies, RPC functions, and TypeScript types.

## Database Schema

### Tables

#### Core Tables
- **users**: Extends Supabase auth.users with additional fields
- **profiles**: User settings and preferences
- **folders**: Hierarchical PARA organization structure
- **notes**: User notes with optional encryption support
- **attachments**: File attachments linked to notes

#### Supporting Tables
- **guidance_events**: AI suggestions and user feedback
- **templates**: Reusable note templates
- **reviews**: Area maintenance and review scheduling

### Key Features

#### Hierarchical Organization
- Folders use `ltree` extension for efficient hierarchical queries
- Automatic path generation for folder relationships
- Support for unlimited nesting levels

#### Security
- Row Level Security (RLS) enabled on all tables
- Users can only access their own data
- Proper foreign key constraints with cascading deletes

#### Performance
- Comprehensive indexing strategy
- Full-text search capabilities
- Optimized for common query patterns

## Migration Files

### 20240102000000_complete_para_schema.sql
- Creates all database tables
- Sets up RLS policies
- Defines custom types and enums
- Creates basic indexes

### 20240102000001_para_rpc_functions.sql
- `create_initial_para_root()`: Creates default PARA structure
- `para_suggest()`: AI-powered placement suggestions
- `move_note_to_para()`: Moves notes with validation
- `complete_project()`: Archives completed projects
- `search_notes()`: Full-text search with ranking
- `get_folder_hierarchy()`: Returns folder tree structure
- `get_folder_notes_count()`: Returns note counts per folder

### 20240102000002_storage_policies.sql
- Storage bucket configuration for attachments
- RLS policies for file access
- File validation functions
- Cleanup utilities for orphaned files

### 20240102000003_performance_indexes.sql
- Additional performance indexes
- Composite indexes for common queries
- Partial indexes for filtered data
- Query analysis and maintenance functions

## RPC Functions

### PARA Operations

#### `create_initial_para_root()`
Creates the default PARA folder structure for new users.

```sql
SELECT create_initial_para_root();
```

Returns:
```json
{
  "projects_folder_id": "uuid",
  "areas_folder_id": "uuid", 
  "resources_folder_id": "uuid",
  "archive_folder_id": "uuid",
  "success": true
}
```

#### `para_suggest(note_title, note_preview)`
Suggests PARA placement for notes based on content analysis.

```sql
SELECT * FROM para_suggest('Project Planning Meeting', 'Discussing Q1 roadmap and deadlines');
```

Returns array of suggestions with confidence scores and reasoning.

#### `move_note_to_para(note_id, target_folder_id)`
Moves a note to a different PARA folder with validation.

```sql
SELECT move_note_to_para('note-uuid', 'folder-uuid');
```

#### `complete_project(project_folder_id)`
Moves a completed project to the archive.

```sql
SELECT complete_project('project-folder-uuid');
```

### Search and Navigation

#### `search_notes(query, filters)`
Full-text search across notes with ranking.

```sql
SELECT * FROM search_notes('meeting notes', 'projects', 'folder-uuid', 50);
```

#### `get_folder_hierarchy(folder_id)`
Returns the complete folder hierarchy.

```sql
SELECT * FROM get_folder_hierarchy();
```

#### `get_folder_notes_count()`
Returns note counts for each folder.

```sql
SELECT * FROM get_folder_notes_count();
```

## TypeScript Integration

The `types.ts` file provides complete TypeScript definitions for:

- Database table types
- Insert/Update types
- Function return types
- Extended types with relationships
- API response types
- Search and filter types

### Usage Example

```typescript
import { createClient } from '@supabase/supabase-js'
import type { Database, Note, ParaSuggestion } from './types'

const supabase = createClient<Database>('your-url', 'your-key')

// Type-safe queries
const { data: notes } = await supabase
  .from('notes')
  .select('*, folder:folders(*)')
  .eq('user_id', userId)

// Type-safe RPC calls
const { data: suggestions } = await supabase
  .rpc('para_suggest', {
    note_title: 'Project Planning',
    note_preview: 'Meeting notes about Q1 roadmap'
  })
```

## Security

### Row Level Security (RLS)
All tables have RLS enabled with policies that ensure:
- Users can only access their own data
- Proper authentication checks
- Secure file access for attachments

### Storage Policies
File attachments are stored in a private bucket with:
- User-specific access controls
- File type validation
- Size limits (10MB default)
- Automatic cleanup of orphaned files

## Performance

### Indexing Strategy
- Primary indexes on foreign keys
- Composite indexes for common query patterns
- Full-text search indexes
- Partial indexes for filtered queries
- GIN indexes for array and JSONB operations

### Query Optimization
- Trigram indexes for fuzzy text search
- Path indexes for hierarchical queries
- Statistics updates for better query planning
- Maintenance functions for database health

## Maintenance

### Database Health
Use the provided maintenance functions:

```sql
-- Get table statistics
SELECT * FROM get_table_stats();

-- Analyze query performance
SELECT * FROM analyze_query_performance('SELECT * FROM notes WHERE user_id = $1');

-- Get slow queries
SELECT * FROM get_slow_queries();

-- Run maintenance
SELECT * FROM maintenance_vacuum();
```

### Cleanup
- Orphaned attachments are automatically cleaned up
- Regular VACUUM and ANALYZE operations
- Index maintenance for optimal performance

## Development

### Local Development
1. Start Supabase locally: `supabase start`
2. Run migrations: `supabase db reset`
3. Generate types: `supabase gen types typescript --local > src/lib/supabase/types.ts`

### Production Deployment
1. Deploy migrations: `supabase db push`
2. Update types: `supabase gen types typescript --project-id <project-id> > src/lib/supabase/types.ts`

## Monitoring

### Key Metrics to Monitor
- Query performance (use `get_slow_queries()`)
- Table sizes (use `get_table_stats()`)
- RLS policy effectiveness
- Storage usage and cleanup

### Alerts to Set Up
- Slow query detection
- Storage quota warnings
- Failed authentication attempts
- RLS policy violations

## Troubleshooting

### Common Issues

#### RLS Policy Violations
- Ensure user is authenticated
- Check policy conditions
- Verify foreign key relationships

#### Performance Issues
- Check index usage with `EXPLAIN ANALYZE`
- Run maintenance functions
- Monitor slow queries

#### Storage Issues
- Verify file upload validation
- Check storage policies
- Run cleanup functions

### Debug Queries

```sql
-- Check RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE schemaname = 'public';

-- Check table sizes
SELECT * FROM get_table_stats();

-- Check index usage
SELECT schemaname, tablename, indexname, idx_tup_read, idx_tup_fetch
FROM pg_stat_user_indexes
WHERE schemaname = 'public';
```
