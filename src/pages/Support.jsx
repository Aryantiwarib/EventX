import { useLocation } from 'react-router-dom';

const Support = () => {
    const { state } = useLocation();
    
    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-sm">
                <h1 className="text-2xl font-bold mb-4">Payment Support</h1>
                {state?.paymentId && (
                    <div className="mb-4">
                        <p className="font-medium">Payment Reference ID: {state.paymentId}</p>
                        {state.error && (
                            <p className="text-red-600 mt-2">Error Details: {state.error}</p>
                        )}
                    </div>
                )}
                <p className="text-gray-600">
                    Please contact our support team at support@eventx.com with the above details.
                </p>
            </div>
        </div>
    );
};

export default Support;