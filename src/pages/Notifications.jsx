import React, { useState, useEffect } from 'react';
import { Client, Databases, Account } from "appwrite";
import conf from '../conf/conf.js';
import service from '../appwrite/config.js';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [subscription, setSubscription] = useState(null);

  const client = new Client();
  client
    .setEndpoint(conf.appwriteUrl)
    .setProject(conf.appwriteProjectId);
  
  const account = new Account(client);

  const formatDescription = (text) => {
    return text.replace(/\n/g, '<br />');
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatNotification = (doc) => ({
    id: doc.$id,
    title: doc.title,
    description: formatDescription(doc.description),
    eventType: doc.eventType,
    timestamp: formatTimestamp(doc.$createdAt),
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
      setUnreadCount(prev => prev - 1);
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
        setUnreadCount(prev => prev - 1);
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const markAllAsRead = async () => {
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

  const getEventIcon = (eventType) => {
    const icons = {
      concert: '🎵',
      music: '🎵',
      conference: '💻',
      tech: '💻',
      exhibition: '🎨',
      art: '🎨',
      fitness: '🏋️',
      sports: '⚽',
      food: '🍔',
      dining: '🍽️',
      educational: '📚',
      workshop: '🔧',
      social: '👥',
      networking: '🤝'
    };
    return icons[eventType?.toLowerCase()] || '📅';
  };

// Improved deduplication function in fetchNotifications
const fetchNotifications = async () => {
    setLoading(true);
    try {
      const userId = await getCurrentUser();
      if (!userId) throw new Error("User not authenticated");
      
      const response = await service.getUserNotifications(userId);
      
      const fetchedNotifications = response.documents.map(doc => formatNotification(doc));
      
      // Better deduplication that considers content, not just IDs
      const uniqueNotifications = [];
      const seen = new Set();
      
      fetchedNotifications.forEach(notification => {
        // Create a unique key based on eventId and title
        const uniqueKey = `${notification.eventId}-${notification.title}`;
        
        if (!seen.has(uniqueKey)) {
          seen.add(uniqueKey);
          uniqueNotifications.push(notification);
        }
      });
      
      setNotifications(uniqueNotifications);
      calculateUnreadCount(uniqueNotifications);
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
      return user.$id;
    } catch (error) {
      console.error("Error getting current user:", error);
      return null;
    }
  };

  const setupRealtime = async () => {
    const userId = await getCurrentUser();
    if (!userId) return;
  
    const unsubscribe = client.subscribe(
      `databases.${conf.appwriteDatabaseId}.collections.${conf.appwriteCollectionNotificationsId}.documents`,
      response => {
        if (response.events.includes('databases.*.collections.*.documents.*.create')) {
          const newNotification = response.payload;
          if (newNotification.userId === userId) {
            setNotifications(prev => {
              // Create a formatted notification
              const formattedNotification = formatNotification(newNotification);
              
              // Check if notification with same eventId and title already exists
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
    setSubscription(unsubscribe);
  };

  useEffect(() => {
    const initialize = async () => {
      await getCurrentUser();
      await fetchNotifications();
      await setupRealtime();
    };

    initialize();

    return () => {
      if (subscription) {
        subscription();
      }
    };
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
              <p className="text-gray-500">{notifications.length} total notifications</p>
            </div>
            {unreadCount > 0 && (
              <div className="flex gap-4 items-center">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {unreadCount} unread
                </span>
                <button
                  onClick={markAllAsRead}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Mark all as read
                </button>
              </div>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">🎉</div>
              <h3 className="text-xl font-medium text-gray-700 mb-2">All caught up!</h3>
              <p className="text-gray-500">No new notifications</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border transition-all ${
                    notification.isRead 
                      ? 'bg-gray-50 border-gray-200'
                      : 'bg-white border-blue-200 shadow-sm'
                  }`}
                >
                  <div className="flex gap-4">
                    <div className={`text-2xl p-3 rounded-full ${
                      notification.isRead ? 'bg-gray-200' : 'bg-blue-100'
                    }`}>
                      {getEventIcon(notification.eventType)}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className={`font-medium ${
                          notification.isRead ? 'text-gray-700' : 'text-gray-900'
                        }`}>
                          {notification.title}
                        </h3>
                        <span className="text-sm text-gray-500">
                          {notification.timestamp}
                        </span>
                      </div>
                      <div
                        className="text-gray-600 mb-3"
                        dangerouslySetInnerHTML={{ __html: notification.description }}
                      />
                      <div className="flex justify-between items-center">
                        {notification.actionUrl && (
                          <a
                            href={notification.actionUrl}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            View Event →
                          </a>
                        )}
                        <div className="flex gap-3">
                          {!notification.isRead && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="text-gray-500 hover:text-gray-700 text-sm"
                            >
                              Mark read
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="text-red-500 hover:text-red-700 text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  {!notification.isRead && (
                    <div className="mt-2 h-1 w-full bg-blue-200 rounded-full">
                      <div className="h-full bg-blue-500 rounded-full animate-pulse" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;