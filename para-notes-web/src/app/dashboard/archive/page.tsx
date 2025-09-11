'use client';

import { useState, useEffect } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  MoreVertical,
  Edit,
  Trash2,
  Archive,
  Tag,
  Calendar,
  Clock,
  RotateCcw,
  FileText,
  FolderOpen,
  BookOpen
} from 'lucide-react';
import Link from 'next/link';

interface ArchivedItem {
  id: string;
  title: string;
  content: string;
  type: 'note' | 'project' | 'area' | 'resource';
  originalFolder: string;
  tags: string[];
  archivedAt: string;
  archivedReason: string;
  originalCreatedAt: string;
  originalUpdatedAt: string;
}

export default function ArchivePage() {
  const [archivedItems, setArchivedItems] = useState<ArchivedItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for now
  useEffect(() => {
    const mockArchivedItems: ArchivedItem[] = [
      {
        id: '1',
        title: 'Old Website Design Notes',
        content: 'Initial design concepts and wireframes for the old website...',
        type: 'note',
        originalFolder: 'Projects',
        tags: ['design', 'website', 'old'],
        archivedAt: '2024-01-10T00:00:00Z',
        archivedReason: 'Project completed',
        originalCreatedAt: '2023-11-01T00:00:00Z',
        originalUpdatedAt: '2024-01-09T00:00:00Z'
      },
      {
        id: '2',
        title: 'Q4 2023 Marketing Campaign',
        content: 'Complete marketing campaign for Q4 2023 product launches...',
        type: 'project',
        originalFolder: 'Projects',
        tags: ['marketing', 'q4-2023', 'campaign'],
        archivedAt: '2024-01-05T00:00:00Z',
        archivedReason: 'Project completed successfully',
        originalCreatedAt: '2023-10-01T00:00:00Z',
        originalUpdatedAt: '2024-01-04T00:00:00Z'
      },
      {
        id: '3',
        title: 'Old Fitness Routine',
        content: 'Previous workout routine that I no longer follow...',
        type: 'area',
        originalFolder: 'Areas',
        tags: ['fitness', 'routine', 'old'],
        archivedAt: '2024-01-08T00:00:00Z',
        archivedReason: 'Replaced with new routine',
        originalCreatedAt: '2023-09-01T00:00:00Z',
        originalUpdatedAt: '2024-01-07T00:00:00Z'
      },
      {
        id: '4',
        title: 'Outdated Productivity Article',
        content: 'Article about productivity methods that are no longer relevant...',
        type: 'resource',
        originalFolder: 'Resources',
        tags: ['productivity', 'article', 'outdated'],
        archivedAt: '2024-01-12T00:00:00Z',
        archivedReason: 'Information outdated',
        originalCreatedAt: '2023-08-15T00:00:00Z',
        originalUpdatedAt: '2024-01-11T00:00:00Z'
      },
      {
        id: '5',
        title: 'Legacy Database Documentation',
        content: 'Documentation for the old database system that was migrated...',
        type: 'note',
        originalFolder: 'Projects',
        tags: ['database', 'documentation', 'legacy'],
        archivedAt: '2024-01-15T00:00:00Z',
        archivedReason: 'System migrated',
        originalCreatedAt: '2023-07-01T00:00:00Z',
        originalUpdatedAt: '2024-01-14T00:00:00Z'
      },
      {
        id: '6',
        title: 'Old Investment Strategy',
        content: 'Previous investment approach that I no longer follow...',
        type: 'area',
        originalFolder: 'Areas',
        tags: ['investment', 'strategy', 'old'],
        archivedAt: '2024-01-03T00:00:00Z',
        archivedReason: 'Strategy changed',
        originalCreatedAt: '2023-06-01T00:00:00Z',
        originalUpdatedAt: '2024-01-02T00:00:00Z'
      }
    ];
    
    setTimeout(() => {
      setArchivedItems(mockArchivedItems);
      setIsLoading(false);
    }, 1000);
  }, []);

  const filteredItems = archivedItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'note': return <FileText className="h-4 w-4" />;
      case 'project': return <FolderOpen className="h-4 w-4" />;
      case 'area': return <BookOpen className="h-4 w-4" />;
      case 'resource': return <BookOpen className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'note': return 'bg-blue-100 text-blue-800';
      case 'project': return 'bg-para-projects-100 text-para-projects-800';
      case 'area': return 'bg-para-areas-100 text-para-areas-800';
      case 'resource': return 'bg-para-resources-100 text-para-resources-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getOriginalFolderColor = (folder: string) => {
    switch (folder) {
      case 'Projects': return 'para-projects';
      case 'Areas': return 'para-areas';
      case 'Resources': return 'para-resources';
      case 'Archive': return 'para-archive';
      default: return 'bg-gray-100';
    }
  };

  const totalItems = archivedItems.length;
  const notesCount = archivedItems.filter(item => item.type === 'note').length;
  const projectsCount = archivedItems.filter(item => item.type === 'project').length;
  const areasCount = archivedItems.filter(item => item.type === 'area').length;
  const resourcesCount = archivedItems.filter(item => item.type === 'resource').length;

  if (isLoading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Archive</h1>
            <p className="text-muted-foreground">
              {filteredItems.length} of {totalItems} archived items
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            >
              {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total</p>
                <p className="text-2xl font-bold text-foreground">{totalItems}</p>
              </div>
              <Archive className="h-8 w-8 text-para-archive-500" />
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Notes</p>
                <p className="text-2xl font-bold text-foreground">{notesCount}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Projects</p>
                <p className="text-2xl font-bold text-foreground">{projectsCount}</p>
              </div>
              <FolderOpen className="h-8 w-8 text-para-projects-500" />
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Areas</p>
                <p className="text-2xl font-bold text-foreground">{areasCount}</p>
              </div>
              <BookOpen className="h-8 w-8 text-para-areas-500" />
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Resources</p>
                <p className="text-2xl font-bold text-foreground">{resourcesCount}</p>
              </div>
              <BookOpen className="h-8 w-8 text-para-resources-500" />
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search archived items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">All Types</option>
            <option value="note">Notes</option>
            <option value="project">Projects</option>
            <option value="area">Areas</option>
            <option value="resource">Resources</option>
          </select>
        </div>

        {/* Archived Items Grid/List */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">
              {searchQuery ? 'No archived items found matching your search.' : 'No archived items yet.'}
            </div>
            <p className="text-sm text-muted-foreground">
              Items are automatically archived when projects are completed or areas are replaced.
            </p>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
            : 'space-y-4'
          }>
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className={`bg-white border rounded-lg p-6 hover:shadow-md transition-shadow ${
                  viewMode === 'list' ? 'flex items-center justify-between' : ''
                }`}
              >
                {viewMode === 'grid' ? (
                  <>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(item.type)}`}>
                          {getTypeIcon(item.type)}
                          <span className="ml-1 capitalize">{item.type}</span>
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getOriginalFolderColor(item.originalFolder)}`}>
                          {item.originalFolder}
                        </span>
                      </div>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
                      {item.title}
                    </h3>
                    
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                      {item.content}
                    </p>
                    
                    <div className="bg-muted rounded-lg p-3 mb-4">
                      <div className="text-xs text-muted-foreground mb-1">Archived Reason</div>
                      <div className="text-sm text-foreground">{item.archivedReason}</div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-4">
                      {item.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded"
                        >
                          {tag}
                        </span>
                      ))}
                      {item.tags.length > 3 && (
                        <span className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded">
                          +{item.tags.length - 3}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Archived {formatDate(item.archivedAt)}
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <RotateCcw className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-foreground">{item.title}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(item.type)}`}>
                          {getTypeIcon(item.type)}
                          <span className="ml-1 capitalize">{item.type}</span>
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getOriginalFolderColor(item.originalFolder)}`}>
                          {item.originalFolder}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
                        {item.content}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Archived {formatDate(item.archivedAt)}
                        </div>
                        <div className="text-muted-foreground">
                          {item.archivedReason}
                        </div>
                        <div className="flex gap-1">
                          {item.tags.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-muted rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm">
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
