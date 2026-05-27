import type { Todo } from "../../types/todo"
import styles from "./TodoItem.module.css"

interface TodoItemProps {
    todo: Todo
    onToggle: (id: string) => void | Promise<void>
    onDelete: (id: string) => void | Promise<void>
    disabled?: boolean
}

export function TodoItem({
    todo,
    onToggle,
    onDelete,
    disabled,
}: TodoItemProps) {
    const d = Boolean(disabled)
    return (
        <li className={styles.todoItem}>
            <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => void onToggle(todo.id)}
                className={styles.checkbox}
                disabled={d}
            />
            <span
                className={`${styles.todoText} ${todo.completed ? styles.todoTextSelected : ""
                    }`}
            >
                {todo.title}
            </span>
            <button
                type="button"
                onClick={() => void onDelete(todo.id)}
                className={styles.deleteButton}
                disabled={d}
            >
                削除
            </button>
        </li>
    )
}
