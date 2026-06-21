export default function Portfolio() {
    const projects = [
        {
            id: "nebula",
            title: "Project Nebula",
            category: "C++ Game Engine",
            description: "A high-performance ECS based game engine prototype built inside Unreal Engine.",
            image: "https://via.placeholder.com/600x400/1a1a1a/00ffcc?text=Project+Nebula",
            link: "/portfolio/nebula"
        },
        {
            id: "shadow-realm",
            title: "Shadow Realm",
            category: "Action RPG",
            description: "A dark-fantasy action RPG showcasing advanced AI state machines and custom shaders.",
            image: "https://via.placeholder.com/600x400/1a1a1a/00ffcc?text=Shadow+Realm",
            link: "/portfolio/shadow-realm"
        },
        {
            id: "fps-core",
            title: "FPS Core Framework",
            category: "Unreal Plugin",
            description: "A robust first-person shooter framework featuring generic weapon systems and netcode.",
            image: "https://via.placeholder.com/600x400/1a1a1a/00ffcc?text=FPS+Core",
            link: "/portfolio/fps-core"
        }
    ];

    return (
        <div className="container" style={{ padding: '4rem 2rem' }}>
            <h1 className="heading-primary" style={{ textAlign: 'center', marginBottom: '1rem' }}>Portfolio</h1>
            <p className="text-muted" style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 4rem auto' }}>
                A selection of my best game development projects, Unreal Engine tools, and C++ systems.
            </p>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '2.5rem'
            }}>
                {projects.map((project) => (
                    <div key={project.id} className="glass-panel" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                        <div style={{
                            height: '240px',
                            backgroundColor: '#1a1a1a',
                            backgroundImage: `url(${project.image})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        }} />
                        <div style={{ padding: '2rem' }}>
                            <div style={{ fontSize: '0.85rem', color: 'var(--accent-color)', marginBottom: '0.5rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                {project.category}
                            </div>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#fff' }}>
                                {project.title}
                            </h3>
                            <p className="text-muted" style={{ marginBottom: '2rem', fontSize: '1rem', lineHeight: '1.5' }}>
                                {project.description}
                            </p>
                            <a href={project.link} className="btn btn-outline" style={{ display: 'block', textAlign: 'center' }}>
                                View Project
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
