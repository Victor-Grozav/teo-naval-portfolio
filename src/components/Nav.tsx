'use client'

import { useState, useRef, useEffect } from 'react'

const categories = ['Arhitectură', 'Interior', 'Peisagistică', 'Urban']

interface NavProps {
  activeCategory: string | null
  onCategoryChange: (cat: string | null) => void
  searchQuery: string
  onSearchChange: (q: string) => void
}

export default function Nav({ activeCategory, onCategoryChange, searchQuery, onSearchChange }: NavProps) {
  const [searchOpen, setSearchOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus()
  }, [searchOpen])

  function closeSearch() {
    setSearchOpen(false)
    onSearchChange('')
  }

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100">
      {/* Main row */}
      <div className="flex items-center px-4 sm:px-8 h-[50px] sm:h-[60px]">
        <div className="text-[15px] sm:text-[17px] font-semibold tracking-[0.08em] mr-auto cursor-pointer select-none">
          OLD ARCHITECTURE
        </div>

        {searchOpen ? (
          <div className="flex items-center gap-3 ml-8">
            <input
              ref={inputRef}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onKeyDown={(e) => e.key === 'Escape' && closeSearch()}
              placeholder="Caută proiect..."
              className="text-[11px] tracking-[0.08em] border-b border-gray-300 outline-none bg-transparent w-48 sm:w-64 pb-0.5 placeholder:text-gray-300"
            />
            <button
              onClick={closeSearch}
              className="text-[11px] tracking-[0.12em] uppercase opacity-40 hover:opacity-100 transition-opacity"
            >
              ✕
            </button>
          </div>
        ) : (
          <>
            {/* Desktop categories */}
            <ul className="hidden sm:flex gap-12">
              <li>
                <button
                  onClick={() => onCategoryChange(null)}
                  className={`text-[11px] tracking-[0.12em] uppercase transition-opacity ${
                    activeCategory === null ? 'opacity-100' : 'opacity-50 hover:opacity-100'
                  }`}
                >
                  Toate
                </button>
              </li>
              {categories.map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => onCategoryChange(cat)}
                    className={`text-[11px] tracking-[0.12em] uppercase transition-opacity ${
                      activeCategory === cat ? 'opacity-100' : 'opacity-50 hover:opacity-100'
                    }`}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
            <button
              onClick={() => setSearchOpen(true)}
              className="sm:ml-12 text-[11px] tracking-[0.12em] uppercase opacity-50 cursor-pointer hover:opacity-100 transition-opacity"
            >
              ⌕
            </button>
          </>
        )}
      </div>

      {/* Mobile categories row */}
      {!searchOpen && (
        <div
          className="sm:hidden flex overflow-x-auto border-t border-gray-50 px-4 py-2 gap-6"
          style={{ scrollbarWidth: 'none' }}
        >
          <button
            onClick={() => onCategoryChange(null)}
            className={`flex-shrink-0 text-[10px] tracking-[0.12em] uppercase transition-opacity ${
              activeCategory === null ? 'opacity-100' : 'opacity-40'
            }`}
          >
            Toate
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={`flex-shrink-0 text-[10px] tracking-[0.12em] uppercase transition-opacity ${
                activeCategory === cat ? 'opacity-100' : 'opacity-40'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}
    </nav>
  )
}
