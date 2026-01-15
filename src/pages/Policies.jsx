// import { EnvelopeIcon } from '@heroicons/react/24/outline'

const PolicySection = ({ title, children }) => (
  <div className="mb-8">
    <h2 className="text-2xl font-bold text-gray-800 mb-4">{title}</h2>
    <div className="text-gray-600 space-y-4">{children}</div>
  </div>
)

export {
    PolicySection
}