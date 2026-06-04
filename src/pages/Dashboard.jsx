import { useSelector } from 'react-redux';
import DashboardStats from '../components/DashBoard/DashboardStats';
import BookingsList from '../components/BookingsList';
import OrganizerView from '../components/OrganizerView';

const Dashboard = () => {
    const user = useSelector(state => state.auth.userData);

    const checkIsAdmin = (user) => {
        if (!user) return false;
        return (
            user.labels?.includes('admin') ||
            user.prefs?.role === 'admin' ||
            user.prefs?.isAdmin === true ||
            user.email?.endsWith('@eventx-admin.com')
        );
    };

    const isAdmin = checkIsAdmin(user);

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Welcome back, {user?.name || user?.email?.split('@')[0]} 👋
                        </h1>
                        <p className="text-gray-500 mt-1">
                            {isAdmin ? "Organizer Control Center" : "Attendee Event Portal"}
                        </p>
                    </div>
                </div>
                
                <DashboardStats userId={user?.$id} isAdmin={isAdmin} />
                
                <div className="mt-12">
                    {isAdmin ? (
                        <div className="bg-white rounded-xl p-6 border shadow-sm">
                            <OrganizerView userId={user?.$id} />
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl p-6 border shadow-sm">
                            <h2 className="text-2xl font-semibold mb-6 border-b pb-4 text-gray-800">Your Registered Bookings</h2>
                            <BookingsList userId={user?.$id} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;