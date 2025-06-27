"use client";

import { useEffect, useState } from "react";

export default function SplashScreen() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handleLoad = () => {
      // fade-out then hide
      setTimeout(() => setVisible(false), 300);
    };
    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
      return () => window.removeEventListener("load", handleLoad);
    }
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white transition-opacity duration-300">
      <img
        src="/Uge30Blaa.png"
        alt="MyApp"
        className="h-24 w-24 animate-pulse"
      />
    </div>
  );
}
