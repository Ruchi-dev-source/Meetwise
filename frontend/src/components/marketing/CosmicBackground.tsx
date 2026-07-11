import { useEffect, useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

export function CosmicBackground() {
  const glowRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();

  // Each orb drifts at a different rate as the page scrolls, giving the
  // backdrop subtle depth instead of scrolling in lockstep with content.
  const yOrb1 = useTransform(scrollY, [0, 4000], [0, reduceMotion ? 0 : 500]);
  const yOrb2 = useTransform(scrollY, [0, 4000], [0, reduceMotion ? 0 : 260]);
  const yOrb3 = useTransform(scrollY, [0, 4000], [0, reduceMotion ? 0 : 700]);

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
      <motion.div
        aria-hidden
        className="gradient-orb w-[600px] h-[600px] bg-primary top-[-100px] left-[-200px] animate-pulse"
        style={{ animationDuration: "12s", y: yOrb1 }}
      />
      <motion.div
        aria-hidden
        className="gradient-orb w-[500px] h-[500px] bg-secondary top-[400px] right-[-100px] animate-pulse"
        style={{ animationDuration: "15s", animationDelay: "3s", y: yOrb2 }}
      />
      <motion.div
        aria-hidden
        className="gradient-orb w-[600px] h-[600px] bg-pinky bottom-[200px] left-[10%] animate-pulse"
        style={{ animationDuration: "20s", y: yOrb3 }}
      />
    </>
  );
}
