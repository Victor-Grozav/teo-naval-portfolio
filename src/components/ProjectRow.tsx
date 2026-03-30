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
  | { _type: 'gallerySlideshow'; _key: string; slides: Array<{ dimensions?: { width: number; height: number } } & object> }
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
  vw: number
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

export default function ProjectRow({ project, isOpen, priority = false, vw, onToggle }: ProjectRowProps) {
  const rowRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [showGallery, setShowGallery] = useState(false)

  const isMobile = vw > 0 && vw < 768

  // Dimensions
  const PREVIEW_SIZE = 500
  const GALLERY_HEIGHT = 520
  const previewW = isMobile ? Math.round(vw * 0.88) : PREVIEW_SIZE
  const previewH = isMobile ? Math.round(vw * 0.56) : PREVIEW_SIZE
  const galleryH = isMobile ? 400 : GALLERY_HEIGHT
  const panelW = isMobile ? Math.round(vw * 0.84) : 0 // 16vw peek of next panel

  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(() => setShowGallery(true), isMobile ? 180 : 340)
      return () => clearTimeout(t)
    } else {
      setShowGallery(false)
    }
  }, [isOpen, isMobile])

  // Scroll into view when opening
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

  // Horizontal wheel handler for gallery (desktop only)
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

  return (
    <div ref={rowRef} className="border-b border-gray-100">
      <div
        className="flex items-center"
        style={{
          paddingTop: isOpen ? '0px' : isMobile ? '16px' : '48px',
          paddingBottom: isOpen ? '0px' : isMobile ? '16px' : '48px',
          paddingLeft: isMobile && !isOpen ? '16px' : '0px',
          transition: 'padding 0.35s ease',
        }}
      >
        {/* Left: meta — desktop only, hidden when open */}
        {!isMobile && (
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
        )}

        {/* Image / gallery container */}
        <div
          className="overflow-hidden relative flex-shrink-0"
          style={{
            width: isOpen ? '100%' : `${previewW}px`,
            height: isOpen ? `${galleryH}px` : `${previewH}px`,
            transition: isMobile
              ? 'height 0.42s cubic-bezier(0.25, 0.46, 0.45, 0.94), width 0.42s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
              : 'height 0.38s ease, width 0.38s ease',
          }}
        >
          {/* Preview thumbnail */}
          <div
            className="absolute inset-0 cursor-pointer group"
            style={{
              opacity: isOpen ? 0 : 1,
              transform: isOpen ? 'scale(1.03)' : 'scale(1)',
              transition: isMobile
                ? 'opacity 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.42s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                : 'opacity 0.25s ease, transform 0.35s ease',
              pointerEvents: isOpen ? 'none' : 'auto',
              zIndex: 1,
            }}
            onClick={onToggle}
          >
            <Image
              src={urlFor(project.mainImage).width(1000).height(1000).url()}
              alt={project.title}
              fill
              sizes={isMobile ? '100vw' : '500px'}
              priority={priority}
              className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
            {isMobile && (
              <div className="absolute bottom-3 right-3 bg-black/50 text-white text-[9px] tracking-[0.12em] uppercase px-2 py-1">
                Vezi →
              </div>
            )}
          </div>

          {/* Inline gallery */}
          {showGallery && (
            <div className="absolute inset-0 animate-fadeIn" style={{ zIndex: 2 }}>
              <div
                ref={scrollRef}
                className="flex flex-row h-full overflow-x-auto overflow-y-hidden"
                style={{
                  scrollbarWidth: isMobile ? 'none' : 'thin',
                  scrollbarColor: '#ccc transparent',
                  overscrollBehaviorX: 'contain',
                  scrollSnapType: 'none',
                }}
              >
                {/* ── Col 1: Main image (click to close) ── */}
                <div
                  className="flex-shrink-0 relative group cursor-pointer"
                  style={{
                    width: isMobile ? `${panelW}px` : '560px',
                    
                  }}
                  onClick={onToggle}
                >
                  <Image
                    src={urlFor(project.mainImage).width(1120).height(1040).url()}
                    alt={project.title}
                    fill
                    sizes={isMobile ? '100vw' : '560px'}
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-end justify-start p-5">
                    <span className="text-white text-[11px] uppercase tracking-[0.12em] opacity-0 group-hover:opacity-100 transition-opacity">
                      ← Închide
                    </span>
                  </div>
                  {/* Mobile close hint (always visible) */}
                  {isMobile && (
                    <div className="absolute top-4 right-4 bg-black/40 text-white text-[10px] tracking-[0.1em] uppercase px-2 py-1">
                      × Închide
                    </div>
                  )}
                </div>

                {/* ── Col 2: Description ── */}
                <div
                  className="flex-shrink-0 flex flex-col border-l border-gray-100"
                  style={{
                    width: isMobile ? `${panelW}px` : '380px',
                    padding: isMobile ? '32px 24px' : '40px 48px',
                    overflowY: 'auto',
                    justifyContent: 'center',
                    
                  }}
                >
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

                {/* ── Gallery panels ── */}
                {project.gallery && project.gallery.map((item) => {
                  if (item._type === 'galleryImage') {
                    return (
                      <div
                        key={item._key}
                        className="flex flex-row flex-shrink-0"
                        style={{ scrollSnapAlign: isMobile ? 'start' : undefined }}
                      >
                        <div
                          className="flex-shrink-0 relative border-l border-gray-100"
                          style={{ width: isMobile ? `${panelW}px` : '480px' }}
                        >
                          <Image
                            src={urlFor(item.image).width(960).height(1040).url()}
                            alt={item.caption || 'Imagine'}
                            fill
                            sizes={isMobile ? '100vw' : '480px'}
                            className="object-cover"
                          />
                          </div>
                        {/* Caption panel — separate container on both mobile and desktop */}
                        {item.caption && (
                          <div
                            className="flex-shrink-0 flex flex-col justify-center border-l border-gray-100 overflow-hidden"
                            style={{
                              width: isMobile ? `${panelW}px` : '300px',
                              padding: isMobile ? '24px' : '40px',
                              
                            }}
                          >
                            <p
                              className="text-[13px] leading-[1.8] text-gray-700"
                              style={{
                                overflowWrap: 'break-word',
                                wordBreak: 'break-word',
                                whiteSpace: 'pre-wrap',
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
                    if (!item.slides?.length) return null
                    return (
                      <div
                        key={item._key}
                        className="flex-shrink-0 relative border-l border-gray-100"
                        style={{
                          width: isMobile ? `${panelW}px` : '560px',
                          
                        }}
                      >
                        <GallerySlideshow
                          slides={item.slides.map(s => ({ image: s, dimensions: s.dimensions }))}
                          galleryHeight={galleryH}
                          containerWidth={isMobile ? panelW : 560}
                        />
                      </div>
                    )
                  }

                  if (item._type === 'galleryMap') {
                    return (
                      <div
                        key={item._key}
                        className="flex-shrink-0 border-l border-gray-100 relative"
                        style={{
                          width: isMobile ? `${panelW}px` : '480px',
                          
                        }}
                      >
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

        {/* Right: vertical category label — desktop only, preview state */}
        {!isMobile && !isOpen && (
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
      {/* Mobile: title + location below image */}
      {isMobile && !isOpen && (
        <div style={{ paddingLeft: '16px', paddingBottom: '14px', paddingTop: '8px' }}>
          <div style={{ fontSize: '13px', fontWeight: 400, lineHeight: 1.3 }}>{project.title}</div>
          <div style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#9ca3af', marginTop: '3px' }}>{project.location}</div>
        </div>
      )}
    </div>
  )
}
