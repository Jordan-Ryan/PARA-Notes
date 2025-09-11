"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, Settings, ExternalLink } from 'lucide-react';

export function SetupRequired() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="p-3 rounded-full bg-yellow-100">
            <AlertCircle className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Setup Required
        </h1>
        
        <p className="text-gray-600 mb-6 leading-relaxed">
          This app requires Supabase configuration to function properly. 
          Please configure your environment variables in Vercel or contact your administrator.
        </p>
        
        <div className="space-y-3">
          <Button 
            className="w-full bg-gray-900 text-white hover:bg-gray-800"
            onClick={() => window.open('https://vercel.com/docs/environment-variables', '_blank')}
          >
            <Settings className="h-4 w-4 mr-2" />
            Configure Environment Variables
            <ExternalLink className="h-4 w-4 ml-2" />
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
        
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Required Variables:</h3>
          <div className="text-xs text-gray-600 space-y-1">
            <div>• NEXT_PUBLIC_SUPABASE_URL</div>
            <div>• NEXT_PUBLIC_SUPABASE_ANON_KEY</div>
            <div>• NEXT_PUBLIC_APP_URL</div>
          </div>
        </div>
      </div>
    </div>
  );
}
