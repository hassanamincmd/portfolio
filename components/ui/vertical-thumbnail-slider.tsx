"use client";

import React from "react";
import type { EmblaOptionsType } from "embla-carousel";

import {
  Carousel,
  Slider,
  SliderContainer,
  ThumbsSlider,
} from "@/components/ui/vertical-thumbnail-slider-utils/carousel";

const IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    alt: "Scenic travel road through mountains",
  },
  {
    src: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80",
    alt: "Minimal workspace with laptop and coffee",
  },
  {
    src: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80",
    alt: "Portrait placeholder with soft natural lighting",
  },
  {
    src: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80",
    alt: "Collaborative team session around a table",
  },
  {
    src: "https://images.unsplash.com/photo-1511988617509-a57c8a288659?auto=format&fit=crop&w=1200&q=80",
    alt: "Matcha setup and reading corner",
  },
  {
    src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
    alt: "Landscape lake view at golden hour",
  },
  {
    src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1200&q=80",
    alt: "Lifestyle portrait placeholder smiling at camera",
  },
] as const;

export default function VerticalThumbnailSlider() {
  const options: EmblaOptionsType = {
    loop: false,
    axis: "x",
  };

  return (
    <Carousel options={options} className="relative flex h-full w-full flex-col gap-2">
      <SliderContainer className="min-h-0 w-full flex-1">
        {IMAGES.map((image) => (
          <Slider key={image.src} className="h-full w-full" thumbnailSrc={image.src}>
            <img
              src={image.src}
              alt={image.alt}
              className="h-full w-full rounded-[16px] object-cover"
            />
          </Slider>
        ))}
      </SliderContainer>

      <ThumbsSlider
        orientation="horizontal"
        className="w-full shrink-0"
        thumbsClassName="w-full"
        thumbsSliderClassName="border-black/15"
      />
    </Carousel>
  );
}
