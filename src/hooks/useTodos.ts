import { useLocalStorage } from "./useLocalStorage"

export interface TodoItem {
    id: number
    text: string
    selected: boolean
}

export function useTodos() {
    const [todos, setTodos] = useLocalStorage<TodoItem[]>("todos", [])

    const addTodo = (text: string) => {
        if (!text.trim()) return
        setTodos([...todos, { id: Date.now(), text, selected: false }])
    }

    const toggleTodo = (id: number) => {
        setTodos(
            todos.map((todoItem) =>
                todoItem.id === id
                    ? { ...todoItem, selected: !todoItem.selected }
                    : todoItem
            )
        )
    }

    const deleteTodo = (id: number) => {
        setTodos(todos.filter((todoItem) => todoItem.id !== id))
    }

    const deleteSelected = () => {
        setTodos(todos.filter((todoItem) => !todoItem.selected))
    }

    const deleteAll = () => {
        setTodos([])
    }

    const hasSelected = todos.some((todoItem) => todoItem.selected)

    return {
        todos,
        addTodo,
        toggleTodo,
        deleteTodo,
        deleteSelected,
        deleteAll,
        hasSelected,
    }
}

