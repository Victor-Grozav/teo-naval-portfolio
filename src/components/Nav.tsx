'use client'

const categories = ['Arhitectură', 'Interior', 'Peisagistică', 'Urban']

interface NavProps {
  activeCategory: string | null
  onCategoryChange: (cat: string | null) => void
}

export default function Nav({ activeCategory, onCategoryChange }: NavProps) {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100">
      {/* Main row */}
      <div className="flex items-center px-4 sm:px-8 h-[50px] sm:h-[60px]">
        <div className="text-[15px] sm:text-[17px] font-semibold tracking-[0.08em] mr-auto cursor-pointer select-none">
          OLD ARCHITECTURE
        </div>
        {/* Desktop categories */}
        <ul className="hidden sm:flex gap-12">
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
        <div className="sm:ml-12 text-[11px] tracking-[0.12em] uppercase opacity-50 cursor-pointer hover:opacity-100 transition-opacity">
          ⌕
        </div>
      </div>
      {/* Mobile categories row */}
      <div
        className="sm:hidden flex overflow-x-auto border-t border-gray-50 px-4 py-2 gap-6"
        style={{ scrollbarWidth: 'none' }}
      >
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onCategoryChange(activeCategory === cat ? null : cat)}
            className={`flex-shrink-0 text-[10px] tracking-[0.12em] uppercase transition-opacity ${
              activeCategory === cat ? 'opacity-100' : 'opacity-40'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </nav>
  )
}
