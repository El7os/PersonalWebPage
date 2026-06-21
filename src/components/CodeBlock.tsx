'use client';

import { useState, useRef } from 'react';

interface CodeBlockProps {
    code: string;
    language?: string;
    filename?: string;
    showLineNumbers?: boolean;
}

// ─── Token types ────────────────────────────────────────────────────────────

type TokenType =
    | 'keyword'
    | 'preprocessor'
    | 'type'
    | 'number'
    | 'string'
    | 'comment'
    | 'operator'
    | 'punctuation'
    | 'function'
    | 'macro'
    | 'plain';

interface Token {
    type: TokenType;
    value: string;
}

// ─── C++ syntax highlighting ─────────────────────────────────────────────────

const CPP_KEYWORDS = new Set([
    'alignas','alignof','and','and_eq','asm','auto','bitand','bitor',
    'break','case','catch','class','compl','concept','const','consteval',
    'constexpr','constinit','const_cast','continue','co_await','co_return',
    'co_yield','decltype','default','delete','do','dynamic_cast','else',
    'enum','explicit','export','extern','false','for','friend','goto',
    'if','inline','mutable','namespace','new','noexcept','not','not_eq',
    'nullptr','operator','or','or_eq','private','protected','public',
    'register','reinterpret_cast','requires','return','sizeof','static',
    'static_assert','static_cast','struct','switch','template','this',
    'thread_local','throw','true','try','typedef','typeid','typename',
    'union','using','virtual','volatile','while','xor','xor_eq',
]);

const CPP_TYPES = new Set([
    'bool','char','char8_t','char16_t','char32_t','double','float',
    'int','long','short','signed','unsigned','void','wchar_t',
    'size_t','ptrdiff_t','int8_t','int16_t','int32_t','int64_t',
    'uint8_t','uint16_t','uint32_t','uint64_t','string','vector',
    'map','unordered_map','set','unordered_set','pair','tuple',
    'optional','variant','any','array','deque','list','stack','queue',
    'shared_ptr','unique_ptr','weak_ptr','function','iterator',
]);

const OPERATORS = /^(->|::|\+\+|--|<<|>>|<=|>=|==|!=|&&|\|\||[+\-*/%&|^~<>=!])/;
const PUNCTUATION = /^[(){}[\];:,.?]/;

function tokenize(code: string): Token[][] {
    const lines = code.split('\n');
    return lines.map(line => tokenizeLine(line));
}

function tokenizeLine(line: string): Token[] {
    const tokens: Token[] = [];
    let i = 0;

    while (i < line.length) {
        // Preprocessor directive (whole line starts with #)
        if (i === 0 && line[i] === '#') {
            const match = line.slice(i).match(/^#\s*\w+/);
            if (match) {
                tokens.push({ type: 'preprocessor', value: match[0] });
                i += match[0].length;
                // Rest of preprocessor line (e.g. the filename in #include)
                if (i < line.length) {
                    tokens.push({ type: 'macro', value: line.slice(i) });
                    i = line.length;
                }
                continue;
            }
        }

        // Line comment
        if (line[i] === '/' && line[i + 1] === '/') {
            tokens.push({ type: 'comment', value: line.slice(i) });
            i = line.length;
            continue;
        }

        // String literal
        if (line[i] === '"' || line[i] === "'") {
            const quote = line[i];
            let j = i + 1;
            while (j < line.length) {
                if (line[j] === '\\') { j += 2; continue; }
                if (line[j] === quote) { j++; break; }
                j++;
            }
            tokens.push({ type: 'string', value: line.slice(i, j) });
            i = j;
            continue;
        }

        // Number literal
        const numMatch = line.slice(i).match(/^(0x[\da-fA-F']+|0b[01']+|\d[\d.']*(?:[eE][+-]?\d+)?[uUlLfF]*)/);
        if (numMatch) {
            tokens.push({ type: 'number', value: numMatch[0] });
            i += numMatch[0].length;
            continue;
        }

        // Identifier or keyword
        const identMatch = line.slice(i).match(/^[A-Za-z_][\w]*/);
        if (identMatch) {
            const word = identMatch[0];
            const next = line.slice(i + word.length).trimStart();
            let type: TokenType = 'plain';
            if (CPP_KEYWORDS.has(word)) type = 'keyword';
            else if (CPP_TYPES.has(word)) type = 'type';
            else if (next.startsWith('(')) type = 'function';
            tokens.push({ type, value: word });
            i += word.length;
            continue;
        }

        // Operator
        const opMatch = line.slice(i).match(OPERATORS);
        if (opMatch) {
            tokens.push({ type: 'operator', value: opMatch[0] });
            i += opMatch[0].length;
            continue;
        }

        // Punctuation
        const punctMatch = line.slice(i).match(PUNCTUATION);
        if (punctMatch) {
            tokens.push({ type: 'punctuation', value: punctMatch[0] });
            i += punctMatch[0].length;
            continue;
        }

        // Whitespace / fallthrough
        tokens.push({ type: 'plain', value: line[i] });
        i++;
    }

    return tokens;
}

// ─── Token → colour mapping ──────────────────────────────────────────────────

// Palette: dark charcoal base, vivid accent tokens — evokes a modern editor
// (One Dark / Dracula inspired but purposefully distinct)
const TOKEN_COLORS: Record<TokenType, string> = {
    keyword:      '#C678DD', // violet
    preprocessor: '#E06C75', // rose
    type:         '#56B6C2', // teal
    number:       '#D19A66', // amber
    string:       '#98C379', // sage green
    comment:      '#5C6370', // muted grey
    operator:     '#ABB2BF', // light grey
    punctuation:  '#ABB2BF', // light grey
    function:     '#61AFEF', // sky blue
    macro:        '#E5C07B', // gold
    plain:        '#D4D4D4', // off-white
};

const BACKGROUND   = '#1E2127';
const GUTTER_BG    = '#181A1F';
const BORDER_COLOR = '#3A3F4B';
const HEADER_BG    = '#23272F';
const LINE_NUM_COLOR = '#4B5263';
const SCROLLBAR_THUMB = '#3A3F4B';

// ─── Component ───────────────────────────────────────────────────────────────

export default function CodeBlock({
    code,
    language = 'cpp',
    filename,
    showLineNumbers = true,
}: CodeBlockProps) {
    const [copied, setCopied] = useState(false);
    const codeRef = useRef<HTMLDivElement>(null);

    const trimmed = code.trim();
    const tokenLines = tokenize(trimmed);
    const lineCount = tokenLines.length;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(trimmed);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // fallback for older browsers
            const el = document.createElement('textarea');
            el.value = trimmed;
            document.body.appendChild(el);
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const gutterWidth = showLineNumbers
        ? `${Math.max(String(lineCount).length * 9 + 24, 48)}px`
        : '0px';

    return (
        <div
            style={{
                borderRadius: '12px',
                overflow: 'hidden',
                border: `1px solid ${BORDER_COLOR}`,
                boxShadow: '0 4px 24px rgba(0,0,0,0.45)',
                fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'Consolas', 'Menlo', monospace",
                fontSize: '13.5px',
                lineHeight: '1.65',
                margin: '1.5rem 0',
            }}
        >
            {/* ── Header bar ─────────────────────────────────────────────── */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 16px',
                    background: HEADER_BG,
                    borderBottom: `1px solid ${BORDER_COLOR}`,
                    gap: '12px',
                }}
            >
                {/* Traffic-light dots */}
                <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                    {['#FF5F57','#FFBD2E','#28C840'].map((c, idx) => (
                        <div key={idx} style={{
                            width: '12px', height: '12px',
                            borderRadius: '50%',
                            backgroundColor: c,
                            opacity: 0.85,
                        }} />
                    ))}
                </div>

                {/* Filename / language pill */}
                <div style={{
                    flex: 1,
                    textAlign: 'center',
                    color: '#636D83',
                    fontSize: '12px',
                    letterSpacing: '0.04em',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                }}>
                    {filename ?? language.toUpperCase()}
                </div>

                {/* Copy button */}
                <button
                    onClick={handleCopy}
                    title="Copy code"
                    style={{
                        flexShrink: 0,
                        background: copied ? '#2A3D2A' : 'transparent',
                        border: `1px solid ${copied ? '#3A6B3A' : BORDER_COLOR}`,
                        borderRadius: '6px',
                        color: copied ? '#98C379' : '#636D83',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        padding: '4px 10px',
                        fontSize: '11px',
                        letterSpacing: '0.03em',
                        transition: 'all 0.15s ease',
                    }}
                >
                    {copied ? (
                        <>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" strokeWidth="2.5"
                                strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                            Copied
                        </>
                    ) : (
                        <>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" strokeWidth="2"
                                strokeLinecap="round" strokeLinejoin="round">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                            </svg>
                            Copy
                        </>
                    )}
                </button>
            </div>

            {/* ── Code area ──────────────────────────────────────────────── */}
            <div
                ref={codeRef}
                style={{
                    background: BACKGROUND,
                    overflowX: 'auto',
                    overflowY: 'auto',
                    maxHeight: '600px',
                    // Custom scrollbar styling (webkit)
                    scrollbarWidth: 'thin',
                    scrollbarColor: `${SCROLLBAR_THUMB} transparent`,
                }}
            >
                <table
                    style={{
                        borderCollapse: 'collapse',
                        width: '100%',
                        tableLayout: 'fixed',
                    }}
                >
                    <colgroup>
                        {showLineNumbers && (
                            <col style={{ width: gutterWidth }} />
                        )}
                        <col />
                    </colgroup>
                    <tbody>
                        {tokenLines.map((tokens, lineIdx) => (
                            <tr
                                key={lineIdx}
                                style={{
                                    verticalAlign: 'top',
                                }}
                            >
                                {/* Line number gutter */}
                                {showLineNumbers && (
                                    <td
                                        style={{
                                            background: GUTTER_BG,
                                            color: LINE_NUM_COLOR,
                                            textAlign: 'right',
                                            padding: '0 12px 0 16px',
                                            userSelect: 'none',
                                            whiteSpace: 'nowrap',
                                            fontSize: '12px',
                                            borderRight: `1px solid ${BORDER_COLOR}`,
                                            lineHeight: '1.65',
                                        }}
                                    >
                                        {lineIdx + 1}
                                    </td>
                                )}

                                {/* Code cell */}
                                <td style={{ padding: '0 24px 0 20px', whiteSpace: 'pre' }}>
                                    {tokens.length === 0
                                        ? <span>&nbsp;</span>
                                        : tokens.map((tok, tIdx) => (
                                            <span
                                                key={tIdx}
                                                style={{
                                                    color: TOKEN_COLORS[tok.type],
                                                    fontStyle: tok.type === 'comment' ? 'italic' : 'normal',
                                                    fontWeight: tok.type === 'keyword' ? 600 : 400,
                                                }}
                                            >
                                                {tok.value}
                                            </span>
                                        ))
                                    }
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
