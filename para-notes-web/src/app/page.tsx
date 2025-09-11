import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/button';
import { SetupRequired } from '@/components/features/auth/SetupRequired';
import { 
  FolderOpen, 
  Target, 
  BookOpen, 
  FileText, 
  Plus, 
  TrendingUp, 
  Calendar,
  CheckCircle,
  Clock,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function Home() {
  // Check if Supabase is properly configured
  const supabaseUrl = process.env['NEXT_PUBLIC_SUPABASE_URL'];
  const supabaseAnonKey = process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY'];
  
  const isSupabaseConfigured = supabaseUrl && 
    supabaseAnonKey && 
    !supabaseUrl.includes('placeholder') && 
    !supabaseAnonKey.includes('placeholder');

  // Show setup required message if Supabase is not configured
  if (!isSupabaseConfigured) {
    return <SetupRequired />;
  }

  return (
    <AppShell>
      <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100">
        <div className="space-y-8">
          {/* Hero Section */}
          <div className="text-center py-8 md:py-12 px-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-600 text-sm font-medium mb-4 md:mb-6">
              <Sparkles className="h-4 w-4" />
              Welcome to PARA Notes
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 md:mb-6 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent leading-tight">
              Organize Your Life
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-6 md:mb-8 px-4">
              The PARA method helps you organize information by actionability: 
              <span className="font-semibold text-gray-900"> Projects</span>, 
              <span className="font-semibold text-gray-900"> Areas</span>, 
              <span className="font-semibold text-gray-900"> Resources</span>, and 
              <span className="font-semibold text-gray-900"> Archive</span>.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center px-4">
              <Button size="lg" className="bg-gray-900 text-white hover:bg-gray-800 px-6 md:px-8 py-3 text-sm md:text-base w-full sm:w-auto rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="border border-gray-300 bg-white text-gray-900 hover:bg-gray-50 px-6 md:px-8 py-3 text-sm md:text-base w-full sm:w-auto rounded-lg">
                Learn More
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 px-4">
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-6 group hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-blue-100">
                  <FolderOpen className="h-6 w-6 text-blue-600" />
                </div>
                <span className="text-2xl font-bold text-gray-900">12</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Active Projects</h3>
              <p className="text-sm text-gray-600">Outcomes with deadlines</p>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-6 group hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-green-100">
                  <Target className="h-6 w-6 text-green-600" />
                </div>
                <span className="text-2xl font-bold text-gray-900">8</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Areas</h3>
              <p className="text-sm text-gray-600">Standards to maintain</p>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-6 group hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-yellow-100">
                  <BookOpen className="h-6 w-6 text-yellow-600" />
                </div>
                <span className="text-2xl font-bold text-gray-900">24</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Resources</h3>
              <p className="text-sm text-gray-600">Topics to reference</p>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-6 group hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-gray-100">
                  <FileText className="h-6 w-6 text-gray-600" />
                </div>
                <span className="text-2xl font-bold text-gray-900">156</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Notes</h3>
              <p className="text-sm text-gray-600">Inactive items</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 px-4">
            <Button className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 h-32 flex-col space-y-3 cursor-pointer hover:border-blue-300 hover:-translate-y-0.5 group">
              <div className="p-3 rounded-xl bg-blue-100 group-hover:bg-blue-200 transition-colors">
                <Plus className="h-6 w-6 text-blue-600" />
              </div>
              <span className="font-semibold text-gray-900">New Project</span>
              <span className="text-xs opacity-75 text-gray-600">Create a new project</span>
            </Button>
            
            <Button className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 h-32 flex-col space-y-3 cursor-pointer hover:border-green-300 hover:-translate-y-0.5 group">
              <div className="p-3 rounded-xl bg-green-100 group-hover:bg-green-200 transition-colors">
                <Plus className="h-6 w-6 text-green-600" />
              </div>
              <span className="font-semibold text-gray-900">New Area</span>
              <span className="text-xs opacity-75 text-gray-600">Define a new area</span>
            </Button>
            
            <Button className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 h-32 flex-col space-y-3 cursor-pointer hover:border-yellow-300 hover:-translate-y-0.5 group">
              <div className="p-3 rounded-xl bg-yellow-100 group-hover:bg-yellow-200 transition-colors">
                <Plus className="h-6 w-6 text-yellow-600" />
              </div>
              <span className="font-semibold text-gray-900">New Resource</span>
              <span className="text-xs opacity-75 text-gray-600">Add a resource</span>
            </Button>
            
            <Button className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 h-32 flex-col space-y-3 cursor-pointer hover:border-gray-300 hover:-translate-y-0.5 group">
              <div className="p-3 rounded-xl bg-gray-100 group-hover:bg-gray-200 transition-colors">
                <Plus className="h-6 w-6 text-gray-600" />
              </div>
              <span className="font-semibold text-gray-900">New Note</span>
              <span className="text-xs opacity-75 text-gray-600">Create a note</span>
            </Button>
          </div>

          {/* Activity & Deadlines */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 px-4">
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-blue-100">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Recent Activity</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="p-1 rounded-full bg-green-100 mt-0.5">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">Completed "Website Redesign" project</p>
                    <p className="text-xs text-gray-600 mt-1">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="p-1 rounded-full bg-yellow-100 mt-0.5">
                    <Clock className="h-4 w-4 text-yellow-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">Added new note to "Health & Fitness" area</p>
                    <p className="text-xs text-gray-600 mt-1">4 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="p-1 rounded-full bg-blue-100 mt-0.5">
                    <FileText className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">Created "Investment Strategies" resource</p>
                    <p className="text-xs text-gray-600 mt-1">1 day ago</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-blue-100">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Upcoming Deadlines</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Q1 Report</p>
                    <p className="text-xs text-gray-600">Marketing Department</p>
                  </div>
                  <span className="px-2 py-1 text-xs font-medium text-red-600 bg-red-50 rounded-full">
                    Due in 2 days
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Team Meeting</p>
                    <p className="text-xs text-gray-600">Weekly Standup</p>
                  </div>
                  <span className="px-2 py-1 text-xs font-medium text-yellow-600 bg-yellow-50 rounded-full">
                    Due in 5 days
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Budget Review</p>
                    <p className="text-xs text-gray-600">Finance Team</p>
                  </div>
                  <span className="px-2 py-1 text-xs font-medium text-green-600 bg-green-50 rounded-full">
                    Due in 1 week
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}