'use client';

import TableOfContents from './TableOfContents';

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display:  'flex',
        flexDirection: 'row',
        minHeight: 'calc(100vh - 70px)',
        position: 'relative',
      }}
    >
      {/* Left: fixed TOC + spacer */}
      <TableOfContents />

      {/* Right: article content */}
      <div style={{ flex: 1, minWidth: 0, overflowX: 'hidden' }}>
        {children}
      </div>
    </div>
  );
}
