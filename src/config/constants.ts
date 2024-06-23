const profile = {
  name: 'Benjamin Fazli',
  title: 'Benjamin Fazli | Software Engineer',
  description: 'Expresing my thoughts and ideas through code and writing.',
  image: '/images/cover.png',
  username: 'oedotme',
  links: {
    email: 'mailto:oedotme@gmail.com',
    github: 'https://github.com/oedotme',
    twitter: 'https://twitter.com/oedotme',
    linkedin: 'https://linkedin.com/in/oedotme',
  }
}

export const constants = {
  profile,
  site: import.meta.env.SITE,

  links: {
    internal: [
      { name: 'Home', link: '/' },
      { name: 'Blog', link: '/blog' }
    ],
    external: [
      { name: 'Email', link: profile.links.email },
      { name: 'GitHub', link: profile.links.github },
      { name: 'Twitter', link: profile.links.twitter },
      { name: 'LinkedIn', link: profile.links.linkedin },
    ]
  }
}
