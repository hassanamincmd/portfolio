"use client";

import * as React from "react";
import useEmblaCarousel from "embla-carousel-react";
import type { EmblaOptionsType } from "embla-carousel";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type SlideMeta = {
  thumbnailSrc?: string;
};

type CarouselContextValue = {
  emblaRef: ReturnType<typeof useEmblaCarousel>[0];
  emblaApi: ReturnType<typeof useEmblaCarousel>[1];
  selectedIndex: number;
  scrollTo: (index: number) => void;
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
  slides: SlideMeta[];
  setSlides: React.Dispatch<React.SetStateAction<SlideMeta[]>>;
};

const CarouselContext = React.createContext<CarouselContextValue | null>(null);

function useCarouselContext() {
  const context = React.useContext(CarouselContext);
  if (!context) {
    throw new Error("Carousel components must be used within <Carousel />");
  }
  return context;
}

export function Carousel({
  options,
  className,
  children,
}: {
  options?: EmblaOptionsType;
  className?: string;
  children: React.ReactNode;
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel(options);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);
  const [slides, setSlides] = React.useState<SlideMeta[]>([]);

  const onSelect = React.useCallback(() => {
    if (!emblaApi) {
      return;
    }
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  React.useEffect(() => {
    if (!emblaApi) {
      return;
    }
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  const value = React.useMemo(
    () => ({
      emblaRef,
      emblaApi,
      selectedIndex,
      scrollTo: (index: number) => emblaApi?.scrollTo(index),
      scrollPrev: () => emblaApi?.scrollPrev(),
      scrollNext: () => emblaApi?.scrollNext(),
      canScrollPrev,
      canScrollNext,
      slides,
      setSlides,
    }),
    [emblaApi, emblaRef, selectedIndex, canScrollPrev, canScrollNext, slides],
  );

  return (
    <CarouselContext.Provider value={value}>
      <div className={cn("relative flex min-w-0", className)}>{children}</div>
    </CarouselContext.Provider>
  );
}

export function SliderContainer({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const { emblaRef, setSlides } = useCarouselContext();
  const slides = React.useMemo(
    () =>
      React.Children.toArray(children).map((child) => {
        if (React.isValidElement<{ thumbnailSrc?: string }>(child)) {
          return { thumbnailSrc: child.props.thumbnailSrc };
        }
        return {};
      }),
    [children],
  );

  React.useEffect(() => {
    setSlides((prev) => {
      const same =
        prev.length === slides.length &&
        prev.every((item, index) => item.thumbnailSrc === slides[index]?.thumbnailSrc);
      return same ? prev : slides;
    });
  }, [setSlides, slides]);

  return (
    <div ref={emblaRef} className={cn("min-w-0 flex-1 overflow-hidden rounded-[16px]", className)}>
      <div className="flex h-full touch-pan-x">{children}</div>
    </div>
  );
}

export function Slider({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
  thumbnailSrc?: string;
}) {
  return (
    <div
      role="group"
      aria-roledescription="slide"
      className={cn("min-w-0 shrink-0 grow-0 basis-full", className)}
    >
      {children}
    </div>
  );
}

export function SliderDotButton({
  className,
  isActive,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { isActive?: boolean }) {
  return (
    <button
      type="button"
      className={cn(
        "h-2.5 w-2.5 rounded-full transition-colors",
        isActive ? "bg-foreground" : "bg-foreground/30 hover:bg-foreground/60",
        className,
      )}
      {...props}
    />
  );
}

export function ThumbsSlider({
  className,
  thumbsClassName,
  thumbsSliderClassName,
  orientation = "vertical",
}: {
  className?: string;
  thumbsClassName?: string;
  thumbsSliderClassName?: string;
  orientation?: "horizontal" | "vertical";
}) {
  const {
    slides,
    selectedIndex,
    scrollTo,
    scrollPrev,
    scrollNext,
    canScrollPrev,
    canScrollNext,
  } = useCarouselContext();

  return (
    <div
      className={cn(
        "flex gap-2",
        orientation === "horizontal" ? "w-full flex-row items-center" : "w-24 flex-col",
        className,
      )}
    >
      <Button
        type="button"
        variant="outline"
        size="icon"
        className={cn(
          "rounded-xl border-black/10 bg-white/80",
          orientation === "horizontal" ? "h-8 w-8 shrink-0" : "h-9 w-full",
        )}
        onClick={scrollPrev}
        disabled={!canScrollPrev}
      >
        {orientation === "horizontal" ? (
          <ChevronLeft className="h-4 w-4" />
        ) : (
          <ChevronUp className="h-4 w-4" />
        )}
        <span className="sr-only">Previous image</span>
      </Button>

      <div
        className={cn(
          "flex flex-1 gap-2",
          orientation === "horizontal"
            ? "min-w-0 flex-row overflow-x-hidden py-1"
            : "flex-col overflow-y-auto pr-1",
          thumbsClassName,
        )}
      >
        {slides.map((slide, index) => (
          <button
            key={`${slide.thumbnailSrc ?? "thumb"}-${index}`}
            type="button"
            onClick={() => scrollTo(index)}
            className={cn(
              "group relative overflow-hidden border-2 border-transparent bg-black/5 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/80",
              orientation === "horizontal"
                ? "h-12 w-12 shrink-0 rounded-[12px]"
                : "h-20 w-full rounded-3xl",
              selectedIndex === index
                ? "scale-[0.98] border-black shadow-[0_10px_28px_rgba(0,0,0,0.16)]"
                : "hover:border-black/25",
              thumbsSliderClassName,
            )}
            aria-label={`Show image ${index + 1}`}
            aria-pressed={selectedIndex === index}
          >
            {slide.thumbnailSrc ? (
              <img
                src={slide.thumbnailSrc}
                alt=""
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="h-full w-full bg-muted" />
            )}
          </button>
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        size="icon"
        className={cn(
          "rounded-xl border-black/10 bg-white/80",
          orientation === "horizontal" ? "h-8 w-8 shrink-0" : "h-9 w-full",
        )}
        onClick={scrollNext}
        disabled={!canScrollNext}
      >
        {orientation === "horizontal" ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
        <span className="sr-only">Next image</span>
      </Button>
    </div>
  );
}
