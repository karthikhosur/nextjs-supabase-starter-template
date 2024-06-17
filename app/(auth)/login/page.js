"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabaseClient';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setError(null);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
    } else {
      console.log('User logged in:', data.user);
      router.push('/dashboard');
    }
  };

  const handleMagicLink = async () => {
    setError(null);
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) {
      setError(error.message);
    } else {
      setMagicLinkSent(true);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center">
      <div className="card w-full max-w-sm shadow-2xl bg-base-100">
        <div className="card-body">
          <h2 className="card-title text-center text-2xl font-bold">Login</h2>
          {error && <p className="text-red-500">{error}</p>}
          {magicLinkSent && <p className="text-green-500">Magic link sent! Check your email.</p>}
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
          <div className="form-control mt-4">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <div className="relative">
              <input
                type={passwordVisible ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input input-bordered w-full pr-10"
              />
              <div
                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                {passwordVisible ? <FaEyeSlash /> : <FaEye />}
              </div>
            </div>
          </div>
          <div className="form-control mt-6">
            <button onClick={handleLogin} className="btn btn-primary w-full">
              Log In
            </button>
          </div>
          <div className="form-control mt-4">
            <button onClick={handleMagicLink} className="btn btn-secondary w-full">
              Send Magic Link
            </button>
          </div>
          <div className="form-control mt-4">
            <button
              onClick={() => router.push('/forgot-password')}
              className="btn btn-link"
            >
              Forgot Password?
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
