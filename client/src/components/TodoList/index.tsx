import { useTodos } from "../../hooks/useTodos"
import { TodoInput } from "./TodoInput"
import { TodoItem } from "./TodoItem"
import { TodoActions } from "./TodoActions"
import styles from "./TodoList.module.css"

export default function TodoList() {
    const {
        todos,
        isInitialLoading,
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
        hasApiUrl && !isAuthenticated && !isInitialLoading && !error

    const statusText = error
        ? error
        : isInitialLoading
          ? "読み込み中..."
          : showLoginHint
            ? "ログインしてください"
            : ""

    return (
        <div className={styles.container}>
            <p
                className={styles.statusMessage}
                role={error ? "alert" : "status"}
                aria-live="polite"
                aria-busy={isInitialLoading}
            >
                {statusText}
            </p>

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
