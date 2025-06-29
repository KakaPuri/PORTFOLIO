import React, { useEffect, useRef } from "react";

export default function AnimatedBlueBg() {
  const particleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = particleRef.current;
    if (!container) return;

    const particles: HTMLDivElement[] = [];
    const numParticles = 80;
    for (let i = 0; i < numParticles; i++) {
      const particle = document.createElement("div");
      particle.className = "particle-bubble";
      particle.style.left = Math.random() * 100 + "%";
      particle.style.top = Math.random() * 100 + "%";
      particle.style.width = particle.style.height = Math.random() * 32 + 16 + "px";
      particle.style.opacity = (Math.random() * 0.3 + 0.1).toString();
      particle.style.animationDelay = Math.random() * 8 + "s";
      container.appendChild(particle);
      particles.push(particle);
    }
    return () => {
      particles.forEach(p => p.remove());
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-gray-800 opacity-90 animate-gradient" />
      <div ref={particleRef} className="absolute inset-0 w-full h-full overflow-hidden" />
      <style>{`
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradientMove 8s ease-in-out infinite;
        }
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .particle-bubble {
          position: absolute;
          border-radius: 9999px;
          background: linear-gradient(135deg, #60a5fa55 0%, #818cf855 100%);
          filter: blur(1px);
          animation: float-bubble 16s linear infinite;
        }
        @keyframes float-bubble {
          0% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-60px) scale(1.1);
          }
          100% {
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
}
