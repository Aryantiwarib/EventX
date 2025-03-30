import React, { useState, useEffect } from 'react';
import { Container } from '../components';
import EventCard from '../components/EventCard'; // Import directly
import appwriteService from "../appwrite/config";
import { Query } from "appwrite";
import { useSelector } from 'react-redux';
import { FaSearch, FaFilter } from 'react-icons/fa';

function AllEvents() {
    const [events, setEvents] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
    const [categories] = useState([
        'all',
        'Technology',
        'Cultural',
        'Career',
        'Sports',
        'Academic',
        'Workshop',
        'Seminar',
        'Competition'
    ]);
    const user = useSelector((state) => state.auth.userData);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                // Base query for active events
                let queries = [Query.equal('status', 'active')];
                
                // Add category filter if needed
                if (selectedCategory !== 'all') {
                    queries.push(Query.equal('category', selectedCategory));
                }

                // Get active events
                const activeEvents = await appwriteService.getEvents(queries);
                
                // Get creator's events if logged in
                let creatorEvents = { documents: [] };
                if (user?.$id) {
                    let creatorQueries = [Query.equal('userId', user.$id)];
                    if (selectedCategory !== 'all') {
                        creatorQueries.push(Query.equal('category', selectedCategory));
                    }
                    creatorEvents = await appwriteService.getEvents(creatorQueries);
                }

                // Combine and deduplicate
                const combinedEvents = [
                    ...activeEvents.documents,
                    ...creatorEvents.documents
                ];
                
                const uniqueEvents = combinedEvents.filter(
                    (event, index, self) =>
                        index === self.findIndex((e) => e.$id === event.$id)
                );

                setEvents(uniqueEvents);
            } catch (error) {
                console.error("Error fetching events:", error);
            }
        };

        fetchEvents();
    }, [selectedCategory, user?.$id]);

    // Filter events based on search query
    const filteredEvents = events.filter(event => 
        event.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Group events by category for display
    const groupedEvents = {};
    filteredEvents.forEach(event => {
        if (!groupedEvents[event.category]) {
            groupedEvents[event.category] = [];
        }
        groupedEvents[event.category].push(event);
    });

    // Toggle mobile filter
    const toggleMobileFilter = () => {
        setIsMobileFilterOpen(!isMobileFilterOpen);
    };

    return (
        <div className="w-full min-h-screen bg-gray-50 py-6">
            <Container>
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                            Explore Events
                        </h1>
                        <p className="text-gray-600 text-sm md:text-base">
                            Discover and register for upcoming events
                        </p>
                    </div>
                    
                    {/* Search Bar (Compact) */}
                    <div className="relative mt-4 md:mt-0 w-full md:w-auto flex">
                        <div className="relative flex-1 md:w-64">
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search events..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 rounded-l-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-r-lg font-medium hover:bg-blue-700 transition-colors">
                            Search
                        </button>
                        
                        {/* Mobile Filter Button */}
                        <button 
                            className="ml-2 md:hidden bg-white p-2 rounded-lg border border-gray-200"
                            onClick={toggleMobileFilter}
                        >
                            <FaFilter className="text-gray-600" />
                        </button>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-6">
                    {/* Category Sidebar - Desktop */}
                    <div className={`md:block ${isMobileFilterOpen ? 'block' : 'hidden'} md:w-52 lg:w-64 flex-shrink-0`}>
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden sticky top-4">
                            <h2 className="text-lg font-semibold p-3 border-b border-gray-100 bg-gray-50">Categories</h2>
                            <div>
                                {categories.map((category) => (
                                    <button
                                        key={category}
                                        onClick={() => {
                                            setSelectedCategory(category);
                                            setIsMobileFilterOpen(false);
                                        }}
                                        className={`w-full text-left px-4 py-2.5 transition-colors text-sm ${
                                            selectedCategory === category 
                                            ? 'bg-blue-50 text-blue-600 font-medium border-l-4 border-blue-600' 
                                            : 'text-gray-700 hover:bg-gray-50 border-l-4 border-transparent'
                                        }`}
                                    >
                                        {category === 'all' ? 'All Categories' : category}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Events Grid */}
                    <div className="flex-1">
                        {selectedCategory === 'all' ? (
                            // Show events grouped by category when "All" is selected
                            Object.entries(groupedEvents).map(([category, categoryEvents], idx) => (
                                <div key={category} className="mb-8">
                                    <div className="flex items-center mb-4">
                                        <h2 className="text-xl font-bold text-gray-800">
                                            {category} Events
                                        </h2>
                                        <div className="ml-auto">
                                            <button 
                                                onClick={() => setSelectedCategory(category)}
                                                className="text-sm text-blue-600 hover:underline"
                                            >
                                                View all
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                        {categoryEvents.map((event, eventIdx) => (
                                            <EventCard 
                                                key={event.$id} 
                                                {...event} 
                                                showStatus={user?.$id === event.userId}
                                                attendees={event.attendees || (Math.floor(Math.random() * 200) + 50)}
                                                isFeatured={eventIdx === 0 && categoryEvents.length > 2}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))
                        ) : (
                            // Show events from selected category
                            <div>
                                <h2 className="text-xl font-bold text-gray-800 mb-4">
                                    {selectedCategory} Events
                                </h2>
                                
                                {filteredEvents.length === 0 ? (
                                    <div className="text-center py-10 bg-white rounded-lg shadow-sm">
                                        <p className="text-gray-500">
                                            No events found in this category
                                        </p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                        {filteredEvents.map((event, idx) => (
                                            <EventCard 
                                                key={event.$id} 
                                                {...event} 
                                                showStatus={user?.$id === event.userId}
                                                attendees={event.attendees || (Math.floor(Math.random() * 200) + 50)}
                                                isFeatured={idx === 0 && filteredEvents.length > 2}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </Container>
        </div>
    );
}

export default AllEvents;