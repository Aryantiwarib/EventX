export default function TermsPage() {
    return (
      <section className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-gradient-to-r from-blue-800 to-purple-700 text-white rounded-xl p-8 mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-xl opacity-90">Last Updated: January 2024</p>
        </div>
  
        <div className="bg-white rounded-xl shadow-lg p-8 space-y-8">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-2">Acceptance of Terms</h3>
                <p className="text-gray-600">By accessing EventX, you agree to be bound by these terms and conditions.</p>
              </div>
            </div>
  
            <div className="flex items-start gap-4">
              <div className="bg-purple-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-2">User Responsibilities</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Provide accurate registration information</li>
                  <li>Maintain account security</li>
                  <li>Comply with all applicable laws</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }