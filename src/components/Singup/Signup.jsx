// Signup.jsx (updated)
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as authLogin } from '../../store/authSlice';
import { Button, Input, Logo } from '../index';
import { useDispatch } from 'react-redux';
import authService from '../../appwrite/auth';
import { useForm } from 'react-hook-form';

function Signup({ isOpen, onClose, openLoginModal }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();
  const [error, setError] = useState('');
  const [send, setSend] = useState(false);
  const [userId, setUserId] = useState('');
  const [formData, setFormData] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const create = async (data) => {
    setError('');
    try {
      const userData = await authService.createAccount(data);
      if (userData) {
        const userData = await authService.getCurrentUser();
        if (userData) dispatch(authLogin(userData));
        setSuccessMessage('You have registered successfully!');
        onClose(); // Close modal immediately
        navigate('/'); // Navigate immediately
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const SENDOTP = async (data) => {
    setError('');
    try {
      const token = await authService.SendOtp(data);
      if (token) {
        setUserId(token.userId);
        setFormData(data);
        setSend(true);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const VerifyOTP = async (data) => {
    setError('');
    try {
      await authService.verifyOtp(userId, data.otp);
      await create({ ...formData, password: data.password });
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <>
      {isOpen && (
        <div className='fixed inset-0 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg p-8 w-full max-w-md mx-4 shadow-lg'>
            {/* ... (keep existing JSX structure) ... */}
            {!send ? (
              <form onSubmit={handleSubmit(SENDOTP)} className='space-y-4'>
                <Input
                  label='Name: '
                  placeholder='Enter your name'
                  type='text'
                  {...register('name', { required: true })}
                />
                <Input
                  label='Email: '
                  placeholder='Enter your email'
                  type='email'
                  {...register('email', {
                    required: true,
                    pattern: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                  })}
                />
                <Button type='submit' className='w-full'>
                  Get OTP
                </Button>
              </form>
            ) : (
              <form onSubmit={handleSubmit(VerifyOTP)} className='space-y-4'>
                <Input
                  label='OTP: '
                  type='text'
                  placeholder='Enter your OTP'
                  {...register('otp', { required: true })}
                />
                <Input
                  label='Password: '
                  type='password'
                  placeholder='Enter your password'
                  {...register('password', { required: true })}
                />
                <Button type='submit' className='w-full'>
                  Submit OTP
                </Button>
              </form>
            )}

            <p className='mt-4 text-center text-gray-600'>
              Already have an account?{' '}
              <button
                onClick={openLoginModal}
                className='text-blue-600 hover:underline'
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export default Signup;