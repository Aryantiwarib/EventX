import React from "react";
import { cn } from "../../lib/utils";

const Logo = ({ 
  className, 
  size = "md", 
  variant = "primary" 
}) => {
  const sizeClasses = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-3xl",
  };

  const variantClasses = {
    primary: "text-primary",
    dark: "text-gray-900",
    light: "text-white",
  };

  return (
    <div className={cn(
      "font-display font-bold flex items-center", 
      sizeClasses[size], 
      variantClasses[variant], 
      className
    )}>
      <span className="flex items-center">
        Event
        <span className="bg-primary text-white rounded-sm px-1 -mt-1 ml-0.5">X</span>
      </span>
    </div>
  );
};

export default Logo;