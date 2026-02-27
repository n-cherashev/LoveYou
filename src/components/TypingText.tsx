import React, { useState, useEffect, useRef } from 'react';

interface TypingTextProps {
  text: string;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
  onComplete?: () => void;
}

const TypingText: React.FC<TypingTextProps> = ({
  text,
  delay = 100,
  className = '',
  style,
  onComplete,
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const currentIndexRef = useRef(0);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (currentIndexRef.current < text.length) {
      timeoutRef.current = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndexRef.current]);
        currentIndexRef.current += 1;
      }, delay);
    } else if (onComplete) {
      onComplete();
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [text, delay, onComplete, displayedText.length]);

  return (
    <span className={className} style={style}>
      {displayedText}
      {displayedText.length < text.length && (
        <span className="animate-pulse inline-block w-0.5 h-full bg-heart-light ml-1" />
      )}
    </span>
  );
};

export default TypingText;
