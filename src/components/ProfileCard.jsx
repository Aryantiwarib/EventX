import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

const ProfileCard = ({ isOpen, onClose }) => {
  const user = useSelector((state) => state.auth.userData);
  const cardRef = useRef(null);
  
  // Sample user data - replace with actual Redux state
  const userData = user || {
    name: '',
    email: 'user@example.com'
  };

  // Get user initials - prioritize name, fallback to email
  const getUserInitials = () => {
    // If name exists, use first letter of first and last name
    if (userData.name && userData.name.trim() !== '') {
      const nameParts = userData.name.split(' ');
      const firstInitial = nameParts[0].charAt(0).toUpperCase();
      const lastInitial = nameParts.length > 1 ? nameParts[nameParts.length - 1].charAt(0).toUpperCase() : '';
      return `${firstInitial}${lastInitial}`;
    } 
    // If name doesn't exist, use first letter of email
    else if (userData.email) {
      return userData.email.charAt(0).toUpperCase();
    }
    // Fallback
    return 'U';
  };

  // Close card when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cardRef.current && !cardRef.current.contains(event.target)) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div 
        ref={cardRef} 
        className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4"
      >
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {getUserInitials()}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              {userData.name || userData.email.split('@')[0]}
            </h2>
            <p className="text-gray-500">{userData.email}</p>
          </div>
        </div>
        
        {/* Profile content can be expanded here */}
        <div className="space-y-4">
          {/* Add more profile details as needed */}
        </div>
        
        <div className="mt-8 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;