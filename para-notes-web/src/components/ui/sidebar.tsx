import React from 'react';
import { cn } from '@/lib/utils/cn';
import { Button } from './button';
import { 
  Home, 
  FileText, 
  FolderOpen, 
  BookOpen, 
  Archive, 
  Settings,
  X
} from 'lucide-react';

export interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  currentPath: string;
  className?: string;
}

const navigationItems = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Notes', href: '/notes', icon: FileText },
  { name: 'Projects', href: '/projects', icon: FolderOpen },
  { name: 'Areas', href: '/areas', icon: BookOpen },
  { name: 'Resources', href: '/resources', icon: BookOpen },
  { name: 'Archive', href: '/archive', icon: Archive },
  { name: 'Settings', href: '/settings', icon: Settings },
];

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onToggle,
  currentPath,
  className,
}) => {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <div
        className={cn(
          'fixed left-0 top-0 z-50 h-full w-72 transform bg-white/95 backdrop-blur-xl border-r border-gray-200 transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          className
        )}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <div className="w-6 h-6 bg-gradient-to-br from-primary to-primary/70 rounded-md"></div>
            </div>
            <h1 className="text-xl font-bold text-gray-900">PARA Notes</h1>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="lg:hidden hover:bg-accent"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 px-4 py-6">
          <ul className="space-y-2">
            {navigationItems.map((item) => {
              const isActive = currentPath === item.href;
              const Icon = item.icon;
              
              return (
                <li key={item.name}>
                  <Button
                    variant="ghost"
                    className={cn(
                      'w-full justify-start text-left h-12 px-4 rounded-xl transition-all duration-200 group',
                      isActive 
                        ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm' 
                        : 'hover:bg-accent hover:text-accent-foreground'
                    )}
                    onClick={() => {
                      // Handle navigation here
                      onToggle();
                    }}
                  >
                    <Icon className={cn(
                      "mr-3 h-5 w-5 transition-colors",
                      isActive ? "text-primary" : "text-gray-600 group-hover:text-accent-foreground"
                    )} />
                    <span className="font-medium">{item.name}</span>
                    {isActive && (
                      <div className="ml-auto w-2 h-2 bg-primary rounded-full"></div>
                    )}
                  </Button>
                </li>
              );
            })}
          </ul>
        </nav>
        
        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-600">
              PARA Notes v1.0.0
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs text-gray-600">Online</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export { Sidebar };
