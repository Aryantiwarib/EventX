import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as authLogin } from '../../store/authSlice';
import { Button, Logo } from '../index';
import { useDispatch } from 'react-redux';
import authService from '../../appwrite/auth';
import { useForm } from 'react-hook-form';
import { FaUser, FaEnvelope, FaLock, FaKey, FaTimes, FaArrowLeft } from 'react-icons/fa';

function Signup({ isOpen, onClose, openLoginModal }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { register: registerEmail, handleSubmit: handleSubmitEmail } = useForm();
  const { register: registerOtp, handleSubmit: handleSubmitOtp } = useForm();
  const [error, setError] = useState('');
  const [send, setSend] = useState(false);
  const [userId, setUserId] = useState('');
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  const create = async (data) => {
    setError('');
    setLoading(true);
    try {
      // The account was created automatically in Appwrite when the OTP was sent.
      // Now that the session is verified, we set the name and password to complete signup.
      await authService.updateName(data.name);
      await authService.updatePassword(data.password);
      
      const currentUserData = await authService.getCurrentUser();
      if (currentUserData) dispatch(authLogin(currentUserData));
      if (isModal) {
        onClose();
      }
      navigate('/'); // Navigate immediately
    } catch (err) {
      setError(err.message || 'Failed to register account.');
    } finally {
      setLoading(false);
    }
  };

  const SENDOTP = async (data) => {
    setError('');
    setLoading(true);
    try {
      const token = await authService.SendOtp(data);
      if (token) {
        setUserId(token.userId);
        setFormData(data);
        setSend(true);
      }
    } catch (err) {
      setError(err.message || 'Could not send verification OTP.');
    } finally {
      setLoading(false);
    }
  };

  const VerifyOTP = async (data) => {
    setError('');
    setLoading(true);
    try {
      await authService.verifyOtp(userId, data.otp);
      await create({ ...formData, password: data.password });
    } catch (err) {
      setError(err.message || 'OTP verification failed. Please try again.');
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

  const formContent = (
    <div className="w-full">
      <div className="flex justify-center mb-6">
        <Logo width="70px" />
      </div>

      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Create Attendee Account</h2>
        <p className="text-sm text-gray-500 mt-1">
          {!send 
            ? 'Sign up to register for upcoming college events' 
            : `Enter the OTP sent to ${formData.email}`}
        </p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4 text-center border border-red-100">
          {error}
        </div>
      )}

      {!send ? (
        <form key="email-form" onSubmit={handleSubmitEmail(SENDOTP)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <div className="relative">
              <input
                key="name-input"
                type="text"
                placeholder="Enter your name"
                autoComplete="name"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white text-black outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 duration-200 border border-gray-200"
                {...registerEmail('name', { required: true })}
              />
              <FaUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <div className="relative">
              <input
                key="email-input"
                type="email"
                placeholder="Enter your email"
                autoComplete="email"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white text-black outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 duration-200 border border-gray-200"
                {...registerEmail('email', {
                  required: true,
                  pattern: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
                })}
              />
              <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-sm hover:shadow transition-all mt-6 flex items-center justify-center">
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              'Get OTP'
            )}
          </Button>
        </form>
      ) : (
        <form key="otp-form" onSubmit={handleSubmitOtp(VerifyOTP)} className="space-y-4">
          <button
            type="button"
            onClick={() => {
              setSend(false);
              setError('');
            }}
            className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-semibold mb-2 transition-colors cursor-pointer"
          >
            <FaArrowLeft className="text-[10px]" />
            Change email
          </button>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">One-Time Password (OTP)</label>
            <div className="relative">
              <input
                key="otp-input"
                type="text"
                placeholder="Enter your OTP"
                autoComplete="one-time-code"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white text-black outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 duration-200 border border-gray-200"
                {...registerOtp('otp', { required: true })}
              />
              <FaKey className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Choose Password</label>
            <div className="relative">
              <input
                key="password-input"
                type="password"
                placeholder="Choose a password"
                autoComplete="new-password"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white text-black outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 duration-200 border border-gray-200"
                {...registerOtp('password', { required: true })}
              />
              <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-sm hover:shadow transition-all mt-6 flex items-center justify-center">
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              'Verify & Sign Up'
            )}
          </Button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <button
          type="button"
          onClick={() => {
            if (isModal && openLoginModal) {
              openLoginModal();
            } else {
              navigate('/login');
            }
          }}
          className="text-blue-600 hover:underline font-semibold"
        >
          Sign In
        </button>
      </p>
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

export default Signup;