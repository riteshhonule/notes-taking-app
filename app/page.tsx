'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/store';

export default function Page() {
  const router = useRouter();
  const { token } = useAuth();

  useEffect(() => {
    if (token) {
      router.push('/notes');
    } else {
      router.push('/auth/signin');
    }
  }, [token, router]);

  return null;
}
