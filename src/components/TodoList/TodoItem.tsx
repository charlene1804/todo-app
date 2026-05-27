import type { Todo } from "../../types/todo"
import styles from "./TodoItem.module.css"

interface TodoItemProps {
    todo: Todo
    onToggle: (id: string) => void
    onDelete: (id: string) => void
}

export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
    return (
        <li className={styles.todoItem}>
            <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => onToggle(todo.id)}
                className={styles.checkbox}
            />
            <span
                className={`${styles.todoText} ${todo.completed ? styles.todoTextSelected : ""
                    }`}
            >
                {todo.title}
            </span>
            <button
                onClick={() => onDelete(todo.id)}
                className={styles.deleteButton}
            >
                削除
            </button>
        </li>
    )
}
