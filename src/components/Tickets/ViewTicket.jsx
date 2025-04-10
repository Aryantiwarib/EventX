import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import appwriteService from '../../appwrite/config';
import { Button } from '../index';
import EventTicket from './EventTicket';

function ViewTicket() {
    const { eventId, ticketId } = useParams();
    const navigate = useNavigate();
    const currentUser = useSelector((state) => state.auth.userData);
    const [ticket, setTicket] = useState(null);
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTicketAndEvent = async () => {
            try {
                // Fetch ticket
                const ticketData = await appwriteService.getBooking(ticketId);
                if (!ticketData) {
                    setError('Ticket not found');
                    setLoading(false);
                    return;
                }
                
                // Check if ticket belongs to current user
                if (ticketData.userId !== currentUser?.$id) {
                    setError('You do not have access to this ticket');
                    setLoading(false);
                    return;
                }
                
                setTicket(ticketData);
                
                // Fetch event details
                const eventData = await appwriteService.getEvent(eventId);
                if (!eventData) {
                    setError('Event not found');
                    setLoading(false);
                    return;
                }
                
                setEvent(eventData);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        if (eventId && ticketId && currentUser) {
            fetchTicketAndEvent();
        } else {
            setError('Missing required information');
            setLoading(false);
        }
    }, [eventId, ticketId, currentUser]);

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
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">Your Ticket</h1>
                    <div className="flex gap-4">
                        <Button
                            onClick={() => navigate(`/events/${eventId}/tickets`)}
                            className="text-blue-600 hover:text-blue-800"
                        >
                            View All Tickets
                        </Button>
                        <Button
                            onClick={() => navigate(`/events/${eventId}`)}
                            className="text-gray-600 hover:text-gray-800"
                        >
                            Back to Event
                        </Button>
                    </div>
                </div>
                
                <EventTicket ticket={ticket} event={event} />
            </div>
        </div>
    );
}

export default ViewTicket;