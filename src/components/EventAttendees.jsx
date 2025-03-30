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
        try {
            await service.updateAttendeeStatus(bookingId, newStatus);
            const updatedAttendees = attendees.map(attendee => 
                attendee.$id === bookingId ? { ...attendee, status: newStatus } : attendee
            );
            setAttendees(updatedAttendees);
        } catch (error) {
            console.error("Failed to update status:", error);
            setError("Failed to update attendee status");
        }
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

            {showScanner && (
                <QrScannerModal 
                    eventId={eventId}
                    attendees={attendees}
                    onScanSuccess={(bookingId) => handleStatusChange(bookingId, 'checkedIn')}
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
                            <tr key={attendee.$id} className="border-t border-gray-200 hover:bg-gray-50">
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
                                        >
                                            Check In
                                        </button>
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
        </div>
    );
};

export default EventAttendees;