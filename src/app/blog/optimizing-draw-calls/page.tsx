import type { Metadata } from 'next';
import BlogLayout from '@/components/BlogLayout';
import Content from './content.mdx';

export const metadata: Metadata = {
  title: 'Optimizing Draw Calls in Unreal Engine 5',
  description: 'Exploring techniques to batch draw calls in Unreal Engine 5 using custom C++ render passes.',
};

export default function Page() {
  return (
    <BlogLayout>
      <article className="blog-content" style={{ maxWidth: '860px', margin: '0 auto', padding: '2rem' }}>
        <Content />
      </article>
    </BlogLayout>
  );
}
