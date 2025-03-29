const conf ={
    appwriteUrl:String(import.meta.env.VITE_APPWRITE_URL),
    appwriteProjectId:String(import.meta.env.VITE_APPWRITE_PROJECT_ID),
    appwriteDatabaseId:String(import.meta.env.VITE_APPWRITE_DATABASE_ID),
    appwriteCollectionId:String(import.meta.env.VITE_APPWRITE_COLLECTION_ID),
    appwriteBucketId:String(import.meta.env.VITE_APPWRITE_BUCKET_ID),
    appwriteCollectionBookingId:String(import.meta.env.VITE_APPWRITE_COLLECTION_BOOKING_ID),
    appwriteCollectionPaymentsId:String(import.meta.env.VITE_APPWRITE_COLLECTION_PAYMENTS_ID)
}


export default conf