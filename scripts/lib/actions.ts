import fs from 'node:fs'

export const setOutput = (name: string, value: string) => {
    const file = process.env.GITHUB_OUTPUT

    if (!file) return

    const delimiter = `ghadelimiter_${name}`

    fs.appendFileSync(file, `${name}<<${delimiter}\n${value}\n${delimiter}\n`)
}