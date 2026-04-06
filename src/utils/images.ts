const projectImages = import.meta.glob<{ default: ImageMetadata }>('/src/assets/projects/*.webp', { eager: true })
const experienceImages = import.meta.glob<{ default: ImageMetadata }>('/src/assets/experiences/*.webp', { eager: true })

export function getProjectImage(icon: string) {
    const filename = icon.split('/').pop()
    const key = `/src/assets/projects/${filename}`
    return projectImages[key]?.default
}

export function getExperienceImage(company: string) {
    const key = `/src/assets/experiences/${company.toLowerCase()}.webp`
    return experienceImages[key]?.default
}
