import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container } from '../components';
import EventCard from '../components/EventCard';
import Loader from '../components/Loader';
import appwriteService from "../appwrite/config";
import { Query } from "appwrite";
import { useSelector } from 'react-redux';
import { FaSearch, FaFilter } from 'react-icons/fa';

const EVENT_CACHE = {};
const CACHE_EXPIRY = 60 * 1000; // 1 minute cache
const LOADER_DELAY = 300; // Show loader after 300ms

function AllEvents() {
    const navigate = useNavigate();
    const { category: urlCategory } = useParams();
    const [rawEvents, setRawEvents] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
    const [showLoader, setShowLoader] = useState(false);
    const [categories] = useState([
        'all', 'Technology', 'Cultural', 'Career', 
        'Sports', 'Academic', 'Workshop', 'Seminar', 'Competition'
    ]);
    
    const timeoutRef = useRef(null);
    const selectedCategory = categories.includes(urlCategory || 'all') 
        ? (urlCategory || 'all') : 'all';

    const user = useSelector((state) => state.auth.userData);

    // Memoized filtered events
    const filteredEvents = useMemo(() => {
        const searchLower = searchQuery.toLowerCase();
        return rawEvents.filter(event => 
            event.title.toLowerCase().includes(searchLower)
        );
    }, [rawEvents, searchQuery]);

    // Memoized grouped events
    const groupedEvents = useMemo(() => {
        return filteredEvents.reduce((groups, event) => {
            groups[event.category] = [...(groups[event.category] || []), event];
            return groups;
        }, {});
    }, [filteredEvents]);

    const fetchEvents = useCallback(async () => {
        try {
            const cacheEntry = EVENT_CACHE[selectedCategory];
            if (cacheEntry && Date.now() - cacheEntry.timestamp < CACHE_EXPIRY) {
                setRawEvents(cacheEntry.data);
                return;
            }

            timeoutRef.current = setTimeout(() => setShowLoader(true), LOADER_DELAY);

            const [activeEvents, creatorEvents] = await Promise.all([
                appwriteService.getEvents([
                    Query.equal('status', 'active'),
                    ...(selectedCategory !== 'all' ? [Query.equal('category', selectedCategory)] : [])
                ]),
                user?.$id ? appwriteService.getEvents([
                    Query.equal('userId', user.$id),
                    ...(selectedCategory !== 'all' ? [Query.equal('category', selectedCategory)] : [])
                ]) : { documents: [] }
            ]);

            const combined = [...activeEvents.documents, ...creatorEvents.documents];
            const uniqueEvents = combined.filter((event, index, self) =>
                index === self.findIndex((e) => e.$id === event.$id)
            );

            EVENT_CACHE[selectedCategory] = { timestamp: Date.now(), data: uniqueEvents };
            setRawEvents(uniqueEvents);
        } catch (error) {
            console.error("Error fetching events:", error);
        } finally {
            clearTimeout(timeoutRef.current);
            setShowLoader(false);
        }
    }, [selectedCategory, user?.$id]);

    useEffect(() => {
        fetchEvents();
        return () => clearTimeout(timeoutRef.current);
    }, [fetchEvents]);

    const handleCategoryChange = useCallback((category) => {
        if (category === selectedCategory) return;
        setIsMobileFilterOpen(false);
        navigate(category === 'all' ? '/events' : `/events/category/${category}`);
    }, [selectedCategory, navigate]);

    const prefetchCategory = useCallback(async (category) => {
        if (EVENT_CACHE[category]?.timestamp && 
            Date.now() - EVENT_CACHE[category].timestamp < CACHE_EXPIRY) return;

        try {
            const events = await appwriteService.getEvents([
                Query.equal('status', 'active'),
                ...(category !== 'all' ? [Query.equal('category', category)] : [])
            ]);
            EVENT_CACHE[category] = { timestamp: Date.now(), data: events.documents };
        } catch (error) {
            console.error("Prefetch failed:", error);
        }
    }, []);

    const renderEvents = useCallback((eventsArray) => (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {eventsArray.map((event, idx) => (
                <EventCard 
                    key={event.$id} 
                    {...event} 
                    showStatus={user?.$id === event.userId}
                    attendees={event.attendees || Math.floor(Math.random() * 200) + 50}
                    isFeatured={idx === 0 && eventsArray.length > 2}
                />
            ))}
        </div>
    ), [user?.$id]);

    return (
        <div className="w-full min-h-screen bg-gray-50 py-6">
            <Container>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                            {selectedCategory === 'all' ? 'All Events' : `${selectedCategory} Events`}
                        </h1>
                        <p className="text-gray-600 text-sm md:text-base">
                            Discover and register for upcoming events
                        </p>
                    </div>
                    
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
                        
                        <button 
                            className="ml-2 md:hidden bg-white p-2 rounded-lg border border-gray-200"
                            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
                        >
                            <FaFilter className="text-gray-600" />
                        </button>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-6">
                    <div className={`md:block ${isMobileFilterOpen ? 'block' : 'hidden'} md:w-52 lg:w-64 flex-shrink-0`}>
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden sticky top-4">
                            <h2 className="text-lg font-semibold p-3 border-b border-gray-100 bg-gray-50">Categories</h2>
                            <div>
                                {categories.map((category) => (
                                    <button
                                        key={category}
                                        onClick={() => handleCategoryChange(category)}
                                        onMouseEnter={() => prefetchCategory(category)}
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

                    <div className="flex-1">
                        {showLoader ? (
                            <div className="flex justify-center items-center min-h-[400px]">
                                <Loader />
                            </div>
                        ) : selectedCategory === 'all' ? (
                            Object.entries(groupedEvents).map(([category, categoryEvents]) => (
                                <div key={category} className="mb-8">
                                    <div className="flex items-center mb-4">
                                        <h2 className="text-xl font-bold text-gray-800">
                                            {category} Events
                                        </h2>
                                        <div className="ml-auto">
                                            <button 
                                                onClick={() => handleCategoryChange(category)}
                                                className="text-sm text-blue-600 hover:underline"
                                            >
                                                View all
                                            </button>
                                        </div>
                                    </div>
                                    {renderEvents(categoryEvents)}
                                </div>
                            ))
                        ) : filteredEvents.length === 0 ? (
                            <div className="text-center py-10 bg-white rounded-lg shadow-sm">
                                <p className="text-gray-500">No events found in this category</p>
                            </div>
                        ) : (
                            <div>
                                <h2 className="text-xl font-bold text-gray-800 mb-4">
                                    {selectedCategory} Events
                                </h2>
                                {renderEvents(filteredEvents)}
                            </div>
                        )}
                    </div>
                </div>
            </Container>
        </div>
    );
}

export default AllEvents;