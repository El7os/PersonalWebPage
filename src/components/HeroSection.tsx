import Image from 'next/image';

export default function HeroSection() {
    return (
        <div className="container" style={{ maxWidth: 'calc(50% + 600px)', paddingTop: '8rem', paddingBottom: '4rem' }}>
            <section style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'flex-start',
                justifyContent: 'center',
                gap: '4rem',
                padding: '2rem 0',
            }}>
                {/* Photo */}
                <div style={{
                    flex: '0 1 340px',
                    aspectRatio: '1 / 1',
                    position: 'relative',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    border: '1px solid rgba(0, 255, 65, 0.35)',
                    boxShadow: '0 0 40px rgba(0, 255, 65, 0.12), var(--glass-shadow)',
                }}>
                    <Image
                        src="/ProfilePhoto.jpg"
                        alt="Portrait"
                        fill
                        sizes="340px"
                        priority
                        style={{ objectFit: 'cover' }}
                    />
                </div>

                {/* Intro */}
                <div style={{ flex: '1 1 420px', maxWidth: '820px' }}>
                    <h1 className="heading-primary" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', lineHeight: 1.15, marginTop: '-0.28em' }}>E. Yahya Arabacı</h1>

                    <p className="text-muted" style={{ marginBottom: '2rem' }}>
                        Designing immersive gameplay experiences with C++ in Unreal Engine, blending powerful logic with premium web presentations.
                    </p>

                    <div className="mono" style={{ fontSize: '0.85rem', color: 'var(--accent-color)', marginBottom: '0.75rem' }}>
                        <span aria-hidden="true" style={{ opacity: 0.6 }}>{'// '}</span>this site
                    </div>
                    <p style={{ color: 'rgba(255, 255, 255, 0.85)', lineHeight: 1.8, marginBottom: '2.5rem' }}>
                        This is my personal corner of the web, where I write about Unreal Engine internals, rendering and
                        performance. Each post is a deep dive into a system I have studied or built, written up so it can save
                        other developers the time it took me to figure it out.
                    </p>

                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <a href="/blog" className="btn btn-primary">Read Research Blog</a>
                        <a href="/about" className="btn btn-outline">More About Me</a>
                    </div>
                </div>
            </section>
        </div>
    );
}
