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

}

const service = new Service();
export default service;