'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase/client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) setError(error.message);
    else setSent(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-2xl font-semibold">Forgot password</h1>
        <form className="space-y-4" onSubmit={onSubmit}>
          <label className="block text-sm">
            Email
            <input className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          {error && <p className="text-sm text-destructive">{error}</p>}
          {sent && <p className="text-sm text-emerald-600">Check your email for a reset link.</p>}
          <Button type="submit" className="w-full">Send reset link</Button>
        </form>
      </div>
    </div>
  );
}


