import { withBasePath } from '@/lib/basePath';

export default function GameVideo({ src, autoPlay = true, loop = true, muted = true, controls = false }: { src: string, autoPlay?: boolean, loop?: boolean, muted?: boolean, controls?: boolean }) {
    return (
        <div className="game-video-wrapper" style={{
            width: '100%',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: 'var(--glass-shadow)',
            margin: '2rem 0',
            background: 'var(--glass-bg)',
            border: '1px solid var(--glass-border)',
            position: 'relative'
        }}>
            <video
                src={withBasePath(src)}
                autoPlay={autoPlay}
                loop={loop}
                muted={muted}
                controls={controls}
                playsInline
                style={{
                    width: '100%',
                    display: 'block',
                    objectFit: 'cover'
                }}
            />
        </div>
    );
}
