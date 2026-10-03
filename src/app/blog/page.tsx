import DecryptText from '@/components/DecryptText';
export default function Blog() {
    const posts = [
        {
            slug: "scalability-with-synthetic-benchmark",
            title: "Scalability With Synthetic Benchmark in Unreal Engine",
            date: "October 1, 2026",
            excerpt: "How Unreal Engine benchmarks the CPU and GPU, turns the results into performance indices and maps them onto scalability settings.",
            readTime: "8 min read"
        },
        {
            slug: "implementing-per-object-clip-planes",
            title: "Implementing Per-Object Clip Planes In Unreal Engine 5",
            date: "June 5, 2026",
            excerpt: "Extending Unreal Engine's rendering pipeline to support custom clipping planes on individual primitives.",
            readTime: "15 min read"
        }
    ];

    return (
        <div className="container" style={{ padding: '4rem 2rem', maxWidth: '900px' }}>
            <h1 className="heading-primary" style={{ marginBottom: '1rem' }}><DecryptText text="Research & Thoughts" /></h1>
            <p className="text-muted" style={{ maxWidth: '600px', marginBottom: '4rem', fontSize: '1.1rem' }}>
                Deep dives into game architecture, C++ optimization, Unreal Engine rendering techniques, and performance analysis.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {posts.map((post) => (
                    <article key={post.slug} className="glass-panel" style={{ padding: '2.5rem', transition: 'all 0.3s' }}>
                        <div className="mono" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', fontSize: '0.85rem', color: '#888' }}>
                            <span aria-hidden="true" style={{ color: 'var(--accent-color)', opacity: 0.6 }}>{'//'}</span>
                            <time>{post.date}</time>
                            <span>•</span>
                            <span>{post.readTime}</span>
                        </div>

                        <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem', color: '#fff', lineHeight: '1.2' }}>
                            <a href={`/blog/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit' }} className="hover:text-[var(--accent-color)] transition-colors">
                                {post.title}
                            </a>
                        </h2>

                        <p className="text-muted" style={{ marginBottom: '2rem', fontSize: '1.1rem', lineHeight: '1.6' }}>
                            {post.excerpt}
                        </p>

                        <a href={`/blog/${post.slug}`} style={{
                            color: 'var(--accent-color)',
                            fontWeight: '600',
                            display: 'inline-flex',
                            alignItems: 'center',
                            textDecoration: 'none'
                        }}>
                            Read Full Article
                            <span style={{ marginLeft: '0.5rem', fontSize: '1.2rem' }}>→</span>
                        </a>
                    </article>
                ))}
            </div>
        </div>
    );
}
