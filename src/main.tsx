import React from 'react'
import { createRoot } from 'react-dom/client'
import { useEffect } from 'react'
import App from './App.tsx'
import './index.css'
import { forceWesternNumerals, fixNumberDisplay } from './lib/number-fix'

function AppWrapper() {
  useEffect(() => {
    // Apply Western numerals fixes
    forceWesternNumerals();
    const observer = fixNumberDisplay();
    
    // Re-apply fixes on route changes or content updates
    const interval = setInterval(() => {
      forceWesternNumerals();
    }, 1000);
    
    // Cleanup on unmount
    return () => {
      observer.disconnect();
      clearInterval(interval);
    };
  }, []);

  return <App />;
}

// تسجيل Service Worker للـ PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

createRoot(document.getElementById("root")!).render(<AppWrapper />);
