import { useEffect, useRef } from "react";

export function CosmicBackground() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const glow = glowRef.current;
    if (!glow) return;
    glow.style.display = "block";
    const onMove = (e: MouseEvent) => {
      glow.style.left = `${e.clientX}px`;
      glow.style.top = `${e.clientY}px`;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <>
      <div
        ref={glowRef}
        aria-hidden
        className="fixed w-[400px] h-[400px] rounded-full pointer-events-none z-[1] -translate-x-1/2 -translate-y-1/2 hidden"
        style={{
          background:
            "radial-gradient(circle, rgba(139,92,246,0.06) 0%, rgba(59,130,246,0.03) 50%, transparent 70%)",
        }}
      />
      <div aria-hidden className="absolute inset-0 cosmic-grid pointer-events-none z-0" />
      <div
        aria-hidden
        className="gradient-orb w-[600px] h-[600px] bg-primary top-[-100px] left-[-200px] animate-pulse"
        style={{ animationDuration: "12s" }}
      />
      <div
        aria-hidden
        className="gradient-orb w-[500px] h-[500px] bg-secondary top-[400px] right-[-100px] animate-pulse"
        style={{ animationDuration: "15s", animationDelay: "3s" }}
      />
      <div
        aria-hidden
        className="gradient-orb w-[600px] h-[600px] bg-pinky bottom-[200px] left-[10%] animate-pulse"
        style={{ animationDuration: "20s" }}
      />
    </>
  );
}
