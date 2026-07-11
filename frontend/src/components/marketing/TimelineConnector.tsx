import { motion, useReducedMotion } from "framer-motion";

export function TimelineConnector() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="hidden lg:block absolute top-1/2 left-[10%] right-[10%] h-px -translate-y-1/2 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-white/5" />
      <motion.div
        className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary via-secondary to-pinky origin-left"
        initial={{ scaleX: reduceMotion ? 1 : 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        style={{ width: "100%" }}
      />
    </div>
  );
}
