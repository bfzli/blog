const fs = require('fs')
const path = require('path')
const dotenv = require('dotenv')
const sharp = require('sharp')

dotenv.config()

const postsImagePath = path.join(__dirname, '../public/images/posts')
const mdxPostsPath = path.join(__dirname, '../src/content/posts')

const GenerateScreenshots = () => {
    const secret = process.env.SECRET_API_KEY

    if (secret) {
        fs.readdir(postsImagePath, (_, files) => {
            if (files) {
                files.forEach(file => {
                    fs.unlink(path.join(postsImagePath, file), err => {
                        if (!err) console.log('File deleted', file)
                    })
                })
            }
        })

        fs.readdir(mdxPostsPath, (_, files) => {
            if (files) {
                files.forEach(async (file) => {
                    const fileFormatted = file.replace('.mdx', '')
                    const readFile = fs.readFileSync(path.join(mdxPostsPath, `${fileFormatted}.mdx`), 'utf-8')
                    
                    const titlePattern = /title:\s*(.*)/
                    const descriptionPattern = /description:\s*(.*)/

                    const titleMatch = readFile.match(titlePattern)
                    const descriptionMatch = readFile.match(descriptionPattern)

                    const title = titleMatch ? titleMatch[1] : null
                    const description = descriptionMatch ? descriptionMatch[1] : null
                    
                    if (title && description) {
                        const url = process.env.URL2IMAGE_URL

                        const req = await fetch(`${url}/api/utils/template-to-image`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                templateId: "669e5aa29b9e4133ada86e31",
                                secret: "sAeQW9rp55lkiUp",
                                changes: {
                                    title: title?.replace(/"/g, ''),
                                    description: description?.replace(/"/g, ''),
                                },
                            })
                        })

                        const res = await req.json()

                        if (res) {
                            const { success, data } = res

                            if (success && data) {
                                const bufferData = Buffer.from(data, 'base64')
                                const bufferSharp = await sharp(bufferData).toBuffer()

                                fs.writeFile(path.join(postsImagePath, `${fileFormatted}.webp`), bufferSharp, (err) => {
                                    if (!err) console.log('File created', `${fileFormatted}.webp`)
                                })
                            }
                        }
                    }
                })
            }
        })
    }
    
}

GenerateScreenshots()