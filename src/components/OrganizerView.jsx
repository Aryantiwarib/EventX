import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import service from '../appwrite/config';
import { Query } from "appwrite";
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaEdit, FaTrashAlt, FaPlus, FaCheckCircle, FaSpinner } from 'react-icons/fa';
import { toast } from 'sonner';

const OrganizerView = ({ userId }) => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true);
            try {
                const { documents } = await service.getEvents([
                    Query.equal('userId', userId)
                ]);
                
                // Fetch correct bookings count dynamically for each event
                const eventsWithCounts = await Promise.all(
                    documents.map(async (event) => {
                        try {
                            const bookings = await service.getEventBookings(event.$id);
                            return {
                                ...event,
                                attendeeCount: bookings.total || bookings.documents?.length || 0
                            };
                        } catch (err) {
                            console.error(`Failed to fetch bookings for event ${event.$id}:`, err);
                            return {
                                ...event,
                                attendeeCount: 0
                            };
                        }
                    })
                );
                setEvents(eventsWithCounts);
            } catch (error) {
                console.error("Failed to fetch organizer events:", error);
                toast.error("Failed to load your events");
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchEvents();
        }
    }, [userId]);

    const handleDeleteEvent = async (slug, title) => {
        if (window.confirm(`Are you sure you want to delete the event "${title}"? This cannot be undone.`)) {
            const deleteToastId = toast.loading(`Deleting event "${title}"...`);
            try {
                await service.deleteEvent(slug);
                setEvents(prevEvents => prevEvents.filter(e => e.$id !== slug));
                toast.success(`Event "${title}" deleted successfully`, { id: deleteToastId });
            } catch (error) {
                console.error("Failed to delete event:", error);
                toast.error("Failed to delete event. Please try again.", { id: deleteToastId });
            }
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <FaSpinner className="animate-spin text-3xl text-blue-600 mb-3" />
                <p className="text-sm font-medium">Loading your events...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center border-b pb-4 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <FaCheckCircle className="text-blue-600" />
                    Events You Organized
                </h2>
                <Link
                    to="/add-event"
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm hover:shadow"
                >
                    <FaPlus /> Create Event
                </Link>
            </div>

            {events.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                    <p className="text-gray-500 mb-4 font-medium">You haven't created any events yet.</p>
                    <Link
                        to="/add-event"
                        className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                        <FaPlus /> Create Your First Event
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {events.map(event => {
                        const isPassed = new Date(event.date) < new Date();
                        return (
                            <div 
                                key={event.$id} 
                                className="bg-white p-5 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                            >
                                <div>
                                    <div className="flex justify-between items-start mb-3">
                                        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                                            isPassed ? 'bg-amber-100 text-amber-800' :
                                            event.status === 'active' ? 'bg-green-100 text-green-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                            {isPassed ? 'Passed' : event.status === 'active' ? 'Active' : 'Draft'}
                                        </span>
                                        <span className="text-sm font-bold text-gray-900">
                                            {event.price && parseFloat(event.price) > 0 ? `₹${parseFloat(event.price).toLocaleString()}` : 'Free'}
                                        </span>
                                    </div>
                                    <h3 className="font-semibold text-lg text-gray-900 mb-1.5 line-clamp-1">{event.title}</h3>
                                    <p className="text-xs text-gray-500 bg-gray-100 rounded-md py-1 px-2.5 inline-block mb-4 font-medium">
                                        {event.category || 'General'}
                                    </p>
                                    <div className="space-y-2 mb-5">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <FaCalendarAlt className="text-gray-400 shrink-0" />
                                            <span>
                                                {new Date(event.date).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <FaMapMarkerAlt className="text-gray-400 shrink-0" />
                                            <span className="line-clamp-1">{event.venue || 'Online / TBD'}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="border-t pt-4 mt-auto flex flex-col gap-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-gray-500 font-medium">Total Bookings</span>
                                        <span className="text-sm font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                                            <FaUsers className="text-xs" />
                                            {event.attendeeCount || 0}
                                        </span>
                                    </div>
                                    <div className="flex gap-2">
                                        <Link
                                            to={`/event-attendees/${event.$id}`}
                                            className="flex-1 text-center bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                                        >
                                            <FaUsers className="text-xs" /> View Attendees
                                        </Link>
                                        <Link
                                            to={`/edit-event/${event.$id}`}
                                            className="bg-gray-50 hover:bg-gray-100 text-gray-600 p-2 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center border border-gray-200"
                                            title="Edit Event"
                                        >
                                            <FaEdit className="text-sm" />
                                        </Link>
                                        <button
                                            onClick={() => handleDeleteEvent(event.$id, event.title)}
                                            className="bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center border border-red-200"
                                            title="Delete Event"
                                        >
                                            <FaTrashAlt className="text-sm" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default OrganizerView;