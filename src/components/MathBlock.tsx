import katex from 'katex';

interface MathBlockProps {
    /** LaTeX source for the equation. Preferred in MDX (avoids escaping issues with children). */
    latex?: string;
    /** Optional caption shown below the equation. */
    caption?: string;
    /** Display scale. */
    size?: 'medium' | 'large' | 'xlarge';
}

const SIZE_SCALE: Record<NonNullable<MathBlockProps['size']>, string> = {
    medium: '1.35rem',
    large: '1.65rem',
    xlarge: '2rem',
};

export default function MathBlock({
    latex,
    caption,
    size = 'large',
}: MathBlockProps) {
    const source = latex?.trim();

    if (!source) {
        return null;
    }

    const html = katex.renderToString(source, {
        displayMode: true,
        throwOnError: false,
        strict: 'ignore',
    });

    return (
        <figure
            className="math-block"
            style={{
                margin: '2rem 0',
                padding: '1.75rem 2rem',
                borderRadius: '16px',
                border: '1px solid var(--glass-border)',
                background: 'var(--glass-bg)',
                boxShadow: 'var(--glass-shadow)',
                textAlign: 'center',
            }}
        >
            <div
                className="math-block__equation"
                style={{ fontSize: SIZE_SCALE[size], lineHeight: 1.4 }}
                dangerouslySetInnerHTML={{ __html: html }}
            />
            {caption && (
                <figcaption
                    style={{
                        marginTop: '1rem',
                        color: '#888',
                        fontSize: '0.95rem',
                        letterSpacing: '0.01em',
                    }}
                >
                    {caption}
                </figcaption>
            )}
        </figure>
    );
}
