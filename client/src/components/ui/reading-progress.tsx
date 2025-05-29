import { useEffect, useState } from "react";

export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrollTop = window.pageYOffset;
      const scrollPercentage = (scrollTop / documentHeight) * 100;
      
      setProgress(Math.min(Math.max(scrollPercentage, 0), 100));
    };

    window.addEventListener("scroll", updateProgress);
    updateProgress(); // Initial calculation

    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  return (
    <div 
      className="reading-progress fixed top-0 left-0 w-full z-50"
      style={{ transform: `scaleX(${progress / 100})` }}
    />
  );
}
