import { useEffect, useState } from 'react';
import { FaTicketAlt, FaCalendarCheck, FaUserFriends } from 'react-icons/fa';
import service from '../../appwrite/config';
import { Query } from 'appwrite';

const DashboardStats = ({ userId, isAdmin }) => {
    const [stats, setStats] = useState({
        booked: 0,
        attended: 0,
        organized: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                if (isAdmin) {
                    const organized = await service.getEvents([Query.equal('userId', userId)]);
                    
                    // Fetch bookings for all events organized by the user
                    const bookingsPromises = organized.documents.map(event =>
                        service.getEventBookings(event.$id)
                    );
                    const allBookingsResults = await Promise.all(bookingsPromises);

                    let totalBookings = 0;
                    let totalRevenue = 0;

                    allBookingsResults.forEach(res => {
                        totalBookings += res.total || res.documents?.length || 0;
                        res.documents?.forEach(booking => {
                            const amt = parseFloat(booking.amount) || 0;
                            totalRevenue += amt;
                        });
                    });

                    setStats({
                        booked: totalBookings,
                        attended: totalRevenue, // store total revenue here
                        organized: organized.total
                    });
                } else {
                    const bookings = await service.getBookingsByUser(userId);
                    const events = await Promise.all(
                        bookings.documents.map(booking => 
                            service.getEvent(booking.eventId) 
                        )
                    );
                    const attended = events.filter(event => {
                        if (!event?.date) return false;
                        return new Date(event.date) < new Date();
                    }).length;

                    setStats({
                        booked: bookings.total,
                        attended,
                        organized: 0
                    });
                }
            } catch (error) {
                console.error('Failed to load dashboard stats:', error);
            }
        };

        if (userId) {
            fetchStats();
        }
    }, [userId, isAdmin]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {!isAdmin ? (
                <>
                    {/* Booked Events Card */}
                    <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 shadow-sm transition-all hover:shadow-md">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1 font-medium">Events Booked</p>
                                <p className="text-3xl font-bold text-blue-900">{stats.booked}</p>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                                <FaTicketAlt className="text-2xl" />
                            </div>
                        </div>
                    </div>

                    {/* Attended Events Card */}
                    <div className="bg-green-50 p-6 rounded-xl border border-green-100 shadow-sm transition-all hover:shadow-md">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1 font-medium">Events Attended</p>
                                <p className="text-3xl font-bold text-green-900">{stats.attended}</p>
                            </div>
                            <div className="p-3 bg-green-100 rounded-lg text-green-600">
                                <FaCalendarCheck className="text-2xl" />
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    {/* Organized Events Card */}
                    <div className="bg-purple-50 p-6 rounded-xl border border-purple-100 shadow-sm transition-all hover:shadow-md">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1 font-medium">Events Organized</p>
                                <p className="text-3xl font-bold text-purple-900">{stats.organized}</p>
                            </div>
                            <div className="p-3 bg-purple-100 rounded-lg text-purple-600">
                                <FaUserFriends className="text-2xl" />
                            </div>
                        </div>
                    </div>

                    {/* Total Tickets Sold Card */}
                    <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 shadow-sm transition-all hover:shadow-md">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1 font-medium">Total Tickets Sold</p>
                                <p className="text-3xl font-bold text-blue-900">{stats.booked}</p>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                                <FaTicketAlt className="text-2xl" />
                            </div>
                        </div>
                    </div>

                    {/* Total Revenue Card */}
                    <div className="bg-green-50 p-6 rounded-xl border border-green-100 shadow-sm transition-all hover:shadow-md">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1 font-medium">Total Revenue</p>
                                <p className="text-3xl font-bold text-green-900">₹{stats.attended.toLocaleString()}</p>
                            </div>
                            <div className="p-3 bg-green-100 rounded-lg text-green-600">
                                <FaCalendarCheck className="text-2xl" />
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default DashboardStats;