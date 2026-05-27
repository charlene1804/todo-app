import { useState } from "react"
import styles from "./TodoInput.module.css"

interface TodoInputProps {
    onAdd: (text: string) => boolean | Promise<boolean>
    disabled?: boolean
}

export function TodoInput({ onAdd, disabled }: TodoInputProps) {
    const [text, setText] = useState("")
    const [isComposing, setIsComposing] = useState(false)

    const handleSubmit = async () => {
        if (disabled) return
        const trimmed = text
        const ok = await Promise.resolve(onAdd(trimmed))
        if (ok !== false) {
            setText("")
        }
    }

    return (
        <div className={styles.inputContainer}>
            <input
                type="text"
                value={text}
                onChange={(event) => setText(event.target.value)}
                onCompositionStart={() => setIsComposing(true)}
                onCompositionEnd={() => setIsComposing(false)}
                onKeyDown={(event) => {
                    if (event.key === "Enter" && !isComposing) {
                        void handleSubmit()
                    }
                }}
                placeholder="ここにTODOを入力"
                className={styles.input}
                disabled={disabled}
            />
            <button
                type="button"
                onClick={() => void handleSubmit()}
                className={styles.addButton}
                disabled={disabled}
            >
                追加
            </button>
        </div>
    )
}
