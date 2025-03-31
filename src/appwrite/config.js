import conf from '../conf/conf.js';
import { Client, ID, Databases, Storage, Query } from "appwrite";

export class Service {
    client = new Client();
    databases;
    bucket;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);

        this.databases = new Databases(this.client);
        this.bucket = new Storage(this.client);
    }

    async createEvent({ title, slug, price, CollegeYear, category, date, venue, template, description, status, userId }) {
        try {
            if (!template || typeof template !== "string") {
                throw new Error("Valid template ID is required");
            }

            const event = await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                {
                    title,
                    price,
                    CollegeYear: Array.isArray(CollegeYear) ? CollegeYear.join(', ') : CollegeYear,
                    category,
                    date,
                    venue,
                    template,
                    description,
                    status,
                    userId,
                    attendees: '',

                }
            );


            await this.createNotificationTemplate({
                title: `New Event Added: ${title}`,
                description: description.substring(0, 120) + (description.length > 120 ? '...' : ''),
                eventType: category,
                actionUrl: `/events/${slug}`,
                eventId: slug
            });


            return event;
        } catch (error) {
            console.error(`Appwrite :: createEvent :: ${error}`);
            throw error;
        }
    }

    async updateEvent(slug, { title, price, CollegeYear, category, date, venue, template, description, status, userId }) {

        try {
            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                {
                    title,
                    price,
                    CollegeYear: Array.isArray(CollegeYear) ? CollegeYear.join(', ') : CollegeYear,
                    category,
                    date,
                    venue,
                    template,
                    description,
                    status,
                    userId,
                }
            );
        } catch (error) {
            console.error(`Appwrite :: updateEvent :: ${error}`);
            throw error;
        }
    }


    async uploadFile(file) {
        try {
            const response = await this.bucket.createFile(
                conf.appwriteBucketId,
                ID.unique(),
                file
            );
            return response;
        } catch (error) {
            console.error(`Appwrite :: uploadFile :: ${error}`);
            throw error;
        }
    }

    async deleteEvent(slug) {
        try {
            return await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
            )

        } catch (error) {
            console.log(`Appwrite :: deleteEvent :: error: ${error}`);
            throw error;

        }
    }

    async getEvent(slug) {
        try {
            return await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
            )

        } catch (error) {
            console.log(`Appwrite :: getEvent :: error: ${error}`);
        }
    }

    async getEvents(queries = [Query.equal("status", "active")]) {
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                queries,
            )
        } catch (error) {
            console.log(`Appwrite :: getEvents :: error: ${error}`);
            throw error;

        }
    }

    async deleteFile(fileId) {
        try {
            await this.bucket.deleteFile(
                conf.appwriteBucketId,
                fileId,
            )
            return true;
        } catch (error) {
            console.log(`Appwrite :: deleteFile :: error: ${error} `);
            return false;
        }
    }

    getFilePreview(fileId) {
        return this.bucket.getFilePreview(
            conf.appwriteBucketId,
            fileId,
        )
    }


    // BOOKING AND PAYMENTS METHODS 

    // Booking Methods
    async createBooking({ eventId, userId, paymentId, ticketHolderName, ticketHolderEmail, amount }) {
        try {
            return await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionBookingId,
                ID.unique(),
                {
                    eventId,
                    userId,
                    paymentId,
                    ticketHolderName,
                    ticketHolderEmail,
                    amount: amount.toString(),
                    status: 'registered', // Default status
                    bookingDate: new Date().toISOString()
                }
            );
        } catch (error) {
            console.error(`Appwrite :: createBooking :: ${error}`);
            throw error;
        }
    }

    async getBookingsByUser(userId) {
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionBookingId,
                [Query.equal('userId', userId)]
            );
        } catch (error) {
            console.error(`Appwrite :: getBookingsByUser :: ${error}`);
            throw error;
        }
    }

    async getEventBookings(eventId) {
        if (!eventId) {
            throw new Error("Event ID is required");
        }
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionBookingId,
                [Query.equal('eventId', eventId)]
            );
        } catch (error) {
            console.error(`Appwrite :: getEventBookings :: ${error}`);
            throw error;
        }
    }

    // Payment Methods
    async createPaymentRecord(paymentData) {
        try {
            return await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionPaymentsId,
                ID.unique(),
                {
                    userId: paymentData.userId,
                    eventId: paymentData.eventId,
                    paymentId: paymentData.paymentId,
                    amount: paymentData.amount,
                    currency: paymentData.currency,
                    paymentMethod: paymentData.paymentMethod,
                    status: paymentData.status,
                    paymentDate: new Date().toISOString()
                }
            );
        } catch (error) {
            console.error(`Appwrite :: createPaymentRecord :: ${error}`);
            throw error;
        }
    }

    async getPaymentsByUser(userId) {
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionPaymentsId,
                [Query.equal('userId', userId)]
            );
        } catch (error) {
            console.error(`Appwrite :: getPaymentsByUser :: ${error}`);
            throw error;
        }
    }


    // Add this to your service class
    async deleteBooking(bookingId) {
        try {
            await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionBookingId,
                bookingId
            );
            return true;
        } catch (error) {
            console.error('Failed to delete booking:', error);
            return false;
        }
    }

    async deletePayment(paymentId) {
        try {
            await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionPaymentsId,
                paymentId
            );
            return true;
        } catch (error) {
            console.error('Failed to delete payment:', error);
            return false;
        }
    }


    //   attendees methods 


    // Add these methods to your Service class

    // Get single attendee by booking ID
    async getAttendee(bookingId) {
        try {
            return await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionBookingId,
                bookingId
            );
        } catch (error) {
            console.error(`Appwrite :: getAttendee :: ${error}`);
            throw error;
        }
    }

    // Update attendee status
    async updateAttendeeStatus(bookingId, newStatus) {
        try {
            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionBookingId,
                bookingId,
                {
                    status: newStatus
                }
            );
        } catch (error) {
            console.error(`Appwrite :: updateAttendeeStatus :: ${error}`);
            throw error;
        }
    }

    // Get attendees with status filter
    async getAttendeesByStatus(eventId, status) {
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionBookingId,
                [
                    Query.equal('eventId', eventId),
                    Query.equal('status', status)
                ]
            );
        } catch (error) {
            console.error(`Appwrite :: getAttendeesByStatus :: ${error}`);
            throw error;
        }
    }


    //////////////// notification methods hai /////////////// 

    async createNotificationTemplate(notification) {
        try {
          return await this.databases.createDocument(
            conf.appwriteDatabaseId,
            conf.appwriteCollectionNotificationsTemplatesId,
            ID.unique(),
            {
              title: notification.title,
              description: notification.description,
              eventType: notification.eventType,
              actionUrl: notification.actionUrl,
              eventId: notification.eventId,
              isTemplate: true
              // REMOVED: createdAt - Appwrite adds this automatically as $createdAt
            }
          );
        } catch (error) {
          console.error(`Appwrite :: createNotificationTemplate :: ${error}`);
          throw error;
        }
      }

      async createUserNotification(userId, notification) {
        try {
          return await this.databases.createDocument(
            conf.appwriteDatabaseId,
            conf.appwriteCollectionNotificationsId,
            ID.unique(),
            {
              title: notification.title,
              description: notification.description,
              eventType: notification.eventType,
              actionUrl: notification.actionUrl,
              eventId: notification.eventId,
              userId: userId,
              isRead: false
              // REMOVED: createdAt - Appwrite adds this automatically as $createdAt
            }
          );
        } catch (error) {
          console.error(`Appwrite :: createUserNotification :: ${error}`);
          throw error;
        }
      }

      async getUserNotifications(userId) {
        try {
          // First get user-specific notifications
          const userNotifications = await this.databases.listDocuments(
            conf.appwriteDatabaseId,
            conf.appwriteCollectionNotificationsId,
            [
              Query.equal('userId', userId),
              Query.orderDesc('$createdAt'),
              Query.limit(100)
            ]
          );
      
          // Get template notifications
          const templateNotifications = await this.databases.listDocuments(
            conf.appwriteDatabaseId,
            conf.appwriteCollectionNotificationsTemplatesId,
            [
              Query.equal('isTemplate', true),
              Query.orderDesc('$createdAt'),
              Query.limit(20)
            ]
          );
      
          // Check which templates haven't been converted to user notifications
          const existingEventIds = new Set(userNotifications.documents.map(doc => doc.eventId));
          const newTemplates = templateNotifications.documents.filter(template => 
            !existingEventIds.has(template.eventId)
          );
      
          // Create user copies of only new template notifications
          if (newTemplates.length > 0) {
            const copyPromises = newTemplates.map(template => 
              this.createUserNotification(userId, {
                title: template.title,
                description: template.description,
                eventType: template.eventType,
                actionUrl: template.actionUrl,
                eventId: template.eventId
              })
            );
            await Promise.all(copyPromises);
          }
      
          // Return final combined list
          return await this.databases.listDocuments(
            conf.appwriteDatabaseId,
            conf.appwriteCollectionNotificationsId,
            [
              Query.equal('userId', userId),
              Query.orderDesc('$createdAt'),
              Query.limit(100)
            ]
          );
        } catch (error) {
          console.error(`Appwrite :: getUserNotifications :: ${error}`);
          throw error;
        }
      }



    
getLastNotificationDate(notifications) {
    if (!notifications || notifications.length === 0) {
      return '1970-01-01T00:00:00Z'; // Very old date if no notifications exist
    }
    return notifications[0].$createdAt;
  }
      

    async markNotificationAsRead(notificationId) {
        try {
            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionNotificationsId,
                notificationId,
                {
                    isRead: true
                }
            );
        } catch (error) {
            console.error(`Appwrite :: markNotificationAsRead :: ${error}`);
            throw error;
        }
    }

    async deleteNotification(notificationId) {
        try {
            return await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionNotificationsId,
                notificationId
            );
        } catch (error) {
            console.error(`Appwrite :: deleteNotification :: ${error}`);
            throw error;
        }
    }

    async markAllNotificationsRead(userId) {
        try {
            const { documents } = await this.getUserNotifications(userId);
            const unread = documents.filter(n => !n.isRead);

            const promises = unread.map(n =>
                this.markNotificationAsRead(n.$id)
            );

            await Promise.all(promises);
            return true;
        } catch (error) {
            console.error(`Appwrite :: markAllNotificationsRead :: ${error}`);
            throw error;
        }
    }




}

const service = new Service();
export default service;