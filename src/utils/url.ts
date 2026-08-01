export const cleanPath = (pathname: string) => {
    const path = pathname.replace(/index\.html$/, '').replace(/\.html$/, '')

    return path === '' ? '/' : path
}

export const markdownPath = (pathname: string) => {
    const path = cleanPath(pathname)

    return path === '/' ? '/index.md' : `${path}.md`
}