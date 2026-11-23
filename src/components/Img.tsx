import { withBasePath } from '@/lib/basePath';

// Use <Img> in MDX instead of a literal <img>: MDX does not route literal JSX tags through
// the component registry, so a plain <img src="/..."> would miss the site's base path.
export default function Img({ src, alt = '', ...rest }: React.ImgHTMLAttributes<HTMLImageElement> & { src: string }) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={withBasePath(src)} alt={alt} {...rest} />;
}
