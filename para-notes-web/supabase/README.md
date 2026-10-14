# Supabase files

This directory is the Supabase config for `para-notes-web`. The npm scripts that call the CLI are in `para-notes-web/package.json`. The CLI binary is not an npm dependency.

`config.toml`:

- `project_id = "para-notes-web"`
- API port `54321`, database port `54322`, shadow port `54320`, pooler port `54329` (pooler `enabled = false`)
- `[db] major_version = 15`
- Studio port `54323`, Inbucket port `54324`
- `[storage] file_size_limit = "50MiB"`
- `[auth] site_url = "http://localhost:3000"`
- `[auth.email] enable_confirmations = false`
- External auth providers in this file are `enabled = false`

`config.toml` has no `[db.seed]` block. `seed.sql` is in this directory.

## Migrations

Applied order is filename order. They were not executed as part of writing this note. `20240102000000_complete_para_schema.sql` drops `users` and `notes` after `20240101000000_initial_schema.sql` creates them. `search_notes` is defined in both files with different arguments.

| File | What it adds |
| --- | --- |
| `20240101000000_initial_schema.sql` | `pgcrypto`; enums `para_category`, `item_status`, `priority_level`, `review_frequency`, `resource_type`; tables `users`, `para_items`, `notes`; RLS; `update_updated_at_column`, `get_user_para_items`, `search_notes(user_uuid, search_query)` |
| `20240102000000_complete_para_schema.sql` | `ltree`; drops and recreates `users` (id references `auth.users`), `profiles`, `folders`, `notes`, `attachments`, `guidance_events`, `templates`, `reviews`; RLS; `update_folder_path` |
| `20240102000001_para_rpc_functions.sql` | `create_initial_para_root`, `para_suggest(note_title, note_preview)`, `move_note_to_para`, `complete_project`, `search_notes(search_query, para_category_filter, folder_id_filter, limit_count)`, `get_folder_hierarchy`, `get_folder_notes_count` |
| `20240102000002_storage_policies.sql` | bucket `attachments` with `file_size_limit` `10485760`; policies on `storage.objects`; `cleanup_orphaned_attachments`, `get_attachment_url`, `validate_file_upload` |
| `20240102000003_performance_indexes.sql` | `pg_trgm`; indexes; `get_table_stats`, `analyze_query_performance`, `get_slow_queries`, `maintenance_vacuum` |

`para_suggest` scores keyword matches in the combined title and preview. It returns `suggested_category`, `confidence_score`, `reasoning`, `suggested_folder_id`, and `suggested_folder_name`.

## Commands from this package

Run from `para-notes-web`:

```bash
npm run supabase:start
npm run supabase:status
npm run supabase:db:push
npm run supabase:db:pull
npm run supabase:reset
npm run supabase:stop
npm run supabase:gen:types
```

`supabase:gen:types` is:

```bash
supabase gen types typescript --local > src/types/database.ts
```

That writes `para-notes-web/src/types/database.ts`. `src/lib/supabase/types.ts` is a separate file.

## RPC calls as written in SQL

```sql
SELECT create_initial_para_root();
SELECT * FROM para_suggest('Project Planning Meeting', 'Discussing Q1 roadmap and deadlines');
SELECT move_note_to_para('note-uuid', 'folder-uuid');
SELECT complete_project('project-folder-uuid');
SELECT * FROM search_notes('meeting notes', 'projects', 'folder-uuid', 50);
SELECT * FROM get_folder_hierarchy();
SELECT * FROM get_folder_notes_count();
```

The four-argument `search_notes` above is the function in `20240102000001_para_rpc_functions.sql`. The initial migration defines `search_notes(user_uuid UUID, search_query TEXT)` as well.
