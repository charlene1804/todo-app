import { useTodos } from "../hooks/useTodos"
import { TodoInput } from "./TodoInput"
import { TodoItem } from "./TodoItem"

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

            <ul style={{ listStyle: "none", padding: 0 }}>
                {todos.map((todoItem) => (
                    <TodoItem
                        key={todoItem.id}
                        todo={todoItem}
                        onToggle={toggleTodo}
                        onDelete={deleteTodo}
                    />
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
