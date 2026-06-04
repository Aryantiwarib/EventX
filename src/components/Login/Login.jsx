import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as authLogin } from '../../store/authSlice';
import { Button, Input, Logo } from '../index';
import { useDispatch } from 'react-redux';
import authService from '../../appwrite/auth';
import { useForm } from 'react-hook-form';
import { FaUser, FaUserCog, FaEnvelope, FaLock, FaTimes } from 'react-icons/fa';

function Login({ isOpen, onClose, openSignupModal }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();
  const [error, setError] = useState('');
  const [role, setRole] = useState('user'); // 'user' or 'admin'
  const [loading, setLoading] = useState(false);

  const checkIsAdmin = (user) => {
    if (!user) return false;
    return (
      user.labels?.includes('admin') ||
      user.prefs?.role === 'admin' ||
      user.prefs?.isAdmin === true ||
      user.email?.endsWith('@eventx-admin.com')
    );
  };

  const login = async (data) => {
    setError('');
    setLoading(false);
    
    // Quick validation
    if (!data.email || !data.password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const session = await authService.login(data);
      if (session) {
        const userData = await authService.getCurrentUser();
        if (userData) {
          // If logging in as Organizer, verify privileges
          if (role === 'admin' && !checkIsAdmin(userData)) {
            await authService.logout();
            throw new Error("This account does not have Organizer / Admin privileges.");
          }
          
          dispatch(authLogin(userData));
          
          if (isModal) {
            onClose();
          }
          
          if (checkIsAdmin(userData)) {
            navigate('/dashboard');
          } else {
            navigate('/');
          }
        }
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const isModal = isOpen !== undefined;
  const shouldRender = !isModal || isOpen;

  if (!shouldRender) return null;

  const handleClose = () => {
    if (isModal && onClose) onClose();
    else navigate('/');
  };

  // Card Content Layout
  const formContent = (
    <div className="w-full">
      <div className="flex justify-center mb-6">
        <Logo width="70px" />
      </div>

      {/* Tabs */}
      <div className="flex bg-gray-100 p-1.5 rounded-xl mb-6">
        <button
          type="button"
          onClick={() => {
            setRole('user');
            setError('');
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all ${
            role === 'user'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          <FaUser className="text-xs" />
          Attendee Login
        </button>
        <button
          type="button"
          onClick={() => {
            setRole('admin');
            setError('');
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all ${
            role === 'admin'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          <FaUserCog className="text-xs" />
          Organizer Login
        </button>
      </div>

      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800">
          {role === 'user' ? 'Attendee Sign In' : 'Organizer Sign In'}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          {role === 'user' ? 'Access your event tickets & payment history' : 'Manage your college events, bookings, and check-ins'}
        </p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4 text-center border border-red-100">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(login)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <div className="relative">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white text-black outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 duration-200 border border-gray-200"
              {...register('email', {
                required: true,
                pattern: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
              })}
            />
            <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <div className="relative">
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white text-black outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 duration-200 border border-gray-200"
              {...register('password', {
                required: true
              })}
            />
            <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-sm hover:shadow transition-all mt-6 flex items-center justify-center">
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            'Sign In'
          )}
        </Button>
      </form>

      {role === 'user' ? (
        <p className="mt-6 text-center text-sm text-gray-600">
          Don&apos;t have an account?{' '}
          <button
            type="button"
            onClick={() => {
              if (isModal && openSignupModal) {
                openSignupModal();
              } else {
                navigate('/signup');
              }
            }}
            className="text-blue-600 hover:underline font-semibold"
          >
            Sign Up
          </button>
        </p>
      ) : (
        <div className="mt-6 p-3 bg-gray-50 border rounded-lg text-center text-xs text-gray-500">
          Organizer accounts are pre-configured by system administrators. If you require credentials, please contact support.
        </div>
      )}
    </div>
  );

  return isModal ? (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl relative border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-4 top-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
        >
          <FaTimes className="w-4 h-4" />
        </button>
        {formContent}
      </div>
    </div>
  ) : (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-500/10 via-white to-purple-500/10 py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl border border-gray-100">
        {formContent}
      </div>
    </div>
  );
}

export default Login;