'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/store';
import { LogOut } from 'lucide-react';

export default function Header() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/auth/signin');
  };

  return (
    <header className="bg-gradient-to-r from-blue-400 to-cyan-400 text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/notes" className="text-2xl font-bold">
          Keep Notes
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            href="/notes"
            className="hover:opacity-80 transition text-sm font-medium"
          >
            Notes
          </Link>
          <span className="text-sm font-medium">{user?.user_name}</span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition text-sm font-medium"
          >
            <LogOut size={16} /> Logout
          </button>
        </nav>
      </div>
    </header>
  );
}
