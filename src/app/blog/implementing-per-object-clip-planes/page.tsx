import type { Metadata } from 'next';
import BlogLayout from '@/components/BlogLayout';
import Content from './content.mdx';

export const metadata: Metadata = {
  title: 'Implementing Per-Object Clip Planes in Unreal Engine 5',
  description: 'Extending Unreal Engine\'s rendering pipeline to support custom clipping planes on individual primitives.',
};

export default function Page() {
  return (
    <BlogLayout>
      <article className="blog-content" style={{ maxWidth: 'calc(50% + 430px)', margin: '0 auto', padding: '2rem' }}>
        <Content />
      </article>
    </BlogLayout>
  );
}
