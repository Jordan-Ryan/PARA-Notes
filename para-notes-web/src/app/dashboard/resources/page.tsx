'use client';

import { useState, useEffect } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
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
  ExternalLink,
  BookOpen,
  FileText,
  Link as LinkIcon,
  Star,
  StarOff
} from 'lucide-react';
import Link from 'next/link';

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'article' | 'book' | 'video' | 'podcast' | 'website' | 'document' | 'other';
  url?: string;
  tags: string[];
  isFavorite: boolean;
  rating?: number;
  notes: string;
  createdAt: string;
  updatedAt: string;
  lastAccessedAt?: string;
}

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [tagFilter, setTagFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for now
  useEffect(() => {
    const mockResources: Resource[] = [
      {
        id: '1',
        title: 'Getting Things Done by David Allen',
        description: 'The classic productivity methodology that forms the foundation of the PARA system',
        type: 'book',
        url: 'https://gettingthingsdone.com',
        tags: ['productivity', 'gtd', 'methodology'],
        isFavorite: true,
        rating: 5,
        notes: 'Essential reading for anyone serious about productivity. The GTD methodology is the foundation of PARA.',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-16T10:00:00Z',
        lastAccessedAt: '2024-01-15T14:30:00Z'
      },
      {
        id: '2',
        title: 'Building a Second Brain - Tiago Forte',
        description: 'A comprehensive guide to building a personal knowledge management system',
        type: 'book',
        url: 'https://www.buildingasecondbrain.com',
        tags: ['productivity', 'knowledge-management', 'para'],
        isFavorite: true,
        rating: 5,
        notes: 'Great follow-up to GTD. The PARA method is explained in detail here.',
        createdAt: '2024-01-02T00:00:00Z',
        updatedAt: '2024-01-16T09:00:00Z',
        lastAccessedAt: '2024-01-14T16:00:00Z'
      },
      {
        id: '3',
        title: 'The PARA Method: A Universal System for Organizing Digital Information',
        description: 'Tiago Forte\'s original blog post introducing the PARA method',
        type: 'article',
        url: 'https://fortelabs.co/blog/para/',
        tags: ['para', 'organization', 'digital'],
        isFavorite: false,
        rating: 4,
        notes: 'The original article that started it all. Great for understanding the philosophy behind PARA.',
        createdAt: '2024-01-03T00:00:00Z',
        updatedAt: '2024-01-15T11:00:00Z',
        lastAccessedAt: '2024-01-12T10:00:00Z'
      },
      {
        id: '4',
        title: 'Notion PARA Template',
        description: 'A ready-to-use Notion template implementing the PARA system',
        type: 'website',
        url: 'https://www.notion.so/para-template',
        tags: ['notion', 'template', 'para', 'tools'],
        isFavorite: false,
        rating: 4,
        notes: 'Good starting point for implementing PARA in Notion, though I prefer custom solutions.',
        createdAt: '2024-01-04T00:00:00Z',
        updatedAt: '2024-01-14T15:00:00Z',
        lastAccessedAt: '2024-01-10T08:00:00Z'
      },
      {
        id: '5',
        title: 'Deep Work by Cal Newport',
        description: 'Rules for focused success in a distracted world',
        type: 'book',
        url: 'https://calnewport.com/books/deep-work/',
        tags: ['productivity', 'focus', 'work'],
        isFavorite: true,
        rating: 5,
        notes: 'Excellent book on maintaining focus and doing meaningful work. Complements PARA well.',
        createdAt: '2024-01-05T00:00:00Z',
        updatedAt: '2024-01-16T12:00:00Z',
        lastAccessedAt: '2024-01-13T09:00:00Z'
      },
      {
        id: '6',
        title: 'The Productivity Show Podcast',
        description: 'Weekly podcast about productivity, organization, and personal effectiveness',
        type: 'podcast',
        url: 'https://www.productivityshow.com',
        tags: ['podcast', 'productivity', 'interviews'],
        isFavorite: false,
        rating: 4,
        notes: 'Great interviews with productivity experts. Episodes on PARA and GTD are particularly valuable.',
        createdAt: '2024-01-06T00:00:00Z',
        updatedAt: '2024-01-15T13:00:00Z',
        lastAccessedAt: '2024-01-11T17:00:00Z'
      }
    ];
    
    setTimeout(() => {
      setResources(mockResources);
      setIsLoading(false);
    }, 1000);
  }, []);

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.notes.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesType = typeFilter === 'all' || resource.type === typeFilter;
    const matchesTag = tagFilter === 'all' || resource.tags.includes(tagFilter);
    
    return matchesSearch && matchesType && matchesTag;
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
      case 'book': return <BookOpen className="h-4 w-4" />;
      case 'article': return <FileText className="h-4 w-4" />;
      case 'video': return <ExternalLink className="h-4 w-4" />;
      case 'podcast': return <ExternalLink className="h-4 w-4" />;
      case 'website': return <LinkIcon className="h-4 w-4" />;
      case 'document': return <FileText className="h-4 w-4" />;
      default: return <ExternalLink className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'book': return 'bg-blue-100 text-blue-800';
      case 'article': return 'bg-green-100 text-green-800';
      case 'video': return 'bg-purple-100 text-purple-800';
      case 'podcast': return 'bg-orange-100 text-orange-800';
      case 'website': return 'bg-gray-100 text-gray-800';
      case 'document': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const allTags = Array.from(new Set(resources.flatMap(r => r.tags))).sort();
  const favoriteResources = resources.filter(r => r.isFavorite).length;
  const totalResources = resources.length;

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
            <h1 className="text-3xl font-bold text-gray-900">Resources</h1>
            <p className="text-gray-600">
              {filteredResources.length} of {totalResources} resources
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
            
            <Link href="/dashboard/resources/new">
              <Button className="para-resources">
                <Plus className="h-4 w-4 mr-2" />
                New Resource
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Resources</p>
                <p className="text-2xl font-bold text-gray-900">{totalResources}</p>
              </div>
              <BookOpen className="h-8 w-8 text-para-resources-500" />
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Favorites</p>
                <p className="text-2xl font-bold text-gray-900">{favoriteResources}</p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tags</p>
                <p className="text-2xl font-bold text-gray-900">{allTags.length}</p>
              </div>
              <Tag className="h-8 w-8 text-gray-600" />
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-600" />
            <input
              type="text"
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">All Types</option>
            <option value="book">Books</option>
            <option value="article">Articles</option>
            <option value="video">Videos</option>
            <option value="podcast">Podcasts</option>
            <option value="website">Websites</option>
            <option value="document">Documents</option>
            <option value="other">Other</option>
          </select>
          
          <select
            value={tagFilter}
            onChange={(e) => setTagFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">All Tags</option>
            {allTags.map(tag => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
        </div>

        {/* Resources Grid/List */}
        {filteredResources.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-600 mb-4">
              {searchQuery ? 'No resources found matching your search.' : 'No resources yet.'}
            </div>
            <Link href="/dashboard/resources/new">
              <Button className="para-resources">
                <Plus className="h-4 w-4 mr-2" />
                Add your first resource
              </Button>
            </Link>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
            : 'space-y-4'
          }>
            {filteredResources.map((resource) => (
              <div
                key={resource.id}
                className={`bg-white border rounded-lg p-6 hover:shadow-md transition-shadow ${
                  viewMode === 'list' ? 'flex items-center justify-between' : ''
                }`}
              >
                {viewMode === 'grid' ? (
                  <>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(resource.type)}`}>
                          {getTypeIcon(resource.type)}
                          <span className="ml-1 capitalize">{resource.type}</span>
                        </span>
                        {resource.isFavorite && (
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        )}
                      </div>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {resource.title}
                    </h3>
                    
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                      {resource.description}
                    </p>
                    
                    {resource.notes && (
                      <p className="text-xs text-gray-600 mb-4 line-clamp-2 italic">
                        "{resource.notes}"
                      </p>
                    )}
                    
                    <div className="flex flex-wrap gap-1 mb-4">
                      {resource.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs bg-muted text-gray-600 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                      {resource.tags.length > 3 && (
                        <span className="px-2 py-1 text-xs bg-muted text-gray-600 rounded">
                          +{resource.tags.length - 3}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {resource.lastAccessedAt ? formatDate(resource.lastAccessedAt) : 'Never accessed'}
                      </div>
                      {resource.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-500 fill-current" />
                          {resource.rating}
                        </div>
                      )}
                    </div>
                    
                    {resource.url && (
                      <div className="mt-4">
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary/80"
                        >
                          <ExternalLink className="h-3 w-3" />
                          Visit Resource
                        </a>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{resource.title}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(resource.type)}`}>
                          {getTypeIcon(resource.type)}
                          <span className="ml-1 capitalize">{resource.type}</span>
                        </span>
                        {resource.isFavorite && (
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-1">
                        {resource.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {resource.lastAccessedAt ? formatDate(resource.lastAccessedAt) : 'Never accessed'}
                        </div>
                        <div className="flex gap-1">
                          {resource.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-muted rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        {resource.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-yellow-500 fill-current" />
                            {resource.rating}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-1">
                      {resource.url && (
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-gray-600 hover:text-gray-900"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Archive className="h-4 w-4" />
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
