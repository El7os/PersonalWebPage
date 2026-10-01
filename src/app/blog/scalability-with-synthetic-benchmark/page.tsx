import type { Metadata } from 'next';
import BlogLayout from '@/components/BlogLayout';
import Content from './content.mdx';

export const metadata: Metadata = {
  title: 'Scalability With Synthetic Benchmark in Unreal Engine',
  description: 'How Unreal Engine benchmarks the CPU and GPU, turns the results into performance indices and maps them onto scalability settings.',
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
