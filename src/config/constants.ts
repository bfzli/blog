const profile = {
  name: 'Benjamin Fazli',
  title: 'Benjamin Fazli | Software Engineer',
  description: 'Expresing my thoughts and ideas through code and writing.',
  image: '/images/generals/cover.webp',
  username: 'bfzli',
  links: {
    email: 'mailto:bfzli@hotmail.com',
    github: 'https://github.com/bfzli',
    twitter: 'https://twitter.com/bfzli',
    resume: 'https://bfzli.com/me.pdf',
    linkedIn: 'https://www.linkedin.com/in/benjaminfzl'
  }
}

export const constants = {
  profile,
  site: 'https://bfzli.com/',
  links: {
    external: [
      { name: 'Email', link: profile.links.email },
      { name: 'Resume', link: profile.links.resume },
      { name: 'LinkedIn', link: profile.links.linkedIn },
      { name: 'GitHub', link: profile.links.github },
      { name: 'X', link: profile.links.twitter }
    ]
  }
}
