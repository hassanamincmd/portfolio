import { motion } from "framer-motion";
import { progressLineColors } from "../../data/site";

export function ScrollProgressLines({ activeIndex, progress, count = 3 }) {
  const baseHeights = [100, 80, 60];

  return (
    <div className="scroll-lines" aria-hidden="true">
      {progressLineColors.slice(0, count).map((color, index) => {
        const isPast = index < activeIndex;
        const isActive = index === activeIndex;
        const target = baseHeights[index] ?? 60;
        const heightPercent = isPast ? target : isActive ? 20 + progress * (target - 20) : 20;

        return (
          <motion.span
            key={color}
            className="scroll-lines__bar"
            style={{
              backgroundColor: color,
              bottom: index === 0 ? 0 : "61px"
            }}
            animate={{ height: `${heightPercent}%` }}
            transition={{ duration: 0.35, ease: [0.44, 0, 0.56, 1] }}
          />
        );
      })}
    </div>
  );
}
