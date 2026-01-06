import { useState } from "react"

interface TodoInputProps {
    onAdd: (text: string) => void
}

export function TodoInput({ onAdd }: TodoInputProps) {
    const [text, setText] = useState("")

    const handleSubmit = () => {
        onAdd(text)
        setText("")
    }

    return (
        <div style={{ display: "flex", gap: "0.5rem" }}>
            <input
                type="text"
                value={text}
                onChange={(event) => setText(event.target.value)}
                onKeyDown={(event) => {
                    if (event.key === "Enter") {
                        handleSubmit()
                    }
                }}
                placeholder="ここにTODOを入力"
                style={{ flex: 1 }}
            />
            <button onClick={handleSubmit}>追加</button>
        </div>
    )
}

