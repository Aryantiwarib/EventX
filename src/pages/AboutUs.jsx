export default function AboutPage() {
    return (
      <section className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl p-8 mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">About EventX</h1>
          <p className="text-xl opacity-90">Revolutionizing Event Management Since 2023</p>
        </div>
  
        <div className="bg-white rounded-xl shadow-lg p-8 space-y-8">
          <div className="flex items-start gap-4">
            <div className="bg-purple-100 p-3 rounded-full">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-2">Our Mission</h3>
              <p className="text-gray-600">To create seamless event experiences through innovative technology solutions</p>
            </div>
          </div>
  
          <div className="flex items-start gap-4">
            <div className="bg-pink-100 p-3 rounded-full">
              <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-2">Key Features</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Automated QR Check-in System</li>
                <li>Real-time Attendance Tracking</li>
                <li>Integrated Payment Gateway</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    )
  }