'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase/client';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // If there's no active session for password recovery, supabase will handle it.
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    const { error } = await supabase.auth.updateUser({ password });
    if (error) setError(error.message);
    else setSuccess(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-2xl font-semibold">Reset password</h1>
        <form className="space-y-4" onSubmit={onSubmit}>
          <label className="block text-sm">
            New password
            <input className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>
          <label className="block text-sm">
            Confirm password
            <input className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2" type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} />
          </label>
          {error && <p className="text-sm text-destructive">{error}</p>}
          {success && <p className="text-sm text-emerald-600">Password updated. You can close this tab.</p>}
          <Button type="submit" className="w-full">Update password</Button>
        </form>
      </div>
    </div>
  );
}


