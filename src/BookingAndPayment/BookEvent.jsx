import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import appwriteService from '../appwrite/config';
import { Button } from '../components';
import { FaEnvelope, FaUser, FaLock } from 'react-icons/fa';
import { motion } from 'framer-motion';

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

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const data = await appwriteService.getEvent(eventId);
                if (data) {
                    // Convert price to number for calculations
                    data.price = parseFloat(data.price);
                    setEvent(data);
                    setLoading(false);
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
    }, [eventId]);

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
        const options = {
            key: "rzp_test_fXVCC0ILCOrj7Y",
            amount: (event.price * 100).toString(), // Convert to paise
            currency: "INR",
            name: event.title,
            description: "Event Booking",
            prefill: { name, email },
            handler: async (response) => {
                try {
                    // Create booking record
                    const booking = await appwriteService.createBooking({
                        eventId: event.$id,
                        userId: currentUser.$id,
                        paymentId: response.razorpay_payment_id,
                        ticketHolderName: name,
                        ticketHolderEmail: email,
                        amount: event.price
                    });

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


                    // Update event attendees
                    const currentAttendees = event.attendees
                        ? event.attendees.split(',').filter(Boolean)
                        : [];

                    await appwriteService.updateEvent(event.$id, { // Changed from event.slug to event.$id
                        attendees: [...currentAttendees, currentUser.$id].join(',')
                    });

                    navigate('/dashboard', {
                        state: {
                            message: 'Booking successful!',
                            bookingId: booking.$id,
                            paymentId: response.razorpay_payment_id
                        }
                    });
                } catch (error) {
                    console.error('Payment processing failed:', error);
                    alert(`Payment completed but record creation failed. Please contact support with this ID: ${response.razorpay_payment_id}`);
                    navigate('/support', {
                        state: {
                            paymentId: response.razorpay_payment_id,
                            error: error.message
                        }
                    });
                }
            },
            notes: {
                userId: currentUser.$id,
                eventId: eventId
            }
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
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
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                            >
                                <FaLock className="text-sm" />
                                Proceed to Payment
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