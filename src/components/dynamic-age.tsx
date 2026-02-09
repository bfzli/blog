import { createSignal, onMount, onCleanup } from 'solid-js'
import { calculateAge, formatAge } from '@/utils/age'
import confetti from 'canvas-confetti'

interface DynamicAgeProps {
    birthDate: string | Date
}

export const DynamicAge = (props: DynamicAgeProps) => {
    const birthDate = typeof props.birthDate === 'string' ? new Date(props.birthDate) : props.birthDate
    const [age, setAge] = createSignal(calculateAge(birthDate))
    const STORAGE_KEY = 'bfzli-25th-birthday-confetti'

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
        let animationFrameId: number

        const updateAge = () => {
            const currentAge = calculateAge(birthDate)
            setAge(currentAge)

            const now = new Date()
            const currentMonth = now.getMonth()
            const currentDay = now.getDate()
            const birthMonth = birthDate.getMonth()
            const birthDay = birthDate.getDate()

            const isBirthday = currentMonth === birthMonth && currentDay === birthDay
            const is25thBirthday = currentAge >= 25.0 && currentAge < 26.0

            if (isBirthday && is25thBirthday) {
                const lastTriggered = localStorage.getItem(STORAGE_KEY)
                const today = now.toDateString()

                if (lastTriggered !== today) {
                    localStorage.setItem(STORAGE_KEY, today)
                    triggerConfetti()
                }
            } else {
                const lastTriggered = localStorage.getItem(STORAGE_KEY)
                if (lastTriggered) {
                    const birthday2026 = new Date(2026, birthMonth, birthDay + 1)
                    
                    if (now > birthday2026) {
                        localStorage.removeItem(STORAGE_KEY)
                    }
                }
            }

            animationFrameId = requestAnimationFrame(updateAge)
        }

        animationFrameId = requestAnimationFrame(updateAge)

        onCleanup(() => {
            cancelAnimationFrame(animationFrameId)
        })
    })

    return <span class="font-mono text-[0.875rem]">{formatAge(age())}</span>
}

