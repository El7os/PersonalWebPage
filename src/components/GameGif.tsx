export default function GameGif({ src, alt = "Animated GIF" }: { src: string, alt?: string }) {
    return (
        <div className="game-gif-wrapper" style={{
            width: '100%',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: 'var(--glass-shadow)',
            margin: '2rem 0',
            background: 'var(--glass-bg)',
            border: '1px solid var(--glass-border)',
        }}>
            <img
                src={src}
                alt={alt}
                loading="lazy"
                style={{
                    width: '100%',
                    display: 'block',
                    objectFit: 'cover'
                }}
            />
        </div>
    );
}
