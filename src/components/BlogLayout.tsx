'use client';

import TableOfContents from './TableOfContents';
import ReadingProgress from './ReadingProgress';

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

      {/* Right: article content. overflow-x clip (not hidden) keeps the sticky progress bar working. */}
      <div style={{ flex: 1, minWidth: 0, overflowX: 'clip' }}>
        <ReadingProgress />
        {children}
      </div>
    </div>
  );
}
