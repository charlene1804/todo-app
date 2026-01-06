import { useTodos } from "../../hooks/useTodos"
import { TodoInput } from "./TodoInput"
import { TodoItem } from "./TodoItem"
import { TodoActions } from "./TodoActions"
import styles from "./TodoList.module.css"

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
        <div className={styles.container}>
            <TodoInput onAdd={addTodo} />

            <ul className={styles.todoList}>
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
