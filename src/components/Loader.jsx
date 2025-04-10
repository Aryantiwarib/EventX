import React from 'react';

function Loader() {
  return (
    <div className="flex items-center justify-center">
      <div className="relative">
        {/* Spinner */}
        <div className="w-12 h-12 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin"></div>
        
        {/* Optional loading text */}
        <p className="mt-4 text-gray-600 text-sm font-medium">Loading...</p>
      </div>
    </div>
  );
}

export default Loader;