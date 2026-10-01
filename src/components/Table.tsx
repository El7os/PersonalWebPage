import type { ReactNode } from 'react';

type BadgeTone = 'positive' | 'negative' | 'warning' | 'accent' | 'neutral';
type Align = 'left' | 'center' | 'right';

interface TableProps {
    /** Column header labels. */
    columns: ReactNode[];
    /** Row data; each row holds one cell per column. */
    rows: ReactNode[][];
    /** Optional caption shown below the table. */
    caption?: string;
    /** Style the first cell of each row as a row header. */
    rowHeaders?: boolean;
    /** Per-column alignment. Missing entries default to left. */
    align?: Align[];
    /** Render cells whose text exactly matches a key as a colored badge, e.g. { "Obtained": "positive" }. */
    badges?: Record<string, BadgeTone>;
}

const BORDER_COLOR = 'rgba(255, 255, 255, 0.08)';
const HEADER_BG = 'rgba(0, 255, 65, 0.06)';
const STRIPE_BG = 'rgba(255, 255, 255, 0.02)';

const BADGE_COLORS: Record<BadgeTone, { color: string; bg: string; border: string }> = {
    positive: { color: '#98C379', bg: 'rgba(152, 195, 121, 0.1)', border: 'rgba(152, 195, 121, 0.3)' },
    negative: { color: '#E06C75', bg: 'rgba(224, 108, 117, 0.1)', border: 'rgba(224, 108, 117, 0.3)' },
    warning:  { color: '#E5C07B', bg: 'rgba(229, 192, 123, 0.1)', border: 'rgba(229, 192, 123, 0.3)' },
    accent:   { color: '#00ff41', bg: 'rgba(0, 255, 65, 0.08)', border: 'rgba(0, 255, 65, 0.28)' },
    neutral:  { color: '#ABB2BF', bg: 'rgba(255, 255, 255, 0.06)', border: 'rgba(255, 255, 255, 0.12)' },
};

function renderCell(value: ReactNode, badges?: Record<string, BadgeTone>) {
    if (typeof value !== 'string' || !badges) {
        return value;
    }

    const tone = badges[value.trim()];
    if (!tone) {
        return value;
    }

    const { color, bg, border } = BADGE_COLORS[tone];
    return (
        <span
            style={{
                display: 'inline-block',
                padding: '0.1em 0.6em',
                borderRadius: '6px',
                border: `1px solid ${border}`,
                background: bg,
                color,
                fontFamily: 'var(--font-mono), monospace',
                fontSize: '0.85em',
                fontWeight: 500,
                whiteSpace: 'nowrap',
            }}
        >
            {value}
        </span>
    );
}

export default function Table({
    columns,
    rows,
    caption,
    rowHeaders = true,
    align = [],
    badges,
}: TableProps) {
    const cellPadding = '0.75rem 1rem';

    return (
        <figure className="blog-table" style={{ margin: '2rem 0' }}>
            <div
                style={{
                    overflowX: 'auto',
                    borderRadius: '12px',
                    border: `1px solid ${BORDER_COLOR}`,
                    background: 'var(--glass-bg)',
                    boxShadow: 'var(--glass-shadow)',
                }}
            >
                <table
                    style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        fontSize: '0.95rem',
                        lineHeight: 1.5,
                    }}
                >
                    <thead>
                        <tr style={{ background: HEADER_BG }}>
                            {columns.map((column, i) => (
                                <th
                                    key={i}
                                    scope="col"
                                    style={{
                                        padding: cellPadding,
                                        textAlign: align[i] ?? 'left',
                                        verticalAlign: 'bottom',
                                        borderBottom: '1px solid rgba(0, 255, 65, 0.28)',
                                        color: 'var(--accent-color)',
                                        fontFamily: 'var(--font-mono), monospace',
                                        fontSize: '0.8rem',
                                        fontWeight: 600,
                                        letterSpacing: '0.04em',
                                        textTransform: 'uppercase',
                                    }}
                                >
                                    {column}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, r) => (
                            <tr key={r} style={{ background: r % 2 === 1 ? STRIPE_BG : 'transparent' }}>
                                {row.map((cell, c) => {
                                    const isRowHeader = rowHeaders && c === 0;
                                    const CellTag = isRowHeader ? 'th' : 'td';
                                    return (
                                        <CellTag
                                            key={c}
                                            scope={isRowHeader ? 'row' : undefined}
                                            style={{
                                                padding: cellPadding,
                                                textAlign: align[c] ?? 'left',
                                                verticalAlign: 'middle',
                                                borderBottom: r === rows.length - 1 ? 'none' : `1px solid ${BORDER_COLOR}`,
                                                color: isRowHeader ? '#ffffff' : 'rgba(255, 255, 255, 0.85)',
                                                fontWeight: isRowHeader ? 600 : 400,
                                                whiteSpace: isRowHeader ? 'nowrap' : undefined,
                                            }}
                                        >
                                            {renderCell(cell, badges)}
                                        </CellTag>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {caption && (
                <figcaption
                    style={{
                        marginTop: '0.75rem',
                        color: '#888',
                        fontSize: '0.95rem',
                        textAlign: 'center',
                    }}
                >
                    {caption}
                </figcaption>
            )}
        </figure>
    );
}
