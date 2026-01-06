import { useState, useEffect } from "react"

interface TodoItem {
    id: number
    text: string
    selected: boolean
}

export default function TodoList() {
    const [text, setText] = useState("")
    const [todos, setTodos] = useState<TodoItem[]>(() => {
        const stored = localStorage.getItem("todos")
        return stored ? JSON.parse(stored) : []
    })

    // Save to localStorage
    useEffect(() => {
        localStorage.setItem("todos", JSON.stringify(todos))
    }, [todos])

    const addTodo = () => {
        if (!text.trim()) return
        setTodos([...todos, { id: Date.now(), text, selected: false }])
        setText("")
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {/* 入力フォーム */}
            <div style={{ display: "flex", gap: "0.5rem" }}>
                <input
                    type="text"
                    value={text}
                    onChange={(event) => setText(event.target.value)}
                    placeholder="ここにTODOを入力"
                    style={{ flex: 1 }}
                />
                <button onClick={addTodo}>追加</button>
            </div>

            {/* タスク一覧 */}
            <ul style={{ listStyle: "none", padding: 0 }}>
                {todos.map((todo) => (
                    <li
                        key={todo.id}
                        style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}
                    >
                        <input
                            type="checkbox"
                            checked={todo.selected}
                            onChange={() =>
                                setTodos(
                                    todos.map((todoItem) =>
                                        todoItem.id === todo.id ? { ...todoItem, selected: !todoItem.selected } : todoItem
                                    )
                                )
                            }
                        />
                        <span>{todo.text}</span>
                        <button
                            onClick={() => setTodos(todos.filter((todoItem) => todoItem.id !== todo.id))}
                        >
                            削除
                        </button>
                    </li>
                ))}
            </ul>

            {/* 削除ボタン */}
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button
                    onClick={() =>
                        setTodos(todos.filter((todoItem) => !todoItem.selected))
                    }
                >
                    選択削除
                </button>

                <button onClick={() => setTodos([])}>
                    全削除
                </button>
            </div>

        </div>
    )
}
