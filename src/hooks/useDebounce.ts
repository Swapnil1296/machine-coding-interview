import { useEffect, useState } from 'react'

/**
 * Returns a copy of `value` that updates only after `value` has stayed
 * unchanged for `delay` milliseconds.
 * A new change clears the previous timer, so rapid updates collapse into one.
 */
export function useDebounce<T>(value: T, delay = 500): T {
    const [debouncedValue, setDebouncedValue] = useState(value)

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setDebouncedValue(value)
        }, delay)

        return () => clearTimeout(timeoutId)
    }, [value, delay])

    return debouncedValue
}
