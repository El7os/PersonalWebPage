import DecryptText from '@/components/DecryptText';
import { withBasePath } from '@/lib/basePath';
export default function About() {
    const skills = [
        { category: "Languages", items: ["C++", "Python"] },
        { category: "Engines", items: ["Unreal Engine (4 & 5)"] },
        { category: "Tools", items: ["Visual Studio", "Rider", "Git", "RenderDoc"] },
        { category: "Specialties", items: ["Engine Architecture", "Rendering Pipeline", "Memory Optimization", "Multi-threading", "Gameplay Programming"] },
    ];

    return (
        <div className="container" style={{ padding: '4rem 2rem', maxWidth: '1000px' }}>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(300px, 1fr) 2fr',
                gap: '4rem',
                alignItems: 'start'
            }}>

                {/* Sidebar / Photo Area */}
                <div style={{ position: 'sticky', top: '100px' }}>
                    <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
                        <div style={{
                            width: '150px',
                            height: '150px',
                            borderRadius: '50%',
                            backgroundColor: '#1a1a1a',
                            margin: '0 auto 1.5rem auto',
                            border: '2px solid var(--accent-color)',
                            backgroundImage: `url("${withBasePath('/ProfilePhoto.jpg')}")`,
                            backgroundSize: 'cover'
                        }} />
                        <h2 style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '0.5rem' }}>Game Programmer</h2>
                        <p className="text-muted" style={{ marginBottom: '1.5rem' }}>Istanbul, Turkey</p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <a href="mailto:yahyaarb@outlook.com" className="btn btn-outline" style={{ display: 'block' }}>Email Me</a>
                            <a href="#" className="btn btn-primary" style={{ display: 'block' }}>Download Resume (PDF)</a>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div>
                    <h1 className="heading-primary" style={{ marginBottom: '2rem' }}><DecryptText text="About Me" /></h1>

                    <div className="glass-panel" style={{ padding: '2.5rem', marginBottom: '3rem' }}>
                        <h3 style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '1rem', fontWeight: 'bold' }}>Background</h3>
                        <p className="text-muted" style={{ marginBottom: '1.5rem', lineHeight: '1.8' }}>
                            I am a gameplay and engine programmer who loves writing in C++ and building high-performance systems for real-time applications. My journey started with creating my own gameplay systems and architectures.
                        </p>
                        <p className="text-muted" style={{ lineHeight: '1.8' }}>
                            Currently, I focus primarily on Unreal Engine development, bridging the gap between low-level memory optimizations and high-level gameplay programming.
                        </p>
                    </div>

                    <h2 className="heading-secondary" style={{ marginBottom: '1.5rem', fontSize: '2rem' }}>Technical Skills</h2>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                        gap: '1.5rem',
                        marginBottom: '4rem'
                    }}>
                        {skills.map((skillGroup) => (
                            <div key={skillGroup.category} className="glass-panel" style={{ padding: '1.5rem' }}>
                                <h4 style={{ color: 'var(--accent-color)', marginBottom: '1rem', fontSize: '1.1rem', fontWeight: '600' }}>
                                    {skillGroup.category}
                                </h4>
                                <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
                                    {skillGroup.items.map(item => (
                                        <li key={item} style={{ color: '#ccc', marginBottom: '0.5rem', fontSize: '0.95rem' }}>
                                            • {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    <h2 className="heading-secondary" style={{ marginBottom: '1.5rem', fontSize: '2rem' }}>Experience</h2>
                    <div className="glass-panel" style={{ padding: '2.5rem' }}>
                        {/* Experience Item */}
                        <div style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '2rem', marginBottom: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.5rem' }}>
                                <h3 style={{ fontSize: '1.3rem', color: '#fff', fontWeight: 'bold' }}>Gameplay Programmer</h3>
                                <span className="text-muted" style={{ fontSize: '0.9rem' }}>2024 - Present</span>
                            </div>
                            <h4 style={{ color: 'var(--accent-color)', marginBottom: '1rem', fontSize: '1rem' }}>Motion Blur</h4>
                            <p className="text-muted" style={{ lineHeight: '1.6' }}>
                                My core responsibilities involved engineering custom engine-level features alongside implementing robust gameplay systems. Beyond feature development, I focused heavily on deep engine customization and performance optimization, which included modifying the Unreal render pipeline to hit specific technical targets and customizing the nav-mesh to support complex AI pathfinding and navigation requirements.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
