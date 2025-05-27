"use client";

import { useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";

interface WaitingIndicatorProps {
  isAiResponding: boolean;
}

export default function WaitingIndicator({ isAiResponding }: WaitingIndicatorProps) {
  const [showAnimation, setShowAnimation] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  
  // Show animation when AI starts responding
  useEffect(() => {
    if (isAiResponding) {
      setShowAnimation(true);
    } else {
      // Delay hiding the animation to give user time to notice transition
      const timer = setTimeout(() => {
        setShowAnimation(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isAiResponding]);
  
  // When user tries to type or click while AI is responding
  useEffect(() => {
    const handleEvents = () => {
      if (isAiResponding) {
        setShowWarning(true);
        setTimeout(() => setShowWarning(false), 2000);
      }
    };
    
    // Show warning when user clicks or presses keys while AI is responding
    if (isAiResponding) {
      window.addEventListener("click", handleEvents);
      window.addEventListener("keydown", handleEvents);
      
      return () => {
        window.removeEventListener("click", handleEvents);
        window.removeEventListener("keydown", handleEvents);
      };
    }
  }, [isAiResponding]);

  if (!showAnimation && !showWarning) return null;
  
  return (
    <div 
      className={`absolute bottom-20 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-full flex items-center gap-2 text-sm shadow-md z-10 transition-all duration-300 ${
        showWarning 
          ? 'bg-amber-500 text-white motion-safe:animate-[shake_0.5s_linear]' 
          : 'bg-secondary text-secondary-foreground animate-pulse'
      }`}
    >
      <AlertCircle className="h-4 w-4" />
      <span>{showWarning ? "Veuillez attendre la fin de la réponse" : "Attendez la réponse complète..."}</span>
    </div>
  );
}
