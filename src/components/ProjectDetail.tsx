'use client'

import { useRef, useEffect } from 'react'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { urlFor } from '@/lib/sanity'
import { PortableText } from 'next-sanity'

const ProjectMap = dynamic(() => import('./ProjectMap'), { ssr: false })

interface Project {
  _id: string
  title: string
  location: string
  year?: string
  client?: string
  typology?: string
  surface?: string
  status?: string
  mainImage: object
  gallery?: Array<{ image: object; caption?: string }>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  description?: any[]
  coordinates?: { lat: number; lng: number }
}

interface ProjectDetailProps {
  project: Project
  onClose: () => void
}

export default function ProjectDetail({ project, onClose }: ProjectDetailProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

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
  }, [])

  return (
    <div className="border-b border-gray-100 overflow-hidden animate-slideDown">
      {/* Horizontal scroll container */}
      <div
        ref={scrollRef}
        className="flex flex-row overflow-x-auto overflow-y-hidden"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#ccc transparent',
          height: '520px',
        }}
      >
        {/* ── Col 1: Meta panel ── */}
        <div
          className="flex-shrink-0 flex flex-col justify-between border-r border-gray-100 px-8 py-10"
          style={{ width: '200px' }}
        >
          <div>
            {/* Icon placeholder */}
            <div className="w-10 h-10 bg-black mb-4 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="white" width="20" height="20">
                <rect x="3" y="8" width="18" height="3" />
                <rect x="3" y="13" width="18" height="3" />
              </svg>
            </div>
            <div className="text-[13px] font-medium mb-1 leading-snug">{project.title}</div>
            <div className="text-[10px] uppercase tracking-[0.1em] text-gray-400 mb-8">
              {project.location}
            </div>

            {project.year && (
              <div className="mb-5">
                <div className="text-[9px] uppercase tracking-[0.12em] text-gray-400 mb-1">An</div>
                <div className="text-[11px] font-medium uppercase tracking-[0.04em]">{project.year}</div>
              </div>
            )}
            {project.client && (
              <div className="mb-5">
                <div className="text-[9px] uppercase tracking-[0.12em] text-gray-400 mb-1">Client</div>
                <div className="text-[11px] font-medium uppercase tracking-[0.04em]">{project.client}</div>
              </div>
            )}
            {project.typology && (
              <div className="mb-5">
                <div className="text-[9px] uppercase tracking-[0.12em] text-gray-400 mb-1">Tipologie</div>
                <div className="text-[11px] font-medium uppercase tracking-[0.04em]">{project.typology}</div>
              </div>
            )}
            {project.surface && (
              <div className="mb-5">
                <div className="text-[9px] uppercase tracking-[0.12em] text-gray-400 mb-1">Suprafață</div>
                <div className="text-[11px] font-medium uppercase tracking-[0.04em]">{project.surface}</div>
              </div>
            )}
            {project.status && (
              <div className="mb-5">
                <div className="text-[9px] uppercase tracking-[0.12em] text-gray-400 mb-1">Status</div>
                <div className="text-[11px] font-medium uppercase tracking-[0.04em]">{project.status}</div>
              </div>
            )}
          </div>

          <button
            onClick={onClose}
            className="text-[10px] uppercase tracking-[0.1em] text-gray-400 hover:text-black transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span className="text-lg leading-none">×</span> Închide
          </button>
        </div>

        {/* ── Col 2: Main image ── */}
        <div className="flex-shrink-0 relative" style={{ width: '560px' }}>
          <Image
            src={urlFor(project.mainImage).width(1120).height(1040).url()}
            alt={project.title}
            fill
            className="object-cover"
          />
        </div>

        {/* ── Col 3: Description ── */}
        <div
          className="flex-shrink-0 flex flex-col justify-center px-12 py-10 border-r border-gray-100"
          style={{ width: '380px' }}
        >
          {project.description ? (
            <div className="text-[13px] leading-[1.8] text-gray-700 prose prose-sm max-w-none">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <PortableText value={project.description as any} />
            </div>
          ) : (
            <div className="text-[13px] leading-[1.8] text-gray-700">
              <p>
                Complexul turistic RockScor este o intervenție arhitecturală ce redefinește raportul
                dintre structura construită și peisajul natural al zonei Cosernița. Formele conice ale
                acoperișurilor evocă profilul dealurilor moldovenești, integrând construcția în
                relief ca o continuare organică a terenului.
              </p>
              <p className="mt-4">
                Materialele utilizate — lemn local, piatră naturală și sticlă — asigură o tranziție
                fluidă între interior și exterior, oferind oaspeților o experiență de imersie totală
                în peisaj, indiferent de anotimp.
              </p>
            </div>
          )}
        </div>

        {/* ── Col 4+: Gallery images with caption panels ── */}
        {project.gallery && project.gallery.length > 0 ? (
          project.gallery.map((item, idx) => (
            <div key={idx} className="flex flex-row flex-shrink-0">
              {/* Image column */}
              <div
                className="flex-shrink-0 relative border-l border-gray-100"
                style={{ width: '480px' }}
              >
                <Image
                  src={urlFor(item.image).width(960).height(1040).url()}
                  alt={item.caption || `Imagine ${idx + 2}`}
                  fill
                  className="object-cover"
                />
              </div>
              {/* Caption panel */}
              {item.caption && (
                <div
                  className="flex-shrink-0 flex flex-col justify-center px-10 py-10 border-l border-gray-100"
                  style={{ width: '300px' }}
                >
                  <p className="text-[13px] leading-[1.8] text-gray-700">{item.caption}</p>
                </div>
              )}
            </div>
          ))
        ) : null}

        {/* ── Map panel (always last) ── */}
        {project.coordinates?.lat && project.coordinates?.lng && (
          <div
            className="flex-shrink-0 border-l border-gray-100 relative"
            style={{ width: '480px' }}
          >
            <ProjectMap
              lat={project.coordinates.lat}
              lng={project.coordinates.lng}
              title={project.title}
            />
          </div>
        )}
      </div>
    </div>
  )
}
