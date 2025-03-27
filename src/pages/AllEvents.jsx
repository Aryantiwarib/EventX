import React, { useState, useEffect } from 'react'
import { Container, EventCard } from '../components'
import appwriteService from "../appwrite/config";
import { Query } from "appwrite";
import { useSelector } from 'react-redux'

function AllEvents() {
    const [events, setEvents] = useState([])
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [categories] = useState([
        'all',
        'Music',
        'Tech',
        'Sports',
        'Cultural',
        'Academic',
        'Workshop',
        'Seminar',
        'Other'
    ])
    const user = useSelector((state) => state.auth.userData)

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                // Base query for active events
                let queries = [Query.equal('status', 'active')]
                
                // Add category filter if needed
                if (selectedCategory !== 'all') {
                    queries.push(Query.equal('category', selectedCategory))
                }

                // Get active events
                const activeEvents = await appwriteService.getEvents(queries)
                
                // Get creator's events if logged in
                let creatorEvents = { documents: [] }
                if (user?.$id) {
                    let creatorQueries = [Query.equal('userId', user.$id)]
                    if (selectedCategory !== 'all') {
                        creatorQueries.push(Query.equal('category', selectedCategory))
                    }
                    creatorEvents = await appwriteService.getEvents(creatorQueries)
                }

                // Combine and deduplicate
                const combinedEvents = [
                    ...activeEvents.documents,
                    ...creatorEvents.documents
                ]
                
                const uniqueEvents = combinedEvents.filter(
                    (event, index, self) =>
                        index === self.findIndex((e) => e.$id === event.$id)
                )

                setEvents(uniqueEvents)
            } catch (error) {
                console.error("Error fetching events:", error)
            }
        }

        fetchEvents()
    }, [selectedCategory, user?.$id])

    return (
        <div className='w-full min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12'>
            <Container>
                <div className='flex flex-col lg:flex-row gap-8'>
                    {/* Category Sidebar */}
                    <div className='w-full lg:w-64 space-y-4'>
                        <div className='bg-white rounded-xl p-6 shadow-lg border border-gray-100'>
                            <h2 className='text-2xl font-bold mb-4 text-gray-800'>Categories</h2>
                            <div className='space-y-2'>
                                {categories.map((category) => (
                                    <button
                                        key={category}
                                        onClick={() => setSelectedCategory(category)}
                                        className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 ${
                                            selectedCategory === category 
                                            ? 'bg-blue-600 text-white shadow-md' 
                                            : 'hover:bg-blue-50 text-gray-600 hover:text-blue-600'
                                        } font-medium capitalize`}
                                    >
                                        {category.replace('-', ' ')}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Events Grid */}
                    <div className='flex-1'>
                        <h1 className='text-4xl font-bold text-gray-800 mb-8'>
                            {selectedCategory === 'all' ? 'All Events' : `${selectedCategory} Events`}
                            {user?.$id && " (including your draft events)"}
                        </h1>
                        
                        {events.length === 0 ? (
                            <div className='text-center py-12'>
                                <p className='text-gray-500 text-xl'>
                                    {user?.$id 
                                        ? "No events found in this category" 
                                        : "No active events found in this category"
                                    }
                                </p>
                            </div>
                        ) : (
                            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                                {events.map((event) => (
                                    <div 
                                        key={event.$id} 
                                        className='transform transition-all duration-300 hover:scale-105 hover:shadow-xl'
                                    >
                                        <EventCard 
                                            {...event} 
                                            className='rounded-xl overflow-hidden shadow-lg border border-gray-100'
                                            showStatus={user?.$id === event.userId}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </Container>
        </div>
    )
}

export default AllEvents