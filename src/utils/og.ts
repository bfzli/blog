import satori from 'satori'
import sharp from 'sharp'
import fs from 'node:fs'

const boldFont = fs.readFileSync('public/fonts/dm-sans/DMSans-Bold.ttf')
const regularFont = fs.readFileSync('public/fonts/dm-sans/DMSans-Regular.ttf')
const avatarPng = sharp('src/assets/generals/avatar.webp').resize(96, 96).png()
let avatarBase64: string

function descriptionNode(description: string) {
    const text =
        description.length > 120
            ? description.slice(0, 117) + '...'
            : description
    return {
        type: 'p',
        props: {
            style: {
                fontSize: '22px',
                fontWeight: 400,
                color: '#72809a',
                marginTop: '20px',
                lineHeight: 1.5
            },
            children: text
        }
    }
}

async function getAvatar() {
    if (!avatarBase64) {
        const buf = await avatarPng.toBuffer()
        avatarBase64 = `data:image/png;base64,${buf.toString('base64')}`
    }
    return avatarBase64
}

export async function generateOgImage(
    title: string,
    description?: string
): Promise<Buffer> {
    const avatar = await getAvatar()
    const svg = await satori(
        {
            type: 'div',
            props: {
                style: {
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    padding: '80px',
                    backgroundColor: '#fcfcfc',
                    fontFamily: 'DM Sans'
                },
                children: [
                    {
                        type: 'img',
                        props: {
                            src: avatar,
                            width: 120,
                            height: 120,
                            style: {
                                borderRadius: '50%',
                                marginBottom: '32px'
                            }
                        }
                    },
                    {
                        type: 'h1',
                        props: {
                            style: {
                                fontSize: title.length > 40 ? '48px' : '56px',
                                fontWeight: 700,
                                color: '#111',
                                lineHeight: 1.2,
                                margin: 0
                            },
                            children: title
                        }
                    },
                    ...(description ? [descriptionNode(description)] : [])
                ]
            }
        },
        {
            width: 1200,
            height: 630,
            fonts: [
                {
                    name: 'DM Sans',
                    data: boldFont,
                    weight: 700,
                    style: 'normal'
                },
                {
                    name: 'DM Sans',
                    data: regularFont,
                    weight: 400,
                    style: 'normal'
                }
            ]
        }
    )

    return await sharp(Buffer.from(svg)).webp({ quality: 90 }).toBuffer()
}