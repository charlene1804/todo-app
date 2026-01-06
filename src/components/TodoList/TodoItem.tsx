import type { TodoItem as TodoItemType } from "../../hooks/useTodos"

interface TodoItemProps {
    todo: TodoItemType
    onToggle: (id: number) => void
    onDelete: (id: number) => void
}

export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
    return (
        <li
            style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginBottom: "0.5rem",
            }}
        >
            <input
                type="checkbox"
                checked={todo.selected}
                onChange={() => onToggle(todo.id)}
            />
            <span>{todo.text}</span>
            <button onClick={() => onDelete(todo.id)}>削除</button>
        </li>
    )
}

