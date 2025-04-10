import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import appwriteService from '../../appwrite/config';

const Tickets = () => {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const currentUser = useSelector((state) => state.auth.userData);
  
  const [events, setEvents] = useState([]);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data based on route
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!currentUser || !currentUser.$id) {
          setError('Please log in to view your tickets');
          setLoading(false);
          return;
        }

        if (eventId) {
          // Fetch single event and its tickets
          const eventData = await appwriteService.getEvent(eventId);
          setCurrentEvent(eventData);

          const bookingsResponse = await appwriteService.getUserBookings(currentUser.$id);
          const eventTickets = bookingsResponse.documents.filter(
            booking => booking.eventId === eventId
          );
          setTickets(eventTickets);
        } else {
          // Fetch all events with tickets
          const bookingsResponse = await appwriteService.getUserBookings(currentUser.$id);
          const userBookings = bookingsResponse.documents || [];
          
          const eventIds = [...new Set(userBookings.map(booking => booking.eventId))];
          const eventsData = await Promise.all(
            eventIds.map(async (id) => {
              const event = await appwriteService.getEvent(id);
              const ticketCount = userBookings.filter(b => b.eventId === id).length;
              return { ...event, ticketCount };
            })
          );

          setEvents(eventsData.filter(e => e).sort((a, b) => new Date(b.date) - new Date(a.date)));
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message || 'Failed to load data');
        setLoading(false);
      }
    };

    fetchData();
  }, [eventId, currentUser]);

  const handleBackToEvents = () => {
    navigate('/tickets');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center max-w-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-yellow-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="text-xl font-medium text-gray-800 mb-3">Error</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/events')}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-md transition-colors"
          >
            Browse Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      {!eventId ? (
        // Events List View
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">My Tickets</h1>
          
          {events.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <p className="text-gray-600 mb-4">You don't have any tickets yet.</p>
              <button
                onClick={() => navigate('/events')}
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg"
              >
                Browse Events
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <div 
                  key={event.$id}
                  className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-all cursor-pointer"
                  onClick={() => navigate(`/tickets/${event.$id}`)}
                >
                  {/* Event Card Content - Same as before */}
                  {event.image ? (
                    <div className="h-40 bg-gray-200 overflow-hidden">
                      <img 
                        src={event.image} 
                        alt={event.title}
                        className="w-full h-full object-cover" 
                      />
                    </div>
                  ) : (
                    <div className="h-40 bg-blue-100 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                    </div>
                  )}
                  
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <h2 className="text-xl font-semibold text-gray-800 mb-2">{event.title}</h2>
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        {event.ticketCount} {event.ticketCount === 1 ? 'ticket' : 'tickets'}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-3">
                      {new Date(event.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                      {event.time && ` • ${event.time}`}
                    </p>
                    
                    <p className="text-gray-500 text-sm">
                      {event.location || 'Location TBD'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        // Single Event Tickets View
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Your Tickets</h1>
              <p className="text-gray-600">For {currentEvent?.title}</p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => navigate(`/events/${eventId}/book`)}
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
              >
                Book More Tickets
              </button>
              <button
                onClick={handleBackToEvents}
                className="text-gray-600 hover:text-gray-800 border border-gray-300 py-2 px-4 rounded-lg"
              >
                Back to Events
              </button>
            </div>
          </div>
          
          {tickets.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <p className="text-gray-600 mb-4">You don't have any tickets for this event yet.</p>
              <button
                onClick={() => navigate(`/events/${eventId}/book`)}
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
              >
                Book Tickets Now
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tickets.map((ticket) => (
                <div 
                  key={ticket.$id}
                  className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 transition-all hover:shadow-md"
                >
                  {/* Ticket Card Content - Same as before */}
                  <div className="bg-blue-500 p-3 text-white font-medium flex justify-between items-center">
                    <span>{currentEvent.title}</span>
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
                      <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                        <svg className="w-20 h-20 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path>
                        </svg>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex justify-center">
                      <Link 
                        to={`/events/${eventId}/tickets/${ticket.$id}`}
                        className="bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 px-4 rounded-lg text-sm font-medium transition-colors w-full text-center"
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
      )}
    </div>
  );
};

export default Tickets;