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
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '5px',
                padding: '0.15em 0.35em',
                fontFamily: 'var(--font-mono), "JetBrains Mono", "Fira Code", "Cascadia Code", "Consolas", "Menlo", monospace',
                fontSize: '0.9em',
                letterSpacing: '0.01em',
                wordBreak: 'break-word',
            }}
        >
            {text}
        </code>
    );
}
