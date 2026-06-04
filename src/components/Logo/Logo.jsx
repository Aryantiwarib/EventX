import React from 'react';
import LogoPath from "../../Images/harshit.jpg";


function Logo({ width = '100px', className = '' }) {
  return (
    <div className={`inline-flex items-center ${className}`}>
      <img 
        src={LogoPath} 
        alt="EventX Logo" 
        style={{ width }} 
        className="object-contain max-h-[50px] w-auto h-auto"
      />
    </div>
  );
}

export default Logo;