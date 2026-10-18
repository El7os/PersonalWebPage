'use client';

import { useEffect, useRef, useState } from 'react';

// ─── Constants ────────────────────────────────────────────────────────────────

const NAV_HEIGHT    = 70;                 // px – matches the fixed top nav
const FILLED        = '█';
const EMPTY         = '░';
const SPINNER       = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
const BLOCK_GAP     = '0.2em';             // spacing so each block reads as a separate cell
const MONO_STACK    = 'var(--font-mono), "Cascadia Mono", Consolas, "DejaVu Sans Mono", monospace';

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Old-school command-line style reading progress bar, e.g.
 *   reading [██████████░░░░░░░░░░]  50%  ⠹
 * Sticks below the nav and tracks progress through the first <article> on the page.
 */
export default function ReadingProgress() {
    const [progress, setProgress] = useState(0);      // 0..1
    const [cells,    setCells]    = useState(0);      // block characters that fit
    const [frame,    setFrame]    = useState(0);      // spinner frame

    const barRef     = useRef<HTMLSpanElement>(null);
    const measureRef = useRef<HTMLSpanElement>(null);

    // Fit the number of block characters to the available width.
    useEffect(() => {
        const bar = barRef.current;
        const measure = measureRef.current;
        if (!bar || !measure) return;

        const fit = () => {
            const charWidth = measure.getBoundingClientRect().width / 20;
            if (charWidth <= 0) return;
            // Two characters are reserved for the surrounding brackets.
            setCells(Math.max(0, Math.floor(bar.clientWidth / charWidth) - 2));
        };

        fit();
        const observer = new ResizeObserver(fit);
        observer.observe(bar);
        document.fonts?.ready.then(fit);
        return () => observer.disconnect();
    }, []);

    // Track scroll position through the article.
    useEffect(() => {
        let raf = 0;
        let lastY = window.scrollY;

        const update = () => {
            raf = 0;
            const article = document.querySelector('article');
            if (!article) return;

            const rect  = article.getBoundingClientRect();
            const start = rect.top + window.scrollY - NAV_HEIGHT;
            const end   = rect.bottom + window.scrollY - window.innerHeight;
            const value = end <= start ? 1 : (window.scrollY - start) / (end - start);
            setProgress(Math.min(1, Math.max(0, value)));

            // Spin only while the reader is actually moving.
            if (window.scrollY !== lastY) {
                setFrame(f => (f + 1) % SPINNER.length);
                lastY = window.scrollY;
            }
        };

        const schedule = () => { if (!raf) raf = requestAnimationFrame(update); };

        update();
        window.addEventListener('scroll', schedule, { passive: true });
        window.addEventListener('resize', schedule);
        return () => {
            window.removeEventListener('scroll', schedule);
            window.removeEventListener('resize', schedule);
            if (raf) cancelAnimationFrame(raf);
        };
    }, []);

    const filled  = Math.round(progress * cells);
    const percent = Math.round(progress * 100);
    const done    = percent >= 100;

    return (
        <div
            data-reading-progress
            role="progressbar"
            aria-label="Reading progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={percent}
            style={{
                position:       'sticky',
                top:            `${NAV_HEIGHT}px`,
                zIndex:         40,
                background:     'rgba(13,13,13,0.85)',
                backdropFilter: 'blur(14px)',
                WebkitBackdropFilter: 'blur(14px)',
                borderBottom:   '1px solid rgba(255,255,255,0.07)',
            }}
        >
            <div
                style={{
                    display:    'flex',
                    alignItems: 'center',
                    gap:        '0.75rem',
                    maxWidth:   'calc(50% + 430px)',
                    margin:     '0 auto',
                    padding:    '0.45rem 2rem',
                    fontFamily: MONO_STACK,
                    fontSize:   '0.8rem',
                    lineHeight: 1.2,
                    whiteSpace: 'pre',
                    color:      'rgba(255,255,255,0.35)',
                }}
            >
                <span style={{ letterSpacing: '0.08em' }}>{'reading'}</span>

                <span
                    ref={barRef}
                    aria-hidden="true"
                    style={{ flex: '1 1 0', minWidth: 0, overflow: 'hidden', letterSpacing: BLOCK_GAP }}
                >
                    {cells > 0 && (
                        <>
                            [
                            <span style={{ color: 'var(--accent-color)', textShadow: '0 0 6px var(--accent-glow)' }}>
                                {FILLED.repeat(filled)}
                            </span>
                            <span style={{ color: 'rgba(255,255,255,0.3)' }}>
                                {EMPTY.repeat(cells - filled)}
                            </span>
                            ]
                        </>
                    )}
                </span>

                <span style={{ color: done ? 'var(--accent-color)' : 'rgba(255,255,255,0.6)' }}>
                    {String(percent).padStart(3, ' ')}%
                </span>

                <span aria-hidden="true" style={{ color: 'var(--accent-color)', width: '1ch', textAlign: 'center' }}>
                    {done ? '✓' : SPINNER[frame]}
                </span>

                {/* Hidden ruler used to measure the width of one block character. */}
                <span
                    ref={measureRef}
                    aria-hidden="true"
                    style={{ position: 'absolute', visibility: 'hidden', pointerEvents: 'none', letterSpacing: BLOCK_GAP }}
                >
                    {FILLED.repeat(10) + EMPTY.repeat(10)}
                </span>
            </div>
        </div>
    );
}
