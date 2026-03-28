'use client'

import { useState } from 'react'

const categories = ['Arhitectură', 'Interior', 'Peisagistică', 'Urban']

interface NavProps {
  activeCategory: string | null
  onCategoryChange: (cat: string | null) => void
}

export default function Nav({ activeCategory, onCategoryChange }: NavProps) {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 h-[60px] flex items-center px-8">
      <div className="text-[17px] font-semibold tracking-[0.08em] mr-auto cursor-pointer select-none">
        TEO NAVAL
      </div>
      <ul className="flex gap-12">
        {categories.map((cat) => (
          <li key={cat}>
            <button
              onClick={() => onCategoryChange(activeCategory === cat ? null : cat)}
              className={`text-[11px] tracking-[0.12em] uppercase transition-opacity ${
                activeCategory === cat ? 'opacity-100' : 'opacity-50 hover:opacity-100'
              }`}
            >
              {cat}
            </button>
          </li>
        ))}
      </ul>
      <div className="ml-12 text-[11px] tracking-[0.12em] uppercase opacity-50 cursor-pointer hover:opacity-100 transition-opacity">
        ⌕ Caută
      </div>
    </nav>
  )
}
