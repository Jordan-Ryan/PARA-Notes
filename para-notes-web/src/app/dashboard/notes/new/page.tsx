'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/button';
import { 
  Save, 
  ArrowLeft, 
  MoreVertical,
  Tag,
  FolderOpen,
  Lock,
  Eye,
  EyeOff,
  Download,
  Share,
  Archive
} from 'lucide-react';
import Link from 'next/link';

interface NoteFormData {
  title: string;
  content: string;
  folder: string;
  tags: string[];
  isEncrypted: boolean;
  encryptionPassphrase: string;
}

export default function NewNotePage() {
  const router = useRouter();
  const [formData, setFormData] = useState<NoteFormData>({
    title: '',
    content: '',
    folder: 'Projects',
    tags: [],
    isEncrypted: false,
    encryptionPassphrase: ''
  });
  const [newTag, setNewTag] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showPassphrase, setShowPassphrase] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const folders = [
    { value: 'Projects', label: 'Projects', color: 'para-projects' },
    { value: 'Areas', label: 'Areas', color: 'para-areas' },
    { value: 'Resources', label: 'Resources', color: 'para-resources' },
    { value: 'Archive', label: 'Archive', color: 'para-archive' }
  ];

  const handleInputChange = (field: keyof NoteFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      handleInputChange('tags', [...formData.tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    handleInputChange('tags', formData.tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock save logic
    console.log('Saving note:', formData);
    
    setIsSaving(false);
    setHasUnsavedChanges(false);
    router.push('/dashboard/notes');
  };

  const handleSaveAndContinue = async () => {
    await handleSave();
    // Reset form for new note
    setFormData({
      title: '',
      content: '',
      folder: 'Projects',
      tags: [],
      isEncrypted: false,
      encryptionPassphrase: ''
    });
  };

  // Warn user about unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/notes">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Notes
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-foreground">New Note</h1>
              <p className="text-sm text-muted-foreground">
                {hasUnsavedChanges ? 'Unsaved changes' : 'All changes saved'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Share className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Note Form */}
        <div className="bg-white border rounded-lg p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter note title..."
              className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring text-lg font-medium"
            />
          </div>

          {/* Folder Selection */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Folder
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {folders.map((folder) => (
                <button
                  key={folder.value}
                  onClick={() => handleInputChange('folder', folder.value)}
                  className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                    formData.folder === folder.value
                      ? `${folder.color} border-current`
                      : 'border-input hover:bg-muted'
                  }`}
                >
                  <FolderOpen className="h-4 w-4 mx-auto mb-1" />
                  {folder.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Tags
            </label>
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Add a tag..."
                  className="flex-1 px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <Button onClick={handleAddTag} disabled={!newTag.trim()}>
                  <Tag className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
              
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-muted text-muted-foreground rounded-md text-sm"
                    >
                      {tag}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-foreground"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Encryption */}
          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <label className="block text-sm font-medium text-foreground">
                  Encryption
                </label>
                <p className="text-xs text-muted-foreground">
                  Encrypt this note for additional security
                </p>
              </div>
              <button
                onClick={() => handleInputChange('isEncrypted', !formData.isEncrypted)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  formData.isEncrypted ? 'bg-primary' : 'bg-muted'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    formData.isEncrypted ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            
            {formData.isEncrypted && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Encryption Passphrase
                </label>
                <div className="relative">
                  <input
                    type={showPassphrase ? 'text' : 'password'}
                    value={formData.encryptionPassphrase}
                    onChange={(e) => handleInputChange('encryptionPassphrase', e.target.value)}
                    placeholder="Enter passphrase..."
                    className="w-full px-3 py-2 pr-10 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassphrase(!showPassphrase)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassphrase ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  <Lock className="h-3 w-3 inline mr-1" />
                  This note will be encrypted locally before saving
                </p>
              </div>
            )}
          </div>

          {/* Content Editor */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Content
            </label>
            <div className="border border-input rounded-md">
              <div className="border-b border-input p-2 bg-muted/50">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Rich text editor will be integrated here</span>
                  <div className="flex gap-1 ml-auto">
                    <button className="p-1 hover:bg-muted rounded">B</button>
                    <button className="p-1 hover:bg-muted rounded">I</button>
                    <button className="p-1 hover:bg-muted rounded">U</button>
                    <button className="p-1 hover:bg-muted rounded">•</button>
                    <button className="p-1 hover:bg-muted rounded">1.</button>
                  </div>
                </div>
              </div>
              <textarea
                value={formData.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                placeholder="Start writing your note..."
                className="w-full p-4 border-0 rounded-b-md bg-background focus:outline-none resize-none min-h-[400px]"
                style={{ fontFamily: 'var(--font-mono)' }}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              onClick={handleSave}
              disabled={!formData.title.trim() || isSaving}
              className="para-projects"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Note'}
            </Button>
            
            <Button
              onClick={handleSaveAndContinue}
              disabled={!formData.title.trim() || isSaving}
              variant="outline"
            >
              Save & New
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Archive className="h-4 w-4 mr-2" />
              Archive
            </Button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
