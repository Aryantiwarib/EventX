// import { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import appwriteService from '../appwrite/config';
// import { Button } from '../components';
// import { FaEnvelope, FaUser, FaLock } from 'react-icons/fa';
// import { motion } from 'framer-motion';

// function BookEvent() {
//     const { eventId } = useParams();
//     const navigate = useNavigate();
//     const currentUser = useSelector((state) => state.auth.userData);
//     const [event, setEvent] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState('');
//     const [name, setName] = useState('');
//     const [useSavedEmail, setUseSavedEmail] = useState(true);
//     const [email, setEmail] = useState(currentUser?.email || '');
//     const [formError, setFormError] = useState('');
//     const [hasBooking, setHasBooking] = useState(false);

//     useEffect(() => {
//         const fetchEvent = async () => {
//             try {
//                 const data = await appwriteService.getEvent(eventId);
//                 if (data) {
//                     // Convert price to number for calculations
//                     data.price = parseFloat(data.price);
//                     setEvent(data);
//                     setLoading(false);
                    
//                     // Check if user has already booked this event
//                     if (currentUser && currentUser.$id) {
//                         const bookingsResponse = await appwriteService.getUserBookings(currentUser.$id);
//                         const userBookings = bookingsResponse.documents || [];
//                         const hasBooked = userBookings.some(booking => booking.eventId === eventId);
//                         setHasBooking(hasBooked);
//                     }
//                 } else {
//                     setError('Event not found');
//                     setLoading(false);
//                 }
//             } catch (error) {
//                 setError(error.message);
//                 setLoading(false);
//             }
//         };

//         if (eventId) {
//             fetchEvent();
//         } else {
//             setError('Invalid event ID');
//             setLoading(false);
//         }
//     }, [eventId, currentUser]);

//     const handleSubmit = (e) => {
//         e.preventDefault();

//         if (!name.trim()) {
//             setFormError('Please enter name for ticket');
//             return;
//         }

//         if (!/\S+@\S+\.\S+/.test(email)) {
//             setFormError('Please enter a valid email address');
//             return;
//         }

//         initiatePayment();
//     };

//     const initiatePayment = () => {
//         const options = {
//             key: "rzp_test_fXVCC0ILCOrj7Y",
//             amount: (event.price * 100).toString(), // Convert to paise
//             currency: "INR",
//             name: event.title,
//             description: "Event Booking",
//             prefill: { name, email },
//             handler: async (response) => {
//                 try {
//                     // Create booking record with ticket information
//                     const booking = await appwriteService.createBooking({
//                         eventId: event.$id,
//                         userId: currentUser.$id,
//                         paymentId: response.razorpay_payment_id,
//                         ticketHolderName: name,
//                         ticketHolderEmail: email,
//                         amount: event.price,
//                         ticketType: 'Standard',
//                         status: 'Confirmed',
//                         ticketId: `TX-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
//                     });

//                     // Create payment record
//                     await appwriteService.createPaymentRecord({
//                         userId: currentUser.$id,
//                         eventId: event.$id,
//                         paymentId: response.razorpay_payment_id,
//                         amount: event.price.toString(),
//                         currency: 'INR',
//                         paymentMethod: 'razorpay',
//                         status: 'completed'
//                     });

//                     // Navigate to the ticket view page
//                     navigate(`/events/${eventId}/tickets/${booking.$id}`, {
//                         state: {
//                             message: 'Booking successful!',
//                             bookingId: booking.$id,
//                             paymentId: response.razorpay_payment_id
//                         }
//                     });
//                 } catch (error) {
//                     console.error('Payment processing failed:', error);
//                     alert(`Payment completed but record creation failed. Please contact support with this ID: ${response.razorpay_payment_id}`);
//                     navigate('/support', {
//                         state: {
//                             paymentId: response.razorpay_payment_id,
//                             error: error.message
//                         }
//                     });
//                 }
//             },
//             notes: {
//                 userId: currentUser.$id,
//                 eventId: eventId
//             }
//         };

//         const razorpay = new window.Razorpay(options);
//         razorpay.open();
//     };

//     const handleViewTickets = () => {
//         navigate(`/events/${eventId}/tickets`);
//     };

//     if (loading) {
//         return (
//             <div className="min-h-screen flex items-center justify-center">
//                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div className="min-h-screen flex items-center justify-center">
//                 <div className="text-red-500 text-xl text-center p-4 max-w-2xl">
//                     {error}
//                     <Button
//                         onClick={() => navigate('/events')}
//                         className="mt-4 block text-blue-600 hover:text-blue-800"
//                     >
//                         Back to Events
//                     </Button>
//                 </div>
//             </div>
//         );
//     }

    
//     return (
//         <div className="min-h-screen bg-gray-50 py-12">
//             <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
//                 <motion.div
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     className="bg-white rounded-2xl shadow-sm p-8 border border-gray-200"
//                 >
//                     <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
//                         Book {event.title}
//                     </h1>

//                     {hasBooking && (
//                         <div className="mb-8 p-4 bg-blue-50 rounded-lg">
//                             <p className="text-blue-700 text-center">
//                                 You've already booked this event.
//                             </p>
//                             <Button
//                                 onClick={handleViewTickets}
//                                 className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors"
//                             >
//                                 View Your Tickets
//                             </Button>
//                         </div>
//                     )}

//                     <form onSubmit={handleSubmit} className="space-y-6">
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-2">
//                                 Name on Ticket
//                             </label>
//                             <div className="relative">
//                                 <input
//                                     type="text"
//                                     value={name}
//                                     onChange={(e) => setName(e.target.value)}
//                                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                     placeholder="Enter name as it should appear on ticket"
//                                     required
//                                 />
//                                 <FaUser className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
//                             </div>
//                         </div>

//                         <div className="space-y-4">
//                             <div className="flex items-center">
//                                 <input
//                                     type="checkbox"
//                                     checked={useSavedEmail}
//                                     onChange={(e) => {
//                                         setUseSavedEmail(e.target.checked);
//                                         if (e.target.checked) setEmail(currentUser.email);
//                                     }}
//                                     id="useSavedEmail"
//                                     className="h-4 w-4 text-blue-600 border-gray-300 rounded"
//                                 />
//                                 <label
//                                     htmlFor="useSavedEmail"
//                                     className="ml-2 block text-sm text-gray-900"
//                                 >
//                                     Use my account email ({currentUser?.email})
//                                 </label>
//                             </div>

//                             {!useSavedEmail && (
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                                         Alternate Email for Updates
//                                     </label>
//                                     <div className="relative">
//                                         <input
//                                             type="email"
//                                             value={email}
//                                             onChange={(e) => setEmail(e.target.value)}
//                                             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                             placeholder="Enter email for event updates"
//                                             required={!useSavedEmail}
//                                         />
//                                         <FaEnvelope className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
//                                     </div>
//                                 </div>
//                             )}
//                         </div>

//                         {formError && (
//                             <div className="text-red-500 text-sm text-center">{formError}</div>
//                         )}

//                         <div className="border-t pt-6 mt-8">
//                             <div className="flex justify-between items-center mb-6">
//                                 <span className="text-gray-600">Total Amount:</span>
//                                 <span className="text-2xl font-bold text-gray-900">
//                                     ₹{event.price?.toLocaleString()}
//                                 </span>
//                             </div>

//                             <motion.button
//                                 whileHover={{ scale: 1.02 }}
//                                 whileTap={{ scale: 0.98 }}
//                                 type="submit"
//                                 className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
//                             >
//                                 <FaLock className="text-sm" />
//                                 Proceed to Payment
//                             </motion.button>
//                         </div>
//                     </form>
//                 </motion.div>

//                 <Button
//                     onClick={() => navigate(-1)}
//                     className="mt-6 text-gray-600 hover:text-gray-800 flex items-center gap-2"
//                     variant="ghost"
//                 >
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                         <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
//                     </svg>
//                     Back to Event
//                 </Button>
//             </div>
//         </div>
//     );
// }

// export default BookEvent;




















///////////////////////// EMail SET up

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import appwriteService from '../appwrite/config';
import { Button } from '../components';
import { FaEnvelope, FaUser, FaLock } from 'react-icons/fa';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import emailjs from '@emailjs/browser';
import { toast } from 'sonner';


function BookEvent() {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const currentUser = useSelector((state) => state.auth.userData);
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [name, setName] = useState('');
    const [useSavedEmail, setUseSavedEmail] = useState(true);
    const [email, setEmail] = useState(currentUser?.email || '');
    const [formError, setFormError] = useState('');
    const [hasBooking, setHasBooking] = useState(false);
    const [paymentLoading, setPaymentLoading] = useState(false);


    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const data = await appwriteService.getEvent(eventId);
                if (data) {
                    // Convert price to number for calculations
                    data.price = parseFloat(data.price);
                    setEvent(data);
                    setLoading(false);
                    
                    // Check if user has already booked this event
                    if (currentUser && currentUser.$id) {
                        const bookingsResponse = await appwriteService.getUserBookings(currentUser.$id);
                        const userBookings = bookingsResponse.documents || [];
                        const hasBooked = userBookings.some(booking => booking.eventId === eventId);
                        setHasBooking(hasBooked);
                    }
                } else {
                    setError('Event not found');
                    setLoading(false);
                }
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        if (eventId) {
            fetchEvent();
        } else {
            setError('Invalid event ID');
            setLoading(false);
        }
    }, [eventId, currentUser]);

    const formatDate = (dateString) => {
        if (!dateString) return 'TBD';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const sendConfirmationEmail = async (bookingData, paymentId) => {
        try {
            // First, let's log the environment variables to make sure they're loaded
            // (We'll only log whether they exist, not their values for security)
            console.log('Email configuration check:');
            console.log('Service ID exists:', !!import.meta.env.VITE_EMAILJS_SERVICE_ID);
            console.log('Template ID exists:', !!import.meta.env.VITE_EMAILJS_TEMPLATE_ID);
            console.log('Public key exists:', !!import.meta.env.VITE_EMAILJS_PUBLIC_KEY);
            
            // Create the template parameters object
            const templateParams = {
                name: bookingData.ticketHolderName,
                to_email: bookingData.ticketHolderEmail,
                event_title: event.title,
                event_date: formatDate(event.dateTime),
                booking_id: bookingData.ticketId,
                payment_id: paymentId,
                amount: `₹${event.price.toLocaleString()}`
            };
            
            // Log the parameters (excluding any sensitive data)
            console.log('Sending email with parameters:', {
                name: templateParams.name,
                event_title: templateParams.event_title,
                event_date: templateParams.event_date,
                booking_id: templateParams.booking_id,
                amount: templateParams.amount
            });
            
            // Send the email with promise handling
            const response = await emailjs.send(
                import.meta.env.VITE_EMAILJS_SERVICE_ID,
                import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
                templateParams,
                import.meta.env.VITE_EMAILJS_PUBLIC_KEY
            );
            
            console.log('Email sent successfully:', response);
            return true;
        } catch (error) {
            console.error('Email sending failed - detailed error:', {
                message: error.message,
                name: error.name,
                text: error.text,
                status: error.status,
                stack: error.stack
            });
            
            // Don't throw the error, just log it - we don't want to interrupt the booking process
            return false;
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!name.trim()) {
            setFormError('Please enter name for ticket');
            return;
        }

        if (!/\S+@\S+\.\S+/.test(email)) {
            setFormError('Please enter a valid email address');
            return;
        }

        initiatePayment();
    };

    const initiatePayment = () => {
        setPaymentLoading(true);
        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_SXONAICSSMElAV",
            amount: (event.price * 100).toString(), // Convert to paise
            currency: "INR",
            name: event.title,
            description: "Event Booking",
            prefill: { name, email },
            handler: async (response) => {
                try {
                    // Generate ticket ID
                    const ticketId = `TX-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
                    
                    // Create booking record with ticket information
                    const bookingData = {
                        eventId: event.$id,
                        userId: currentUser.$id,
                        paymentId: response.razorpay_payment_id,
                        ticketHolderName: name,
                        ticketHolderEmail: email,
                        amount: event.price,
                        ticketType: 'Standard',
                        status: 'Confirmed',
                        ticketId: ticketId
                    };
                    
                    // Log booking data (excluding sensitive info)
                    console.log('Creating booking with data:', {
                        eventId: bookingData.eventId,
                        ticketHolderName: bookingData.ticketHolderName,
                        amount: bookingData.amount,
                        ticketId: bookingData.ticketId
                    });
                    
                    const booking = await appwriteService.createBooking(bookingData);
                    console.log('Booking created:', booking.$id);

                    // Create payment record
                    await appwriteService.createPaymentRecord({
                        userId: currentUser.$id,
                        eventId: event.$id,
                        paymentId: response.razorpay_payment_id,
                        amount: event.price.toString(),
                        currency: 'INR',
                        paymentMethod: 'razorpay',
                        status: 'completed'
                    });
                    console.log('Payment record created');
                    
                    // Create real-time user notification
                    await appwriteService.createUserNotification(currentUser.$id, {
                        title: "Booking Confirmed!",
                        description: `You have successfully booked a ticket for "${event.title}".`,
                        eventType: event.category,
                        actionUrl: `/events/${event.$id}/tickets/${booking.$id}`,
                        eventId: event.$id
                    });
                    console.log('Notification created');

                    // Try to send confirmation email
                    try {
                        const emailSent = await sendConfirmationEmail(bookingData, response.razorpay_payment_id);
                        if (emailSent) {
                            console.log('Confirmation email sent successfully');
                        } else {
                            console.warn('Could not send confirmation email, but booking was completed');
                        }
                    } catch (emailError) {
                        console.error('Email error occurred but continuing with booking process:', emailError);
                    }

                    toast.success("Payment completed & Booking confirmed!");

                    // Navigate to the ticket view page - do this regardless of email success/failure
                    navigate(`/events/${eventId}/tickets/${booking.$id}`, {
                        state: {
                            message: 'Booking successful!',
                            bookingId: booking.$id,
                            paymentId: response.razorpay_payment_id
                        }
                    });
                } catch (error) {
                    console.error('Payment processing failed:', error);
                    toast.error(`Payment completed but record creation failed. Please contact support with this ID: ${response.razorpay_payment_id}`);
                    navigate('/support', {
                        state: {
                            paymentId: response.razorpay_payment_id,
                            error: error.message
                        }
                    });
                } finally {
                    setPaymentLoading(false);
                }
            },
            modal: {
                ondismiss: function() {
                    setPaymentLoading(false);
                    toast.error("Payment cancelled by user.");
                }
            },
            notes: {
                userId: currentUser.$id,
                eventId: eventId
            }
        };

        const razorpay = new window.Razorpay(options);
        
        razorpay.on("payment.failed", function (response) {
            setPaymentLoading(false);
            toast.error(`Payment failed: ${response.error.description}`);
        });

        razorpay.open();
    };

    const handleViewTickets = () => {
        navigate(`/tickets/${eventId}`);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-red-500 text-xl text-center p-4 max-w-2xl">
                    {error}
                    <Button
                        onClick={() => navigate('/events')}
                        className="mt-4 block text-blue-600 hover:text-blue-800"
                    >
                        Back to Events
                    </Button>
                </div>
            </div>
        );
    }

    
    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-sm p-8 border border-gray-200"
                >
                    <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                        Book {event.title}
                    </h1>

                    {hasBooking && (
                        <div className="mb-8 p-4 bg-blue-50 rounded-lg">
                            <p className="text-blue-700 text-center">
                                You've already booked this event.
                            </p>
                            <Button
                                onClick={handleViewTickets}
                                className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors"
                            >
                                View Your Tickets
                            </Button>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Name on Ticket
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter name as it should appear on ticket"
                                    required
                                />
                                <FaUser className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={useSavedEmail}
                                    onChange={(e) => {
                                        setUseSavedEmail(e.target.checked);
                                        if (e.target.checked) setEmail(currentUser.email);
                                    }}
                                    id="useSavedEmail"
                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                                />
                                <label
                                    htmlFor="useSavedEmail"
                                    className="ml-2 block text-sm text-gray-900"
                                >
                                    Use my account email ({currentUser?.email})
                                </label>
                            </div>

                            {!useSavedEmail && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Alternate Email for Updates
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Enter email for event updates"
                                            required={!useSavedEmail}
                                        />
                                        <FaEnvelope className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    </div>
                                </div>
                            )}
                        </div>

                        {formError && (
                            <div className="text-red-500 text-sm text-center">{formError}</div>
                        )}

                        <div className="border-t pt-6 mt-8">
                            <div className="flex justify-between items-center mb-6">
                                <span className="text-gray-600">Total Amount:</span>
                                <span className="text-2xl font-bold text-gray-900">
                                    ₹{event.price?.toLocaleString()}
                                </span>
                            </div>

                            <motion.button
                                whileHover={{ scale: !paymentLoading ? 1.02 : 1 }}
                                whileTap={{ scale: !paymentLoading ? 0.98 : 1 }}
                                type="submit"
                                disabled={paymentLoading}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {paymentLoading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>Opening Payment Gateway...</span>
                                    </>
                                ) : (
                                    <>
                                        <FaLock className="text-sm" />
                                        <span>Proceed to Payment</span>
                                    </>
                                )}
                            </motion.button>
                        </div>
                    </form>
                </motion.div>

                <Button
                    onClick={() => navigate(-1)}
                    className="mt-6 text-gray-600 hover:text-gray-800 flex items-center gap-2"
                    variant="ghost"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    Back to Event
                </Button>
            </div>
        </div>
    );
}

export default BookEvent;
