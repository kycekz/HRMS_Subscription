import { useState, useEffect } from 'react';

interface WindowSize {
  width: number;
  height: number;
}

export const useWindowSize = (): WindowSize => {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Add event listener
    window.addEventListener('resize', handleResize, { passive: true });
    
    // Handle orientation change on mobile devices
    window.addEventListener('orientationchange', handleResize, { passive: true });

    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  return windowSize;
};

export const useIsMobile = (breakpoint: number = 768): boolean => {
  const { width } = useWindowSize();
  return width < breakpoint;
};

export const useIsTablet = (): boolean => {
  const { width } = useWindowSize();
  return width >= 768 && width < 1024;
};

export const useIsDesktop = (): boolean => {
  const { width } = useWindowSize();
  return width >= 1024;
};