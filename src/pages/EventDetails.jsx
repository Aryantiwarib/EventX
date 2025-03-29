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
    FaTrash
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
    }, [eventId, userData]) // Added userData to dependencies

    const deleteEvent = () => {
        appwriteService.deleteEvent(event.$id).then((status) => {
            if (status) {
                appwriteService.deleteFile(event.template)
                navigate('/events')
            }
        })
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

    
    const handleCardClick = (e) => {
        navigate(e === "book" ? "/book-event" : `/event/${event}`);
      };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Author Controls - Fixed Positioning */}
                {isAuthor && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="fixed right-6 top-24 flex gap-3 z-50 bg-white/90 backdrop-blur-sm p-3 rounded-xl shadow-lg border border-gray-200"
                    >
                        <Link to={`/edit-event/${event.$id}`}>
                            <Button className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all hover:scale-105">
                                <FaEdit className="text-sm" />
                                <span className="hidden sm:inline">Edit Event</span>
                            </Button>
                        </Link>
                        <Button
                            className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all hover:scale-105"
                            onClick={deleteEvent}
                        >
                            <FaTrash className="text-sm" />
                            <span className="hidden sm:inline">Delete Event</span>
                        </Button>
                    </motion.div>
                )}

                <Link
                    to="/events"
                    className="mb-8 inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                >
                    <FaArrowLeft className="mr-2" />
                    Back to Events
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-xl shadow-lg p-6 mb-8 relative"
                        >
                            <h1 className="text-4xl font-bold text-gray-800 mb-4 font-serif">
                                {event.title}
                            </h1>

                            <div className="relative h-[500px] rounded-xl overflow-hidden mb-6 group">
                                <div
                                    className="relative h-full w-full cursor-zoom-in transition-all duration-500"
                                    onClick={() => setShowImageModal(true)}
                                >
                                    <LazyLoadImage
                                        src={appwriteService.getFilePreview(event.template)}
                                        alt={event.title}
                                        className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
                                        effect="opacity"
                                        beforeLoad={() => setImageLoaded(false)}
                                        afterLoad={() => setImageLoaded(true)}
                                        threshold={200}
                                    />

                                    {!imageLoaded && (
                                        <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-shimmer">
                                            <div className="absolute inset-0 bg-white/30 backdrop-blur-sm" />
                                        </div>
                                    )}

                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-6">
                                        <div className="text-center text-white translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                            <FaExpand className="text-3xl mx-auto mb-2" />
                                            <p className="font-medium tracking-wide">Click to Expand</p>
                                        </div>
                                    </div>
                                </div>

                                <AnimatePresence>
                                    {showImageModal && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[999] flex items-center justify-center p-4"
                                            onClick={(e) => e.target === e.currentTarget && setShowImageModal(false)}
                                        >
                                            <div className="relative max-w-6xl w-full h-[90vh] flex flex-col">
                                                <div className="flex justify-between items-center mb-4 px-4">
                                                    <h2 className="text-xl text-white font-medium">{event.title}</h2>
                                                    <button
                                                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                                                        onClick={() => setShowImageModal(false)}
                                                        aria-label="Close image viewer"
                                                    >
                                                        <FaTimes className="text-2xl text-white" />
                                                    </button>
                                                </div>

                                                <motion.div
                                                    initial={{ scale: 0.95 }}
                                                    animate={{ scale: 1 }}
                                                    className="relative flex-1 bg-black rounded-xl overflow-hidden shadow-2xl"
                                                >
                                                    <img
                                                        src={appwriteService.getFilePreview(event.template)}
                                                        alt={event.title}
                                                        className="w-full h-full object-contain"
                                                        onClick={(e) => e.stopPropagation()}
                                                    />
                                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                                                        <div className="h-1 w-24 bg-white/20 rounded-full overflow-hidden">
                                                            <motion.div
                                                                initial={{ width: 0 }}
                                                                animate={{ width: "100%" }}
                                                                transition={{ duration: 0.8, ease: "easeInOut" }}
                                                                className="h-full bg-white"
                                                            />
                                                        </div>
                                                    </div>
                                                </motion.div>

                                                <div className="mt-4 text-center text-gray-300 text-sm">
                                                    {event.venue} • {eventDate}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        className="flex items-center bg-blue-50 p-4 rounded-lg border border-blue-100"
                                    >
                                        <FaCalendarAlt className="text-blue-600 text-2xl mr-3" />
                                        <div>
                                            <p className="text-sm text-gray-600 mb-1">Date & Time</p>
                                            <p className="font-semibold text-gray-800">
                                                {eventDate} • {eventTime}
                                            </p>
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        className="flex items-center bg-blue-50 p-4 rounded-lg border border-blue-100"
                                    >
                                        <FaMapMarkerAlt className="text-blue-600 text-2xl mr-3" />
                                        <div>
                                            <p className="text-sm text-gray-600 mb-1">Venue</p>
                                            <p className="font-semibold text-gray-800">{event.venue}</p>
                                        </div>
                                    </motion.div>
                                </div>

                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="bg-gray-50 p-6 rounded-xl border border-gray-100"
                                >
                                    <h2 className="text-2xl font-bold text-gray-800 mb-4 font-serif">
                                        Event Details
                                    </h2>
                                    <div className="browser-css text-gray-600 leading-relaxed prose max-w-none">
                                        {parse(event.description || '')}
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Booking Sidebar */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-1"
                    >
                        <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8 border border-gray-100">
                            <div className="space-y-6">
                                <div className="border-b pb-4">
                                    <h3 className="text-2xl font-bold text-gray-800 mb-4 font-serif">
                                        Booking Information
                                    </h3>

                                    <div className="flex items-center mb-3">
                                        <FaTag className="text-gray-600 mr-2" />
                                        <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                                            {event.category}
                                        </span>
                                    </div>

                                    <div className="flex items-center">
                                        <FaMoneyBillWave className="text-gray-600 mr-2" />
                                        <span className="text-2xl font-bold text-gray-800">
                                            ₹{event.price?.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                                
                                <Link to={`/book-event/${event.$id}`}>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                                    onClick={() => handleCardClick("book-event")}
                                >
                                    Book Now
                                </motion.button>
                                </Link>

                                
                            {/* <Button className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all hover:scale-105">
                                <FaEdit className="text-sm" />
                                <span className="hidden sm:inline">Edit Event</span>
                            </Button> */}
                        


                                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                                    <h4 className="font-semibold text-gray-800 mb-2">What's Included</h4>
                                    <ul className="list-disc list-inside text-gray-600 space-y-2">
                                        <li className="flex items-center">
                                            <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                                            Full event access
                                        </li>
                                        <li className="flex items-center">
                                            <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                                            Entry to all sessions
                                        </li>
                                        <li className="flex items-center">
                                            <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                                            Exclusive event goodie bag
                                        </li>
                                        <li className="flex items-center">
                                            <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                                            Networking opportunities
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}

export default EventDetails