'use client'

import { useRef, useEffect, useState } from 'react'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity'
import { PortableText } from 'next-sanity'
import dynamic from 'next/dynamic'
import GallerySlideshow from './GallerySlideshow'

const ProjectMap = dynamic(() => import('./ProjectMap'), { ssr: false })

type GalleryItem =
  | { _type: 'galleryImage'; _key: string; image: object; caption?: string }
  | { _type: 'gallerySlideshow'; _key: string; slides: object[] }
  | { _type: 'galleryMap'; _key: string; lat: number; lng: number }

interface Project {
  _id: string
  title: string
  location: string
  year?: string
  client?: string
  typology?: string
  surface?: string
  status?: string
  category?: string
  mainImage: object
  gallery?: GalleryItem[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  description?: any[]
}

interface ProjectRowProps {
  project: Project
  isOpen: boolean
  priority?: boolean
  onToggle: () => void
}

function CategoryIcon({ category }: { category?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="white" width="22" height="22">
      {category === 'Arhitectură' && (
        <polygon points="12,3 22,19 2,19" />
      )}
      {category === 'Interior' && (
        <polygon points="12,3 21,12 12,21 3,12" />
      )}
      {category === 'Peisagistică' && (
        <circle cx="12" cy="12" r="9" />
      )}
      {category === 'Urban' && (<>
        <rect x="10" y="2" width="4" height="20" />
        <rect x="2" y="10" width="20" height="4" />
      </>)}
      {!category && (<>
        <rect x="3" y="8" width="18" height="3" />
        <rect x="3" y="13" width="18" height="3" />
      </>)}
    </svg>
  )
}

export default function ProjectRow({ project, isOpen, priority = false, onToggle }: ProjectRowProps) {
  const rowRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  // Delay gallery render until container transition finishes — eliminates end-of-transition pop
  const [showGallery, setShowGallery] = useState(false)

  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(() => setShowGallery(true), 340)
      return () => clearTimeout(t)
    } else {
      setShowGallery(false)
    }
  }, [isOpen])

  // Scroll into view when opening — only if row is below the fold
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        const el = rowRef.current
        if (!el) return
        const rect = el.getBoundingClientRect()
        if (rect.top > window.innerHeight * 0.35) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 80)
    }
  }, [isOpen])

  // Horizontal wheel handler for gallery
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > 0) {
        e.preventDefault()
        el.scrollLeft += e.deltaX
      }
    }

    el.addEventListener('wheel', handleWheel, { passive: false })
    return () => el.removeEventListener('wheel', handleWheel)
  }, [isOpen])

  const PREVIEW_SIZE = 500   // square preview
  const GALLERY_HEIGHT = 520

  return (
    <div ref={rowRef} className="border-b border-gray-100">
      <div
        className="flex items-start pr-0"
        style={{
          paddingTop: isOpen ? '0px' : '48px',
          paddingBottom: isOpen ? '0px' : '48px',
          transition: 'padding 0.35s ease',
        }}
      >
        {/* Left: meta — hidden when gallery is open */}
        <div
          className="flex-shrink-0 flex flex-col items-end pr-10 pt-2 cursor-pointer overflow-hidden"
          style={{
            width: isOpen ? '0px' : '420px',
            opacity: isOpen ? 0 : 1,
            paddingRight: isOpen ? '0px' : undefined,
            transition: 'width 0.35s ease, opacity 0.25s ease',
          }}
          onClick={onToggle}
        >
          <div className="w-12 h-12 bg-black flex items-center justify-center mb-3">
            <CategoryIcon category={project.category} />
          </div>
          <div className="text-[16px] font-normal text-right mb-1 leading-snug">
            {project.title}
          </div>
          <div className="text-[11px] uppercase tracking-[0.1em] text-gray-400 text-right">
            {project.location}
          </div>
          {project.category && (
            <div className="text-[10px] uppercase tracking-[0.08em] text-gray-300 text-right mt-1">
              {project.category}
            </div>
          )}
        </div>

        {/* Right: thumbnail / inline gallery */}
        <div
          className="overflow-hidden relative flex-shrink-0"
          style={{
            width: isOpen ? '100%' : `${PREVIEW_SIZE}px`,
            height: isOpen ? `${GALLERY_HEIGHT}px` : `${PREVIEW_SIZE}px`,
            transition: 'height 0.38s ease, width 0.38s ease',
          }}
        >
          {/* Preview thumbnail — scales up and blurs out when opening */}
          <div
            className="absolute inset-0 cursor-pointer group"
            style={{
              opacity: isOpen ? 0 : 1,
              transform: isOpen ? 'scale(1.03)' : 'scale(1)',
              transition: 'opacity 0.25s ease, transform 0.35s ease',
              pointerEvents: isOpen ? 'none' : 'auto',
              zIndex: 1,
            }}
            onClick={onToggle}
          >
            <Image
              src={urlFor(project.mainImage).width(1000).height(1000).url()}
              alt={project.title}
              fill
              sizes="500px"
              priority={priority}
              className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
          </div>

          {/* Inline gallery — renders after container transition completes */}
          {showGallery && (
            <div
              className="absolute inset-0 animate-fadeIn"
              style={{ zIndex: 2 }}
            >
              <div
                ref={scrollRef}
                className="flex flex-row h-full overflow-x-auto overflow-y-hidden"
                style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#ccc transparent',
                  overscrollBehaviorX: 'contain',
                }}
              >
                {/* ── Col 1: Main image (click to close) ── */}
                <div
                  className="flex-shrink-0 relative group cursor-pointer"
                  style={{ width: '560px' }}
                  onClick={onToggle}
                >
                  <Image
                    src={urlFor(project.mainImage).width(1120).height(1040).url()}
                    alt={project.title}
                    fill
                    sizes="560px"
                    className="object-cover"
                  />
                  {/* Close hint overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-end justify-start p-5">
                    <span className="text-white text-[11px] uppercase tracking-[0.12em] opacity-0 group-hover:opacity-100 transition-opacity">
                      ← Închide
                    </span>
                  </div>
                </div>

                {/* ── Col 2: Description ── */}
                <div
                  className="flex-shrink-0 flex flex-col justify-center px-12 py-10 border-l border-gray-100"
                  style={{ width: '380px' }}
                >
                  {/* Meta info */}
                  <div className="mb-6 space-y-3">
                    {project.year && (
                      <div>
                        <div className="text-[9px] uppercase tracking-[0.12em] text-gray-400 mb-1">An</div>
                        <div className="text-[11px] font-medium uppercase tracking-[0.04em]">{project.year}</div>
                      </div>
                    )}
                    {project.client && (
                      <div>
                        <div className="text-[9px] uppercase tracking-[0.12em] text-gray-400 mb-1">Client</div>
                        <div className="text-[11px] font-medium uppercase tracking-[0.04em]">{project.client}</div>
                      </div>
                    )}
                    {project.typology && (
                      <div>
                        <div className="text-[9px] uppercase tracking-[0.12em] text-gray-400 mb-1">Tipologie</div>
                        <div className="text-[11px] font-medium uppercase tracking-[0.04em]">{project.typology}</div>
                      </div>
                    )}
                    {project.surface && (
                      <div>
                        <div className="text-[9px] uppercase tracking-[0.12em] text-gray-400 mb-1">Suprafață</div>
                        <div className="text-[11px] font-medium uppercase tracking-[0.04em]">{project.surface}</div>
                      </div>
                    )}
                    {project.status && (
                      <div>
                        <div className="text-[9px] uppercase tracking-[0.12em] text-gray-400 mb-1">Status</div>
                        <div className="text-[11px] font-medium uppercase tracking-[0.04em]">{project.status}</div>
                      </div>
                    )}
                  </div>

                  {project.description ? (
                    <div className="text-[13px] leading-[1.8] text-gray-700 prose prose-sm max-w-none">
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      <PortableText value={project.description as any} />
                    </div>
                  ) : null}
                </div>

                {/* ── Gallery panels — ordered by user in Sanity ── */}
                {project.gallery && project.gallery.map((item) => {
                  if (item._type === 'galleryImage') {
                    return (
                      <div key={item._key} className="flex flex-row flex-shrink-0">
                        <div className="flex-shrink-0 relative border-l border-gray-100" style={{ width: '480px' }}>
                          <Image
                            src={urlFor(item.image).width(960).height(1040).url()}
                            alt={item.caption || 'Imagine'}
                            fill
                            sizes="480px"
                            className="object-cover"
                          />
                        </div>
                        {item.caption && (
                          <div
                            className="flex-shrink-0 flex flex-col justify-center border-l border-gray-100 overflow-hidden"
                            style={{ width: '300px', padding: '40px' }}
                          >
                            <p
                              className="text-[13px] leading-[1.8] text-gray-700"
                              style={{
                                overflowWrap: 'break-word',
                                wordBreak: 'break-word',
                                display: '-webkit-box',
                                WebkitLineClamp: 18,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                              }}
                            >
                              {item.caption}
                            </p>
                          </div>
                        )}
                      </div>
                    )
                  }

                  if (item._type === 'gallerySlideshow') {
                    return (
                      <div key={item._key} className="flex-shrink-0 relative border-l border-gray-100" style={{ width: '560px' }}>
                        <GallerySlideshow slides={item.slides.map(s => ({ image: s }))} />
                      </div>
                    )
                  }

                  if (item._type === 'galleryMap') {
                    return (
                      <div key={item._key} className="flex-shrink-0 border-l border-gray-100 relative" style={{ width: '480px' }}>
                        <ProjectMap lat={item.lat} lng={item.lng} title={project.title} />
                      </div>
                    )
                  }

                  return null
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right: vertical category label — visible only in preview state */}
        {!isOpen && (
          <div className="flex-1 flex items-center justify-start pl-10">
            <span
              style={{
                writingMode: 'vertical-rl',
                transform: 'rotate(180deg)',
                fontSize: '11px',
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                color: '#d1d5db',
                userSelect: 'none',
                whiteSpace: 'nowrap',
              }}
            >
              {project.category || 'Proiect'}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
