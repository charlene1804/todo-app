import { useState } from "react"

export function useLocalStorage<StoredValue>(
    key: string,
    initialValue: StoredValue
) {
    const [storedValue, setStoredValue] = useState<StoredValue>(() => {
        try {
            const item = window.localStorage.getItem(key)
            return item ? JSON.parse(item) : initialValue
        } catch (error) {
            return initialValue
        }
    })

    const setValue = (
        value: StoredValue | ((previousValue: StoredValue) => StoredValue)
    ) => {
        try {
            const valueToStore =
                value instanceof Function ? value(storedValue) : value
            setStoredValue(valueToStore)
            window.localStorage.setItem(key, JSON.stringify(valueToStore))
        } catch (error) {
            console.error(error)
        }
    }

    return [storedValue, setValue] as const
}

