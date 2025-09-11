import React, { useState } from 'react';
import { SyncStatus } from '@/components/features/sync/SyncStatus';
import { Button } from '@/components/ui/button';
import { Menu, Search, Bell, User, Settings, Command, Plus } from 'lucide-react';
import Link from 'next/link';

export interface TopBarProps {
  onMenuClick: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onMenuClick }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search logic
    console.log('Searching for:', searchQuery);
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-white/95 backdrop-blur-xl px-4 lg:px-6">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onMenuClick}
          className="lg:hidden hover:bg-accent"
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        <div className="hidden lg:block">
          <h1 className="text-lg font-semibold text-foreground">
            Dashboard
          </h1>
        </div>
      </div>
      
      {/* Desktop Search Bar */}
      <div className="hidden lg:flex flex-1 max-w-lg mx-8">
        <form onSubmit={handleSearch} className="w-full">
          <div className="search-modern">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search notes, projects, areas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
              <kbd className="px-2 py-1 text-xs font-medium text-muted-foreground bg-muted/50 border border-border rounded-md">
                ⌘K
              </kbd>
            </div>
          </div>
        </form>
      </div>
      
      <div className="flex items-center space-x-2">
        {/* Mobile Search */}
        <Button 
          variant="ghost" 
          size="sm" 
          className="lg:hidden hover:bg-accent"
          onClick={() => setShowSearch(!showSearch)}
        >
          <Search className="h-4 w-4" />
        </Button>
        
        {/* Quick Add Button - Desktop */}
        <Button 
          variant="outline" 
          size="sm" 
          className="hidden lg:flex btn-outline hover:bg-accent"
        >
          <Plus className="h-4 w-4 mr-2" />
          Quick Add
        </Button>
        
        {/* Notifications */}
        <Button variant="ghost" size="sm" className="relative hover:bg-accent">
          <Bell className="h-4 w-4" />
          <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center font-medium">
            3
          </span>
        </Button>
        
        {/* User Menu */}
        <Button variant="ghost" size="sm" className="hover:bg-accent">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-4 w-4 text-primary" />
          </div>
        </Button>
        
        {/* Settings */}
        <Link href="/dashboard/settings">
          <Button variant="ghost" size="sm" className="hover:bg-accent">
            <Settings className="h-4 w-4" />
          </Button>
        </Link>

        {/* Sync Status - Desktop */}
        <div className="hidden lg:block">
          <SyncStatus />
        </div>
      </div>

      {/* Mobile Search Overlay */}
      {showSearch && (
        <div className="lg:hidden absolute top-16 left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-border p-4 z-50">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search notes, projects, areas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-modern pl-10 pr-4 w-full"
                autoFocus
              />
            </div>
          </form>
        </div>
      )}
    </header>
  );
};

export { TopBar };
