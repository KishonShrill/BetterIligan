'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, LogIn } from 'lucide-react';
import { adminLogin } from '@/actions/bangonAdmin';

export default function LoginForm() {
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        try {
            const result = await adminLogin(new FormData(e.currentTarget));
            if (result.success) {
                router.replace('/bangon-iligan/admin');
                router.refresh();
            } else {
                setError(result.error);
                setSubmitting(false);
            }
        } catch {
            setError('Something went wrong. Please try again.');
            setSubmitting(false);
        }
    }

    return (
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div className="space-y-1.5">
                <label htmlFor="password" className="text-sm font-bold text-slate-700">
                    Password
                </label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    autoFocus
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                />
            </div>
            {error && <p className="text-sm font-medium text-red-600">{error}</p>}
            <button
                type="submit"
                disabled={submitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 font-bold text-white transition-colors hover:bg-slate-800 disabled:opacity-60"
            >
                {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <LogIn className="h-5 w-5" />}
                Sign in
            </button>
        </form>
    );
}
