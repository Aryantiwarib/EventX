import { useEffect, useState } from 'react';
import { FaTicketAlt, FaCalendarCheck, FaUserFriends } from 'react-icons/fa';
import service from '../../appwrite/config';
import { Query } from 'appwrite';

const DashboardStats = ({ userId }) => {
    const [stats, setStats] = useState({
        booked: 0,
        attended: 0,
        organized: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [bookings, organized] = await Promise.all([
                    service.getBookingsByUser(userId),
                    service.getEvents([Query.equal('userId', userId)])
                ]);

                const attended = bookings.documents.filter(booking => {
                    const eventDate = new Date(booking.event.date);
                    return eventDate < new Date();
                });

                setStats({
                    booked: bookings.total,
                    attended: attended.length,
                    organized: organized.total
                });
            } catch (error) {
                console.error('Failed to load dashboard stats:', error);
            }
        };

        fetchStats();
    }, [userId]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Booked Events Card */}
            <div className="bg-blue-50 p-6 rounded-xl shadow-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-600 mb-1">Events Booked</p>
                        <p className="text-3xl font-bold">{stats.booked}</p>
                    </div>
                    <FaTicketAlt className="text-3xl text-blue-600" />
                </div>
            </div>

            {/* Attended Events Card */}
            <div className="bg-green-50 p-6 rounded-xl shadow-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-600 mb-1">Events Attended</p>
                        <p className="text-3xl font-bold">{stats.attended}</p>
                    </div>
                    <FaCalendarCheck className="text-3xl text-green-600" />
                </div>
            </div>

            {/* Organized Events Card */}
            <div className="bg-purple-50 p-6 rounded-xl shadow-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-600 mb-1">Events Organized</p>
                        <p className="text-3xl font-bold">{stats.organized}</p>
                    </div>
                    <FaUserFriends className="text-3xl text-purple-600" />
                </div>
            </div>
        </div>
    );
};

export default DashboardStats;