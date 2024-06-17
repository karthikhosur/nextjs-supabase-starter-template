"use client";

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function Settings() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (data.session) {
        setUser(data.session.user);
      } else {
        router.push('/login');
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center">
      <div className="card w-full max-w-lg shadow-2xl bg-base-100">
        <div className="card-body">
          <h2 className="card-title text-center text-2xl font-bold">Settings</h2>
          <p className="text-center text-gray-500">Settings page content will go here.</p>
          <div className="form-control mt-6">
            <button onClick={() => router.push('/dashboard')} className="btn btn-primary">
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
