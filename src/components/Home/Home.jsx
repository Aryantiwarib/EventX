import React, { useState, useEffect } from 'react';
import { Search, ChevronRight, Calendar, Ticket, CheckSquare, BarChart2 } from 'lucide-react';
import service from '../../appwrite/config'; // Import your service
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaClock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [featuredEvent, setFeaturedEvent] = useState(null);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        
        // Get all active events
        const response = await service.getEvents();
        const events = response.documents;
        
        if (events.length > 0) {
          // Find workshop event for featured section (or fall back to cultural or sports)
          const workshopEvent = events.find(event => 
            event.category.toLowerCase() === 'workshop'
          );
          
          const culturalEvent = events.find(event => 
            event.category.toLowerCase() === 'cultural'
          );
          
          const sportsEvent = events.find(event => 
            event.category.toLowerCase() === 'sports'
          );
          
          // Select featured event based on priority
          const selectedFeaturedEvent = workshopEvent || culturalEvent || sportsEvent || events[0];
          setFeaturedEvent(selectedFeaturedEvent);
          
          // Get top 3 events for the upcoming events section
          // (excluding the featured event to avoid duplication)
          const topEvents = events
            .filter(event => event.$id !== selectedFeaturedEvent.$id)
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(0, 3);
            
          setUpcomingEvents(topEvents);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Helper function to format date like in EventCard
  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'short' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Helper function to get year from date
  const getYear = (dateString) => {
    return new Date(dateString).getFullYear();
  };

  // Helper function to extract time from date
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Helper function to get image URL or fallback to placeholder
  const getEventImageUrl = (event) => {
    if (event && event.template) {
      return service.getFilePreview(event.template); // Use appwrite's file preview
    }
    // Default placeholder if no image is available
    return "/placeholder-event.jpg";
  };

  // Helper function to parse description like in EventCard
  const parseDescription = (description) => {
    if (!description) return 'Join us for this exciting event!';
    
    try {
      // If stored as JSON string, parse it
      const content = typeof description === 'string' ? 
        JSON.parse(description) : description;
          
      // Check if it's Delta format (Quill) or simple HTML
      if (content.ops) {
        // For Quill Delta format
        return content.ops
          .map(op => op.insert)
          .join('')
          .substring(0, 150) + '...';
      } else if (typeof content === 'string') {
        // For HTML string content
        return content.substring(0, 150) + '...';
      } else {
        // For other formats
        return 'Join us for this exciting event!';
      }
    } catch (error) {
      // If it's not JSON, assume it's plain text or HTML
      return description.substring(0, 150) + '...';
    }
  };

  // Create plain text version for cards
  const createPlainText = (htmlContent) => {
    if (!htmlContent) return '';
    
    // Create a temporary div to extract text from HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    const textContent = tempDiv.textContent || tempDiv.innerText || '';
    
    return textContent.length > 120 ? 
      textContent.substring(0, 120) + '...' : 
      textContent;
  };

  // Price display logic
  const getPriceDisplay = (price) => {
    return price > 0 ? `₹${price}` : "Free";
  };

  // category handl karne ka function

  const handleCategoryChange = (category) => {
    // if(category === "technology") {
      navigate(`/events/category/${category}`);
    // }

  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="text-center py-16 px-4 bg-gray-50">
          <div 
            className="inline-block bg-blue-50 text-blue-500 px-4 py-2 rounded-full mb-4 hover:bg-blue-100 transition-colors cursor-pointer text-lg"
          >
            College Event Management Simplified
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            The Ultimate Platform<br />for College <span className="text-blue-500">Events</span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8 text-lg">
            Create, manage, and promote events with ease. Generate QR tickets, track attendance, and gain valuable insights - all in one place.
          </p>
          <div className="flex max-w-md mx-auto mb-8 relative">
            <input
              type="text"
              placeholder="Search for events, workshops, concerts..."
              className="w-full p-3 pl-10 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="absolute left-3 top-3 text-gray-400">
              <Search size={20} />
            </div>
            <button className="absolute right-0 bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-600 transition-colors">
              Search
            </button>
          </div>
          
          {/* Category Pills */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            <button
            onClick={() => handleCategoryChange("Technology")}
             className="px-4 py-1 bg-gray-900 text-white rounded-full hover:bg-black transition-colors">Technology</button>
            <button
            onClick={() => handleCategoryChange("Cultural")} className="px-4 py-1 bg-white border rounded-full hover:bg-gray-100 transition-colors">Cultural</button>
            <button
            onClick={() => handleCategoryChange("Career")}
             className="px-4 py-1 bg-white border rounded-full hover:bg-gray-100 transition-colors">Career</button>
            <button
            onClick={() => handleCategoryChange("Sports")}
             className="px-4 py-1 bg-white border rounded-full hover:bg-gray-100 transition-colors">Sports</button>
            <button
            onClick={() => handleCategoryChange("Academic")}
             className="px-4 py-1 bg-white border rounded-full hover:bg-gray-100 transition-colors">Academic</button>
            <button
            onClick={() => handleCategoryChange("Wrkshop")}
             className="px-4 py-1 bg-white border rounded-full hover:bg-gray-100 transition-colors">Workshop</button>
          </div>
        </section>

        {/* Featured Event Banner */}
        <section className="mx-4 md:mx-8 lg:mx-auto lg:max-w-6xl mb-16">
          {loading ? (
            <div className="h-80 md:h-96 bg-gray-200 rounded-xl animate-pulse"></div>
          ) : featuredEvent ? (
            <div className="relative rounded-xl overflow-hidden bg-black shadow-lg transition-transform hover:scale-[1.01] cursor-pointer">
              <img 
                src={getEventImageUrl(featuredEvent)} 
                alt={featuredEvent.title} 
                className="w-full h-80 md:h-96 object-cover opacity-70"
              />
              <div className="absolute bottom-0 left-0 p-8 text-white">
                <div className="inline-block bg-blue-500 text-xs px-2 py-1 rounded mb-2">
                  Featured Event
                </div>
                <h2 className="text-2xl md:text-4xl font-bold mb-2">{featuredEvent.title}</h2>
                <p className="mb-4 max-w-lg text-lg">
                  {createPlainText(parseDescription(featuredEvent.description))}
                </p>
                <button className="bg-blue-500 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-blue-600 transition-colors group">
                  Learn More <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ) : (
            <div className="h-80 md:h-96 bg-gray-100 rounded-xl flex items-center justify-center">
              <p className="text-gray-500">No featured event available</p>
            </div>
          )}
        </section>

        {/* Features Section */}
        <section className="py-16 px-4">
          <div className="text-center mb-12">
            <p className="text-blue-500 text-sm mb-2">Features</p>
            <h2 className="text-3xl font-bold mb-4">Streamline Your Event Management</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our platform offers everything you need to create, manage, and promote successful college events.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="text-center p-4 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer">
              <div className="bg-blue-50 p-4 inline-block rounded-lg mb-4 group-hover:bg-blue-100">
                <Calendar className="h-6 w-6 text-blue-500" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Create & Manage Events</h3>
              <p className="text-gray-600 text-sm">
                Easily create, customize, and manage events with our intuitive platform.
              </p>
            </div>
            
            <div className="text-center p-4 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer">
              <div className="bg-blue-50 p-4 inline-block rounded-lg mb-4">
                <Ticket className="h-6 w-6 text-blue-500" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Seamless Ticketing</h3>
              <p className="text-gray-600 text-sm">
                Generate custom QR code tickets and distribute them automatically.
              </p>
            </div>
            
            <div className="text-center p-4 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer">
              <div className="bg-blue-50 p-4 inline-block rounded-lg mb-4">
                <CheckSquare className="h-6 w-6 text-blue-500" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Efficient Check-in</h3>
              <p className="text-gray-600 text-sm">
                Quick and secure check-in process with real-time attendance tracking.
              </p>
            </div>
            
            <div className="text-center p-4 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer">
              <div className="bg-blue-50 p-4 inline-block rounded-lg mb-4">
                <BarChart2 className="h-6 w-6 text-blue-500" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Detailed Analytics</h3>
              <p className="text-gray-600 text-sm">
                Get comprehensive insights and statistics about your events.
              </p>
            </div>
          </div>
        </section>

        {/* Upcoming Events Section - Updated to match EventCard style */}
        <section className="py-12 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <div>
                <p className="text-blue-500 text-sm">Upcoming</p>
                <h2 className="text-3xl font-bold">Discover Events</h2>
                <p className="text-gray-600">Find and register for the best events happening around your campus.</p>
              </div>
              <a href="/events" className="flex items-center text-blue-500 hover:underline group">
                View All Events <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-white rounded-lg overflow-hidden shadow-md">
                    <div className="h-48 bg-gray-200 animate-pulse"></div>
                    <div className="p-6">
                      <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                      <div className="h-6 bg-gray-200 rounded animate-pulse mb-2"></div>
                      <div className="h-16 bg-gray-200 rounded animate-pulse mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {upcomingEvents.length > 0 ? (
                  upcomingEvents.map((event) => (
                    <a key={event.$id} href={`/events/${event.$id}`} className="block group">
                      <div className="w-full bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 h-full border border-gray-100">
                        <div className="flex flex-col h-full">
                          {/* Image Section */}
                          <div className="relative overflow-hidden h-48">
                            <img 
                              src={getEventImageUrl(event)}
                              alt={event.title}
                              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            
                            {/* Price Tag */}
                            <div className="absolute top-3 right-3">
                              <span className={`${event.price > 0 ? 'bg-blue-600 text-white' : 'bg-green-500 text-white'} px-3 py-1 rounded-full text-sm font-medium`}>
                                {getPriceDisplay(event.price)}
                              </span>
                            </div>
                            
                            {/* Category Badge */}
                            <div className="absolute bottom-3 left-3">
                              <span className="bg-white/90 px-3 py-1 rounded-full text-sm font-medium text-gray-700">
                                {event.category}
                              </span>
                            </div>
                          </div>

                          {/* Content Section */}
                          <div className="flex flex-col justify-between p-4 flex-grow">
                            <div>
                              {/* Title */}
                              <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                                {event.title}
                              </h3>
                              
                              {/* Description */}
                              <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                                {createPlainText(parseDescription(event.description)) || 'Join us for this exciting event!'}
                              </p>
                            </div>
                            
                            {/* Event Details */}
                            <div className="space-y-2 text-sm text-gray-600 mt-auto">
                              {/* Date */}
                              <div className="flex items-center gap-2">
                                <FaCalendarAlt className="text-blue-500" />
                                <span>{formatDate(event.date)} • {getYear(event.date)}</span>
                              </div>
                              
                              {/* Time */}
                              <div className="flex items-center gap-2">
                                <FaClock className="text-blue-500" />
                                <span>{formatTime(event.date)}</span>
                              </div>
                              
                              {/* Location */}
                              <div className="flex items-center gap-2">
                                <FaMapMarkerAlt className="text-blue-500" />
                                <span className="truncate">{event.venue}</span>
                              </div>
                              
                              {/* Attendees */}
                              <div className="flex items-center gap-2">
                                <FaUsers className="text-blue-500" />
                                <span>{event.attendees ? event.attendees.split(',').length : 0} attending</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                  ))
                ) : (
                  <div className="col-span-3 text-center py-12">
                    <p className="text-gray-500">No upcoming events found</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-blue-500 py-12 px-4">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
            <div className="text-white mb-6 md:mb-0 md:w-2/3">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to host your next event?</h2>
              <p className="mb-4">
                Join EventX today and transform how you manage college events. Get started in minutes.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button className="bg-white text-blue-500 px-6 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors">
                Sign Up Now
              </button>
              <button className="bg-transparent text-white border border-white px-6 py-3 rounded-full font-medium hover:bg-blue-600 transition-colors">
                Learn More
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;