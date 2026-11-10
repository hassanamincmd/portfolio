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
    src: "/about/01-wedding.jpg",
    alt: "Hassan and his wife on their wedding day, walking hand in hand outdoors",
  },
  {
    src: "/about/02-reflection.jpg",
    alt: "Hassan and his wife reflected in glass during a day out together",
  },
  {
    src: "/about/03-waterfront.jpg",
    alt: "Hassan by the waterfront with sailboats in the background",
  },
  {
    src: "/about/04-snorkeling.jpg",
    alt: "Hassan snorkeling and giving a thumbs up in clear blue water",
  },
  {
    src: "/about/05-beach-gazebo.jpg",
    alt: "Red-roofed beach gazebo on the sand by the sea",
  },
  {
    src: "/about/06-desert-grill.jpg",
    alt: "Hassan grilling over a fire pit in the desert",
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
