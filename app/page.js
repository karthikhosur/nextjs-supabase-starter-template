"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabaseClient';

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        router.push('/dashboard');
      } else {
        setUser(null);
      }
    };

    checkUser();
  }, [router]);

  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-4xl">Welcome to the Home Page</h1>
    </div>
  );
}
