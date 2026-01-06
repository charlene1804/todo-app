import { useTodos } from "../../hooks/useTodos"
import { TodoInput } from "./TodoInput"
import { TodoItem } from "./TodoItem"
import { TodoActions } from "./TodoActions"

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

            <TodoActions
                hasSelected={hasSelected}
                hasTodos={todos.length > 0}
                onDeleteSelected={deleteSelected}
                onDeleteAll={deleteAll}
            />
        </div>
    )
}
