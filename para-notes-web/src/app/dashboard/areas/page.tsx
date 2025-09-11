'use client';

import { useState, useEffect } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  Search, 
  Calendar,
  Clock,
  CheckCircle,
  Edit,
  Trash2,
  Archive,
  Target,
  AlertCircle,
  TrendingUp,
  BookOpen
} from 'lucide-react';
import Link from 'next/link';

interface Area {
  id: string;
  name: string;
  description: string;
  lastReviewedAt?: string;
  nextReviewAt: string;
  reviewFrequency: 'weekly' | 'monthly' | 'quarterly';
  notes: number;
  projects: number;
  isOverdue: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AreasPage() {
  const [areas, setAreas] = useState<Area[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for now
  useEffect(() => {
    const mockAreas: Area[] = [
      {
        id: '1',
        name: 'Health & Fitness',
        description: 'Maintaining physical and mental well-being through exercise, nutrition, and self-care',
        lastReviewedAt: '2024-01-10T00:00:00Z',
        nextReviewAt: '2024-01-24T00:00:00Z',
        reviewFrequency: 'weekly',
        notes: 15,
        projects: 2,
        isOverdue: false,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-16T10:00:00Z'
      },
      {
        id: '2',
        name: 'Career Development',
        description: 'Professional growth, skill development, and career advancement',
        lastReviewedAt: '2024-01-05T00:00:00Z',
        nextReviewAt: '2024-02-05T00:00:00Z',
        reviewFrequency: 'monthly',
        notes: 8,
        projects: 1,
        isOverdue: false,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-15T14:30:00Z'
      },
      {
        id: '3',
        name: 'Financial Management',
        description: 'Budgeting, investing, and long-term financial planning',
        lastReviewedAt: '2023-12-15T00:00:00Z',
        nextReviewAt: '2024-01-15T00:00:00Z',
        reviewFrequency: 'monthly',
        notes: 12,
        projects: 0,
        isOverdue: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-10T09:00:00Z'
      },
      {
        id: '4',
        name: 'Relationships',
        description: 'Family, friends, and personal relationships',
        lastReviewedAt: '2024-01-12T00:00:00Z',
        nextReviewAt: '2024-01-19T00:00:00Z',
        reviewFrequency: 'weekly',
        notes: 6,
        projects: 1,
        isOverdue: false,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-12T16:00:00Z'
      },
      {
        id: '5',
        name: 'Learning & Education',
        description: 'Continuous learning, skill acquisition, and personal development',
        lastReviewedAt: '2023-12-01T00:00:00Z',
        nextReviewAt: '2024-03-01T00:00:00Z',
        reviewFrequency: 'quarterly',
        notes: 20,
        projects: 3,
        isOverdue: false,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-08T11:00:00Z'
      }
    ];
    
    setTimeout(() => {
      setAreas(mockAreas);
      setIsLoading(false);
    }, 1000);
  }, []);

  const filteredAreas = areas.filter(area => {
    return area.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           area.description.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysUntilReview = (nextReviewAt: string) => {
    const today = new Date();
    const review = new Date(nextReviewAt);
    const diffTime = review.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getReviewStatus = (area: Area) => {
    const daysUntil = getDaysUntilReview(area.nextReviewAt);
    
    if (area.isOverdue) {
      return { status: 'overdue', color: 'text-red-600', bgColor: 'bg-red-50' };
    } else if (daysUntil <= 3) {
      return { status: 'due-soon', color: 'text-orange-600', bgColor: 'bg-orange-50' };
    } else if (daysUntil <= 7) {
      return { status: 'upcoming', color: 'text-yellow-600', bgColor: 'bg-yellow-50' };
    } else {
      return { status: 'on-track', color: 'text-green-600', bgColor: 'bg-green-50' };
    }
  };

  const overdueAreas = areas.filter(area => area.isOverdue).length;
  const dueSoonAreas = areas.filter(area => {
    const daysUntil = getDaysUntilReview(area.nextReviewAt);
    return !area.isOverdue && daysUntil <= 7;
  }).length;
  const totalAreas = areas.length;

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
            <h1 className="text-3xl font-bold text-gray-900">Areas</h1>
            <p className="text-gray-600">
              {filteredAreas.length} of {areas.length} areas
            </p>
          </div>
          
          <Link href="/dashboard/areas/new">
            <Button className="para-areas">
              <Plus className="h-4 w-4 mr-2" />
              New Area
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Areas</p>
                <p className="text-2xl font-bold text-gray-900">{totalAreas}</p>
              </div>
              <BookOpen className="h-8 w-8 text-para-areas-500" />
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overdue Reviews</p>
                <p className="text-2xl font-bold text-gray-900">{overdueAreas}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Due Soon</p>
                <p className="text-2xl font-bold text-gray-900">{dueSoonAreas}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">On Track</p>
                <p className="text-2xl font-bold text-gray-900">{totalAreas - overdueAreas - dueSoonAreas}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-600" />
            <input
              type="text"
              placeholder="Search areas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        {/* Areas List */}
        {filteredAreas.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-600 mb-4">
              {searchQuery ? 'No areas found matching your search.' : 'No areas yet.'}
            </div>
            <Link href="/dashboard/areas/new">
              <Button className="para-areas">
                <Plus className="h-4 w-4 mr-2" />
                Create your first area
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAreas.map((area) => {
              const reviewStatus = getReviewStatus(area);
              const daysUntil = getDaysUntilReview(area.nextReviewAt);
              
              return (
                <div key={area.id} className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{area.name}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${reviewStatus.bgColor} ${reviewStatus.color}`}>
                          {reviewStatus.status === 'overdue' ? 'Overdue' :
                           reviewStatus.status === 'due-soon' ? 'Due Soon' :
                           reviewStatus.status === 'upcoming' ? 'Upcoming' : 'On Track'}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-4">{area.description}</p>
                      
                      <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {area.lastReviewedAt ? `Last reviewed ${formatDate(area.lastReviewedAt)}` : 'Never reviewed'}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {area.notes} notes
                        </div>
                        <div className="flex items-center gap-1">
                          <Target className="h-4 w-4" />
                          {area.projects} projects
                        </div>
                        <div className="flex items-center gap-1">
                          <CheckCircle className="h-4 w-4" />
                          {area.reviewFrequency} reviews
                        </div>
                      </div>
                      
                      <div className="bg-muted rounded-lg p-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Next Review</span>
                          <span className={`font-medium ${reviewStatus.color}`}>
                            {area.isOverdue ? 'Overdue' : 
                             daysUntil === 0 ? 'Today' :
                             daysUntil === 1 ? 'Tomorrow' :
                             `In ${daysUntil} days`}
                          </span>
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          {formatDate(area.nextReviewAt)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-1 ml-4">
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
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppShell>
  );
}
