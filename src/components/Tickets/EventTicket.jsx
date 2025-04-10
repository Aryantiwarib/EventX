import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { QRCodeSVG } from 'qrcode.react';
import { useParams, useNavigate } from 'react-router-dom';
import appwriteService from '../../appwrite/config';
import { useSelector } from 'react-redux';

const EventTicket = () => {
  const { eventId, ticketId } = useParams();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.auth.userData);
  
  const [ticket, setTicket] = useState(null);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTicketAndEvent = async () => {
      try {
        if (!currentUser || !currentUser.$id) {
          setError('Please log in to view your ticket');
          setLoading(false);
          return;
        }

        // Fetch the specific ticket
        const ticketData = await appwriteService.getBooking(ticketId);
        if (!ticketData) {
          setError('Ticket not found');
          setLoading(false);
          return;
        }
        
        // Verify this ticket belongs to the current user
        if (ticketData.userId !== currentUser.$id) {
          setError('You do not have permission to view this ticket');
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
      } catch (err) {
        console.error('Error fetching ticket data:', err);
        setError('Failed to load ticket information');
        setLoading(false);
      }
    };

    if (eventId && ticketId) {
      fetchTicketAndEvent();
    } else {
      setError('Invalid event or ticket ID');
      setLoading(false);
    }
  }, [eventId, ticketId, currentUser]);

  // Show loading state
  if (loading) {
    return (
      <div className="w-full max-w-md mx-auto bg-white rounded-lg overflow-hidden shadow-md border border-gray-200 p-8">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading ticket information...</p>
        </div>
      </div>
    );
  }

  // Check if we have valid data for ticket
  const hasValidTicketData = ticket && event && ticket.ticketHolderName;
  
  // If data is not present, show error message
  if (!hasValidTicketData || error) {
    return (
      <div className="w-full max-w-md mx-auto bg-white rounded-lg overflow-hidden shadow-md border border-gray-200 p-8">
        <div className="text-center py-8">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-yellow-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="text-xl font-medium text-gray-800 mb-3">Ticket Information Not Available</h3>
          <p className="text-gray-600 mb-6">{error || "We couldn't find the booking information for this ticket. This could be because:"}</p>
          
          {!error && (
            <ul className="text-left text-gray-600 max-w-sm mx-auto mb-6 space-y-2">
              <li className="flex items-start">
                <svg className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                The booking process wasn't completed
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                There was an error loading the ticket data
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                The ticket has been canceled or refunded
              </li>
            </ul>
          )}
          
          <button 
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-md transition-colors"
            onClick={() => navigate(`/events/${eventId}/tickets`)}
          >
            Back to My Tickets
          </button>
        </div>
      </div>
    );
  }

  // Format date if available
  const formattedDate = event.date 
    ? format(new Date(event.date), 'MMM dd, yyyy')
    : 'TBD';

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg overflow-hidden shadow-md border border-gray-200">
      {/* Blue header with logo */}
      <div className="bg-blue-500 p-4 text-center relative">
        <div className="inline-block bg-white rounded-full p-2 absolute right-4 top-4">
          <span className="text-blue-500 font-bold text-xl">X</span>
        </div>
        <div className="text-white text-2xl font-bold">Event<span className="font-normal">X</span></div>
      </div>

      {/* Event details */}
      <div className="p-6 text-center border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800">{event.title || 'Event Title'}</h2>
        <p className="text-gray-600">{event.organizer || 'Organizer'}</p>
        
        <div className="flex justify-center items-center gap-2 mt-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-gray-700">{formattedDate}</span>
          
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 ml-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-gray-700">{event.time || 'TBD'}</span>
        </div>
        
        <div className="flex justify-center items-center gap-2 mt-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-gray-700">{event.location || 'Main Hall'}</span>
        </div>
      </div>

      {/* Ticket details */}
      <div className="grid grid-cols-2 gap-4 p-4 border-b border-gray-200">
        <div>
          <p className="text-gray-500 text-sm">Attendee</p>
          <p className="font-medium text-gray-800">{ticket.ticketHolderName}</p>
        </div>
        <div>
          <p className="text-gray-500 text-sm">Ticket Type</p>
          <p className="font-medium text-gray-800">{ticket.ticketType || 'Standard'}</p>
        </div>
        <div>
          <p className="text-gray-500 text-sm">Ticket ID</p>
          <p className="font-medium text-gray-800">TX-{ticket.$id?.substring(0, 6)}</p>
        </div>
        <div>
          <p className="text-gray-500 text-sm">Status</p>
          <p className="font-medium text-gray-800">Confirmed</p>
        </div>
      </div>

      {/* QR Code */}
      <div className="p-6 flex flex-col items-center">
        <QRCodeSVG
          value={JSON.stringify({
            eventId: event.$id,
            bookingId: ticket.$id,
            name: ticket.ticketHolderName
          })}
          size={200}
          includeMargin={true}
        />
        <p className="text-gray-500 text-sm mt-4">Please show this QR code at the venue entrance</p>
      </div>

      {/* Download Button */}
      <div className="p-4 border-t border-gray-200 flex justify-center">
        <button
          onClick={() => window.print()}
          className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-md flex items-center gap-2 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download Ticket
        </button>
      </div>
    </div>
  );
};

export default EventTicket;