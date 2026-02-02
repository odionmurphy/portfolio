import React, { useEffect, useRef, useState } from "react";

type Particle = {
  id: number;
  x: number;
  y: number;
  size: number;
  rotate: number;
  dur: number;
  offsetX: number;
  offsetY: number;
  color?: string;
  rotateEnd?: number;
  alpha?: number;
};

const CursorSmoke: React.FC = () => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const idRef = useRef(0);
  const lastRef = useRef(0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const now = Date.now();
      // throttle to ~45fps (lower for smoother smoke)
      if (now - lastRef.current < 22) return;
      lastRef.current = now;

      // spawn 1-3 puffs per movement for a denser, cigarette-like exhale
      const count = 1 + Math.floor(Math.random() * 3);

      const newParticles: Particle[] = [];

      for (let i = 0; i < count; i++) {
        const id = ++idRef.current;
        const size = 20 + Math.random() * 60; // 20 - 80 px
        const rotate = (Math.random() - 0.5) * 40;
        const dur = 1800 + Math.random() * 1800; // 1800 - 3600 ms
        const offsetX = (Math.random() - 0.5) * 24; // slight horizontal spread
        const offsetY = -6 - Math.random() * 12; // slight upward starting velocity

        const colorOptions = [
          "190,190,190",
          "200,200,200",
          "180,170,160",
          "220,210,200",
        ];
        const color =
          colorOptions[Math.floor(Math.random() * colorOptions.length)];
        const rotateEnd = (Math.random() - 0.5) * 20 + 8; // end rotation
        const alpha = 0.9 - Math.random() * 0.4; // variable opacity

        const p: Particle = {
          id,
          x: e.clientX + offsetX,
          y: e.clientY + offsetY,
          size,
          rotate,
          dur,
          offsetX,
          offsetY,
          color,
          rotateEnd,
          alpha,
        };

        newParticles.push(p);

        // Remove after animation ends
        window.setTimeout(() => {
          setParticles((s) => s.filter((x) => x.id !== id));
        }, dur + 100);
      }

      setParticles((s) => [...s, ...newParticles]);
    };

    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999]">
      {particles.map((p) => (
        <span
          key={p.id}
          className="smoke-particle"
          style={{
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
            transform: `translate(-50%, -50%) rotate(${p.rotate}deg)`,
            // set CSS variables for per-particle control
            ["--dur" as any]: `${p.dur}ms`,
            ["--c" as any]: p.color,
            ["--drift" as any]: `${p.offsetX}px`,
            ["--rot-end" as any]: `${p.rotateEnd || 12}deg`,
            ["--alpha" as any]: `${p.alpha || 0.85}`,
          }}
        />
      ))}
    </div>
  );
};

export default CursorSmoke;
