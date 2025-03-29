import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import service from '../appwrite/config';

const OrganizerView = ({ userId }) => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
            const { documents } = await service.getEvents([
                Query.equal('userId', userId)
            ]);
            setEvents(documents);
        };
        fetchEvents();
    }, [userId]);

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold">Events You Organized</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {events.map(event => (
                    <div key={event.$id} className="p-4 border rounded-lg">
                        <h3 className="font-medium mb-2">{event.title}</h3>
                        <p className="text-sm text-gray-500 mb-4">
                            {new Date(event.date).toLocaleDateString()}
                        </p>
                        <Link
                            to={`/event-attendees/${event.$id}`}
                            className="text-blue-600 hover:underline text-sm"
                        >
                            View Attendees ({event.attendees?.length || 0})
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrganizerView;