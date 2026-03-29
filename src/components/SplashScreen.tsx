'use client'

import { useState, useEffect, useRef } from 'react'

const FULL_TEXT = 'TEO NAVAL'
const START_DELAY = 800
const TYPE_SPEED = 105
const POST_TYPE_DELAY = 650
const MOVE_DURATION = 700
const FADE_DURATION = 600

const NAV_TOP = 20
const NAV_LEFT = 32
const NAV_FONT_SIZE = 17
const SPLASH_FONT_SIZE = 58
const SCALE = NAV_FONT_SIZE / SPLASH_FONT_SIZE

export default function SplashScreen() {
  const [visible, setVisible] = useState(false)
  const [displayText, setDisplayText] = useState('')
  const [cursorOn, setCursorOn] = useState(true)
  const [overlayFading, setOverlayFading] = useState(false)
  const textRef = useRef<HTMLDivElement>(null)
  const started = useRef(false)

  useEffect(() => {
    // Strict Mode guard — only start once per mount cycle
    if (started.current) return
    started.current = true

    setVisible(true)
    document.body.style.overflow = 'hidden'

    const cursorTimer = setInterval(() => setCursorOn(v => !v), 500)

    // Double rAF ensures the overlay is painted before we start counting the delay
    requestAnimationFrame(() => requestAnimationFrame(() => {
      setTimeout(() => {
        let i = 0
        const typeTimer = setInterval(() => {
          i++
          setDisplayText(FULL_TEXT.slice(0, i))
          if (i === FULL_TEXT.length) {
            clearInterval(typeTimer)
            setTimeout(() => {
              clearInterval(cursorTimer)
              setCursorOn(false)
              startMoveToNav()
            }, POST_TYPE_DELAY)
          }
        }, TYPE_SPEED)
      }, START_DELAY)
    }))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function startMoveToNav() {
    const el = textRef.current
    if (!el) return

    const rect = el.getBoundingClientRect()

    el.style.transition = 'none'
    el.style.top = rect.top + 'px'
    el.style.left = rect.left + 'px'
    el.style.transform = 'none'

    void el.offsetHeight

    el.style.transition = [
      `top ${MOVE_DURATION}ms cubic-bezier(0.4,0,0.2,1)`,
      `left ${MOVE_DURATION}ms cubic-bezier(0.4,0,0.2,1)`,
      `transform ${MOVE_DURATION}ms cubic-bezier(0.4,0,0.2,1)`,
      `letter-spacing ${MOVE_DURATION}ms ease`,
    ].join(', ')
    el.style.top = NAV_TOP + 'px'
    el.style.left = NAV_LEFT + 'px'
    el.style.transform = `scale(${SCALE})`
    el.style.transformOrigin = 'top left'
    el.style.letterSpacing = '0.08em'

    setTimeout(() => {
      setOverlayFading(true)
      // Reveal content at the same moment the overlay starts fading
      document.documentElement.removeAttribute('data-splash')
    }, MOVE_DURATION - 100)

    setTimeout(() => {
      document.body.style.overflow = ''
      setVisible(false)
    }, MOVE_DURATION + FADE_DURATION)
  }

  if (!visible) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#000',
        zIndex: 9999,
        visibility: 'visible',
        opacity: overlayFading ? 0 : 1,
        transition: overlayFading ? `opacity ${FADE_DURATION}ms ease` : 'none',
        pointerEvents: overlayFading ? 'none' : 'auto',
      }}
    >
      <div
        ref={textRef}
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: '#fff',
          fontSize: SPLASH_FONT_SIZE + 'px',
          fontWeight: 600,
          letterSpacing: '0.22em',
          fontFamily: 'var(--font-geist-sans), "Helvetica Neue", Helvetica, sans-serif',
          whiteSpace: 'nowrap',
          userSelect: 'none',
          lineHeight: 1,
        }}
      >
        {displayText}
        <span
          style={{
            display: 'inline-block',
            width: '2px',
            height: '1em',
            backgroundColor: '#fff',
            verticalAlign: 'middle',
            marginLeft: '4px',
            opacity: cursorOn ? 1 : 0,
            transition: 'opacity 0.08s',
          }}
        />
      </div>
    </div>
  )
}
