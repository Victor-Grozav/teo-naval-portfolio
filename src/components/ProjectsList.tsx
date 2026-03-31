'use client'

import { useState, useEffect } from 'react'
import Nav from './Nav'
import ProjectRow from './ProjectRow'

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  gallery?: any[]
  description?: object[]
  coordinates?: { lat: number; lng: number }
}

export default function ProjectsList({ projects }: { projects: Project[] }) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  function handleCategoryChange(cat: string | null) {
    setActiveCategory(cat)
    setActiveId(null)
  }
  const [searchQuery, setSearchQuery] = useState('')
  const [vw, setVw] = useState(0)

  useEffect(() => {
    const update = () => setVw(window.innerWidth)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  useEffect(() => {
    const handlePopState = () => setActiveId(null)
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const q = searchQuery.toLowerCase().trim()
  const filtered = projects.filter((p) => {
    if (q) return p.title.toLowerCase().includes(q) || p.location.toLowerCase().includes(q)
    if (activeCategory && p.category !== activeCategory) return false
    return true
  })

  return (
    <>
      <Nav activeCategory={activeCategory} onCategoryChange={handleCategoryChange} searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <section>
        {filtered.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-gray-400 text-sm tracking-widest uppercase">
            {searchQuery.trim() ? `Niciun rezultat pentru „${searchQuery.trim()}"` : 'Niciun proiect în această categorie'}
          </div>
        ) : (
          filtered.map((project, index) => (
            <ProjectRow
              key={project._id}
              project={project}
              isOpen={activeId === project._id}
              priority={index === 0}
              vw={vw}
              onToggle={() =>
                setActiveId(activeId === project._id ? null : project._id)
              }
            />
          ))
        )}
      </section>
      <footer className="px-8 py-10 border-t border-gray-100 flex justify-between items-center text-[11px] tracking-[0.08em] text-gray-300">
        <span>OLD ARCHITECTURE — ARHITECTURĂ & DESIGN</span>
        <span>© {new Date().getFullYear()}</span>
      </footer>
    </>
  )
}
