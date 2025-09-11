'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';

type Provider = 'github' | 'google' | 'apple';

const providers: { id: Provider; label: string }[] = [
  { id: 'github', label: 'Continue with GitHub' },
  { id: 'google', label: 'Continue with Google' },
  { id: 'apple', label: 'Continue with Apple' },
];

export function OAuthButtons() {
  const [loading, setLoading] = useState<Provider | null>(null);

  const signInWith = async (provider: Provider) => {
    try {
      setLoading(provider);
      const redirectTo = `${window.location.origin}`;
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo },
      });
      if (error) throw error;
    } catch (err) {
      console.error('OAuth error', err);
      alert('Authentication failed. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-2">
      {providers.map((p) => (
        <Button key={p.id} type="button" variant="outline" className="w-full" onClick={() => signInWith(p.id)} isLoading={loading === p.id} disabled={!!loading}>
          {p.label}
        </Button>
      ))}
    </div>
  );
}


