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

  const slide = slides[current]
  const dims = slide.dimensions
  const renderedH = galleryHeight
  // Fall back to square if dimensions not available
  const renderedW = dims ? Math.round((dims.width / dims.height) * renderedH) : renderedH

  return (
    <div
      className="relative bg-white flex-shrink-0"
      style={{ width: renderedW, height: renderedH }}
    >
      <Image
        key={current}
        src={urlFor(slide.image).width(renderedW * 2).url()}
        alt={`Slide ${current + 1}`}
        width={renderedW}
        height={renderedH}
        className="block"
        style={{
          opacity: fading ? 0 : 1,
          transition: `opacity ${FADE_MS}ms ease`,
          width: renderedW,
          height: renderedH,
          objectFit: 'fill',
        }}
      />
      {/* Counter */}
      <div className="absolute bottom-4 right-4 text-[11px] tracking-[0.12em] bg-black/20 text-black px-2 py-1">
        {String(current + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
      </div>
    </div>
  )
}
