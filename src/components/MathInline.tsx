import katex from 'katex';

interface MathInlineProps {
    /** LaTeX source for inline math. */
    latex?: string;
    /** Slightly enlarges inline math relative to body text. */
    emphasized?: boolean;
}

export default function MathInline({ latex, emphasized = false }: MathInlineProps) {
    const source = latex?.trim();

    if (!source) {
        return null;
    }

    const html = katex.renderToString(source, {
        displayMode: false,
        throwOnError: false,
        strict: 'ignore',
    });

    return (
        <span
            className="math-inline"
            style={{
                fontSize: emphasized ? '1.15em' : undefined,
                verticalAlign: emphasized ? 'middle' : undefined,
            }}
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
}
