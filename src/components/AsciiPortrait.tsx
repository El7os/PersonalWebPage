'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { withBasePath } from '@/lib/basePath';
import { ASCII_COLS, ASCII_PORTRAIT, ASCII_ROWS } from './asciiPortraitData';

// ─── Constants ────────────────────────────────────────────────────────────────

const QUIPS = [
    'it works on my machine',
    '// TODO: get a haircut',
    'compiling shaders (4,096 left)',
    'segfault (core dumped)',
    '0 errors, 1,337 warnings',
    'git push --force ...oops',
    'it was a cache miss, I swear',
];

const BUBBLE_WIDTH  = 16;             // characters inside the bubble
const GLITCH_CHARS  = '01$#@%&*+=<>/\\|{}[]';
const GLITCH_MS     = 140;
const QUIP_MS       = 6000;
// --font-mono can't be used: it is defined on :root, but the Geist variables live on <body>.
const MONO_STACK    = 'var(--font-geist-mono), "Cascadia Mono", Consolas, monospace';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Wraps text into an ASCII speech bubble whose tail points down-right. */
function bubble(text: string, width = BUBBLE_WIDTH): string {
    const lines: string[] = [];
    let line = '';
    for (const word of text.split(' ')) {
        if (line && (line + ' ' + word).length > width) {
            lines.push(line);
            line = word;
        } else {
            line = line ? `${line} ${word}` : word;
        }
    }
    if (line) lines.push(line);

    return [
        ` .${'-'.repeat(width + 2)}.`,
        ...lines.map(l => `( ${l.padEnd(width)} )`),
        ` '${'-'.repeat(width + 2)}'`,
        `${' '.repeat(width)}\\`,
        `${' '.repeat(width + 1)}\\`,
    ].join('\n');
}

type Glitch = { row: number; col: number; ch: string };

/** Picks a random non-blank cell of the portrait and a random glyph for it. */
function randomGlitch(): Glitch | null {
    for (let tries = 0; tries < 20; tries++) {
        const row = Math.floor(Math.random() * ASCII_ROWS);
        const col = Math.floor(Math.random() * ASCII_COLS);
        if (ASCII_PORTRAIT[row][col] !== ' ') {
            return { row, col, ch: GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)] };
        }
    }
    return null;
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * ASCII-art version of the profile photo with a speech bubble of programmer jokes.
 * Click to cycle jokes; hover to "decompile" back to the real photo.
 */
export default function AsciiPortrait() {
    const [quip,     setQuip]     = useState(0);
    const [glitches, setGlitches] = useState<Glitch[]>([]);
    const [revealed, setRevealed] = useState(false);

    const nextQuip = () => setQuip(q => (q + 1) % QUIPS.length);

    useEffect(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const glitchTimer = setInterval(() => {
            const next: Glitch[] = [];
            const count = Math.random() < 0.3 ? 2 : Math.random() < 0.6 ? 1 : 0;
            for (let i = 0; i < count; i++) {
                const g = randomGlitch();
                if (g) next.push(g);
            }
            setGlitches(next);
        }, GLITCH_MS);

        const quipTimer = setInterval(() => setQuip(q => (q + 1) % QUIPS.length), QUIP_MS);

        return () => {
            clearInterval(glitchTimer);
            clearInterval(quipTimer);
        };
    }, []);

    const art = ASCII_PORTRAIT.map((line, row) => {
        const hits = glitches.filter(g => g.row === row);
        if (!hits.length) return line;
        const chars = line.split('');
        for (const g of hits) chars[g.col] = g.ch;
        return chars.join('');
    }).join('\n');

    // Cell metrics derived from the frame width so the grid always fills it exactly.
    const textStyle = {
        position:   'absolute' as const,
        margin:     0,
        fontFamily: MONO_STACK,
        fontSize:   `calc(100cqw / ${ASCII_COLS} / 0.6)`,
        lineHeight: `calc(100cqw / ${ASCII_ROWS})`,
        whiteSpace: 'pre' as const,
        pointerEvents: 'none' as const,
    };

    return (
        <div
            role="button"
            tabIndex={0}
            aria-label="ASCII art portrait of E. Yahya Arabacı. Activate for another joke."
            onClick={nextQuip}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); nextQuip(); } }}
            onMouseEnter={() => setRevealed(true)}
            onMouseLeave={() => setRevealed(false)}
            style={{
                flex:          '0 1 340px',
                aspectRatio:   '1 / 1',
                position:      'relative',
                containerType: 'inline-size',
                borderRadius:  '20px',
                overflow:      'hidden',
                cursor:        'pointer',
                background:    '#040904',
                border:        '1px solid rgba(0, 255, 65, 0.35)',
                boxShadow:     '0 0 40px rgba(0, 255, 65, 0.12), var(--glass-shadow)',
            }}
        >
            {/* The portrait */}
            <pre
                aria-hidden="true"
                style={{
                    ...textStyle,
                    inset:      0,
                    color:      'var(--accent-color)',
                    textShadow: '0 0 4px rgba(0, 255, 65, 0.55)',
                }}
            >
                {art}
            </pre>

            {/* Speech bubble */}
            <pre
                aria-live="polite"
                style={{
                    ...textStyle,
                    top:   `calc(100cqw / ${ASCII_ROWS} * 0.5)`,
                    left:  `calc(100cqw / ${ASCII_COLS} * 1)`,
                    color: 'rgba(255, 255, 255, 0.9)',
                }}
            >
                {bubble(QUIPS[quip])}
            </pre>

            {/* Hover: "decompile" back to the real photo */}
            <Image
                src={withBasePath("/ProfilePhoto.jpg")}
                alt=""
                fill
                sizes="340px"
                priority
                style={{
                    objectFit:  'cover',
                    opacity:    revealed ? 1 : 0,
                    transition: 'opacity 0.35s ease',
                }}
            />
        </div>
    );
}
