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

    async createEvent({ title, slug, price, CollegeYear, category, date, venue, template, description, status, userId}) {
        try {
            if (!template || typeof template !== "string") {
                throw new Error("Valid template ID is required");
            }

            return await this.databases.createDocument(
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

    async deleteEvent(slug){
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

    async getEvent(slug){
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

    async getEvents(queries = [Query.equal("status", "active")]){
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
    
    async deleteFile(fileId){
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

    getFilePreview(fileId){
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
                status: 'confirmed',
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




}

const service = new Service();
export default service;