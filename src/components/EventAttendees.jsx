import { useEffect, useState } from 'react';
import service from '../appwrite/config';

const EventAttendees = ({ eventId }) => {
    const [attendees, setAttendees] = useState([]);

    useEffect(() => {
        const fetchAttendees = async () => {
            const { documents } = await service.getEventAttendees(eventId);
            setAttendees(documents);
        };
        fetchAttendees();
    }, [eventId]);

    const exportToCSV = () => {
        const csvContent = [
            'Name,Email,Booking Date',
            ...attendees.map(a => `${a.ticketHolderName},${a.ticketHolderEmail},${a.bookingDate}`)
        ].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `attendees-${eventId}.csv`;
        a.click();
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Event Attendees</h1>
                <button 
                    onClick={exportToCSV}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg"
                >
                    Export to CSV
                </button>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr>
                            <th className="text-left p-2">Name</th>
                            <th className="text-left p-2">Email</th>
                            <th className="text-left p-2">Booking Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {attendees.map(attendee => (
                            <tr key={attendee.$id} className="border-t">
                                <td className="p-2">{attendee.ticketHolderName}</td>
                                <td className="p-2">{attendee.ticketHolderEmail}</td>
                                <td className="p-2">
                                    {new Date(attendee.bookingDate).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default EventAttendees;