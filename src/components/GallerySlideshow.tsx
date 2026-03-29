'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity'

interface Slide {
  image: object
  dimensions?: { width: number; height: number }
}

interface GallerySlideshowProps {
  slides: Slide[]
  galleryHeight: number
}

const INTERVAL = 3500
const FADE_MS = 600
const CONTAINER_W = 560

export default function GallerySlideshow({ slides, galleryHeight }: GallerySlideshowProps) {
  const [current, setCurrent] = useState(0)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    if (slides.length < 2) return
    const timer = setInterval(() => {
      setFading(true)
      setTimeout(() => {
        setCurrent(i => (i + 1) % slides.length)
        setFading(false)
      }, FADE_MS)
    }, INTERVAL)
    return () => clearInterval(timer)
  }, [slides.length])

  return (
    <div
      className="relative bg-white flex-shrink-0"
      style={{ width: CONTAINER_W, height: galleryHeight }}
    >
      <Image
        key={current}
        src={urlFor(slides[current].image).width(CONTAINER_W * 2).url()}
        alt={`Slide ${current + 1}`}
        fill
        sizes={`${CONTAINER_W}px`}
        className="object-contain"
        style={{
          opacity: fading ? 0 : 1,
          transition: `opacity ${FADE_MS}ms ease`,
          objectPosition: 'center center',
        }}
      />
      {/* Counter */}
      <div className="absolute bottom-4 right-4 text-[11px] tracking-[0.12em] bg-black/20 text-black px-2 py-1">
        {String(current + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
      </div>
    </div>
  )
}
