import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import service from '../appwrite/config';

const BookingsList = ({ userId }) => {
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        const fetchBookings = async () => {
            const { documents } = await service.getBookingsByUser(userId);
            const bookingsWithEvents = await Promise.all(
                documents.map(async booking => ({
                    ...booking,
                    event: await service.getEvent(booking.eventId)
                }))
            );
            setBookings(bookingsWithEvents);
        };
        fetchBookings();
    }, [userId]);

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Your Bookings</h2>
            {bookings.map(booking => (
                <div key={booking.$id} className="p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="font-medium">{booking.event.title}</h3>
                            <p className="text-sm text-gray-500">
                                {new Date(booking.event.date).toLocaleDateString()}
                            </p>
                        </div>
                        <span className={`text-sm ${
                            new Date(booking.event.date) < new Date() 
                            ? 'text-green-600' 
                            : 'text-red-600'
                        }`}>
                            {new Date(booking.event.date) < new Date() ? 'Attended' : 'Booked'}
                        </span>
                    </div>
                    <Link 
                        to={`/events/${booking.eventId}`}
                        className="text-blue-600 text-sm mt-2 inline-block"
                    >
                        View Event Details
                    </Link>
                </div>
            ))}
        </div>
    );
};

export default BookingsList;