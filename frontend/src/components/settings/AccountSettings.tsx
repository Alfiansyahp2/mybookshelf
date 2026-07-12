import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Key, Save } from 'lucide-react';
import { useAuthUser, useUpdateProfile, useUpdatePassword } from '../../hooks/useAuth';

export default function AccountSettings() {
  const { data: authData } = useAuthUser();
  const authUser = authData?.user || authData?.data;
  
  const updateProfile = useUpdateProfile();
  const updatePassword = useUpdatePassword();

  const [user, setUser] = useState({
    name: 'User Name',
    email: 'booklover@email.com',
    avatar: 'U',
    memberSince: '2024'
  });

  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    password: '',
    password_confirmation: ''
  });

  useEffect(() => {
    if (authUser) {
      setUser({
        name: authUser.name,
        email: authUser.email,
        avatar: authUser.name.charAt(0).toUpperCase(),
        memberSince: authUser.created_at ? new Date(authUser.created_at).getFullYear().toString() : '2024'
      });
    }
  }, [authUser]);

  const handleProfileSubmit = () => {
    updateProfile.mutate({ name: user.name, email: user.email }, {
      onSuccess: () => alert('Profile updated successfully!'),
      onError: () => alert('Failed to update profile.')
    });
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updatePassword.mutate(passwordForm, {
      onSuccess: () => {
        alert('Password updated successfully!');
        setPasswordForm({ current_password: '', password: '', password_confirmation: '' });
      },
      onError: (err: any) => {
        alert('Failed to update password. Check your current password.');
        console.error(err);
      }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-4"
    >
      <div className="bg-white rounded-2xl p-6 border border-walnut/10 shadow-sm">
        <h2 className="text-xl font-serif font-semibold text-darkBrown mb-6 flex items-center gap-2">
          <User className="w-5 h-5" />
          Profile Information
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-walnut mb-2">Display Name</label>
            <input
              type="text"
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
              className="w-full px-4 py-3 bg-cream border border-walnut/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-walnut/30 focus:border-walnut/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-walnut mb-2">Email Address</label>
            <input
              type="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              className="w-full px-4 py-3 bg-cream border border-walnut/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-walnut/30 focus:border-walnut/50"
            />
          </div>
          <div className="flex items-center gap-3 p-4 bg-cream/30 rounded-xl">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-walnut font-semibold text-lg">
              {user.avatar}
            </div>
            <div>
              <p className="text-sm text-walnut/60">Avatar</p>
              <p className="text-xs text-walnut/50">First letter of your name</p>
            </div>
          </div>
          <div className="pt-2 flex justify-end">
            <button 
              onClick={handleProfileSubmit}
              disabled={updateProfile.isPending}
              className="flex items-center gap-2 px-6 py-2.5 bg-walnut text-white rounded-xl hover:bg-darkBrown transition-colors font-medium disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {updateProfile.isPending ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-walnut/10 shadow-sm mt-4">
        <h2 className="text-xl font-serif font-semibold text-darkBrown mb-6 flex items-center gap-2">
          <Key className="w-5 h-5" />
          Change Password
        </h2>
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-walnut mb-2">Current Password</label>
            <input
              type="password"
              required
              value={passwordForm.current_password}
              onChange={(e) => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
              className="w-full px-4 py-3 bg-cream border border-walnut/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-walnut/30 focus:border-walnut/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-walnut mb-2">New Password</label>
            <input
              type="password"
              required
              minLength={8}
              value={passwordForm.password}
              onChange={(e) => setPasswordForm({ ...passwordForm, password: e.target.value })}
              className="w-full px-4 py-3 bg-cream border border-walnut/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-walnut/30 focus:border-walnut/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-walnut mb-2">Confirm New Password</label>
            <input
              type="password"
              required
              minLength={8}
              value={passwordForm.password_confirmation}
              onChange={(e) => setPasswordForm({ ...passwordForm, password_confirmation: e.target.value })}
              className="w-full px-4 py-3 bg-cream border border-walnut/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-walnut/30 focus:border-walnut/50"
            />
          </div>
          <div className="pt-2 flex justify-end">
            <button 
              type="submit"
              disabled={updatePassword.isPending}
              className="flex items-center gap-2 px-6 py-2.5 bg-darkBrown text-white rounded-xl hover:bg-[#2a1a10] transition-colors font-medium disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {updatePassword.isPending ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
