import HeroSection from '@/components/HeroSection';

export default function Home() {
  return (
    <div style={{ paddingBottom: '4rem' }}>
      <HeroSection />

      <section className="container" style={{ maxWidth: 'calc(50% + 600px)', marginTop: '2rem' }}>
        <h3 className="heading-secondary" style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '3rem' }}>
          Recent Research
        </h3>

        {/* Same width as the hero row above: portrait (340px) + gap (4rem) + intro (max 820px) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          maxWidth: 'calc(340px + 4rem + 820px)',
          margin: '0 auto'
        }}>
          <div className="glass-panel" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ height: '200px', backgroundColor: '#111', backgroundImage: 'url("/blog/scalability-with-synthetic-benchmark/Image_Fractal.png")', backgroundSize: 'cover', backgroundPosition: 'center' }} />
            <div style={{ padding: '1.5rem' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--accent-color)', marginBottom: '0.5rem', fontWeight: 'bold' }}>RESEARCH</div>
              <h4 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#fff' }}>Scalability With Synthetic Benchmark</h4>
              <p className="text-muted" style={{ marginBottom: '1.5rem', fontSize: '0.9rem' }}>How Unreal Engine benchmarks the CPU and GPU, turns the results into performance indices and maps them onto scalability settings.</p>
              <a href="/blog/scalability-with-synthetic-benchmark" className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}>Read Article</a>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ height: '200px', backgroundColor: '#111', backgroundImage: 'url("/blog/implementing-per-object-clip-planes/Image_Box_Clipped.jpg")', backgroundSize: 'cover', backgroundPosition: 'center' }} />
            <div style={{ padding: '1.5rem' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--accent-color)', marginBottom: '0.5rem', fontWeight: 'bold' }}>RESEARCH</div>
              <h4 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#fff' }}>Implementing Per-Object Clip Planes</h4>
              <p className="text-muted" style={{ marginBottom: '1.5rem', fontSize: '0.9rem' }}>Extending Unreal Engine&apos;s rendering pipeline to support custom clipping planes on individual primitives.</p>
              <a href="/blog/implementing-per-object-clip-planes" className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}>Read Article</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
