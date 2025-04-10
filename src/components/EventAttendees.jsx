import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import service from '../appwrite/config';
import QrScannerModal from '../components/QrScannerModal';
import AttendeeQrCode from '../components/AttendeeQrCode';

const EventAttendees = () => {
    const { eventId } = useParams();
    const [attendees, setAttendees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showScanner, setShowScanner] = useState(false);
    const [statusMessage, setStatusMessage] = useState(null);
    const [checkingIn, setCheckingIn] = useState(false);

    useEffect(() => {
        if (!eventId) {
            setError("No event ID provided");
            setLoading(false);
            return;
        }

        const fetchAttendees = async () => {
            try {
                const { documents } = await service.getEventBookings(eventId);
                setAttendees(documents);
                setError(null);
            } catch (error) {
                console.error("Failed to fetch attendees:", error);
                setError("Failed to load attendees. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchAttendees();
    }, [eventId]);

    const handleStatusChange = async (bookingId, newStatus) => {
        console.log("Handle status change called with:", bookingId, newStatus);
        
        if (checkingIn) {
            console.log("Already processing a check-in, ignoring");
            return;
        }
        
        setCheckingIn(true);
        
        try {
            // Find the attendee first to verify they exist
            const attendee = attendees.find(a => a.$id === bookingId);
            if (!attendee) {
                throw new Error(`Attendee with ID ${bookingId} not found`);
            }
            
            console.log("Found attendee:", attendee.ticketHolderName);
            
            // Check if already checked in
            if (attendee.status === 'checkedIn') {
                setStatusMessage({
                    type: 'warning',
                    text: `${attendee.ticketHolderName} is already checked in!`
                });
                
                setTimeout(() => {
                    setStatusMessage(null);
                }, 3000);
                
                setCheckingIn(false);
                return;
            }
            
            // Update status in backend
            console.log("Updating attendee status in backend...");
            await service.updateAttendeeStatus(bookingId, newStatus);
            
            // Update local state
            console.log("Updating local state...");
            const updatedAttendees = attendees.map(attendee => 
                attendee.$id === bookingId ? { ...attendee, status: newStatus } : attendee
            );
            setAttendees(updatedAttendees);
            
            // Show success message
            setStatusMessage({
                type: 'success',
                text: `${attendee.ticketHolderName} checked in successfully!`
            });
            
            // Highlight the row
            const row = document.getElementById(`attendee-${bookingId}`);
            if (row) {
                row.classList.add('bg-green-100');
                setTimeout(() => {
                    row.classList.remove('bg-green-100');
                }, 3000);
                
                // Scroll to the row
                row.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            
            // Clear message after 3 seconds
            setTimeout(() => {
                setStatusMessage(null);
            }, 3000);
            
            console.log("Check-in process completed successfully");
        } catch (error) {
            console.error("Failed to update status:", error);
            
            setStatusMessage({
                type: 'error',
                text: `Failed to check in: ${error.message || 'Unknown error'}`
            });
            
            // Clear message after 5 seconds
            setTimeout(() => {
                setStatusMessage(null);
            }, 5000);
        } finally {
            setCheckingIn(false);
        }
    };

    const handleScanSuccess = (bookingId) => {
        console.log("Scan success with bookingId:", bookingId);
        handleStatusChange(bookingId, 'checkedIn');
        // Close the scanner after successful scan
        setShowScanner(false);
    };

    const exportToCSV = () => {
        const csvContent = [
            'Name,Email,Booking Date,Status',
            ...attendees.map(attendee => 
                `${attendee.ticketHolderName},${attendee.ticketHolderEmail},${attendee.bookingDate},${attendee.status}`
            )
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `attendees-${eventId}.csv`;
        a.click();
    };

    if (loading) {
        return <div className="p-6 text-gray-600">Loading attendees...</div>;
    }

    if (error) {
        return (
            <div className="p-6 text-red-600">
                Error: {error}
                {!eventId && <div className="mt-2">Please check if this event exists.</div>}
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Event Attendees</h1>
                <div className="flex gap-4">
                    <button 
                        onClick={exportToCSV}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                        Export to CSV
                    </button>
                    <button
                        onClick={() => setShowScanner(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Scan QR Code
                    </button>
                </div>
            </div>
            
            {/* Status Message */}
            {statusMessage && (
                <div className={`mb-4 p-3 rounded-lg ${
                    statusMessage.type === 'success' ? 'bg-green-100 text-green-800' : 
                    statusMessage.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                }`}>
                    {statusMessage.text}
                </div>
            )}

            {showScanner && (
                <QrScannerModal 
                    eventId={eventId}
                    attendees={attendees}
                    onScanSuccess={handleScanSuccess}
                    onClose={() => setShowScanner(false)}
                />
            )}

            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="text-left p-3 font-semibold">Name</th>
                            <th className="text-left p-3 font-semibold">Email</th>
                            <th className="text-left p-3 font-semibold">Booking Date</th>
                            <th className="text-left p-3 font-semibold">Status</th>
                            <th className="text-left p-3 font-semibold">QR Code</th>
                            <th className="text-left p-3 font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {attendees.map(attendee => (
                            <tr 
                                key={attendee.$id} 
                                id={`attendee-${attendee.$id}`}
                                className={`border-t border-gray-200 hover:bg-gray-50 transition-colors ${
                                    attendee.status === 'checkedIn' ? 'bg-green-50' : ''
                                }`}
                            >
                                <td className="p-3">{attendee.ticketHolderName}</td>
                                <td className="p-3">{attendee.ticketHolderEmail}</td>
                                <td className="p-3">
                                    {new Date(attendee.bookingDate).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </td>
                                <td className="p-3 capitalize">{attendee.status}</td>
                                <td className="p-3">
                                    <AttendeeQrCode 
                                        eventId={eventId}
                                        attendee={attendee}
                                    />
                                </td>
                                <td className="p-3">
                                    {attendee.status === 'registered' && (
                                        <button
                                            onClick={() => handleStatusChange(attendee.$id, 'checkedIn')}
                                            className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-colors"
                                            disabled={checkingIn}
                                        >
                                            Check In
                                        </button>
                                    )}
                                    {attendee.status === 'checkedIn' && (
                                        <span className="text-green-600 font-medium flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            Checked In
                                        </span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {attendees.length === 0 && (
                    <div className="text-center py-6 text-gray-500">
                        No attendees found for this event
                    </div>
                )}
            </div>
            
            {/* Debug info */}
            <div className="mt-6 p-4 bg-gray-100 rounded-lg text-xs">
                <h3 className="font-bold mb-2">Debug Information</h3>
                <p>Event ID: {eventId}</p>
                <p>Attendee count: {attendees.length}</p>
                <p>Check-in in progress: {checkingIn ? 'Yes' : 'No'}</p>
                <p>Status message: {statusMessage ? JSON.stringify(statusMessage) : 'None'}</p>
            </div>
        </div>
    );
};

export default EventAttendees;