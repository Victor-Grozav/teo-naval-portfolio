'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity'
import ProjectDetail from './ProjectDetail'

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
  gallery?: Array<{ image: object; caption?: string }>
  description?: object[]
  coordinates?: { lat: number; lng: number }
}

interface ProjectRowProps {
  project: Project
  isOpen: boolean
  onToggle: () => void
}

export default function ProjectRow({ project, isOpen, onToggle }: ProjectRowProps) {
  const rowRef = useRef<HTMLDivElement>(null)

  const handleOpen = () => {
    onToggle()
    if (!isOpen) {
      setTimeout(() => {
        rowRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 80)
    }
  }

  return (
    <div ref={rowRef} className="border-b border-gray-100">
      {/* Summary row */}
      <div
        className="flex items-start py-12 pr-0 cursor-pointer group"
        onClick={handleOpen}
      >
        {/* Left: meta */}
        <div
          className="flex-shrink-0 flex flex-col items-end pr-10 pt-2"
          style={{ width: '420px' }}
        >
          {/* Icon */}
          <div className="w-12 h-12 bg-black flex items-center justify-center mb-3">
            <svg viewBox="0 0 24 24" fill="white" width="22" height="22">
              <rect x="3" y="8" width="18" height="3" />
              <rect x="3" y="13" width="18" height="3" />
            </svg>
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

        {/* Right: thumbnail */}
        <div className="flex-1 overflow-hidden" style={{ height: '280px' }}>
          <div className="relative w-full h-full overflow-hidden">
            <Image
              src={urlFor(project.mainImage).width(1200).height(560).url()}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
          </div>
        </div>
      </div>

      {/* Expanded detail */}
      {isOpen && (
        <ProjectDetail project={project} onClose={onToggle} />
      )}
    </div>
  )
}
