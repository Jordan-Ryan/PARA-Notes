'use client';

import { useState, useEffect } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  Search, 
  Grid, 
  List, 
  MoreVertical,
  Edit,
  Trash2,
  Archive,
  Clock
} from 'lucide-react';
import Link from 'next/link';

interface Note {
  id: string;
  title: string;
  content: string;
  folder: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  isEncrypted: boolean;
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterFolder, setFilterFolder] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for now
  useEffect(() => {
    const mockNotes: Note[] = [
      {
        id: '1',
        title: 'Meeting Notes - Q1 Planning',
        content: 'Discussed quarterly goals and resource allocation...',
        folder: 'Projects',
        tags: ['meeting', 'planning', 'q1'],
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T14:30:00Z',
        isEncrypted: false
      },
      {
        id: '2',
        title: 'Health & Fitness Routine',
        content: 'Updated workout schedule and meal planning...',
        folder: 'Areas',
        tags: ['health', 'fitness', 'routine'],
        createdAt: '2024-01-14T08:00:00Z',
        updatedAt: '2024-01-16T09:15:00Z',
        isEncrypted: false
      },
      {
        id: '3',
        title: 'Investment Research - Tech Stocks',
        content: 'Analysis of emerging tech companies...',
        folder: 'Resources',
        tags: ['investment', 'research', 'tech'],
        createdAt: '2024-01-13T16:00:00Z',
        updatedAt: '2024-01-15T11:45:00Z',
        isEncrypted: true
      }
    ];
    
    setTimeout(() => {
      setNotes(mockNotes);
      setIsLoading(false);
    }, 1000);
  }, []);

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFolder = filterFolder === 'all' || note.folder === filterFolder;
    
    return matchesSearch && matchesFolder;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getFolderColor = (folder: string) => {
    switch (folder) {
      case 'Projects': return 'para-projects';
      case 'Areas': return 'para-areas';
      case 'Resources': return 'para-resources';
      case 'Archive': return 'para-archive';
      default: return 'bg-gray-100';
    }
  };

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
            <h1 className="text-3xl font-bold text-gray-900">Notes</h1>
            <p className="text-gray-600">
              {filteredNotes.length} of {notes.length} notes
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
            
            <Link href="/dashboard/notes/new">
              <Button className="para-projects">
                <Plus className="h-4 w-4 mr-2" />
                New Note
              </Button>
            </Link>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-600" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          
          <select
            value={filterFolder}
            onChange={(e) => setFilterFolder(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">All Folders</option>
            <option value="Projects">Projects</option>
            <option value="Areas">Areas</option>
            <option value="Resources">Resources</option>
            <option value="Archive">Archive</option>
          </select>
        </div>

        {/* Notes Grid/List */}
        {filteredNotes.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-600 mb-4">
              {searchQuery ? 'No notes found matching your search.' : 'No notes yet.'}
            </div>
            <Link href="/dashboard/notes/new">
              <Button className="para-projects">
                <Plus className="h-4 w-4 mr-2" />
                Create your first note
              </Button>
            </Link>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
            : 'space-y-4'
          }>
            {filteredNotes.map((note) => (
              <div
                key={note.id}
                className={`bg-white border rounded-lg p-6 hover:shadow-md transition-shadow ${
                  viewMode === 'list' ? 'flex items-center justify-between' : ''
                }`}
              >
                {viewMode === 'grid' ? (
                  <>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getFolderColor(note.folder)}`}>
                          {note.folder}
                        </span>
                        {note.isEncrypted && (
                          <span className="text-xs text-gray-600">🔒</span>
                        )}
                      </div>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {note.title}
                    </h3>
                    
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                      {note.content}
                    </p>
                    
                    <div className="flex flex-wrap gap-1 mb-4">
                      {note.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs bg-muted text-gray-600 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                      {note.tags.length > 3 && (
                        <span className="px-2 py-1 text-xs bg-muted text-gray-600 rounded">
                          +{note.tags.length - 3}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDate(note.updatedAt)}
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <Edit className="h-3 w-3" />
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
                        <h3 className="font-semibold text-gray-900">{note.title}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getFolderColor(note.folder)}`}>
                          {note.folder}
                        </span>
                        {note.isEncrypted && (
                          <span className="text-xs text-gray-600">🔒</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-1">
                        {note.content}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDate(note.updatedAt)}
                        </div>
                        <div className="flex gap-1">
                          {note.tags.slice(0, 3).map((tag) => (
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
