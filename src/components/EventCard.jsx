import React from 'react'
import appwriteService from "../appwrite/config"
import { Link } from 'react-router-dom'
import { FaCalendarAlt, FaMapMarkerAlt, FaTicketAlt } from 'react-icons/fa'

function EventCard({ $id, title, template, price, date, category, venue, status, showStatus }) {
    const eventDate = new Date(date).toLocaleDateString('en-US', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
    })
    
    const eventTime = new Date(date).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    })

    return (
        <Link to={`/events/${$id}`} className="group block transition-transform duration-300 hover:scale-[1.02]">
            <div className="w-full bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl">
                {/* Image Section */}
                <div className="relative h-56 overflow-hidden">
                    <img 
                        src={template ? appwriteService.getFilePreview(template) : '/placeholder-event.jpg'}
                        alt={title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {showStatus && (
                        <div className="absolute top-2 left-2 bg-white/90 px-3 py-1 rounded-full text-sm font-medium">
                            Status: {status}
                        </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                        <div className="text-white">
                            <h3 className="text-xl font-bold mb-1 truncate">{title}</h3>
                            <div className="flex items-center gap-2 text-sm">
                                <FaCalendarAlt className="text-white/80" />
                                <span>{eventDate} • {eventTime}</span>
                            </div>
                        </div>
                    </div>
                    <span className="absolute top-3 right-3 bg-white/90 px-3 py-1 rounded-full text-sm font-medium text-gray-700">
                        {category}
                    </span>
                </div>

                {/* Details Section */}
                <div className="p-4 space-y-3">
                    <div className="flex items-center gap-2 text-gray-600">
                        <FaMapMarkerAlt className="flex-shrink-0 text-gray-400" />
                        <span className="text-sm truncate">{venue}</span>
                    </div>

                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <FaTicketAlt className="text-blue-600" />
                            <span className="text-lg font-bold text-blue-600">
                                ₹{price?.toLocaleString()}
                            </span>
                        </div>
                        
                        <button 
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
                            onClick={(e) => e.preventDefault()}
                        >
                            Book Now
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default EventCard