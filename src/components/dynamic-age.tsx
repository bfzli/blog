import type { DynamicAgeProps } from '@/types/Types'

import confetti from 'canvas-confetti'

import { createSignal, onMount, onCleanup } from 'solid-js'
import { calculateAge, formatAge } from '@/utils/age'

export const DynamicAge = (props: DynamicAgeProps) => {
    const birthDate = typeof props.birthDate === 'string' ? new Date(props.birthDate) : props.birthDate
    
    const [age, setAge] = createSignal(calculateAge(birthDate))

    const triggerConfetti = () => {
        const duration = 5000
        const animationEnd = Date.now() + duration
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

        function randomInRange(min: number, max: number) {
            return Math.random() * (max - min) + min
        }

        const interval: NodeJS.Timeout = setInterval(function() {
            const timeLeft = animationEnd - Date.now()

            if (timeLeft <= 0) {
                return clearInterval(interval)
            }

            const particleCount = 50 * (timeLeft / duration)
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
            })
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
            })
        }, 250)
    }

    onMount(() => {
        let frameId: number

        const tick = () => {
            setAge(calculateAge(birthDate))
            frameId = requestAnimationFrame(tick)
        }

        frameId = requestAnimationFrame(tick)

        const checkBirthday = () => {
            const now = new Date()
            const isBirthday = now.getMonth() === birthDate.getMonth() && now.getDate() === birthDate.getDate()
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

            if (isBirthday && !prefersReducedMotion) triggerConfetti()
        }

        checkBirthday()
        const birthdayInterval = setInterval(checkBirthday, 60000)

        onCleanup(() => {
            cancelAnimationFrame(frameId)
            clearInterval(birthdayInterval)
        })
    })

    return <span class="font-mono text-[0.875rem]">
        {formatAge(age())}
    </span>
}