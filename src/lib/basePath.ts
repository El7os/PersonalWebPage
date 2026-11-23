// The site may be served from a sub-path (e.g. https://<user>.github.io/PersonalWebPage).
// next/link adds that prefix automatically, but plain <img> tags, CSS url() values and
// next/image string sources do not, so absolute asset paths must go through withBasePath.
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export function withBasePath(path: string): string {
    return path.startsWith('/') && !path.startsWith('//') ? `${basePath}${path}` : path;
}
