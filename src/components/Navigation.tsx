'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Portfolio', path: '/portfolio' },
        { name: 'Blog', path: '/blog' },
        { name: 'About', path: '/about' },
    ];

    return (
        <>
            <nav style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 100,
                background: 'var(--glass-bg)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                borderBottom: '1px solid var(--glass-border)',
                height: '70px',
                display: 'flex',
                alignItems: 'center'
            }}>
                <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#fff' }}>
                        <Link href="/">DEV<span style={{ color: 'var(--accent-color)' }}>PORTFOLIO</span></Link>
                    </div>
                    <div style={{ display: 'flex', gap: '2rem' }}>
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                href={link.path}
                                style={{
                                    color: pathname === link.path ? '#fff' : 'var(--text-muted)',
                                    fontWeight: pathname === link.path ? '600' : '400',
                                    transition: 'color 0.3s ease'
                                }}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </nav>

            <main style={{ minHeight: 'calc(100vh - 100px)', paddingTop: '70px' }}>
                {children}
            </main>

            <footer style={{
                marginTop: '4rem',
                padding: '2rem 0',
                borderTop: '1px solid var(--glass-border)',
                textAlign: 'center',
                color: '#888'
            }}>
                <div className="container">
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginBottom: '1rem' }}>
                        <a href="https://github.com/El7os" target="_blank" rel="noreferrer" style={{ transition: 'color 0.3s', color: '#888' }} onMouseOver={(e) => (e.currentTarget.style.color = '#fff')} onMouseOut={(e) => (e.currentTarget.style.color = '#888')}>GitHub</a>
                        <a href="https://www.linkedin.com/in/eminyahyaarabacı/" target="_blank" rel="noreferrer" style={{ transition: 'color 0.3s', color: '#888' }} onMouseOver={(e) => (e.currentTarget.style.color = '#fff')} onMouseOut={(e) => (e.currentTarget.style.color = '#888')}>LinkedIn</a>
                    </div>
                    <p>© {new Date().getFullYear()} Personal Game Dev Portfolio. All rights reserved.</p>
                </div>
            </footer>
        </>
    );
}
