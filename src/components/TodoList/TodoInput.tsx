import { useState } from "react"
import styles from "./TodoInput.module.css"

interface TodoInputProps {
    onAdd: (text: string) => void
}

export function TodoInput({ onAdd }: TodoInputProps) {
    const [text, setText] = useState("")
    const [isComposing, setIsComposing] = useState(false)

    const handleSubmit = () => {
        onAdd(text)
        setText("")
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
                        handleSubmit()
                    }
                }}
                placeholder="ここにTODOを入力"
                className={styles.input}
            />
            <button onClick={handleSubmit} className={styles.addButton}>
                追加
            </button>
        </div>
    )
}

