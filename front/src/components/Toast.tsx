"use client";

import { useState, useEffect } from "react";

interface ToastProps {
  show: boolean;
  message: string;
  type?: "info" | "success" | "warning" | "error";
  duration?: number;
  onClose?: () => void;
}

export default function Toast({ 
  show, 
  message, 
  type = "info", 
  duration = 3000, 
  onClose 
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, duration);
      
      return () => clearTimeout(timer);
    } else {
      // Handle case when show prop changes from true to false
      setIsVisible(false);
    }
  }, [show, duration, onClose]);

  if (!isVisible) return null;

  const getToastClasses = () => {
    let baseClasses = "fixed bottom-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300";
    
    switch (type) {
      case "success":
        return `${baseClasses} bg-green-600 text-white`;
      case "warning":
        return `${baseClasses} bg-amber-500 text-white`;
      case "error":
        return `${baseClasses} bg-red-600 text-white`;
      default:
        return `${baseClasses} bg-primary text-primary-foreground`;
    }
  };

  return (
    <div className={getToastClasses()}>
      {message}
    </div>
  );
}
