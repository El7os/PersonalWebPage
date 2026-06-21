export default function HeroSection() {
    return (
        <div className="container" style={{ paddingTop: '8rem', paddingBottom: '4rem' }}>
            <section className="glass-panel" style={{ textAlign: 'center' }}>
                <h1 className="heading-primary">Unreal Developer</h1>
                <h2 className="heading-secondary" style={{ marginTop: '-1rem' }}>& Gaming Enthusiast</h2>

                <p className="text-muted" style={{ marginBottom: '2.5rem', maxWidth: '600px', margin: '0 auto 2.5rem auto' }}>
                    Designing immersive gameplay experiences with C++ in Unreal Engine, blending powerful logic with premium web presentations.
                </p>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <a href="/portfolio" className="btn btn-primary">View Portfolio</a>
                    <a href="/blog" className="btn btn-outline">Read Research Blog</a>
                </div>
            </section>
        </div>
    );
}
