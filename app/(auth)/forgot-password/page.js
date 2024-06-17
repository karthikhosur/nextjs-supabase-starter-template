"use client";

import { useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleForgotPassword = async () => {
    setError(null);
    setSuccess(false);
    const { data, error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="card w-full max-w-sm shadow-2xl bg-white">
        <div className="card-body">
          <h2 className="card-title text-center text-2xl font-bold">Forgot Password</h2>
          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-500">Password reset email sent!</p>}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input input-bordered"
            />
          </div>
          <div className="form-control mt-6">
            <button onClick={handleForgotPassword} className="btn btn-primary">
              Reset Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
