// app/dashboard/page.js
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session) {
        router.push('/login');
      } else {
        setUser(data.session.user);
      }
    };

    getSession();
  }, []);

  return (
    <div>
      {user ? (
        <div className="min-h-screen flex items-center justify-center">
          <h1 className="text-4xl">Welcome to the Dashboard, {user.email}</h1>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
