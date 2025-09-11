'use client';

import { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/button';
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Database, 
  Download,
  Upload,
  Trash2,
  Save,
  Eye,
  EyeOff,
  Moon,
  Sun,
  Monitor
} from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'data', label: 'Data & Privacy', icon: Database },
  ];

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-card border rounded-lg p-6">
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground mb-4">Profile Information</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          defaultValue="John Doe"
                          className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          defaultValue="john@example.com"
                          className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Bio
                        </label>
                        <textarea
                          defaultValue="Productivity enthusiast and PARA method advocate"
                          rows={3}
                          className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Timezone
                        </label>
                        <select className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring">
                          <option>UTC-8 (Pacific)</option>
                          <option>UTC-5 (Eastern)</option>
                          <option>UTC+0 (GMT)</option>
                          <option>UTC+1 (CET)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground mb-4">Notification Preferences</h2>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-foreground">Email Notifications</div>
                          <div className="text-sm text-muted-foreground">Receive updates via email</div>
                        </div>
                        <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary">
                          <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-foreground">Area Review Reminders</div>
                          <div className="text-sm text-muted-foreground">Get reminded to review your areas</div>
                        </div>
                        <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary">
                          <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-foreground">Project Deadlines</div>
                          <div className="text-sm text-muted-foreground">Notifications for upcoming deadlines</div>
                        </div>
                        <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-muted">
                          <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-1" />
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-foreground">Sync Status</div>
                          <div className="text-sm text-muted-foreground">Updates about sync status</div>
                        </div>
                        <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary">
                          <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground mb-4">Security Settings</h2>
                    
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium text-foreground mb-3">Change Password</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                              Current Password
                            </label>
                            <div className="relative">
                              <input
                                type={showPasswords ? 'text' : 'password'}
                                className="w-full px-3 py-2 pr-10 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                              />
                              <button
                                type="button"
                                onClick={() => setShowPasswords(!showPasswords)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                              >
                                {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </button>
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                              New Password
                            </label>
                            <input
                              type={showPasswords ? 'text' : 'password'}
                              className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                              Confirm New Password
                            </label>
                            <input
                              type={showPasswords ? 'text' : 'password'}
                              className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium text-foreground mb-3">Two-Factor Authentication</h3>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-foreground">2FA Status</div>
                            <div className="text-sm text-muted-foreground">Add an extra layer of security</div>
                          </div>
                          <Button variant="outline">Enable 2FA</Button>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium text-foreground mb-3">Active Sessions</h3>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <div className="font-medium text-foreground">Current Session</div>
                              <div className="text-sm text-muted-foreground">Chrome on macOS • San Francisco, CA</div>
                            </div>
                            <Button variant="outline" size="sm">Revoke</Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'appearance' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground mb-4">Appearance Settings</h2>
                    
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium text-foreground mb-3">Theme</h3>
                        <div className="grid grid-cols-3 gap-4">
                          <button
                            onClick={() => setIsDarkMode(false)}
                            className={`p-4 border rounded-lg text-center ${
                              !isDarkMode ? 'border-primary bg-primary/10' : 'border-input'
                            }`}
                          >
                            <Sun className="h-6 w-6 mx-auto mb-2" />
                            <div className="font-medium">Light</div>
                          </button>
                          
                          <button
                            onClick={() => setIsDarkMode(true)}
                            className={`p-4 border rounded-lg text-center ${
                              isDarkMode ? 'border-primary bg-primary/10' : 'border-input'
                            }`}
                          >
                            <Moon className="h-6 w-6 mx-auto mb-2" />
                            <div className="font-medium">Dark</div>
                          </button>
                          
                          <button className="p-4 border rounded-lg text-center border-input">
                            <Monitor className="h-6 w-6 mx-auto mb-2" />
                            <div className="font-medium">System</div>
                          </button>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium text-foreground mb-3">Font Size</h3>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-muted-foreground">Small</span>
                          <input
                            type="range"
                            min="12"
                            max="18"
                            defaultValue="14"
                            className="flex-1"
                          />
                          <span className="text-sm text-muted-foreground">Large</span>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium text-foreground mb-3">Compact Mode</h3>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-foreground">Use Compact Layout</div>
                            <div className="text-sm text-muted-foreground">Reduce spacing for more content</div>
                          </div>
                          <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-muted">
                            <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-1" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'data' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground mb-4">Data & Privacy</h2>
                    
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium text-foreground mb-3">Export Data</h3>
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <div className="font-medium text-foreground">Download Your Data</div>
                            <div className="text-sm text-muted-foreground">Export all your notes, projects, and settings</div>
                          </div>
                          <Button variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Export
                          </Button>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium text-foreground mb-3">Import Data</h3>
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <div className="font-medium text-foreground">Import from Another App</div>
                            <div className="text-sm text-muted-foreground">Import notes from Notion, Obsidian, or other apps</div>
                          </div>
                          <Button variant="outline">
                            <Upload className="h-4 w-4 mr-2" />
                            Import
                          </Button>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium text-foreground mb-3">Sync Settings</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-foreground">Auto-sync</div>
                              <div className="text-sm text-muted-foreground">Automatically sync changes across devices</div>
                            </div>
                            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary">
                              <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
                            </button>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-foreground">Offline Mode</div>
                              <div className="text-sm text-muted-foreground">Work offline and sync when online</div>
                            </div>
                            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary">
                              <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border-t pt-6">
                        <h3 className="text-lg font-medium text-foreground mb-3 text-red-600">Danger Zone</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
                            <div>
                              <div className="font-medium text-red-900">Delete Account</div>
                              <div className="text-sm text-red-700">Permanently delete your account and all data</div>
                            </div>
                            <Button variant="destructive">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Account
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="flex justify-end pt-6 border-t">
                <Button onClick={handleSave} disabled={isSaving} className="para-projects">
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
