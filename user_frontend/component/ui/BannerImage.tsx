"use client";

import Image, { type StaticImageData } from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

import defaultImage from "../../resources/logos/default_banner_image.png";
import defaultImageTwo from "../../resources/logos/default_banner_image-2.png";

type BannerImageProps = {
  urlList?: (string | StaticImageData)[];
};

const DEFAULT_IMAGES: StaticImageData[] = [
  defaultImage,
  defaultImageTwo,
];

const AUTO_DELAY = 3500;

export default function BannerImage({ urlList = [] }: BannerImageProps) {
  const images = [...DEFAULT_IMAGES, ...urlList];
  const [[index, direction], setIndex] = useState<[number, number]>([0, 0]);

  useEffect(() => {
    const timer = setInterval(() => paginate(1), AUTO_DELAY);
    return () => clearInterval(timer);
  }, [index]);

  function paginate(dir: number) {
    setIndex(([prev]) => [
      (prev + dir + images.length) % images.length,
      dir,
    ]);
  }

  if (!images.length) return null;

  return (
    <div className="w-full flex justify-center py-4 border">
      {/* HEIGHT IS LOCKED HERE */}
      <div className="relative w-[90%] sm:w-[50%] h-[220px] sm:h-[300px] overflow-hidden">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={index}
            custom={direction}
            className="absolute inset-0"
            initial={{ x: direction > 0 ? 300 : -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: direction > 0 ? -300 : 300, opacity: 0 }}
            transition={{ duration: 0.5 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.7}
            onDragEnd={(_, info) => {
              if (info.offset.x > 100) paginate(-1);
              else if (info.offset.x < -100) paginate(1);
            }}
          >
            <Image
              src={images[index]}
              alt={`banner-${index}`}
              fill
              className="object-cover rounded-3xl"
              priority
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
