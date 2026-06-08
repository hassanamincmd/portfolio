import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { AimReticle } from "./AimReticle";

export function HeadingCycler({
  prefix,
  words,
  interval = 2,
  animationDuration = 0.3
}) {
  const filtered = words.filter((word) => word?.trim());
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (filtered.length <= 1) return undefined;

    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % filtered.length);
    }, interval * 1000);

    return () => clearInterval(timer);
  }, [filtered.length, interval]);

  const easing = [0.44, 0, 0.56, 1];

  return (
    <div className="heading-block">
      <AimReticle />
      <div className="heading-block__lines">
        <h1 className="heading-block__prefix">{prefix}</h1>
        <div className="heading-cycler" aria-live="polite">
          {filtered.length <= 1 ? (
            <span className="heading-cycler__word">{filtered[0]}</span>
          ) : (
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={filtered[index]}
                className="heading-cycler__word"
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                exit={{ y: "-100%", opacity: 0 }}
                transition={{ duration: animationDuration, ease: easing }}
              >
                {filtered[index]}
              </motion.span>
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}
