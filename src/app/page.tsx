import HeroSection from '@/components/HeroSection';

export default function Home() {
  return (
    <div style={{ paddingBottom: '4rem' }}>
      <HeroSection />

      <section className="container" style={{ marginTop: '2rem' }}>
        <h3 className="heading-secondary" style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '3rem' }}>
          Recent Projects & Research
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem'
        }}>
          {/* Mock Project 1 */}
          <div className="glass-panel" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ height: '200px', backgroundColor: '#1a1a1a', backgroundImage: 'url("https://via.placeholder.com/600x400/1a1a1a/00ffcc?text=Unreal+Engine+Game")', backgroundSize: 'cover' }} />
            <div style={{ padding: '1.5rem' }}>
              <h4 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#fff' }}>Project Nebula C++</h4>
              <p className="text-muted" style={{ marginBottom: '1.5rem', fontSize: '0.9rem' }}>A high-performance ECS based game engine prototype built inside Unreal Engine.</p>
              <a href="/portfolio/nebula" className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}>View Details</a>
            </div>
          </div>

          {/* Mock Blog Post 1 */}
          <div className="glass-panel" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ height: '200px', backgroundColor: '#111', backgroundImage: 'url("https://via.placeholder.com/600x400/111/00ffcc?text=Rendering+Research")', backgroundSize: 'cover' }} />
            <div style={{ padding: '1.5rem' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--accent-color)', marginBottom: '0.5rem', fontWeight: 'bold' }}>RESEARCH</div>
              <h4 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#fff' }}>Optimizing Draw Calls</h4>
              <p className="text-muted" style={{ marginBottom: '1.5rem', fontSize: '0.9rem' }}>Exploring techniques to batch draw calls in Unreal Engine 5 using custom C++ render passes.</p>
              <a href="/blog/optimizing-draw-calls" className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}>Read Article</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
