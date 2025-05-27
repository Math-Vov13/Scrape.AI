"use client";

import { useState, useEffect, useRef } from "react";

interface TypeWriterProps {
  text: string;
  delay?: number;
  minDelay?: number;
  maxDelay?: number;
  onComplete?: () => void;
}

export default function TypeWriter({ 
  text, 
  delay = 0, 
  minDelay = 15,
  maxDelay = 35,
  onComplete 
}: TypeWriterProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const isCompleted = useRef(false);

  useEffect(() => {
    // Reset when text changes
    setDisplayedText("");
    setCurrentIndex(0);
    isCompleted.current = false;
  }, [text]);

  useEffect(() => {
    if (currentIndex < text.length) {
      // Calculate dynamic delay
      let currentDelay = delay;
      
      // If no fixed delay is provided, use random delay within range
      if (delay === 0) {
        // Add longer pauses at periods, commas, and sentence endings
        if (currentIndex > 0 && ['.', '!', '?'].includes(text[currentIndex - 1]) && text[currentIndex] === ' ') {
          currentDelay = 300; // Pause longer at end of sentences
        } else if (currentIndex > 0 && [',', ';', ':'].includes(text[currentIndex - 1])) {
          currentDelay = 150; // Pause a bit at commas and other punctuation
        } else {
          // Random typing speed for natural effect
          currentDelay = Math.floor(Math.random() * (maxDelay - minDelay + 1) + minDelay);
        }
      }
      
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prevIndex => prevIndex + 1);
      }, currentDelay);
      
      return () => clearTimeout(timeout);
    } else if (!isCompleted.current) {
      isCompleted.current = true;
      onComplete?.();
    }
  }, [currentIndex, delay, minDelay, maxDelay, text, onComplete]);

  return <>{displayedText}</>;
}
