import type { ReactNode } from 'react';

interface NotificationProps {
    /** Emoji as a character, or a Unicode representation (e.g. U+26A0, \u{1F4A1}, 1F4A1). */
    emoji?: string;
    /** Optional short heading shown above the body. */
    title?: string;
    children: ReactNode;
}

const BACKGROUND = '#1E2127';
const BORDER_COLOR = '#3A3F4B';
const ACCENT_COLOR = '#00ffcc';

function parseUnicodeEmoji(input: string): string {
    const trimmed = input.trim();
    if (!trimmed) return '';

    const parts = trimmed.split(/\s+/);

    return parts
        .map((part) => {
            const uPlusMatch = part.match(/^U\+([0-9a-fA-F]{4,6})$/i);
            if (uPlusMatch) {
                return String.fromCodePoint(parseInt(uPlusMatch[1], 16));
            }

            const backslashMatch = part.match(/^\\u\{?([0-9a-fA-F]{4,6})\}?$/i);
            if (backslashMatch) {
                return String.fromCodePoint(parseInt(backslashMatch[1], 16));
            }

            const hexPrefixMatch = part.match(/^0x([0-9a-fA-F]{4,6})$/i);
            if (hexPrefixMatch) {
                return String.fromCodePoint(parseInt(hexPrefixMatch[1], 16));
            }

            if (/^[0-9a-fA-F]{4,6}$/i.test(part)) {
                return String.fromCodePoint(parseInt(part, 16));
            }

            return part;
        })
        .join('');
}

export default function Notification({ emoji, title, children }: NotificationProps) {
    const glyph = emoji ? parseUnicodeEmoji(emoji) : null;

    return (
        <aside
            className="notification"
            role="note"
            style={{
                display: 'flex',
                alignItems: 'flex-start',
                margin: '1.5rem 0',
                padding: '1rem 1.25rem',
                borderRadius: '12px',
                border: `1px solid ${BORDER_COLOR}`,
                borderLeft: `3px solid ${ACCENT_COLOR}`,
                background: BACKGROUND,
                boxShadow: '0 4px 24px rgba(0,0,0,0.45)',
                color: '#D4D4D4',
                fontSize: '0.975rem',
                lineHeight: 1.65,
                overflow: 'hidden',
            }}
        >
            {glyph && (
                <span
                    aria-hidden="true"
                    style={{
                        flexShrink: 0,
                        fontSize: '1.35rem',
                        lineHeight: 1.2,
                        marginRight: '0.85rem',
                        marginTop: title ? '0.1rem' : '0.05rem',
                    }}
                >
                    {glyph}
                </span>
            )}

            <div style={{ flex: 1, minWidth: 0 }}>
                {title && (
                    <div
                        style={{
                            fontSize: '0.9rem',
                            fontFamily: 'var(--font-mono)',
                            fontVariant: 'all-small-caps',
                            letterSpacing: '0.06em',
                            color: ACCENT_COLOR,
                            marginBottom: '0.35rem',
                        }}
                    >
                        {title}
                    </div>
                )}
                <div className="notification__content">{children}</div>
            </div>
        </aside>
    );
}
