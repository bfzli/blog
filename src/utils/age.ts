export function calculateAge(birthDate: Date): number {
    const now = new Date()
    const diff = now.getTime() - birthDate.getTime()
    const years = diff / (1000 * 60 * 60 * 24 * 365.25)
    return years
}

export function formatAge(age: number): string {
    return age.toFixed(11)
}



