export const isoDate = (value: string | Date) => {
    const date = typeof value === 'string' ? new Date(value) : value
    const pad = (part: number) => String(part).padStart(2, '0')

    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}