import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import appwriteService from '../appwrite/config'
import {
    FaCalendarAlt,
    FaMapMarkerAlt,
    FaTag,
    FaMoneyBillWave,
    FaArrowLeft,
    FaTimes,
    FaExpand,
    FaEdit,
    FaTrash,
    FaUser,
    FaShareAlt,
    FaSearch,
    FaHeart
} from 'react-icons/fa'
import { Button } from '../components'
import parse from 'html-react-parser'
import { motion, AnimatePresence } from 'framer-motion'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import 'react-lazy-load-image-component/src/effects/blur.css'
import { useSelector } from 'react-redux'

function EventDetails() {
    const { eventId } = useParams()
    const navigate = useNavigate()
    const [event, setEvent] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [showImageModal, setShowImageModal] = useState(false)
    const [imageLoaded, setImageLoaded] = useState(false)
    const userData = useSelector((state) => state.auth.userData)
    const [isAuthor, setIsAuthor] = useState(false)
    const [isRegistered, setIsRegistered] = useState(false)
    const [attendeeCount, setAttendeeCount] = useState(0)
    const [liked, setLiked] = useState(false)

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                setLoading(true)
                const data = await appwriteService.getEvent(eventId)

                if (data) {
                    setEvent(data)
                    // Check authorization after data loads
                    if (userData && data.userId === userData.$id) {
                        setIsAuthor(true)
                    }
                    
                    // Fetch attendee count
                    fetchAttendeeCount(data.$id)
                    
                    // Check if user is registered
                    if (userData) {
                        checkUserRegistration(data.$id, userData.$id)
                    }
                } else {
                    setError('Event not found')
                }
            } catch (error) {
                console.error('Error fetching event:', error)
                setError(error.message)
            } finally {
                setLoading(false)
            }
        }

        if (eventId) {
            fetchEvent()
        } else {
            setError('Invalid event ID')
            setLoading(false)
        }
    }, [eventId, userData])

    const fetchAttendeeCount = async (eventId) => {
        try {
            // Replace this with your actual attendee count fetching logic
            const attendees = await appwriteService.getEventAttendees(eventId)
            setAttendeeCount(attendees?.length || 0)
        } catch (error) {
            console.error('Error fetching attendee count:', error)
            setAttendeeCount(0)
        }
    }

    const checkUserRegistration = async (eventId, userId) => {
        try {
            // Replace this with your actual registration check logic
            const registrationData = await appwriteService.checkEventRegistration(eventId, userId)
            setIsRegistered(!!registrationData)
        } catch (error) {
            console.error('Error checking registration:', error)
            setIsRegistered(false)
        }
    }

    const deleteEvent = () => {
        appwriteService.deleteEvent(event.$id).then((status) => {
            if (status) {
                appwriteService.deleteFile(event.template)
                navigate('/events')
            }
        })
    }

    const toggleLike = () => {
        setLiked(!liked)
        // You could add API call here to save the like status
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-red-500 text-xl text-center p-4 max-w-2xl">
                    Error loading event: {error}
                    <Link
                        to="/events"
                        className="mt-4 block text-blue-600 hover:text-blue-800 transition-colors"
                    >
                        <FaArrowLeft className="inline mr-2" />
                        Back to Events
                    </Link>
                </div>
            </div>
        )
    }

    if (!event) return null

    const eventDate = new Date(event.date).toLocaleDateString('en-US', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    })

    const eventTime = new Date(event.date).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    })

    return (
        <div className="bg-white min-h-screen">
            {/* Top Navigation Bar */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link to="/events" className="flex items-center text-blue-600 hover:text-blue-800 transition-colors">
                            <FaArrowLeft className="mr-2" />
                            <span className="font-medium">Back</span>
                        </Link>
                        <div className="flex items-center space-x-4">
                            {isAuthor && (
                                <div className="flex gap-2">
                                    <Link to={`/edit-event/${event.$id}`}>
                                        <Button className="bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-all border border-gray-200 hover:shadow-md">
                                            <FaEdit className="text-sm" />
                                            <span>Edit</span>
                                        </Button>
                                    </Link>
                                    <Button
                                        className="bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-all border border-gray-200 hover:shadow-md hover:text-red-600"
                                        onClick={deleteEvent}
                                    >
                                        <FaTrash className="text-sm" />
                                        <span>Delete</span>
                                    </Button>
                                </div>
                            )}
                            <button 
                                className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 hover:scale-105 transition-all"
                                title="Share"
                            >
                                <FaShareAlt />
                            </button>
                            <button 
                                className={`p-2 rounded-full ${liked ? 'bg-red-50 text-red-500' : 'bg-gray-100 text-gray-600'} hover:bg-red-50 hover:text-red-500 hover:scale-105 transition-all`}
                                onClick={toggleLike}
                                title={liked ? "Unlike" : "Like"}
                            >
                                <FaHeart />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Image Section */}
                <div className="relative rounded-xl overflow-hidden h-[400px] mb-8 group">
                    <LazyLoadImage
                        src={appwriteService.getFilePreview(event.template)}
                        alt={event.title}
                        className="w-full h-full object-cover cursor-pointer transition-transform duration-200 group-hover:scale-105"
                        effect="opacity"
                        beforeLoad={() => setImageLoaded(false)}
                        afterLoad={() => setImageLoaded(true)}
                        threshold={200}
                        onClick={() => setShowImageModal(true)}
                    />
                    {!imageLoaded && (
                        <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-shimmer" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                        <div className="p-8 w-full">
                            <div className="mb-2">
                                <span className="inline-block bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                                    {event.category}
                                </span>
                            </div>
                            <h1 className="text-4xl font-bold text-white mb-4">{event.title}</h1>
                            <div className="flex flex-wrap gap-4 text-white">
                                <div className="flex items-center">
                                    <FaCalendarAlt className="mr-2" />
                                    <span>{eventDate} at {eventTime}</span>
                                </div>
                                <div className="flex items-center">
                                    <FaMapMarkerAlt className="mr-2" />
                                    <span>{event.venue}</span>
                                </div>
                                {attendeeCount > 0 && (
                                    <div className="flex items-center">
                                        <FaUser className="mr-2" />
                                        <span>{attendeeCount} {attendeeCount === 1 ? 'attendee' : 'attendees'}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    {/* View Fullscreen Button */}
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                            className="p-3 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                            onClick={() => setShowImageModal(true)}
                            title="View Fullscreen"
                        >
                            <FaExpand />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Content Column */}
                    <div className="lg:col-span-2">
                        {/* Tabs */}
                        <div className="mb-8 border-b">
                            <div className="flex space-x-8">
                                <button className="pb-4 px-2 border-b-2 border-blue-500 font-medium text-blue-600 transition-colors hover:text-blue-700">
                                    About
                                </button>
                                <button className="pb-4 px-2 text-gray-500 hover:text-gray-900 transition-colors">
                                    Schedule
                                </button>
                                <button className="pb-4 px-2 text-gray-500 hover:text-gray-900 transition-colors">
                                    Organizer
                                </button>
                            </div>
                        </div>

                        {/* About Section */}
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold mb-4">About This Event</h2>
                            <div className="prose max-w-none text-gray-600">
                                {parse(event.description || '')}
                            </div>
                        </div>

                        {/* What to Expect Section */}
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold mb-4">What to Expect</h2>
                            <div className="space-y-4">
                                <div className="flex items-start group p-3 rounded-lg transition-all hover:bg-blue-50">
                                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-4 group-hover:bg-blue-200 transition-colors">
                                        <FaCalendarAlt />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg group-hover:text-blue-700 transition-colors">Engaging Sessions</h3>
                                        <p className="text-gray-600">Participate in interactive workshops and sessions</p>
                                    </div>
                                </div>
                                <div className="flex items-start group p-3 rounded-lg transition-all hover:bg-blue-50">
                                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-4 group-hover:bg-blue-200 transition-colors">
                                        <FaUser />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg group-hover:text-blue-700 transition-colors">Networking Opportunities</h3>
                                        <p className="text-gray-600">Connect with like-minded individuals and professionals</p>
                                    </div>
                                </div>
                                <div className="flex items-start group p-3 rounded-lg transition-all hover:bg-blue-50">
                                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-4 group-hover:bg-blue-200 transition-colors">
                                        <FaTag />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg group-hover:text-blue-700 transition-colors">Exclusive Perks</h3>
                                        <p className="text-gray-600">Receive special giveaways and certificates</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-6 transition-all hover:shadow-md">
                            <div className="mb-6">
                                <p className="text-gray-500 mb-1">Price</p>
                                <p className="text-3xl font-bold">₹{event.price?.toLocaleString()}</p>
                            </div>

                            {userData ? (
                                <>
                                    {isRegistered ? (
                                        <Link to={`/my-ticket/${event.$id}`}>
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                className="w-full bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 py-3 rounded-lg font-medium mb-6 transition-colors"
                                            >
                                                View My Ticket
                                            </motion.button>
                                        </Link>
                                    ) : (
                                        <Link to={`/book-event/${event.$id}`}>
                                            <motion.button
                                                whileHover={{ scale: 1.02, backgroundColor: "#2563EB" }}
                                                whileTap={{ scale: 0.98 }}
                                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium mb-6 transition-colors shadow-sm hover:shadow"
                                            >
                                                Register
                                            </motion.button>
                                        </Link>
                                    )}
                                </>
                            ) : (
                                <Link to={`/book-event/${event.$id}`}>
                                    <motion.button
                                        whileHover={{ scale: 1.02, backgroundColor: "#2563EB" }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium mb-6 transition-colors shadow-sm hover:shadow"
                                    >
                                        Register
                                    </motion.button>
                                </Link>
                            )}

                            <div className="flex flex-wrap gap-2 mb-6">
                                {["culture", "performance", "food"].map((tag) => (
                                    <span key={tag} className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-800 hover:bg-gray-200 cursor-pointer transition-colors hover:text-gray-900">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            {/* Location Section */}
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold mb-2">Location</h3>
                                <div className="bg-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                                    <p className="text-gray-800">{event.venue}</p>
                                    <div className="mt-2 h-32 bg-gray-200 rounded-lg relative group overflow-hidden">
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/20 transition-opacity">
                                            <FaSearch className="text-white text-xl" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Similar Events Section */}
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Similar Events</h3>
                                <p className="text-gray-500 text-sm">No similar events found</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="bg-white border-t mt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div>
                            <div className="flex items-center mb-4">
                                <div className="text-blue-600 font-bold text-xl">EventX</div>
                            </div>
                            <p className="text-sm text-gray-600">
                                EventX is the ultimate platform for college event management, ticket generation, and check-in services.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-4">Discover</h3>
                            <ul className="space-y-2 text-sm text-gray-600">
                                {["Events", "Categories", "Organizers", "Venues"].map((item) => (
                                    <li key={item} className="hover:text-blue-600 cursor-pointer transition-colors">{item}</li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-4">Company</h3>
                            <ul className="space-y-2 text-sm text-gray-600">
                                {["About Us", "Contact", "Careers", "Press"].map((item) => (
                                    <li key={item} className="hover:text-blue-600 cursor-pointer transition-colors">{item}</li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-4">Support</h3>
                            <ul className="space-y-2 text-sm text-gray-600">
                                {["Help Center", "Terms of Service", "Privacy Policy", "FAQ"].map((item) => (
                                    <li key={item} className="hover:text-blue-600 cursor-pointer transition-colors">{item}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="mt-8 pt-8 border-t text-sm text-gray-600">
                        © 2025 EventX. All rights reserved.
                    </div>
                </div>
            </div>

            {/* Image Modal - Full Screen */}
            <AnimatePresence>
                {showImageModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center"
                        onClick={(e) => e.target === e.currentTarget && setShowImageModal(false)}
                    >
                        <motion.div 
                            className="relative w-full h-full flex flex-col items-center justify-center"
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                        >
                            <button
                                className="absolute top-4 right-4 p-3 bg-black/50 hover:bg-black/70 rounded-full transition-colors z-10"
                                onClick={() => setShowImageModal(false)}
                            >
                                <FaTimes className="text-2xl text-white" />
                            </button>
                            <div className="w-full h-full flex items-center justify-center p-4">
                                <img
                                    src={appwriteService.getFilePreview(event.template)}
                                    alt={event.title}
                                    className="max-h-full max-w-full object-contain"
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default EventDetails