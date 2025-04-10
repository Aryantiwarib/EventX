import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import appwriteService from '../../appwrite/config';
import { Button } from '../index';
import { format } from 'date-fns';
import { QRCodeSVG } from 'qrcode.react';

function EventTickets() {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const currentUser = useSelector((state) => state.auth.userData);
    const [tickets, setTickets] = useState([]);
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchEventAndTickets = async () => {
            try {
                if (!currentUser || !currentUser.$id) {
                    setError('Please log in to view your tickets');
                    setLoading(false);
                    return;
                }

                // Fetch event details
                const eventData = await appwriteService.getEvent(eventId);
                if (!eventData) {
                    setError('Event not found');
                    setLoading(false);
                    return;
                }
                setEvent(eventData);

                // Fetch user's bookings for this event
                // const userBookings = await appwriteService.getUserBookings(currentUser.$id);
                // const eventTickets = userBookings.filter(booking => booking.eventId === eventId);

                const bookingsResponse = await appwriteService.getUserBookings(currentUser.$id);
                const userBookings = bookingsResponse.documents || [];
                const eventTickets = userBookings.filter(booking => booking.eventId === eventId);
                
                if (eventTickets.length === 0) {
                    // No tickets found, but this is not an error
                    setTickets([]);
                    setLoading(false);
                    return;
                }
                
                setTickets(eventTickets);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        if (eventId) {
            fetchEventAndTickets();
        } else {
            setError('Invalid event ID');
            setLoading(false);
        }
    }, [eventId, currentUser]);

    const handleBookMore = () => {
        navigate(`/events/${eventId}/book`);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-red-500 text-xl text-center p-4 max-w-2xl">
                    {error}
                    <Button
                        onClick={() => navigate('/events')}
                        className="mt-4 block text-blue-600 hover:text-blue-800"
                    >
                        Back to Events
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Your Tickets</h1>
                        <p className="text-gray-600">For {event?.title}</p>
                    </div>
                    <div className="flex gap-4">
                        <Button
                            onClick={handleBookMore}
                            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
                        >
                            Book More Tickets
                        </Button>
                        <Button
                            onClick={() => navigate(`/events/${eventId}`)}
                            className="text-gray-600 hover:text-gray-800 border border-gray-300 py-2 px-4 rounded-lg"
                        >
                            Back to Event
                        </Button>
                    </div>
                </div>
                
                {tickets.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                        <p className="text-gray-600 mb-4">You don't have any tickets for this event yet.</p>
                        <Button
                            onClick={handleBookMore}
                            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
                        >
                            Book Tickets Now
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {tickets.map((ticket) => (
                            <div 
                                key={ticket.$id}
                                className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 transition-all hover:shadow-md"
                            >
                                <div className="bg-blue-500 p-3 text-white font-medium flex justify-between items-center">
                                    <span>{event.title}</span>
                                    <span className="text-sm bg-blue-600 px-2 py-1 rounded">
                                        {ticket.ticketType || 'Standard'}
                                    </span>
                                </div>
                                
                                <div className="p-4">
                                    <div className="flex justify-between mb-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Attendee</p>
                                            <p className="font-medium">{ticket.ticketHolderName}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Ticket ID</p>
                                            <p className="font-medium">TX-{ticket.$id?.substring(0, 6)}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex justify-center my-4">
                                        <QRCodeSVG
                                            value={JSON.stringify({
                                                eventId: eventId,
                                                bookingId: ticket.$id,
                                                name: ticket.ticketHolderName
                                            })}
                                            size={100}
                                            includeMargin={true}
                                        />
                                    </div>
                                    
                                    <div className="mt-4 flex justify-center">
                                        <Link 
                                            to={`/events/${eventId}/tickets/${ticket.$id}`}
                                            className="bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                                        >
                                            View Full Ticket
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default EventTickets;