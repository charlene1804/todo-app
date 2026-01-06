import { useState } from "react"
import { useTodos } from "../hooks/useTodos"

export default function TodoList() {
    const [text, setText] = useState("")
    const {
        todos,
        addTodo: addTodoToState,
        toggleTodo,
        deleteTodo,
        deleteSelected,
        deleteAll,
        hasSelected,
    } = useTodos()

    const addTodo = () => {
        addTodoToState(text)
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
                    onKeyDown={(event) => {
                        if (event.key === "Enter") {
                            addTodo()
                        }
                    }}
                    placeholder="ここにTODOを入力"
                    style={{ flex: 1 }}
                />
                <button onClick={addTodo}>追加</button>
            </div>

            {/* タスク一覧 */}
            <ul style={{ listStyle: "none", padding: 0 }}>
                {todos.map((todoItem) => (
                    <li
                        key={todoItem.id}
                        style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}
                    >
                        <input
                            type="checkbox"
                            checked={todoItem.selected}
                            onChange={() => toggleTodo(todoItem.id)}
                        />
                        <span>{todoItem.text}</span>
                        <button onClick={() => deleteTodo(todoItem.id)}>
                            削除
                        </button>
                    </li>
                ))}
            </ul>

            {/* 削除ボタン */}
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button
                    onClick={deleteSelected}
                    disabled={!hasSelected}
                >
                    選択削除
                </button>

                <button onClick={deleteAll} disabled={!todos.length}>
                    全削除
                </button>
            </div>

        </div>
    )
}
