import { useSelector } from 'react-redux';
import DashboardStats from '../components/DashBoard/DashboardStats';
import BookingsList from '../components/BookingsList';
import OrganizerView from '../components/OrganizerView';

const Dashboard = () => {
    const user = useSelector(state => state.auth.userData);

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">
                    Welcome back, {user.name} 👋
                </h1>
                
                <DashboardStats userId={user.$id} />
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
                    <div className="space-y-6">
                        <h2 className="text-2xl font-semibold mb-4">Your Bookings</h2>
                        <BookingsList userId={user.$id} />
                    </div>
                    
                    <div className="space-y-6">
                        <h2 className="text-2xl font-semibold mb-4">Organized Events</h2>
                        <OrganizerView userId={user.$id} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;