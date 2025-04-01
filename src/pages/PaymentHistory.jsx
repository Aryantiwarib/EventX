import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Container } from '../components';
import service from '../appwrite/config';
import { useNavigate } from 'react-router-dom';

function PaymentHistory() {
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);
  const authStatus = useSelector((state) => state.auth.status);

  useEffect(() => {
    // Redirect if not authenticated
    if (!authStatus) {
      navigate('/');
      return;
    }

    const fetchPaymentHistory = async () => {
      setIsLoading(true);
      try {
        const response = await service.getPaymentsByUser(userData.$id);
        
        // Get event details for each payment
        const paymentsWithDetails = await Promise.all(
          response.documents.map(async (payment) => {
            try {
              const event = await service.getEvent(payment.eventId);
              return {
                ...payment,
                eventTitle: event?.title || 'Unknown Event',
                eventSlug: event?.$id || ''
              };
            } catch (error) {
              console.error(`Error fetching event details for payment ${payment.$id}:`, error);
              return {
                ...payment,
                eventTitle: 'Unknown Event',
                eventSlug: ''
              };
            }
          })
        );
        
        setPayments(paymentsWithDetails);
        setError(null);
      } catch (error) {
        console.error('Error fetching payment history:', error);
        setError('Failed to load payment history. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    if (userData?.$id) {
      fetchPaymentHistory();
    }
  }, [userData, navigate, authStatus]);

  // Format date to a more readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status badge color based on payment status
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'success':
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
      case 'declined':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Container>
      <div className="py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Payment History</h1>
          <p className="text-gray-600">View all your past transactions and payment details.</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-60">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg">
            <p>{error}</p>
          </div>
        ) : payments.length === 0 ? (
          <div className="bg-gray-50 p-8 rounded-lg text-center">
            <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <h2 className="mt-4 text-xl font-medium text-gray-700">No Payment History</h2>
            <p className="mt-2 text-gray-500">You haven't made any payments yet.</p>
            <button 
              onClick={() => navigate('/events')}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Browse Events
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Event
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Method
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {payments.map((payment) => (
                  <tr key={payment.$id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {payment.paymentId?.substring(0, 8) || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {payment.eventSlug ? (
                        <button 
                          onClick={() => navigate(`/events/${payment.eventSlug}`)}
                          className="text-sm font-medium text-blue-600 hover:text-blue-800"
                        >
                          {payment.eventTitle}
                        </button>
                      ) : (
                        <span className="text-sm text-gray-500">{payment.eventTitle}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(payment.paymentDate || payment.$createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {payment.currency ? `${payment.currency} ` : '₹ '}{payment.amount}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {payment.paymentMethod || 'Online'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                        {payment.status || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button 
                        // onClick={() => navigate(`/payment-details/${payment.$id}`)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Container>
  );
}

export default PaymentHistory;