import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { ScrollProgressLines } from "./ScrollProgressLines";
import { StickyProjectCard } from "./StickyProjectCard";

export function StickyProjectStack({ projects }) {
  const sectionRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [lineProgress, setLineProgress] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"]
  });

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const count = projects.length;
    const scaled = value * count;
    const index = Math.min(count - 1, Math.floor(scaled));
    const frac = scaled - index;
    setActiveIndex(index);
    setLineProgress(frac);
  });

  return (
    <section className="nitro-stack-section" ref={sectionRef} aria-label="Featured projects">
      <div className="nitro-stack-section__inner">
        <ScrollProgressLines
          activeIndex={activeIndex}
          progress={lineProgress}
          count={projects.length}
        />

        <div className="nitro-stack nitro-container">
          {projects.map((project, index) => (
            <CardSlot
              key={project.slug}
              index={index}
              total={projects.length}
              sectionRef={sectionRef}
            >
              <StickyProjectCard {...project} index={index} />
            </CardSlot>
          ))}
        </div>
      </div>
    </section>
  );
}

function CardSlot({ children, index, total, sectionRef }) {
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"]
  });

  const start = index / total;
  const end = (index + 1) / total;
  const scale = useTransform(scrollYProgress, [start, end], [1, 0.92]);
  const y = useTransform(scrollYProgress, [start, end], [0, -24]);

  return (
    <div className="nitro-stack__slot">
      <motion.div className="nitro-stack__sticky" style={{ scale, y }}>
        {children}
      </motion.div>
    </div>
  );
}
