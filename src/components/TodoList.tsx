import { useTodos } from "../hooks/useTodos"
import { TodoInput } from "./TodoInput"

export default function TodoList() {
    const {
        todos,
        addTodo,
        toggleTodo,
        deleteTodo,
        deleteSelected,
        deleteAll,
        hasSelected,
    } = useTodos()

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <TodoInput onAdd={addTodo} />

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
