import { useTodos } from "../../hooks/useTodos"
import { TodoInput } from "./TodoInput"
import { TodoItem } from "./TodoItem"
import { TodoActions } from "./TodoActions"
import styles from "./TodoList.module.css"

export default function TodoList() {
    const {
        todos,
        isLoading,
        error,
        isAuthenticated,
        hasApiUrl,
        addTodo,
        toggleTodo,
        deleteTodo,
        deleteSelected,
        deleteAll,
        hasSelected,
        interactionsDisabled,
    } = useTodos()

    const showLoginHint =
        hasApiUrl && !isAuthenticated && !isLoading && !error

    return (
        <div className={styles.container}>
            {error ? (
                <p className={styles.statusMessage} role="alert">
                    {error}
                </p>
            ) : null}
            {isLoading ? (
                <p className={styles.statusMessage}>読み込み中...</p>
            ) : null}
            {showLoginHint ? (
                <p className={styles.statusMessage}>ログインしてください</p>
            ) : null}

            <TodoInput onAdd={addTodo} disabled={interactionsDisabled} />

            <ul className={styles.todoList}>
                {todos.map((todoItem) => (
                    <TodoItem
                        key={todoItem.id}
                        todo={todoItem}
                        onToggle={toggleTodo}
                        onDelete={deleteTodo}
                        disabled={interactionsDisabled}
                    />
                ))}
            </ul>

            <TodoActions
                hasSelected={hasSelected}
                hasTodos={todos.length > 0}
                onDeleteSelected={deleteSelected}
                onDeleteAll={deleteAll}
                disabled={interactionsDisabled}
            />
        </div>
    )
}
