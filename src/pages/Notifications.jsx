import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Client, Account } from "appwrite";
import conf from '../conf/conf.js';
import service from '../appwrite/config.js';
import { 
  Bell, 
  BellOff, 
  Check, 
  Trash2, 
  Calendar, 
  Ticket, 
  CreditCard, 
  Info, 
  AlertTriangle, 
  ArrowRight, 
  CheckSquare 
} from 'lucide-react';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const subscriptionRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const client = new Client();
  client
    .setEndpoint(conf.appwriteUrl)
    .setProject(conf.appwriteProjectId);
  
  const account = new Account(client);

  const formatDescription = (text) => {
    return text.replace(/\n/g, '<br />');
  };

  const getRelativeTimeString = (timestamp) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMs < 0 || diffMins < 1) {
      return 'Just now';
    }
    if (diffMins < 60) {
      return `${diffMins}m ago`;
    }
    if (diffHours < 24) {
      return `${diffHours}h ago`;
    }
    if (diffDays === 1) {
      return 'Yesterday';
    }
    if (diffDays < 7) {
      return `${diffDays}d ago`;
    }
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getNotificationConfig = (eventType, title = '') => {
    const type = eventType?.toLowerCase() || '';
    const lowerTitle = title.toLowerCase();

    if (type === 'booking' || lowerTitle.includes('booking') || lowerTitle.includes('ticket') || lowerTitle.includes('registration')) {
      return {
        icon: Ticket,
        bgColor: 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900/50',
        borderColor: 'border-l-blue-500',
        badgeText: 'Booking',
        badgeClass: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300'
      };
    }
    if (type === 'payment' || lowerTitle.includes('payment') || lowerTitle.includes('paid') || lowerTitle.includes('refund')) {
      return {
        icon: CreditCard,
        bgColor: 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/50',
        borderColor: 'border-l-emerald-500',
        badgeText: 'Payment',
        badgeClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
      };
    }
    if (type === 'alert' || type === 'security' || lowerTitle.includes('alert') || lowerTitle.includes('warning') || lowerTitle.includes('cancelled')) {
      return {
        icon: AlertTriangle,
        bgColor: 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/50',
        borderColor: 'border-l-rose-500',
        badgeText: 'Alert',
        badgeClass: 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300'
      };
    }
    if (type === 'event' || type === 'schedule' || lowerTitle.includes('event') || lowerTitle.includes('schedule') || lowerTitle.includes('venue')) {
      return {
        icon: Calendar,
        bgColor: 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/50',
        borderColor: 'border-l-amber-500',
        badgeText: 'Event Update',
        badgeClass: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
      };
    }
    return {
      icon: Bell,
      bgColor: 'bg-purple-50 text-purple-600 border-purple-100 dark:bg-purple-950/30 dark:text-purple-400 dark:border-purple-900/50',
      borderColor: 'border-l-purple-500',
      badgeText: 'Info',
      badgeClass: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300'
    };
  };

  const formatNotification = (doc) => ({
    id: doc.$id,
    title: doc.title,
    description: formatDescription(doc.description),
    eventType: doc.eventType,
    relativeTime: getRelativeTimeString(doc.$createdAt),
    fullTimestamp: new Date(doc.$createdAt).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    isRead: doc.isRead,
    actionUrl: doc.actionUrl,
    eventId: doc.eventId
  });

  const calculateUnreadCount = (notifs) => {
    const count = notifs.filter(n => !n.isRead).length;
    setUnreadCount(count);
  };

  const markAsRead = async (id) => {
    try {
      await service.markNotificationAsRead(id);
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === id 
            ? { ...notification, isRead: true }
            : notification
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await service.deleteNotification(id);
      setNotifications(prev => 
        prev.filter(notification => notification.id !== id)
      );
      const notification = notifications.find(n => n.id === id);
      if (notification && !notification.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const markAllAsRead = async () => {
    if (unreadCount === 0) return;
    try {
      await service.markAllNotificationsRead(currentUserId);
      setNotifications(prev =>
        prev.map(n => ({ ...n, isRead: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const clearAllNotifications = async () => {
    if (notifications.length === 0) return;
    if (!window.confirm("Are you sure you want to clear all notifications? This cannot be undone.")) return;
    
    try {
      setLoading(true);
      await service.deleteAllNotifications(currentUserId);
      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      console.error("Error clearing notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const user = await getCurrentUser();
      if (!user) throw new Error("User not authenticated");
      
      const response = await service.getUserNotifications(user.$id, user.$createdAt || user.registration);
      const fetchedNotifications = response.documents.map(doc => formatNotification(doc));
      
      setNotifications(fetchedNotifications);
      calculateUnreadCount(fetchedNotifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentUser = async () => {
    try {
      const user = await account.get();
      setCurrentUserId(user.$id);
      return user;
    } catch (error) {
      console.error("Error getting current user:", error);
      return null;
    }
  };

  const setupRealtime = async () => {
    const user = await getCurrentUser();
    if (!user) return;
    const userId = user.$id;
  
    const unsubscribe = client.subscribe(
      `databases.${conf.appwriteDatabaseId}.collections.${conf.appwriteCollectionNotificationsId}.documents`,
      response => {
        if (response.events.includes('databases.*.collections.*.documents.*.create')) {
          const newNotification = response.payload;
          if (newNotification.userId === userId) {
            setNotifications(prev => {
              const formattedNotification = formatNotification(newNotification);
              const duplicateExists = prev.some(n => 
                n.eventId === formattedNotification.eventId && 
                n.title === formattedNotification.title
              );
              
              return duplicateExists ? prev : [formattedNotification, ...prev];
            });
            
            if (!newNotification.isRead) {
              setUnreadCount(prev => prev + 1);
            }
          }
        }
      }
    );
    subscriptionRef.current = unsubscribe;
  };

  useEffect(() => {
    const initialize = async () => {
      await getCurrentUser();
      await fetchNotifications();
      await setupRealtime();
    };

    initialize();

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const filter = searchParams.get('filter');
    if (filter === 'unread') {
      setActiveTab('unread');
    } else {
      setActiveTab('all');
    }
  }, [location.search]);

  const filteredNotifications = notifications.filter(n => {
    if (activeTab === 'unread') return !n.isRead;
    return true;
  });

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          
          {/* Header Area */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-gray-100 pb-6">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Notifications</h1>
              <p className="text-gray-500 text-sm mt-1">
                Manage your alerts and event updates
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 text-xs font-semibold py-2 px-3.5 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all cursor-pointer"
                >
                  <CheckSquare className="w-3.5 h-3.5" />
                  Mark all as read
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={clearAllNotifications}
                  className="flex items-center gap-1.5 text-red-600 hover:text-red-800 text-xs font-semibold py-2 px-3.5 bg-red-50 hover:bg-red-100 rounded-xl transition-all cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Clear all
                </button>
              )}
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-gray-100 mb-6">
            <button
              onClick={() => {
                setActiveTab('all');
                navigate('/notifications');
              }}
              className={`pb-4 px-4 font-semibold text-sm transition-all border-b-2 -mb-[2px] ${
                activeTab === 'all'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              All Notifications
              <span className="ml-2 bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full font-bold">
                {notifications.length}
              </span>
            </button>
            <button
              onClick={() => {
                setActiveTab('unread');
                navigate('/notifications?filter=unread');
              }}
              className={`pb-4 px-4 font-semibold text-sm transition-all border-b-2 -mb-[2px] flex items-center gap-1.5 ${
                activeTab === 'unread'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              Unread
              {unreadCount > 0 && (
                <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded-full font-extrabold animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>

          {/* Notifications Container */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-blue-600"></div>
              <p className="text-gray-400 text-sm font-medium">Loading notifications...</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-16 px-4 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
              <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mb-4">
                <BellOff className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-1">All caught up!</h3>
              <p className="text-gray-500 text-sm max-w-sm mb-6">
                {activeTab === 'unread' 
                  ? "You have read all notifications in your inbox." 
                  : "You don't have any notifications right now. Stay tuned for upcoming events and announcements!"}
              </p>
              <button
                onClick={() => navigate('/events')}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all shadow-sm hover:shadow active:scale-95 cursor-pointer"
              >
                Explore Events <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredNotifications.map((notification) => {
                const config = getNotificationConfig(notification.eventType, notification.title);
                const IconComponent = config.icon;
                
                return (
                  <div
                    key={notification.id}
                    onClick={(e) => {
                      if (e.target.closest('button') || e.target.closest('a')) {
                        return;
                      }
                      if (!notification.isRead) {
                        markAsRead(notification.id);
                      }
                      if (notification.actionUrl) {
                        if (notification.actionUrl.startsWith('http')) {
                          window.location.href = notification.actionUrl;
                        } else {
                          navigate(notification.actionUrl);
                        }
                      }
                    }}
                    className={`group relative p-5 rounded-2xl border-l-4 ${config.borderColor} border transition-all duration-200 ease-in-out cursor-pointer ${
                      notification.isRead 
                        ? 'bg-white border-gray-100 hover:border-gray-300 hover:shadow-md'
                        : 'bg-blue-50/20 border-blue-100/70 hover:border-blue-200 hover:shadow-md'
                    }`}
                  >
                    <div className="flex gap-4">
                      {/* Icon */}
                      <div className={`p-3 rounded-xl h-fit shrink-0 ${config.bgColor}`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2 mb-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className={`font-bold text-base leading-snug truncate max-w-[280px] sm:max-w-md ${
                              notification.isRead ? 'text-gray-700' : 'text-gray-900'
                            }`}>
                              {notification.title}
                            </h3>
                            {!notification.isRead && (
                              <span className="flex h-2 w-2 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                              </span>
                            )}
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${config.badgeClass}`}>
                              {config.badgeText}
                            </span>
                          </div>
                          <span 
                            title={notification.fullTimestamp}
                            className="text-xs text-gray-400 shrink-0 select-none"
                          >
                            {notification.relativeTime}
                          </span>
                        </div>
                        
                        <div
                          className="text-gray-600 text-sm leading-relaxed mb-3 break-words"
                          dangerouslySetInnerHTML={{ __html: notification.description }}
                        />
                        
                        <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-100/50">
                          {notification.actionUrl ? (
                            <span
                              className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 group-hover:text-blue-800 transition-colors"
                            >
                              Go to Action <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                            </span>
                          ) : (
                            <span />
                          )}
                          
                          <div className="flex gap-3 ml-auto opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                            {!notification.isRead && (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className="flex items-center gap-1 text-gray-500 hover:text-gray-800 text-xs font-bold cursor-pointer bg-gray-50 hover:bg-gray-100 py-1.5 px-3 rounded-lg transition-all"
                              >
                                <Check className="w-3 h-3" />
                                Mark read
                              </button>
                            )}
                            <button
                              onClick={() => deleteNotification(notification.id)}
                              className="flex items-center gap-1 text-red-500 hover:text-red-700 hover:bg-red-50 text-xs font-bold cursor-pointer py-1.5 px-3 rounded-lg transition-all"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;