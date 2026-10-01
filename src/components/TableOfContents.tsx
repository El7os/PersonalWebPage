'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface HeadingItem {
  id: string;
  text: string;
  level: number; // 1–6
}

// ─── Constants ────────────────────────────────────────────────────────────────

const COLLAPSED_WIDTH = 48;   // px – mini-mode width
const DEFAULT_WIDTH   = 347;  // px – initial expanded width
const MIN_WIDTH       = 160;  // px – drag minimum
const MAX_WIDTH       = 440;  // px – drag maximum

/** Cube size in px keyed by heading level (h1 = biggest). */
const CUBE_SIZE: Record<number, number> = {
  1: 20,
  2: 16,
  3: 13,
  4: 11,
  5: 9,
  6: 8,
};

/** Indentation (px) in expanded mode keyed by level. */
const INDENT: Record<number, number> = {
  1: 0,
  2: 12,
  3: 24,
  4: 32,
  5: 40,
  6: 48,
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function TableOfContents() {
  const [headings,    setHeadings]    = useState<HeadingItem[]>([]);
  const [activeId,    setActiveId]    = useState<string>('');
  const [collapsed,   setCollapsed]   = useState(false);
  const [width,       setWidth]       = useState(DEFAULT_WIDTH);

  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging   = useRef(false);
  const dragStartX   = useRef(0);
  const dragStartW   = useRef(0);

  // ── 1. Collect headings from the article ──────────────────────────────────
  useEffect(() => {
    // Give the MDX a tick to render
    const collect = () => {
      const article = document.querySelector('article');
      if (!article) return;

      const nodes = Array.from(
        article.querySelectorAll<HTMLElement>('h1, h2, h3, h4, h5, h6')
      );

      const items: HeadingItem[] = nodes.map((el, idx) => {
        if (!el.id) el.id = `toc-heading-${idx}`;
        return {
          id:    el.id,
          text:  el.textContent ?? '',
          level: parseInt(el.tagName[1], 10),
        };
      });

      setHeadings(items);
    };

    // Try immediately, then retry once after a short delay for async hydration
    collect();
    const t = setTimeout(collect, 300);
    return () => clearTimeout(t);
  }, []);

  // ── 2. Intersection observer for scroll-spy ───────────────────────────────
  useEffect(() => {
    if (headings.length === 0) return;

    const observers: IntersectionObserver[] = [];

    // Track which headings are currently visible
    const visible = new Map<string, number>(); // id → top offset

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visible.set(entry.target.id, entry.boundingClientRect.top);
          } else {
            visible.delete(entry.target.id);
          }
        });

        // Pick the topmost visible heading
        if (visible.size > 0) {
          let best = '';
          let bestTop = Infinity;
          visible.forEach((top, id) => {
            if (top < bestTop) { bestTop = top; best = id; }
          });
          setActiveId(best);
        }
      },
      { rootMargin: '-70px 0px -60% 0px', threshold: 0 }
    );

    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  // ── 3. Drag-to-resize ─────────────────────────────────────────────────────
  const onDragStart = useCallback((e: React.MouseEvent) => {
    if (collapsed) return;
    isDragging.current = true;
    dragStartX.current = e.clientX;
    dragStartW.current = width;
    e.preventDefault();
  }, [collapsed, width]);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const delta = e.clientX - dragStartX.current;
      const next  = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, dragStartW.current + delta));
      setWidth(next);
    };
    const onMouseUp = () => { isDragging.current = false; };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup',   onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup',   onMouseUp);
    };
  }, []);

  // ── 4. Scroll to heading on click ─────────────────────────────────────────
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const navHeight = 70;
    const y = el.getBoundingClientRect().top + window.scrollY - navHeight - 16;
    window.scrollTo({ top: y, behavior: 'smooth' });
  };

  // ── 5. Render ──────────────────────────────────────────────────────────────

  const panelWidth = collapsed ? COLLAPSED_WIDTH : width;

  return (
    <>
      {/* Resize cursor ghost (only during drag) */}
      <div
        ref={containerRef}
        style={{
          position:     'fixed',
          top:          '70px',           // below nav
          left:         0,
          width:        panelWidth,
          height:       'calc(100vh - 70px)',
          zIndex:       50,
          display:      'flex',
          flexDirection:'row',
          transition:   isDragging.current ? 'none' : 'width 0.3s cubic-bezier(0.4,0,0.2,1)',
          userSelect:   'none',
        }}
      >
        {/* ── Main panel ── */}
        <div
          className="toc-scroll"
          style={{
            flex:           1,
            overflowY:      'auto',
            overflowX:      'hidden',
            background:     'rgba(13,13,13,0.85)',
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
            borderRight:    '1px solid rgba(255,255,255,0.07)',
            boxShadow:      '4px 0 24px rgba(0,0,0,0.4)',
            padding:        collapsed ? '1rem 0' : '1.5rem 0.75rem 1.5rem 1rem',
            transition:     'padding 0.3s ease',
            display:        'flex',
            flexDirection:  'column',
            gap:            collapsed ? '0.6rem' : '0',
          }}
        >
          {/* Header row */}
          <div
            style={{
              display:        'flex',
              alignItems:     'center',
              justifyContent: collapsed ? 'center' : 'space-between',
              marginBottom:   collapsed ? '0.25rem' : '1.25rem',
              padding:        collapsed ? '0' : '0 0.25rem',
              flexShrink:     0,
            }}
          >
            {!collapsed && (
              <span
                style={{
                  fontSize:    '0.7rem',
                  fontWeight:  700,
                  letterSpacing:'0.12em',
                  textTransform:'uppercase',
                  color:       'rgba(255,255,255,0.35)',
                }}
              >
                {'// contents'}
              </span>
            )}

            {/* Toggle button */}
            <button
              onClick={() => setCollapsed(c => !c)}
              title={collapsed ? 'Expand table of contents' : 'Collapse table of contents'}
              style={{
                background:  'transparent',
                border:      '1px solid rgba(255,255,255,0.1)',
                borderRadius:'6px',
                width:       '28px',
                height:      '28px',
                display:     'flex',
                alignItems:  'center',
                justifyContent:'center',
                cursor:      'pointer',
                color:       'rgba(255,255,255,0.5)',
                flexShrink:  0,
                transition:  'all 0.2s ease',
              }}
              onMouseOver={e  => (e.currentTarget.style.color = '#fff')}
              onMouseOut={e   => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
            >
              {/* Chevron icon */}
              <svg
                width="12" height="12" viewBox="0 0 12 12" fill="none"
                style={{ transition: 'transform 0.3s ease', transform: collapsed ? 'rotate(180deg)' : 'rotate(0deg)' }}
              >
                <path d="M8 8.5L4.5 5.5L8 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          {/* ── EXPANDED mode: heading list ── */}
          {!collapsed && (
            <nav aria-label="Table of contents">
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {headings.map((h) => {
                  const isActive = h.id === activeId;
                  return (
                    <li key={h.id}>
                      <button
                        onClick={() => scrollTo(h.id)}
                        style={{
                          display:     'block',
                          width:       '100%',
                          textAlign:   'left',
                          background:  isActive ? 'rgba(0,255,65,0.08)' : 'transparent',
                          border:      'none',
                          borderLeft:  `2px solid ${isActive ? 'var(--accent-color)' : 'transparent'}`,
                          borderRadius:'0 6px 6px 0',
                          padding:     `0.35rem 0.6rem 0.35rem ${INDENT[h.level] + 8}px`,
                          cursor:      'pointer',
                          color:       isActive ? 'var(--accent-color)' : 'rgba(255,255,255,0.55)',
                          fontSize:    h.level <= 2 ? '0.82rem' : '0.78rem',
                          fontWeight:  h.level <= 2 ? 600 : 400,
                          lineHeight:  1.4,
                          transition:  'all 0.2s ease',
                          marginBottom:'2px',
                          wordBreak:   'break-word',
                        }}
                        onMouseOver={e => {
                          if (!isActive) e.currentTarget.style.color = '#fff';
                        }}
                        onMouseOut={e => {
                          if (!isActive) e.currentTarget.style.color = 'rgba(255,255,255,0.55)';
                        }}
                      >
                        {h.text}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>
          )}

          {/* ── COLLAPSED / MINI mode: cube blocks ── */}
          {collapsed && (
            <nav
              aria-label="Table of contents (mini)"
              style={{
                display:       'flex',
                flexDirection: 'column',
                alignItems:    'center',
                gap:           '6px',
                padding:       '0.25rem 0',
              }}
            >
              {headings.map((h) => {
                const isActive = h.id === activeId;
                const size     = CUBE_SIZE[h.level] ?? 10;
                return (
                  <button
                    key={h.id}
                    onClick={() => scrollTo(h.id)}
                    title={h.text}
                    style={{
                      width:        size,
                      height:       size,
                      flexShrink:   0,
                      background:   isActive
                        ? 'var(--accent-color)'
                        : 'rgba(255,255,255,0.15)',
                      boxShadow:    isActive
                        ? '0 0 10px var(--accent-glow)'
                        : 'none',
                      border:       `1px solid ${isActive ? 'var(--accent-color)' : 'rgba(255,255,255,0.18)'}`,
                      borderRadius: '3px',
                      cursor:       'pointer',
                      padding:      0,
                      transition:   'all 0.2s ease',
                    }}
                    onMouseOver={e => {
                      e.currentTarget.style.background = isActive
                        ? 'var(--accent-color)'
                        : 'rgba(255,255,255,0.35)';
                    }}
                    onMouseOut={e => {
                      e.currentTarget.style.background = isActive
                        ? 'var(--accent-color)'
                        : 'rgba(255,255,255,0.15)';
                    }}
                  />
                );
              })}
            </nav>
          )}
        </div>

        {/* ── Resize handle (only in expanded mode) ── */}
        {!collapsed && (
          <div
            onMouseDown={onDragStart}
            style={{
              width:          '6px',
              flexShrink:     0,
              cursor:         'col-resize',
              position:       'relative',
              zIndex:         10,
              background:     'transparent',
              transition:     'background 0.2s',
            }}
            onMouseOver={e  => (e.currentTarget.style.background = 'rgba(0,255,65,0.25)')}
            onMouseOut={e   => (e.currentTarget.style.background = 'transparent')}
          />
        )}
      </div>

      {/* Spacer so the article doesn't hide behind the TOC */}
      <div style={{ width: panelWidth, flexShrink: 0, transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1)' }} aria-hidden />
    </>
  );
}
