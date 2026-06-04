import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { QRCodeSVG } from 'qrcode.react';
import { useParams, useNavigate } from 'react-router-dom';
import appwriteService from '../../appwrite/config';
import { useSelector } from 'react-redux';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaInfoCircle, FaDownload } from 'react-icons/fa';

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
    <div className="w-full max-w-md mx-auto bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-150 printable-ticket-card font-sans transition-all duration-300 hover:shadow-2xl">
      {/* Brand Header with confirmation */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="flex justify-between items-center relative z-10 mb-6">
          <div className="text-xl font-extrabold tracking-tight">
            Event<span className="text-blue-200">X</span>
          </div>
          <span className="bg-green-500/20 text-green-300 text-xs font-bold px-3 py-1 rounded-full border border-green-500/30 shadow-inner flex items-center gap-1.5 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Confirmed
          </span>
        </div>

        <div className="relative z-10">
          <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2.5 py-1 rounded-md text-blue-100 backdrop-blur-sm">
            {event.category || 'General'}
          </span>
          <h2 className="text-2xl font-extrabold tracking-tight mt-3 text-white leading-tight">
            {event.title || 'Event Title'}
          </h2>
          <p className="text-blue-100 text-xs mt-1.5 font-medium">
            Organized by {event.organizer || 'EventX'}
          </p>
        </div>
      </div>

      {/* Date, Time, Venue Pills */}
      <div className="p-6 border-b border-gray-150 bg-white">
        <div className="grid grid-cols-3 gap-3 bg-gray-50 border border-gray-150 rounded-xl p-3 text-center">
          <div className="flex flex-col items-center">
            <FaCalendarAlt className="text-blue-600 text-sm mb-1" />
            <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Date</span>
            <span className="text-xs font-bold text-gray-800 mt-0.5">{formattedDate}</span>
          </div>
          <div className="flex flex-col items-center border-x border-gray-200">
            <FaClock className="text-blue-600 text-sm mb-1" />
            <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Time</span>
            <span className="text-xs font-bold text-gray-800 mt-0.5">{event.time || 'TBD'}</span>
          </div>
          <div className="flex flex-col items-center">
            <FaMapMarkerAlt className="text-blue-600 text-sm mb-1" />
            <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Venue</span>
            <span className="text-xs font-bold text-gray-800 mt-0.5 line-clamp-1 w-full px-1" title={event.location || 'Main Hall'}>
              {event.location || 'Main Hall'}
            </span>
          </div>
        </div>
      </div>

      {/* Ticket Details Grid */}
      <div className="bg-white grid grid-cols-2 gap-x-6 gap-y-4 p-6 border-b border-gray-150">
        <div>
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-0.5">Attendee</p>
          <p className="font-bold text-gray-800 text-sm line-clamp-1">{ticket.ticketHolderName}</p>
          <p className="text-gray-400 text-[11px] line-clamp-1 mt-0.5">{ticket.ticketHolderEmail}</p>
        </div>
        <div>
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-0.5">Ticket Type</p>
          <span className="inline-flex items-center text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
            {ticket.ticketType || 'Standard'}
          </span>
        </div>
        <div>
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-0.5">Ticket ID</p>
          <p className="font-mono font-bold text-gray-800 text-sm">TX-{ticket.$id?.substring(0, 8).toUpperCase()}</p>
        </div>
        <div>
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-0.5">Booking Status</p>
          <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full ${
            ticket.status === 'checkedIn' ? 'bg-green-100 text-green-800 border border-green-200' :
            'bg-blue-100 text-blue-800 border border-blue-200'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${ticket.status === 'checkedIn' ? 'bg-green-500' : 'bg-blue-500'}`} />
            {ticket.status === 'checkedIn' ? 'Checked In' : 'Confirmed'}
          </span>
        </div>
        <div>
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-0.5">Price Paid</p>
          <p className="font-bold text-gray-800 text-sm">
            {ticket.amount && parseFloat(ticket.amount) > 0 ? `₹${parseFloat(ticket.amount).toLocaleString()}` : 'Free'}
          </p>
        </div>
        <div>
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-0.5">Payment ID</p>
          <p className="font-mono text-gray-600 text-[11px] line-clamp-1">{ticket.paymentId || 'N/A'}</p>
        </div>
      </div>

      {/* Left & Right Circle Cutouts + Dashed Divider */}
      <div className="relative flex items-center justify-between bg-white py-1">
        <div className="absolute left-0 w-6 h-6 bg-gray-50 print:bg-white border-r border-gray-200 rounded-r-full -translate-x-3 z-10" />
        <div className="w-full border-t-2 border-dashed border-gray-200 print:border-gray-300" />
        <div className="absolute right-0 w-6 h-6 bg-gray-50 print:bg-white border-l border-gray-200 rounded-l-full translate-x-3 z-10" />
      </div>

      {/* QR Code Stub */}
      <div className="p-6 bg-white flex flex-col items-center">
        <div className="p-3 bg-white border border-gray-150 rounded-2xl shadow-inner mb-3">
          <QRCodeSVG
            value={JSON.stringify({
              eventId: event.$id,
              bookingId: ticket.$id,
              name: ticket.ticketHolderName
            })}
            size={180}
            includeMargin={true}
          />
        </div>
        <p className="text-gray-400 text-[10px] flex items-center gap-1.5 font-semibold text-center uppercase tracking-wide">
          <FaInfoCircle className="text-blue-500 shrink-0" />
          Present this QR code for scanning at the venue entry.
        </p>
      </div>

      {/* Download Button */}
      <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-center print:hidden">
        <button
          onClick={() => window.print()}
          className="w-full max-w-xs bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg cursor-pointer text-sm"
        >
          <FaDownload />
          Download Ticket
        </button>
      </div>
    </div>
  );
};

export default EventTicket;