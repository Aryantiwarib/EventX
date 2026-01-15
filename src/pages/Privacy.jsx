export default function PrivacyPage() {
    return (
      <section className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-gradient-to-r from-green-600 to-cyan-600 text-white rounded-xl p-8 mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-xl opacity-90">Your Data is Secure With Us</p>
        </div>
  
        <div className="bg-white rounded-xl shadow-lg p-8 space-y-8">
          <div className="flex items-start gap-4">
            <div className="bg-green-100 p-3 rounded-full">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-2">Data Collection</h3>
              <p className="text-gray-600">We collect only essential information for service delivery:</p>
              <ul className="list-disc list-inside text-gray-600 mt-2 space-y-2">
                <li>Name and contact information</li>
                <li>Event participation details</li>
                <li>Payment transaction records</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    )
  }