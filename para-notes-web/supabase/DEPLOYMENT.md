# PARA Notes - Supabase Deployment Guide

This guide covers deploying the complete Supabase configuration for the PARA Notes application.

## Prerequisites

- Supabase CLI installed (`npm install -g supabase`)
- Supabase project created
- Environment variables configured

## Deployment Steps

### 1. Initialize Supabase Project

```bash
# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Or create a new project
supabase projects create para-notes
```

### 2. Deploy Database Schema

```bash
# Deploy all migrations
supabase db push

# Or deploy specific migration
supabase migration up 20240102000000_complete_para_schema
supabase migration up 20240102000001_para_rpc_functions
supabase migration up 20240102000002_storage_policies
supabase migration up 20240102000003_performance_indexes
```

### 3. Generate TypeScript Types

```bash
# Generate types from deployed schema
supabase gen types typescript --project-id your-project-id > src/lib/supabase/types.ts
```

### 4. Set Up Storage Buckets

```bash
# Create attachments bucket
supabase storage create attachments

# Set up storage policies (already included in migration)
```

### 5. Configure Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 6. Seed Development Data (Optional)

```bash
# Run seed script
supabase db seed
```

## Verification

### 1. Check Database Schema

```sql
-- Verify tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- Check RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE schemaname = 'public';
```

### 2. Test RPC Functions

```sql
-- Test PARA root creation
SELECT create_initial_para_root();

-- Test search functionality
SELECT * FROM search_notes('test query');

-- Test folder hierarchy
SELECT * FROM get_folder_hierarchy();
```

### 3. Verify Storage Policies

```bash
# Check storage buckets
supabase storage ls

# Test file upload (via application)
```

## Production Considerations

### 1. Security

- Review all RLS policies
- Enable audit logging
- Set up monitoring alerts
- Regular security audits

### 2. Performance

- Monitor query performance
- Set up database monitoring
- Regular maintenance (VACUUM, ANALYZE)
- Index optimization

### 3. Backup

- Enable point-in-time recovery
- Regular backup verification
- Disaster recovery plan

### 4. Scaling

- Connection pooling
- Read replicas for heavy read workloads
- CDN for static assets
- Caching strategies

## Monitoring

### Key Metrics

- Database performance
- Query execution times
- Storage usage
- Authentication events
- RLS policy violations

### Alerts

- Slow query detection (>1s)
- High error rates
- Storage quota warnings
- Failed authentication spikes

## Troubleshooting

### Common Issues

1. **Migration Failures**
   - Check for existing data conflicts
   - Verify user permissions
   - Review error logs

2. **RLS Policy Issues**
   - Test policies with different user contexts
   - Check foreign key relationships
   - Verify authentication state

3. **Performance Issues**
   - Run `EXPLAIN ANALYZE` on slow queries
   - Check index usage
   - Review query patterns

4. **Storage Issues**
   - Verify bucket policies
   - Check file size limits
   - Review CORS settings

### Debug Commands

```bash
# Check migration status
supabase migration list

# View logs
supabase logs

# Reset database (development only)
supabase db reset

# Check project status
supabase status
```

## Maintenance

### Regular Tasks

1. **Weekly**
   - Review slow queries
   - Check storage usage
   - Monitor error rates

2. **Monthly**
   - Run maintenance functions
   - Review RLS policies
   - Update dependencies

3. **Quarterly**
   - Security audit
   - Performance review
   - Backup verification

### Maintenance Functions

```sql
-- Get table statistics
SELECT * FROM get_table_stats();

-- Run maintenance
SELECT * FROM maintenance_vacuum();

-- Check slow queries
SELECT * FROM get_slow_queries();
```

## Support

For issues or questions:

1. Check Supabase documentation
2. Review migration logs
3. Test in development environment
4. Contact Supabase support if needed

## Changelog

### v1.0.0 (2024-01-02)
- Initial database schema
- RLS policies implementation
- RPC functions for PARA operations
- Storage policies for attachments
- Performance indexes
- TypeScript type definitions
