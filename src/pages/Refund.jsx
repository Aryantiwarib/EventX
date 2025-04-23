export default function UPIPolicy() {
    return (
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-gradient-to-r from-green-600 to-cyan-600 text-white rounded-xl p-8 mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">UPI Payment Policy</h1>
          <p className="text-xl opacity-90">Safe and Secure Transactions</p>
        </div>
  
        <div className="bg-white rounded-xl shadow-lg p-8 space-y-8">
          {/* Policy Items */}
          <div className="flex items-start gap-4">
            <div className="bg-green-100 p-3 rounded-full">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Secure Payments</h3>
              <p className="text-gray-600">All transactions are encrypted using 256-bit SSL technology</p>
            </div>
          </div>
  
          <div className="flex items-start gap-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Instant Refunds</h3>
              <p className="text-gray-600">Refunds processed within 24 hours directly to your source account</p>
            </div>
          </div>
  
          <div className="flex items-start gap-4">
            <div className="bg-purple-100 p-3 rounded-full">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Transaction Limits</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Minimum: ₹99</li>
                <li>Maximum: ₹1,00,000</li>
                <li>Daily limit: ₹2,00,000</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    )
  }