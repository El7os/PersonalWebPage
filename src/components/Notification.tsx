import type { ReactNode } from 'react';

interface NotificationProps {
    /** Emoji character or Unicode code point (e.g. "💡", "U+1F4A1", "1F4A1"). */
    emoji?: string;
    children: ReactNode;
}

const BACKGROUND = 'rgba(var(--accent-rgb), 0.07)';
const BORDER_COLOR = 'rgba(var(--accent-rgb), 0.28)';
const EMOJI_BG = 'rgba(var(--accent-rgb), 0.12)';

function parseEmoji(input: string): string {
    const trimmed = input.trim();

    const uPlusMatch = trimmed.match(/^U\+([0-9A-Fa-f]{4,6})$/i);
    if (uPlusMatch) {
        return String.fromCodePoint(parseInt(uPlusMatch[1], 16));
    }

    if (/^[0-9A-Fa-f]{4,6}$/.test(trimmed)) {
        return String.fromCodePoint(parseInt(trimmed, 16));
    }

    const escapeMatch = trimmed.match(/^\\u\{?([0-9A-Fa-f]{4,6})\}?$/i);
    if (escapeMatch) {
        return String.fromCodePoint(parseInt(escapeMatch[1], 16));
    }

    return trimmed;
}

export default function Notification({
    emoji = 'U+1F4A1',
    children,
}: NotificationProps) {
    const glyph = parseEmoji(emoji);

    return (
        <aside
            className="notification"
            role="note"
            style={{
                position: 'relative',
                display: 'grid',
                gridTemplateColumns: 'auto 1fr',
                gap: '0.85rem 1rem',
                alignItems: 'start',
                margin: '1.5rem 0',
                padding: '1.25rem 1.5rem 1.25rem 1.25rem',
                borderRadius: '12px',
                border: `1px solid ${BORDER_COLOR}`,
                background: BACKGROUND,
                boxShadow: '0 4px 24px rgba(0, 0, 0, 0.35)',
                fontSize: '1rem',
                lineHeight: 1.65,
                color: 'var(--text-color)',
            }}
        >
            <span
                aria-hidden="true"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '2.25rem',
                    height: '2.25rem',
                    borderRadius: '10px',
                    background: EMOJI_BG,
                    border: `1px solid ${BORDER_COLOR}`,
                    fontSize: '1.25rem',
                    lineHeight: 1,
                    flexShrink: 0,
                }}
            >
                {glyph}
            </span>

            <div
                className="notification__content"
                style={{
                    minWidth: 0,
                    paddingTop: '0.15rem',
                }}
            >
                {children}
            </div>
        </aside>
    );
}
