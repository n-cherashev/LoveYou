import React, { useEffect, useState } from 'react';

const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect mobile devices
    const checkMobile = () => {
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      setIsMobile(isTouchDevice);
    };
    
    checkMobile();
  }, []);

  useEffect(() => {
    if (isMobile) return; // Don't track mouse on mobile

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('.cursor-pointer')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    // Hide cursor on touch start (mobile interaction)
    const handleTouchStart = () => {
      setIsVisible(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('touchstart', handleTouchStart);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('touchstart', handleTouchStart);
    };
  }, [isMobile]);

  // Don't render cursor on mobile
  if (isMobile) {
    return (
      <style>{`
        * {
          cursor: auto !important;
        }
      `}</style>
    );
  }

  return (
    <>
      {/* Main cursor dot */}
      <div
        className="fixed pointer-events-none z-[9999] mix-blend-screen transition-opacity duration-200"
        style={{
          left: position.x,
          top: position.y,
          transform: 'translate(-50%, -50%)',
          opacity: isVisible ? 1 : 0,
        }}
      >
        <div
          className={`rounded-full transition-all duration-150 ${
            isClicking ? 'scale-75' : 'scale-100'
          }`}
          style={{
            width: isHovering ? 20 : 12,
            height: isHovering ? 20 : 12,
            background: 'radial-gradient(circle, #f5f5f5 0%, #ba68c8 50%, #9c27b0 100%)',
            boxShadow: `
              0 0 20px rgba(186, 104, 200, 0.8),
              0 0 40px rgba(156, 39, 176, 0.5),
              0 0 60px rgba(156, 39, 176, 0.3)
            `,
          }}
        />
      </div>

      {/* Outer ring */}
      <div
        className="fixed pointer-events-none z-[9998] transition-opacity duration-200"
        style={{
          left: position.x,
          top: position.y,
          transform: 'translate(-50%, -50%)',
          opacity: isVisible ? 1 : 0,
        }}
      >
        <div
          className={`rounded-full border-2 transition-all duration-300 ${
            isHovering ? 'scale-150 opacity-50' : 'scale-100 opacity-80'
          } ${isClicking ? 'scale-125' : ''}`}
          style={{
            width: 40,
            height: 40,
            borderColor: '#ce93d8',
            boxShadow: '0 0 15px rgba(206, 147, 216, 0.5)',
          }}
        />
      </div>

      {/* Trail particles */}
      <div
        className="fixed pointer-events-none z-[9997] transition-opacity duration-200"
        style={{
          left: position.x,
          top: position.y,
          transform: 'translate(-50%, -50%)',
          opacity: isVisible ? 1 : 0,
        }}
      >
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-ping"
            style={{
              width: 8 - i * 1.8,
              height: 8 - i * 1.8,
              background: `rgba(186, 104, 200, ${0.5 - i * 0.12})`,
              animationDelay: `${i * 0.08}s`,
              animationDuration: '1.2s',
            }}
          />
        ))}
      </div>

      {/* Hide default cursor on desktop only */}
      <style>{`
        @media (min-width: 769px) {
          * {
            cursor: none !important;
          }
        }
        @media (max-width: 768px) {
          * {
            cursor: auto !important;
          }
        }
      `}</style>
    </>
  );
};

export default CustomCursor;
