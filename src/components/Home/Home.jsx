// import React, { useEffect, useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { useNavigate } from 'react-router-dom';

// const Home = () => {
//   const navigate = useNavigate();
//   const [activeCategory, setActiveCategory] = useState(null);

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       (entries) => {
//         entries.forEach((entry) => {
//           if (entry.isIntersecting) {
//             entry.target.classList.add('fade-in');
//           }
//         });
//       },
//       { threshold: 0.1 }
//     );

//     document.querySelectorAll('.animate-on-scroll').forEach((section) => {
//       observer.observe(section);
//     });

//     // Particle background effect
//     const createParticles = () => {
//       const container = document.getElementById('particle-container');
//       for (let i = 0; i < 50; i++) {
//         const particle = document.createElement('div');
//         particle.classList.add('particle');
//         particle.style.left = `${Math.random() * 100}%`;
//         particle.style.top = `${Math.random() * 100}%`;
//         particle.style.animationDuration = `${Math.random() * 10 + 5}s`;
//         container.appendChild(particle);
//       }
//     };

//     createParticles();
//   }, []);

//   const handleCardClick = (event) => {
//     navigate(event === "events" ? "/events" : `/event/${event}`);
//   };

//   const eventCategories = [
//     { 
//       icon: '🎵', 
//       name: 'Music', 
//       color: '#7DD3FC', 
//       description: 'Concerts & Open Mics',
//       details: 'Discover live performances, jam sessions, and musical talents from across campus.'
//     },
//     { 
//       icon: '💻', 
//       name: 'Tech', 
//       color: '#BAE6FD', 
//       description: 'Hackathons & Workshops',
//       details: 'Innovative coding challenges, tech talks, and hands-on learning experiences.'
//     },
//     { 
//       icon: '⚽', 
//       name: 'Sports', 
//       color: '#7DD3FC', 
//       description: 'Tournaments & Matches',
//       details: 'Competitive sports events, inter-college tournaments, and fitness challenges.'
//     },
//     { 
//       icon: '🎭', 
//       name: 'Cultural', 
//       color: '#BAE6FD', 
//       description: 'Festivals & Exhibitions',
//       details: 'Celebrate diversity through art, dance, theater, and cultural showcases.'
//     }
//   ];

//   return (
//     <div className="font-sans overflow-hidden relative">
//       {/* Particle Background */}
//       <div 
//         id="particle-container" 
//         className="fixed inset-0 pointer-events-none z-0 opacity-10"
//         style={{
//           background: 'radial-gradient(circle, rgba(13,110,253,0.1) 0%, rgba(125,211,252,0.1) 100%)'
//         }}
//       />

//       {/* Modern Hero Section */}
//       <section className="min-h-screen relative bg-white z-10">
//         <div className="absolute inset-0 overflow-hidden">
//           <div className="absolute w-[200%] h-[150%] -top-1/2 -left-1/2 bg-[#F0F9FF] transform rotate-[15deg]"></div>
//         </div>

//         <div className="container mx-auto px-4 pt-32 relative z-20">
//           <motion.div 
//             initial={{ opacity: 0, y: 50 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8 }}
//             className="max-w-2xl"
//           >
//             <h1 className="text-5xl md:text-7xl font-bold mb-6 text-[#0369A1] leading-tight">
//               Campus Life <br />
//               <span className="text-[#7DD3FC]">Reimagined</span>
//             </h1>
//             <p className="text-xl text-gray-600 mb-8">
//               Transform your college experience through engaging, inspiring, and unforgettable events.
//             </p>
//             <button
//               className="px-8 py-4 rounded-full text-lg font-semibold bg-gradient-to-r from-[#0369A1] to-[#7DD3FC] text-white hover:from-[#075985] hover:to-[#7DD3FC] transition-all transform hover:scale-105 shadow-lg"
//               onClick={() => handleCardClick("events")}
//             >
//               Discover Your Journey
//             </button>
//           </motion.div>
//         </div>
//       </section>

//       {/* Enhanced Event Categories Section */}
//       <section className="py-24 bg-[#F0F9FF] animate-on-scroll relative z-20">
//         <div className="container mx-auto px-4">
//           <motion.h2 
//             initial={{ opacity: 0, y: 50 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             className="text-4xl font-bold text-center mb-16 text-[#0369A1]"
//           >
//             Explore Event Categories
//           </motion.h2>

//           <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
//             {eventCategories.map((category, index) => (
//               <motion.div
//                 key={index}
//                 initial={{ scale: 0.9, opacity: 0 }}
//                 whileInView={{ scale: 1, opacity: 1 }}
//                 whileHover={{ scale: 1.05 }}
//                 onHoverStart={() => setActiveCategory(category)}
//                 onHoverEnd={() => setActiveCategory(null)}
//                 className="group cursor-pointer perspective-1000"
//               >
//                 <div className="relative h-64 transform-style-preserve-3d transition-transform duration-500">
//                   <div className="absolute inset-0 bg-white rounded-3xl p-6 shadow-lg flex flex-col items-center justify-center backface-hidden">
//                     <div className="text-6xl mb-4">{category.icon}</div>
//                     <h3 className="text-2xl font-bold text-[#0369A1]">{category.name}</h3>
//                   </div>
//                 </div>
//               </motion.div>
//             ))}
//           </div>

//           <AnimatePresence>
//             {activeCategory && (
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: 20 }}
//                 className="mt-8 text-center"
//               >
//                 <p className="text-xl text-[#0369A1] font-semibold">
//                   {activeCategory.description}
//                 </p>
//                 <p className="text-gray-600 max-w-2xl mx-auto mt-4">
//                   {activeCategory.details}
//                 </p>
//                 <button
//                   className="mt-6 px-6 py-3 rounded-full bg-[#0369A1] text-white hover:bg-[#075985] transition-colors"
//                   onClick={() => handleCardClick(activeCategory.name.toLowerCase())}
//                 >
//                   Explore {activeCategory.name} Events
//                 </button>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </div>
//       </section>

//       {/* Interactive CTA Section */}
//       <section className="py-24 bg-white animate-on-scroll relative z-20">
//         <div className="container mx-auto px-4">
//           <div className="bg-gradient-to-r from-[#0369A1] to-[#7DD3FC] rounded-[4rem] p-12 text-center relative overflow-hidden">
//             <motion.h2 
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               className="text-4xl font-bold text-white mb-6"
//             >
//               Your Campus, Your Adventure
//             </motion.h2>
//             <p className="text-white/90 mb-8 max-w-2xl mx-auto">
//               Connect, learn, and grow. Be part of a vibrant community that celebrates every moment.
//             </p>
//             <button
//               className="px-8 py-4 rounded-full bg-white text-[#0369A1] font-semibold hover:bg-gray-100 transition-colors transform hover:scale-105"
//               onClick={() => handleCardClick("events")}
//             >
//               Start Your Journey
//             </button>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default Home;






















///////////////////// new Design ///////////
import React, { useState } from 'react';
import { Search, ChevronRight, Calendar, Ticket, CheckSquare, BarChart2 } from 'lucide-react';
import img1 from "../../Images/img1.avif"
import img2 from "../../Images/img2.avif"
import img3 from "../../Images/img3.jpeg"
import img4 from "../../Images/img4.avif"

const Home = () => {
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
            <button className="px-4 py-1 bg-gray-900 text-white rounded-full hover:bg-black transition-colors">Technology</button>
            <button className="px-4 py-1 bg-white border rounded-full hover:bg-gray-100 transition-colors">Cultural</button>
            <button className="px-4 py-1 bg-white border rounded-full hover:bg-gray-100 transition-colors">Career</button>
            <button className="px-4 py-1 bg-white border rounded-full hover:bg-gray-100 transition-colors">Sports</button>
            <button className="px-4 py-1 bg-white border rounded-full hover:bg-gray-100 transition-colors">Academic</button>
            <button className="px-4 py-1 bg-white border rounded-full hover:bg-gray-100 transition-colors">Workshop</button>
          </div>
        </section>

        {/* Featured Event Banner - INCREASED SIZE */}
        <section className="mx-4 md:mx-8 lg:mx-auto lg:max-w-6xl mb-16">
          <div className="relative rounded-xl overflow-hidden bg-black shadow-lg transition-transform hover:scale-[1.01] cursor-pointer">
            <img 
              src={img1}
              alt="Annual Tech Summit" 
              className="w-full h-80 md:h-96 object-cover opacity-70"
            />
            <div className="absolute bottom-0 left-0 p-8 text-white">
              <div className="inline-block bg-blue-500 text-xs px-2 py-1 rounded mb-2">
                Featured Event
              </div>
              <h2 className="text-2xl md:text-4xl font-bold mb-2">Annual Tech Summit</h2>
              <p className="mb-4 max-w-lg text-lg">
                Join us for the biggest tech event of the year. Learn from industry experts, network with peers, and explore cutting-edge technologies.
              </p>
              <button className="bg-blue-500 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-blue-600 transition-colors group">
                Learn More <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
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

        {/* Upcoming Events Section - LARGER CARDS WITHOUT HOVER OVERLAY */}
        <section className="py-12 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <div>
                <p className="text-blue-500 text-sm">Upcoming</p>
                <h2 className="text-3xl font-bold">Discover Events</h2>
                <p className="text-gray-600">Find and register for the best events happening around your campus.</p>
              </div>
              <a href="#" className="flex items-center text-blue-500 hover:underline group">
                View All Events <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Cultural Night Card */}
              <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer">
                <div className="relative">
                  <img src={img2} alt="Cultural Night" className="w-full h-56 object-cover transition-transform duration-500 hover:scale-105" />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-500">Cultural</span>
                    <span className="text-sm text-gray-500">Free</span>
                  </div>
                  <h3 className="font-bold text-xl mb-2">Cultural Night</h3>
                  <p className="text-gray-600 mb-4">
                    Experience diverse cultures through performances, food, and music. Join us for a night to celebrate our global community.
                  </p>
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <Calendar size={14} className="mr-1" /> Nov 25, 2023
                    <span className="mx-2">•</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg> 7 PM
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg> College Grounds
                    <span className="ml-4">450 attending</span>
                  </div>
                </div>
              </div>

              {/* Hackathon Card */}
              <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer">
                <div className="relative">
                  <img src={img3} alt="Hackathon 2023" className="w-full h-56 object-cover transition-transform duration-500 hover:scale-105" />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-500">Technology</span>
                    <span className="text-sm text-gray-500">Free</span>
                  </div>
                  <h3 className="font-bold text-xl mb-2">Hackathon 2023</h3>
                  <p className="text-gray-600 mb-4">
                    48 hours of coding, creativity, and collaboration. Solve real-world problems and compete for exciting prizes.
                  </p>
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <Calendar size={14} className="mr-1" /> Dec 8, 2023
                    <span className="mx-2">•</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg> 7 PM
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg> Computer Science Building
                    <span className="ml-4">120 attending</span>
                  </div>
                </div>
              </div>

              {/* Career Fair Card */}
              <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer">
                <div className="relative">
                  <img src={img4} alt="Career Fair" className="w-full h-56 object-cover transition-transform duration-500 hover:scale-105" />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-500">Career</span>
                    <span className="text-sm text-gray-500">Free</span>
                  </div>
                  <h3 className="font-bold text-xl mb-2">Career Fair</h3>
                  <p className="text-gray-600 mb-4">
                    Connect with top employers, explore internship and job opportunities, and attend resume workshops.
                  </p>
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <Calendar size={14} className="mr-1" /> Nov 15, 2023
                    <span className="mx-2">•</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg> 10 AM
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg> Main Hall
                    <span className="ml-4">500 attending</span>
                  </div>
                </div>
              </div>
            </div>
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