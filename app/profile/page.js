"use client";

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function Profile() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updatePassword, setUpdatePassword] = useState(false);
  const [message, setMessage] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (data.session) {
        const { user } = data.session;
        setUser(user);
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profile) {
          setName(profile.name);
        }
        if (profileError) {
          console.error(profileError);
        }
      } else {
        router.push('/login');
      }
      setLoading(false);
    };

    fetchUserProfile();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (updatePassword && password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: updatePassword ? password : undefined,
    });

    if (updateError) {
      setMessage(updateError.message);
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .upsert({ id: user.id, name: name });

    if (profileError) {
      setMessage(profileError.message);
    } else {
      setMessage('Profile updated successfully');
    }
  };

  const handleDeactivateAccount = async () => {
    const { error: userUpdateError } = await supabase.auth.updateUser({
      data: { active: false },
    });

    if (userUpdateError) {
      setMessage('Error deactivating account: ' + userUpdateError.message);
      return;
    }

    const { error: profileUpdateError } = await supabase
      .from('profiles')
      .update({ active: false })
      .eq('id', user.id);

    if (profileUpdateError) {
      setMessage('Error updating profile: ' + profileUpdateError.message);
      return;
    }

    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center">
      <div className="card w-full max-w-lg shadow-2xl bg-base-100">
        <div className="card-body">
          <h2 className="card-title text-center text-2xl font-bold">Profile</h2>
          {message && <p className="text-center text-red-500">{message}</p>}
          <form onSubmit={handleUpdateProfile}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                value={user.email}
                className="input input-bordered bg-gray-200 cursor-not-allowed"
                readOnly
              />
            </div>
            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input input-bordered"
              />
            </div>
            {updatePassword && (
              <>
                <div className="form-control mt-4">
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
                <div className="form-control mt-4">
                  <label className="label">
                    <span className="label-text">Confirm New Password</span>
                  </label>
                  <input
                    type="password"
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="input input-bordered"
                  />
                </div>
              </>
            )}
            <div className="form-control mt-4">
              <button
                type="button"
                onClick={() => setUpdatePassword(!updatePassword)}
                className="btn btn-outline"
              >
                {updatePassword ? 'Cancel Update Password' : 'Update Password'}
              </button>
            </div>
            <div className="form-control mt-6">
              <button type="submit" className="btn btn-primary">
                Update Profile
              </button>
            </div>
          </form>
          <div className="form-control mt-6">
            <button onClick={() => setDeleteConfirm(true)} className="btn btn-error">
              Deactivate My Account
            </button>
          </div>
        </div>
      </div>
      {deleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="card w-full max-w-md shadow-2xl bg-base-100">
            <div className="card-body">
              <h2 className="card-title text-center text-2xl font-bold">Confirm Deactivation</h2>
              <p className="text-center">Are you sure you want to deactivate your account?</p>
              <div className="form-control mt-6">
                <button onClick={handleDeactivateAccount} className="btn btn-error">
                  Yes, Deactivate My Account
                </button>
                <button onClick={() => setDeleteConfirm(false)} className="btn btn-outline mt-2">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
