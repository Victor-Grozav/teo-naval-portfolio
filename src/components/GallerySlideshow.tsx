'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity'

interface GallerySlideshowProps {
  slides: Array<{ image: object }>
}

const INTERVAL = 3500
const FADE_MS = 600

export default function GallerySlideshow({ slides }: GallerySlideshowProps) {
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
    <div className="relative w-full h-full bg-white">
      <Image
        key={current}
        src={urlFor(slides[current].image).width(1120).url()}
        alt={`Slide ${current + 1}`}
        fill
        sizes="560px"
        className="object-contain"
        style={{
          opacity: fading ? 0 : 1,
          transition: `opacity ${FADE_MS}ms ease`,
        }}
      />
      {/* Counter */}
      <div className="absolute bottom-4 right-4 text-white text-[11px] tracking-[0.12em] bg-black/30 px-2 py-1">
        {String(current + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
      </div>
    </div>
  )
}
