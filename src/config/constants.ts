const profile = {
    name: 'Benjamin Fazli',
    title: 'Benjamin Fazli - Software Engineer',
    description: 'Expresing my thoughts and ideas through code and writing.',
    image: '/og/index.webp',
    username: 'bfzli',
    birthDate: new Date('2001-01-17'),
    links: {
        email: 'mailto:me@bfzli.com',
        github: 'https://github.com/bfzli',
        twitter: 'https://twitter.com/bfzli',
        linkedIn: 'https://www.linkedin.com/in/benjaminfzl'
    }
}

export const constants = {
    profile,
    site: 'https://bfzli.com/',
    links: {
        external: [
            { name: 'Email', link: profile.links.email },
            { name: 'LinkedIn', link: profile.links.linkedIn },
            { name: 'GitHub', link: profile.links.github },
            { name: 'X', link: profile.links.twitter }
        ]
    }
}