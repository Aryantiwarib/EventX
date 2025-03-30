import React from 'react';
import appwriteService from "../appwrite/config";
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers } from 'react-icons/fa';
import DOMPurify from 'dompurify'; // Make sure to install this for sanitization

function EventCard({ $id, title, description, template, price, date, category, venue, status, showStatus, attendees, isFeatured }) {
    const eventDate = new Date(date).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
    });
    
    const eventYear = new Date(date).getFullYear();
    
    // Price display logic - Free or price value
    const priceDisplay = price > 0 ? `₹${price}` : "Free";
    
    // Get attendees count or use a default
    const attendeeCount = attendees || 0;

    // Parse and sanitize RTE content
    const parseDescription = (rteContent) => {
        if (!rteContent) return 'Join us for this exciting event!';
        
        try {
            // If stored as JSON string, parse it
            const content = typeof rteContent === 'string' ? 
                JSON.parse(rteContent) : rteContent;
                
            // Check if it's Delta format (Quill) or simple HTML
            if (content.ops) {
                // For Quill Delta format
                // This is simplified - you might need a proper Delta to HTML converter
                return content.ops
                    .map(op => op.insert)
                    .join('')
                    .substring(0, 150) + '...';
            } else if (typeof content === 'string') {
                // For HTML string content
                return content.substring(0, 150) + '...';
            } else {
                // For other formats
                return 'Join us for this exciting event!';
            }
        } catch (error) {
            // If it's not JSON, assume it's plain text or HTML
            return rteContent.substring(0, 150) + '...';
        }
    };

    // Create plain text version for cards
    const createPlainText = (htmlContent) => {
        if (!htmlContent) return '';
        
        // Create a temporary div to extract text from HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlContent;
        const textContent = tempDiv.textContent || tempDiv.innerText || '';
        
        return textContent.length > 120 ? 
            textContent.substring(0, 120) + '...' : 
            textContent;
    };
    
    // Get sanitized description
    const parsedDescription = parseDescription(description);
    const plainDescription = createPlainText(parsedDescription);

    return (
        <Link to={`/events/${$id}`} className={`block group ${isFeatured ? 'col-span-full md:col-span-2' : ''}`}>
            <div className="w-full bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 h-full border border-gray-100">
                <div className={`flex ${isFeatured ? 'flex-col md:flex-row' : 'flex-col'} h-full`}>
                    {/* Image Section */}
                    <div className={`relative overflow-hidden ${isFeatured ? 'md:w-2/3 h-64 md:h-auto' : 'h-48'}`}>
                        <img 
                            src={template ? appwriteService.getFilePreview(template) : '/placeholder-event.jpg'}
                            alt={title}
                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        
                        {/* Price Tag */}
                        <div className="absolute top-3 right-3">
                            <span className={`${price > 0 ? 'bg-blue-600 text-white' : 'bg-green-500 text-white'} px-3 py-1 rounded-full text-sm font-medium`}>
                                {priceDisplay}
                            </span>
                        </div>
                        
                        {/* Category Badge */}
                        <div className="absolute bottom-3 left-3">
                            <span className="bg-white/90 px-3 py-1 rounded-full text-sm font-medium text-gray-700">
                                {category}
                            </span>
                        </div>
                        
                        {/* Status Badge (if applicable) */}
                        {showStatus && (
                            <div className="absolute top-3 left-3">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                    status === 'active' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'
                                }`}>
                                    {status}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Content Section */}
                    <div className={`flex flex-col justify-between p-4 ${isFeatured ? 'md:w-1/3' : ''}`}>
                        <div>
                            {/* Title */}
                            <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                                {title}
                            </h3>
                            
                            {/* Description (for featured cards or when available) */}
                            {(isFeatured || description) && (
                                <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                                    {plainDescription || 'Join us for this exciting event!'}
                                </p>
                            )}
                        </div>
                        
                        {/* Event Details */}
                        <div className="space-y-2 text-sm text-gray-600 mt-auto">
                            {/* Date */}
                            <div className="flex items-center gap-2">
                                <FaCalendarAlt className="text-blue-500" />
                                <span>{eventDate} • {eventYear}</span>
                            </div>
                            
                            {/* Location */}
                            <div className="flex items-center gap-2">
                                <FaMapMarkerAlt className="text-blue-500" />
                                <span className="truncate">{venue}</span>
                            </div>
                            
                            {/* Attendees */}
                            <div className="flex items-center gap-2">
                                <FaUsers className="text-blue-500" />
                                <span>{attendeeCount} attending</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default EventCard;