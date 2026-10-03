'use client';
import { useEffect, useState } from 'react';

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>/\\[]{}=+*#%&$';
const FRAME_MS = 45;      // how often unresolved glyphs re-roll
const START_DELAY = 150;  // ms before the first character locks in
const STAGGER = 55;       // ms between successive characters locking in
const JITTER = 120;       // random extra time per character so it doesn't resolve as a perfect wipe

const randomGlyph = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)];

// Deterministic first frame so server and client markup match before the effect starts.
const initialGlyphs = (text: string) =>
    Array.from(text, (ch, i) => (ch === ' ' ? ' ' : GLYPHS[(i * 7) % GLYPHS.length]));

/**
 * Renders `text` as if it were being decrypted: every character cycles through random
 * glyphs (in the page accent colour) and locks into place left-to-right.
 *
 * Each character sits in a grid cell sized by its real glyph, so the line never reflows
 * while scrambling. Inherits the parent's styling (incl. .heading-primary's gradient fill).
 */
export default function DecryptText({ text }: { text: string }) {
    const chars = Array.from(text);
    const [glyphs, setGlyphs] = useState<string[]>(() => initialGlyphs(text));
    const [resolved, setResolved] = useState<boolean[]>(() => chars.map(ch => ch === ' '));
    const [done, setDone] = useState(false);

    useEffect(() => {
        const characters = Array.from(text);
        // Reduced motion: everything locks on the first frame.
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const lockAt = characters.map((_, i) => reduceMotion ? 0 : START_DELAY + i * STAGGER + Math.random() * JITTER);
        const start = performance.now();
        let lastFrame = -Infinity;
        let raf = 0;

        const tick = (now: number) => {
            const elapsed = now - start;
            if (now - lastFrame >= FRAME_MS) {
                lastFrame = now;
                const locked = characters.map((ch, i) => ch === ' ' || elapsed >= lockAt[i]);
                setResolved(locked);
                setGlyphs(characters.map((ch, i) => (locked[i] ? ch : randomGlyph())));
                if (locked.every(Boolean)) {
                    setDone(true);
                    return;
                }
            }
            raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [text]);

    // Once finished, hand back plain text so kerning and selection behave normally.
    if (done) return <>{text}</>;

    // Group characters into words so wrapping only happens at spaces.
    const words: { ch: string; i: number }[][] = [[]];
    chars.forEach((ch, i) => (ch === ' ' ? words.push([]) : words[words.length - 1].push({ ch, i })));

    return (
        <>
            <span className="sr-only">{text}</span>
            <span aria-hidden="true">
                {words.map((word, w) => (
                    <span key={w}>
                        {w > 0 && ' '}
                        <span style={{ whiteSpace: 'nowrap' }}>
                            {word.map(({ ch, i }) => resolved[i] ? ch : (
                                // The real glyph stays in normal flow (hidden) so the line box is identical
                                // to plain text; the scramble glyph is absolutely positioned so its
                                // different font metrics can't change the line height.
                                <span key={i} style={{ position: 'relative' }}>
                                    <span style={{ visibility: 'hidden' }}>{ch}</span>
                                    <span
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                            fontFamily: 'var(--font-mono)',
                                            fontWeight: 500,
                                            WebkitTextFillColor: 'var(--accent-color)',
                                            textShadow: '0 0 12px var(--accent-glow)',
                                        }}
                                    >
                                        {glyphs[i]}
                                    </span>
                                </span>
                            ))}
                        </span>
                    </span>
                ))}
            </span>
        </>
    );
}
