import React, { useState } from 'react';
import { Container, Logo, LogoutBtn, Signup, Login } from '../index';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function Header() {
  const authStatus = useSelector((state) => state.auth.status);
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);

  const navItems = [
    { name: 'Home', slug: '/', active: true },
    { 
      name: 'Login', 
      slug: '#',
      active: !authStatus,
      onClick: () => {
        setIsLoginModalOpen(true);
        setIsSignupModalOpen(false);
      }
    },
    { 
      name: 'Signup', 
      slug: '#',
      active: !authStatus,
      onClick: () => {
        setIsSignupModalOpen(true);
        setIsLoginModalOpen(false);
      }
    },  
    { name: 'About', slug: '/dashboard', active: authStatus },
    { name: 'Add Event', slug: '/add-event', active: authStatus },
  ];

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleLogout = () => {
    setIsLoginModalOpen(false);
    setIsSignupModalOpen(false);
    setIsSidebarOpen(false);
    navigate('/');
  };

  return (
    <header className='font-sans sticky top-0 z-50 py-3 shadow-sm bg-white border-b border-gray-200'>
      <Container>
        <nav className='flex items-center justify-between'>
          {/* Logo */}
          <div className='mr-4'>
            <Link to='/' className='hover:opacity-80'>
              <Logo width='70px' />
            </Link>
          </div>

          {/* Hamburger Menu */}
          <button
            onClick={toggleSidebar}
            className='block md:hidden p-2 text-gray-600 hover:text-gray-800'
          >
            <svg 
              className='w-8 h-8'
              fill='none' 
              stroke='currentColor' 
              viewBox='0 0 24 24'
            >
              <path 
                strokeLinecap='round' 
                strokeLinejoin='round' 
                strokeWidth='2' 
                d='M4 6h16M4 12h16M4 18h16'
              />
            </svg>
          </button>

          {/* Desktop Navbar */}
          <ul className='hidden md:flex ml-auto space-x-4'>
            {navItems.map((item) => item.active && (
              <li key={item.name}>
                <button
                  onClick={item.onClick || (() => navigate(item.slug))}
                  className='px-4 py-2 text-gray-600 hover:text-blue-600 transition-colors'
                >
                  {item.name}
                </button>
              </li>
            ))}
            {authStatus && (
              <li>
                <LogoutBtn onLogout={handleLogout} />
              </li>
            )}
          </ul>

          {/* Mobile Sidebar */}
          <div
            className={`fixed inset-0 z-50 transition-opacity md:hidden ${
              isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            {/* Solid White Sidebar Background */}
            <div className='fixed inset-0 bg-white'>
              <div className='flex justify-between items-center p-4 border-b'>
                <Link to='/' onClick={toggleSidebar}>
                  <Logo width='70px' />
                </Link>
                <button
                  onClick={toggleSidebar}
                  className='p-2 text-gray-600 hover:text-gray-800'
                >
                  <svg 
                    className='w-6 h-6'
                    fill='none' 
                    stroke='currentColor' 
                    viewBox='0 0 24 24'
                  >
                    <path 
                      strokeLinecap='round' 
                      strokeLinejoin='round' 
                      strokeWidth='2' 
                      d='M6 18L18 6M6 6l12 12'
                    />
                  </svg>
                </button>
              </div>
              <ul className='p-4 space-y-2'>
                {navItems.map((item) => item.active && (
                  <li key={item.name}>
                    <button
                      onClick={() => {
                        if (item.onClick) item.onClick();
                        else navigate(item.slug);
                        toggleSidebar();
                      }}
                      className='w-full text-left p-3 text-gray-600 hover:bg-gray-100 rounded-lg'
                    >
                      {item.name}
                    </button>
                  </li>
                ))}
                {authStatus && (
                  <li>
                    <LogoutBtn 
                      onLogout={handleLogout} 
                      className='w-full text-left p-3 text-red-600 hover:bg-red-50 rounded-lg'
                    />
                  </li>
                )}
              </ul>
            </div>
          </div>
        </nav>
      </Container>

      {/* Modals */}
      <Login
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        openSignupModal={() => {
          setIsSignupModalOpen(true);
          setIsLoginModalOpen(false);
        }}
      />
      <Signup
        isOpen={isSignupModalOpen}
        onClose={() => setIsSignupModalOpen(false)}
        openLoginModal={() => {
          setIsLoginModalOpen(true);
          setIsSignupModalOpen(false);
        }}
      />
    </header>
  );
}

export default Header;