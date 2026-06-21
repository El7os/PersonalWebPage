import type { ReactNode } from 'react';

interface CodeInlineProps {
    /** Identifier text. Use this in MDX when children are awkward to pass. */
    code?: string;
    children?: ReactNode;
}

export default function CodeInline({ code, children }: CodeInlineProps) {
    const text = (code ?? children)?.toString().trim();

    if (!text) {
        return null;
    }

    return (
        <code
            className="code-inline"
            style={{
                color: '#E06C75',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.92em',
                letterSpacing: '0.01em',
            }}
        >
            {text}
        </code>
    );
}
