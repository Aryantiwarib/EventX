import React, { useState, useRef, useEffect } from 'react';
import { Container, Logo, LogoutBtn, Signup, Login } from '../index';
import { toast } from 'sonner';
import ProfileCard from '../ProfileCard';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import service from '../../appwrite/config';

function Header() {
  const authStatus = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.auth.userData) || { name: '', email: 'user@example.com' };
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isProfileCardOpen, setIsProfileCardOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [animateBell, setAnimateBell] = useState(false);

  const checkIsAdmin = (user) => {
    if (!user) return false;
    return (
      user.labels?.includes('admin') ||
      user.prefs?.role === 'admin' ||
      user.prefs?.isAdmin === true ||
      user.email?.endsWith('@eventx-admin.com')
    );
  };
  
  const isAdmin = authStatus && checkIsAdmin(userData);
  
  const profileRef = useRef(null);

  const getUserInitials = () => {
    if (userData.name && userData.name.trim() !== '') {
      const nameParts = userData.name.split(' ');
      const firstInitial = nameParts[0].charAt(0).toUpperCase();
      const lastInitial = nameParts.length > 1 ? nameParts[nameParts.length - 1].charAt(0).toUpperCase() : '';
      return `${firstInitial}${lastInitial}`;
    } 
    else if (userData.email) {
      return userData.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  useEffect(() => {
    let isMounted = true;
    let subscription = null;

    const fetchNotificationCount = async () => {
      if (!authStatus || !userData.$id) return;
      
      try {
        const response = await service.getUserNotifications(
          userData.$id, 
          userData.$createdAt || userData.registration
        );
        if (isMounted) {
          const unreadNotifications = response.documents.filter(n => n.isRead === false);
          setUnreadCount(unreadNotifications.length);
        }
      } catch {
        setUnreadCount(0);
      }
    };

    const setupRealtime = async () => {
      if (!authStatus || !userData.$id) return;
      
      try {
        const client = service.client;
        const conf = await import('../../conf/conf.js').then(module => module.default);
        
        if (subscription) {
          subscription();
        }
        
        subscription = client.subscribe(
          `databases.${conf.appwriteDatabaseId}.collections.${conf.appwriteCollectionNotificationsId}.documents`,
          async response => {
            if (response.events.includes('databases.*.collections.*.documents.*.create')) {
              const newNotif = response.payload;
              if (newNotif.userId === userData.$id) {
                const cleanDescription = newNotif.description 
                  ? newNotif.description.replace(/<[^>]*>/g, '') 
                  : '';
                
                toast.info(newNotif.title || 'New Notification', {
                  description: cleanDescription,
                  duration: 6000,
                  action: newNotif.actionUrl ? {
                    label: 'View',
                    onClick: () => {
                      if (newNotif.actionUrl.startsWith('http')) {
                        window.location.href = newNotif.actionUrl;
                      } else {
                        navigate(newNotif.actionUrl);
                      }
                      service.markNotificationAsRead(newNotif.$id).catch(console.error);
                    }
                  } : undefined
                });

                if (isMounted) {
                  setAnimateBell(true);
                  setTimeout(() => setAnimateBell(false), 1200);
                  await fetchNotificationCount();
                }
              }
            } else if (response.events.includes('databases.*.collections.*.documents.*.update') ||
                       response.events.includes('databases.*.collections.*.documents.*.delete')) {
              if (isMounted) {
                await fetchNotificationCount();
              }
            }
          }
        );
      } catch (error) {
        console.error("Error setting up realtime updates:", error);
      }
    };



    fetchNotificationCount();
    setupRealtime();

    return () => {
      isMounted = false;
      if (subscription) {
        subscription();
      }
    };
  }, [authStatus, userData.$id]);

  const handleNotificationClick = async () => {
    navigate('/notifications?filter=unread');
  };

  const navItems = [
    { 
      name: 'Events', 
      slug: '/events',
      active: true,
      onClick: () => {
        if (!authStatus) {
          setIsLoginModalOpen(true);
        } else {
          navigate('/events');
        }
      }
    },
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
    { name: 'How It Work', slug: '/work-flow', active: authStatus },
    { name: 'Add Event', slug: '/add-event', active: authStatus && isAdmin },
  ];

  const profileOptions = [
    { 
      name: 'Profile', 
      slug: '#',
      active: true,
      onClick: () => {
        setIsProfileCardOpen(true);
        setIsProfileDropdownOpen(false);
      }
    },
    { name: 'Payment History', slug: `/payment-history`, active: !isAdmin },
    { name: 'Dashboard', slug: '/dashboard', active: true },
    { name: 'EventTickets', slug: '/tickets', active: !isAdmin },
  ];

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleProfileDropdown = () => setIsProfileDropdownOpen(!isProfileDropdownOpen);

  const handleLogout = () => {
    setIsLoginModalOpen(false);
    setIsSignupModalOpen(false);
    setIsSidebarOpen(false);
    setUnreadCount(0);
    navigate('/');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className='font-sans sticky top-0 z-50 py-3 shadow-sm bg-white border-b border-gray-200'>
      <Container>
        <nav className='flex items-center justify-between'>
          <div className='mr-4 cursor-pointer'>
            <Link to='/' className='hover:opacity-80'>
              <Logo width='70px' />
            </Link>
          </div>

          <button
            onClick={toggleSidebar}
            className='block md:hidden p-2 text-gray-600 hover:text-gray-800 cursor-pointer'
          >
            <svg className='w-8 h-8' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M4 6h16M4 12h16M4 18h16'/>
            </svg>
          </button>

          <div className='hidden md:flex items-center ml-auto'>
            <ul className='flex space-x-4'>
              {navItems.map((item) => item.active && (
                <li key={item.name}>
                  <button
                    onClick={item.onClick || (() => navigate(item.slug))}
                    className='px-4 py-2 text-gray-600 hover:text-blue-600 transition-colors cursor-pointer'
                  >
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>

            {authStatus && (
              <div className='flex items-center ml-4 space-x-3'>
                <button 
                  onClick={handleNotificationClick}
                  className='p-2 text-gray-500 hover:text-blue-600 transition-all duration-200 relative cursor-pointer hover:scale-105 active:scale-95'
                >
                  <svg className={`w-5 h-5 transition-transform duration-300 ${animateBell ? 'animate-bounce text-blue-600' : ''}`} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' 
                      d='M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1'/>
                  </svg>
                  {unreadCount > 0 && (
                    <span className='absolute top-1 right-1 bg-red-500 text-white text-[9px] font-extrabold rounded-full min-w-4 h-4 px-1 flex items-center justify-center ring-2 ring-white transform translate-x-0.5 -translate-y-0.5 animate-in zoom-in duration-200'>
                      {unreadCount}
                    </span>
                  )}
                </button>


                <div className='relative cursor-pointer' ref={profileRef}>
                  <button 
                    onClick={toggleProfileDropdown}
                    className='flex items-center rounded-full hover:ring-2 hover:ring-blue-300 transition-all overflow-hidden cursor-pointer'
                  >
                    <div className='w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold'>
                      {getUserInitials()}
                    </div>
                  </button>
                  
                  {isProfileDropdownOpen && (
                    <div className='absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg overflow-hidden z-50 border border-gray-200'>
                      <div className='p-4 bg-gray-50 border-b border-gray-200'>
                        <div className='flex items-center space-x-3'>
                          <div className='w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold'>
                            {getUserInitials()}
                          </div>
                          <div>
                            <h3 className='font-semibold text-gray-800'>
                              {userData.name || userData.email.split('@')[0]}
                            </h3>
                            <p className='text-xs text-gray-500'>{userData.email}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className='py-2'>
                        {profileOptions.filter(o => o.active !== false).map((option) => (
                          <button
                            key={option.name}
                            onClick={() => {
                              if (option.onClick) {
                                option.onClick();
                              } else {
                                navigate(option.slug);
                                setIsProfileDropdownOpen(false);
                              }
                            }}
                            className='block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer'
                          >
                            {option.name}
                          </button>
                        ))}
                        <div className='border-t border-gray-200 mt-2 pt-2'>
                          <LogoutBtn 
                            onLogout={handleLogout} 
                            className='block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 cursor-pointer'
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <ProfileCard 
                    isOpen={isProfileCardOpen} 
                    onClose={() => setIsProfileCardOpen(false)} 
                  />
                </div>
              </div>
            )}
          </div>

          <div className={`fixed inset-0 z-50 transition-opacity md:hidden ${
            isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}>
            <div className='fixed inset-0 bg-white transform transition-all duration-300 ease-in-out w-3/4 right-0 shadow-xl'>
              <div className='flex justify-between items-center p-4 border-b'>
                <Link to='/' onClick={toggleSidebar} className='cursor-pointer'>
                  <Logo width='70px' />
                </Link>
                <button
                  onClick={toggleSidebar}
                  className='p-2 text-gray-600 hover:text-gray-800 cursor-pointer'
                >
                  <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M6 18L18 6M6 6l12 12'/>
                  </svg>
                </button>
              </div>
              
              {authStatus && (
                <div className='p-4 bg-gray-50 border-b border-gray-200'>
                  <div className='flex items-center space-x-3'>
                    <div className='w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold'>
                      {getUserInitials()}
                    </div>
                    <div>
                      <h3 className='font-semibold text-gray-800'>
                        {userData.name || userData.email.split('@')[0]}
                      </h3>
                      <p className='text-xs text-gray-500'>{userData.email}</p>
                    </div>
                  </div>
                </div>
              )}
              
              <ul className='p-4 space-y-2'>
                {navItems.map((item) => item.active && (
                  <li key={item.name}>
                    <button
                      onClick={() => {
                        if (item.name === 'Events' && !authStatus) {
                          setIsLoginModalOpen(true);
                          toggleSidebar();
                        } else {
                          if (item.onClick) item.onClick();
                          else navigate(item.slug);
                          toggleSidebar();
                        }
                      }}
                      className='w-full text-left p-3 text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer'
                    >
                      {item.name}
                    </button>
                  </li>
                ))}
                {authStatus && (
                  <>
                    <li>
                      <button
                        onClick={() => {
                          handleNotificationClick();
                          toggleSidebar();
                        }}
                        className='w-full text-left p-3 text-gray-600 hover:bg-gray-100 rounded-lg flex items-center justify-between cursor-pointer'
                      >
                        <span>Unread Notifications</span>
                        {unreadCount > 0 && (
                          <span className='bg-red-500 text-white text-xs rounded-full px-2 py-1 ml-2'>
                            {unreadCount > 9 ? '9+' : unreadCount}
                          </span>
                        )}
                      </button>
                    </li>
                    {profileOptions.filter(o => o.active !== false).map((option) => (
                      <li key={option.name}>
                        <button
                          onClick={() => {
                            if (option.onClick) {
                              option.onClick();
                              toggleSidebar();
                            } else {
                              navigate(option.slug);
                              toggleSidebar();
                            }
                          }}
                          className='w-full text-left p-3 text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer'
                        >
                          {option.name}
                        </button>
                      </li>
                    ))}
                    <li>
                      <LogoutBtn 
                        onLogout={handleLogout} 
                        className='w-full text-left p-3 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer'
                      />
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </nav>
      </Container>

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
