import type { TodoItem as TodoItemType } from "../../hooks/useTodos"
import styles from "./TodoItem.module.css"

interface TodoItemProps {
    todo: TodoItemType
    onToggle: (id: number) => void
    onDelete: (id: number) => void
}

export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
    return (
        <li className={styles.todoItem}>
            <input
                type="checkbox"
                checked={todo.selected}
                onChange={() => onToggle(todo.id)}
                className={styles.checkbox}
            />
            <span
                className={`${styles.todoText} ${todo.selected ? styles.todoTextSelected : ""
                    }`}
            >
                {todo.text}
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

