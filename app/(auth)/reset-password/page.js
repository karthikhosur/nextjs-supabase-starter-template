"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '../../../lib/supabaseClient';

export default function ResetPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const accessToken = searchParams.get('access_token'); // Get the access token from the URL
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!accessToken) {
      setError('Invalid or missing access token.');
    }
  }, [accessToken]);

  const handleResetPassword = async () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setError(null);

    try {
      // Set the session with the access token
      const { error: sessionError } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: accessToken, // This is a workaround; ideally, you should have the correct refresh token
      });

      if (sessionError) {
        setError(sessionError.message);
        return;
      }

      // Now update the user password
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        setError(error.message);
      } else {
        setSuccess(true);
        setTimeout(() => {
          router.push('/login');
        }, 2000); // Redirect after 2 seconds
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="card w-full max-w-sm shadow-2xl bg-white">
        <div className="card-body">
          <h2 className="card-title text-center text-2xl font-bold">Reset Password</h2>
          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-500">Password reset successful! Redirecting to login...</p>}
          <div className="form-control">
            <label className="label">
              <span className="label-text">New Password</span>
            </label>
            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input input-bordered"
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Confirm Password</span>
            </label>
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input input-bordered"
            />
          </div>
          <div className="form-control mt-6">
            <button onClick={handleResetPassword} className="btn btn-primary">
              Reset Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
