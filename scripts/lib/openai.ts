import OpenAI from 'openai'

export const MODEL = 'gpt-5.4-mini'

export const logUsage = (usage?: {
    input_tokens?: number
    output_tokens?: number
    total_tokens?: number
    output_tokens_details?: { reasoning_tokens?: number }
}) => {
    if (!usage) return

    const reasoning = usage.output_tokens_details?.reasoning_tokens ?? 0

    console.log(
        `Tokens: ${usage.input_tokens ?? 0} in, ${usage.output_tokens ?? 0} out (${reasoning} reasoning), ${usage.total_tokens ?? 0} total on ${MODEL}`
    )
}

export const openai = () => {
    if (!process.env.OPENAI_API_KEY) {
        throw new Error('OPENAI_API_KEY is not set')
    }

    return new OpenAI()
}

export const VOICE = `Write technical reference posts for a software engineering blog.

The subject is the problem. Never the author.

Rules:
- No narrator and no invented experience. Never write "I hit this", "in my case", "the day it broke", "on a Tuesday deploy", "what caught me", or any story about someone encountering the problem. Nothing in the post may claim first-hand experience of an incident.
- No storytelling and no literary framing. No "the annoying part was", "the code felt innocent", no one-line dramatic paragraphs for effect, no suspense, no reveal. This is documentation, not an essay.
- No reflection or lessons learned. Do not end with how someone now thinks differently.
- Open with the exact symptom: what breaks, where it breaks, and the literal error text.
- Address the reader as "you" when giving instructions. Otherwise stay impersonal.
- No marketing language, no "in today's fast-paced world", no "dive into", no bullet-point summary of what you are about to say.
- Technical claims are specific. Name the exact error, package, version, flag or command.
- Explain the mechanism, not just the fix. The reader should understand why it happens, not only what to type.
- Short paragraphs, varied sentence length. Contractions are fine.`