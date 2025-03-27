import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.animate-on-scroll').forEach((section) => {
      observer.observe(section);
    });

    // Particle background effect
    const createParticles = () => {
      const container = document.getElementById('particle-container');
      for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.animationDuration = `${Math.random() * 10 + 5}s`;
        container.appendChild(particle);
      }
    };

    createParticles();
  }, []);

  const handleCardClick = (event) => {
    navigate(event === "events" ? "/events" : `/event/${event}`);
  };

  const eventCategories = [
    { 
      icon: '🎵', 
      name: 'Music', 
      color: '#7DD3FC', 
      description: 'Concerts & Open Mics',
      details: 'Discover live performances, jam sessions, and musical talents from across campus.'
    },
    { 
      icon: '💻', 
      name: 'Tech', 
      color: '#BAE6FD', 
      description: 'Hackathons & Workshops',
      details: 'Innovative coding challenges, tech talks, and hands-on learning experiences.'
    },
    { 
      icon: '⚽', 
      name: 'Sports', 
      color: '#7DD3FC', 
      description: 'Tournaments & Matches',
      details: 'Competitive sports events, inter-college tournaments, and fitness challenges.'
    },
    { 
      icon: '🎭', 
      name: 'Cultural', 
      color: '#BAE6FD', 
      description: 'Festivals & Exhibitions',
      details: 'Celebrate diversity through art, dance, theater, and cultural showcases.'
    }
  ];

  return (
    <div className="font-sans overflow-hidden relative">
      {/* Particle Background */}
      <div 
        id="particle-container" 
        className="fixed inset-0 pointer-events-none z-0 opacity-10"
        style={{
          background: 'radial-gradient(circle, rgba(13,110,253,0.1) 0%, rgba(125,211,252,0.1) 100%)'
        }}
      />

      {/* Modern Hero Section */}
      <section className="min-h-screen relative bg-white z-10">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-[200%] h-[150%] -top-1/2 -left-1/2 bg-[#F0F9FF] transform rotate-[15deg]"></div>
        </div>

        <div className="container mx-auto px-4 pt-32 relative z-20">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-[#0369A1] leading-tight">
              Campus Life <br />
              <span className="text-[#7DD3FC]">Reimagined</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Transform your college experience through engaging, inspiring, and unforgettable events.
            </p>
            <button
              className="px-8 py-4 rounded-full text-lg font-semibold bg-gradient-to-r from-[#0369A1] to-[#7DD3FC] text-white hover:from-[#075985] hover:to-[#7DD3FC] transition-all transform hover:scale-105 shadow-lg"
              onClick={() => handleCardClick("events")}
            >
              Discover Your Journey
            </button>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Event Categories Section */}
      <section className="py-24 bg-[#F0F9FF] animate-on-scroll relative z-20">
        <div className="container mx-auto px-4">
          <motion.h2 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-center mb-16 text-[#0369A1]"
          >
            Explore Event Categories
          </motion.h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {eventCategories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.05 }}
                onHoverStart={() => setActiveCategory(category)}
                onHoverEnd={() => setActiveCategory(null)}
                className="group cursor-pointer perspective-1000"
              >
                <div className="relative h-64 transform-style-preserve-3d transition-transform duration-500">
                  <div className="absolute inset-0 bg-white rounded-3xl p-6 shadow-lg flex flex-col items-center justify-center backface-hidden">
                    <div className="text-6xl mb-4">{category.icon}</div>
                    <h3 className="text-2xl font-bold text-[#0369A1]">{category.name}</h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <AnimatePresence>
            {activeCategory && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="mt-8 text-center"
              >
                <p className="text-xl text-[#0369A1] font-semibold">
                  {activeCategory.description}
                </p>
                <p className="text-gray-600 max-w-2xl mx-auto mt-4">
                  {activeCategory.details}
                </p>
                <button
                  className="mt-6 px-6 py-3 rounded-full bg-[#0369A1] text-white hover:bg-[#075985] transition-colors"
                  onClick={() => handleCardClick(activeCategory.name.toLowerCase())}
                >
                  Explore {activeCategory.name} Events
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Interactive CTA Section */}
      <section className="py-24 bg-white animate-on-scroll relative z-20">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-[#0369A1] to-[#7DD3FC] rounded-[4rem] p-12 text-center relative overflow-hidden">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold text-white mb-6"
            >
              Your Campus, Your Adventure
            </motion.h2>
            <p className="text-white/90 mb-8 max-w-2xl mx-auto">
              Connect, learn, and grow. Be part of a vibrant community that celebrates every moment.
            </p>
            <button
              className="px-8 py-4 rounded-full bg-white text-[#0369A1] font-semibold hover:bg-gray-100 transition-colors transform hover:scale-105"
              onClick={() => handleCardClick("events")}
            >
              Start Your Journey
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;






















///////////////////// new Design ///////////
// import React, { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { useNavigate } from 'react-router-dom';
// import { 
//   Bookmark, 
//   Users, 
//   Sparkles, 
//   Calendar, 
//   Star, 
//   Lightbulb 
// } from 'lucide-react';

// const Home = () => {
//   const navigate = useNavigate();
//   const [activeCategory, setActiveCategory] = useState(null);
//   const [upcomingEvents, setUpcomingEvents] = useState([
//     {
//       id: 1,
//       title: 'Global Tech Innovation Summit',
//       date: 'May 15-16, 2024',
//       category: 'tech',
//       icon: <Lightbulb className="w-12 h-12 text-blue-400" />
//     },
//     {
//       id: 2,
//       title: 'Campus Music Festival',
//       date: 'June 22, 2024',
//       category: 'music',
//       icon: <Star className="w-12 h-12 text-purple-400" />
//     },
//     {
//       id: 3,
//       title: 'Cultural Fusion Showcase',
//       date: 'July 5, 2024',
//       category: 'cultural',
//       icon: <Sparkles className="w-12 h-12 text-pink-400" />
//     }
//   ]);

//   const [particles, setParticles] = useState([]);

//   useEffect(() => {
//     // Create particle effect
//     const generateParticles = () => {
//       const particleCount = 50;
//       const newParticles = Array.from({ length: particleCount }, (_, index) => ({
//         id: index,
//         x: Math.random() * 100,
//         y: Math.random() * 100,
//         size: Math.random() * 3 + 1,
//         speed: Math.random() * 2 + 0.5,
//         delay: Math.random() * 5
//       }));
//       setParticles(newParticles);
//     };

//     generateParticles();
//   }, []);

//   const eventCategories = [
//     {
//       id: 'music',
//       title: 'Music Pulse',
//       icon: '🎵',
//       color: '#4B0082',
//       description: 'Where Melodies Meet Memories',
//       details: 'From indie bands to classical ensembles, experience the rhythm of campus life.',
//       events: ['Live Concerts', 'Open Mic Nights', 'Music Workshops']
//     },
//     {
//       id: 'tech',
//       title: 'Innovation Hub',
//       icon: '💻',
//       color: '#1E90FF',
//       description: 'Coding the Future',
//       details: 'Hackathons, workshops, and cutting-edge tech experiences that transform ideas into reality.',
//       events: ['Hackathons', 'Tech Talks', 'Coding Bootcamps']
//     },
//     {
//       id: 'sports',
//       title: 'Arena',
//       icon: '⚽',
//       color: '#32CD32',
//       description: 'Beyond the Game',
//       details: 'Championship tournaments, fitness challenges, and team-building experiences.',
//       events: ['Inter-College Tournaments', 'Fitness Challenges', 'Sports Workshops']
//     },
//     {
//       id: 'cultural',
//       title: 'Cultural Mosaic',
//       icon: '🎭',
//       color: '#FF4500',
//       description: 'Celebrating Diversity',
//       details: 'A vibrant showcase of global traditions, art, and creative expression.',
//       events: ['Dance Festivals', 'Art Exhibitions', 'Cultural Exchange']
//     }
//   ];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-[#0F172A] to-[#1E293B] text-white relative overflow-hidden">
//       {/* Particle Background */}
//       <div className="absolute inset-0 pointer-events-none overflow-hidden">
//         {particles.map((particle) => (
//           <div
//             key={particle.id}
//             className="absolute bg-white/30 rounded-full"
//             style={{
//               left: `${particle.x}%`,
//               top: `${particle.y}%`,
//               width: `${particle.size}px`,
//               height: `${particle.size}px`,
//               animation: `float ${particle.speed}s ease-in-out infinite`,
//               animationDelay: `${particle.delay}s`
//             }}
//           />
//         ))}
//       </div>

//       {/* Navigation */}
//       <nav className="absolute top-0 left-0 right-0 p-6 z-50">
//         <div className="container mx-auto flex justify-between items-center">
//           <div className="text-2xl font-bold tracking-wider flex items-center">
//             <svg className="w-8 h-8 mr-2" fill="currentColor" viewBox="0 0 20 20">
//               <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
//               <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15a24.98 24.98 0 01-8-1.308z" />
//             </svg>
//             EventScape
//           </div>
//           <div className="space-x-6">
//             <button 
//               className="hover:text-blue-300 transition-colors"
//               onClick={() => navigate('/events')}
//             >
//               Events
//             </button>
//             <button 
//               className="hover:text-blue-300 transition-colors"
//               onClick={() => navigate('/categories')}
//             >
//               Categories
//             </button>
//             <button 
//               className="px-4 py-2 bg-blue-600 rounded-full hover:bg-blue-700 transition-colors"
//               onClick={() => navigate('/create-event')}
//             >
//               Create Event
//             </button>
//           </div>
//         </div>
//       </nav>

//       {/* Hero Section */}
//       <div className="relative h-screen flex items-center justify-center">
//         <div className="container mx-auto px-4 z-20 text-center">
//           <motion.div
//             initial={{ opacity: 0, y: 50 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8 }}
//           >
//             <h1 className="text-6xl font-extrabold mb-6">
//               <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
//                 Campus Events
//               </span>
//               <br />
//               Reimagined
//             </h1>
//             <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10">
//               Transform your college experience. Discover, participate, and create memories that last a lifetime.
//             </p>
//             <div className="flex justify-center space-x-4">
//               <button 
//                 className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full text-white font-semibold hover:scale-105 transition-transform"
//                 onClick={() => navigate('/events')}
//               >
//                 Explore Events
//               </button>
//               <button 
//                 className="px-8 py-3 border-2 border-white/30 rounded-full text-white hover:bg-white/10 transition-colors"
//                 onClick={() => navigate('/about')}
//               >
//                 Learn More
//               </button>
//             </div>
//           </motion.div>
//         </div>

//         {/* Abstract Background Shapes */}
//         <div className="absolute inset-0 overflow-hidden pointer-events-none">
//           <div className="absolute -top-1/2 -right-1/2 w-[200%] h-[200%] bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full transform rotate-45"></div>
//           <div className="absolute -bottom-1/2 -left-1/2 w-[200%] h-[200%] bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full transform -rotate-45"></div>
//         </div>
//       </div>

//       {/* Event Categories Section */}
//       <div className="container mx-auto px-4 mt-24 relative z-20">
//         <h2 className="text-4xl font-bold text-center mb-16">
//           Discover Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">Passion</span>
//         </h2>
        
//         <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
//           {eventCategories.map((category) => (
//             <motion.div
//               key={category.id}
//               initial={{ opacity: 0, y: 50 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               whileHover={{ scale: 1.05 }}
//               transition={{ duration: 0.3 }}
//               className="bg-[#1E293B] rounded-2xl p-6 text-center cursor-pointer relative overflow-hidden group"
//               onHoverStart={() => setActiveCategory(category)}
//               onHoverEnd={() => setActiveCategory(null)}
//             >
//               <div 
//                 className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity" 
//                 style={{ backgroundColor: category.color }}
//               />
//               <div className="text-6xl mb-4 relative z-10 opacity-80">{category.icon}</div>
//               <h3 className="text-2xl font-bold mb-2 relative z-10">{category.title}</h3>
//               <p className="text-gray-400 mb-4 relative z-10">{category.description}</p>
//             </motion.div>
//           ))}
//         </div>

//         <AnimatePresence>
//           {activeCategory && (
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: 20 }}
//               className="mt-12 text-center"
//               style={{ color: activeCategory.color }}
//             >
//               <p className="text-xl font-semibold mb-4">{activeCategory.details}</p>
//               <div className="flex justify-center space-x-4 mt-6">
//                 {activeCategory.events.map((event, index) => (
//                   <span 
//                     key={index} 
//                     className="px-4 py-2 bg-[#1E293B] rounded-full text-sm"
//                   >
//                     {event}
//                   </span>
//                 ))}
//               </div>
//               <button
//                 className="mt-8 px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:scale-105 transition-transform"
//                 onClick={() => navigate(`/category/${activeCategory.id}`)}
//               >
//                 Explore {activeCategory.title}
//               </button>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>

//       {/* Upcoming Events Section */}
//       <div className="container mx-auto px-4 mt-24 relative z-20">
//         <h2 className="text-4xl font-bold text-center mb-16">
//           Upcoming <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">Events</span>
//         </h2>
        
//         <div className="grid md:grid-cols-3 gap-8">
//           {upcomingEvents.map((event) => (
//             <motion.div
//               key={event.id}
//               initial={{ opacity: 0, y: 50 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               className="bg-[#1E293B] rounded-2xl p-6 flex items-center space-x-6 hover:scale-105 transition-transform"
//             >
//               <div>{event.icon}</div>
//               <div>
//                 <h3 className="text-xl font-bold mb-2">{event.title}</h3>
//                 <p className="text-gray-400">{event.date}</p>
//                 <button 
//                   className="mt-4 px-4 py-2 bg-blue-600 rounded-full text-sm hover:bg-blue-700 transition-colors"
//                   onClick={() => navigate(`/event/${event.id}`)}
//                 >
//                   View Details
//                 </button>
//               </div>
//             </motion.div>
//           ))}
//         </div>
//       </div>

//       {/* Community Statistics Section */}
//       <div className="container mx-auto px-4 mt-24 relative z-20 mb-24">
//         <h2 className="text-4xl font-bold text-center mb-16">
//           Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">Community</span>
//         </h2>
        
//         <div className="grid md:grid-cols-3 gap-8">
//           {[
//             { 
//               icon: <Users className="w-12 h-12 text-blue-400" />, 
//               value: '10,000+', 
//               label: 'Active Users' 
//             },
//             { 
//               icon: <Calendar className="w-12 h-12 text-green-400" />, 
//               value: '250+', 
//               label: 'Monthly Events' 
//             },
//             { 
//               icon: <Bookmark className="w-12 h-12 text-purple-400" />, 
//               value: '50+', 
//               label: 'Event Categories' 
//             }
//           ].map((stat, index) => (
//             <motion.div
//               key={index}
//               initial={{ opacity: 0, y: 50 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               className="bg-[#1E293B] rounded-2xl p-6 text-center hover:scale-105 transition-transform"
//             >
//               <div className="flex justify-center mb-4">{stat.icon}</div>
//               <h3 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
//                 {stat.value}
//               </h3>
//               <p className="text-gray-400 mt-2">{stat.label}</p>
//             </motion.div>
//           ))}
//         </div>
//       </div>

//       {/* Custom Styles */}
//       <style jsx global>{`
//         @keyframes float {
//           0%, 100% { transform: translateY(0); }
//           50% { transform: translateY(-20px); }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default Home;