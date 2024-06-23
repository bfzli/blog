const profile = {
  name: 'Benjamin Fazli',
  title: 'Benjamin Fazli | Software Engineer',
  description: 'Expresing my thoughts and ideas through code and writing.',
  image: '/images/cover.webp',
  username: 'oedotme',
  links: {
    email: 'mailto:oedotme@gmail.com',
    github: 'https://github.com/bfzli',
    twitter: 'https://twitter.com/bfzli',
  }
}

export const constants = {
  profile,
  site: 'https://bfzli.com/',
  links: {
    external: [
      { name: 'Email', link: profile.links.email },
      { name: 'GitHub', link: profile.links.github },
      { name: 'X', link: profile.links.twitter }
    ]
  }
}
