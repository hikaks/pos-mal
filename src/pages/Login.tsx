import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import type { User } from '../store/useStore';
import { 
  CurrencyDollarIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';

const Login: React.FC = () => {
  const { setUser } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Simulasi login - dalam implementasi nyata, ini akan menggunakan Firebase Auth
      if (email === 'admin@pos.com' && password === 'admin123') {
        const user: User = {
          id: '1',
          email: 'admin@pos.com',
          name: 'Administrator',
          role: 'admin',
          createdAt: new Date()
        };
        setUser(user);
      } else if (email === 'cashier@pos.com' && password === 'cashier123') {
        const user: User = {
          id: '2',
          email: 'cashier@pos.com',
          name: 'Kasir',
          role: 'cashier',
          createdAt: new Date()
        };
        setUser(user);
      } else {
        setError('Email atau password salah');
      }
    } catch (err) {
      setError('Terjadi kesalahan saat login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 bg-primary-600 rounded-lg flex items-center justify-center">
            <CurrencyDollarIcon className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Login ke POS System
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Masuk ke akun Anda untuk melanjutkan
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field mt-1"
                placeholder="admin@pos.com atau cashier@pos.com"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative mt-1">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pr-10"
                  placeholder="admin123 atau cashier123"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex justify-center py-3"
            >
              {isLoading ? 'Memproses...' : 'Masuk'}
            </button>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Demo Account:
            </p>
            <div className="mt-2 text-xs text-gray-500 space-y-1">
              <p>Admin: admin@pos.com / admin123</p>
              <p>Cashier: cashier@pos.com / cashier123</p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login; 