import { useCallback, useMemo, useState } from "react"
import {
    clearTodos,
    createTodo,
    listTodos,
    removeTodo,
    removeTodosWhere,
    updateTodo,
} from "../data/todoStore"
import type { Todo } from "../types/todo"

export type { Todo as TodoItem } from "../types/todo"

export function useTodos() {
    const [todos, setTodos] = useState<Todo[]>(() => listTodos())

    const sync = useCallback((next: Todo[]) => {
        setTodos(next)
    }, [])

    const addTodo = useCallback((text: string) => {
        if (!text.trim()) return
        try {
            createTodo(text)
            sync(listTodos())
        } catch {
            return
        }
    }, [sync])

    const toggleTodo = useCallback(
        (id: string) => {
            const current = listTodos().find((t) => t.id === id)
            if (!current) return
            updateTodo(id, { completed: !current.completed })
            sync(listTodos())
        },
        [sync]
    )

    const deleteTodo = useCallback(
        (id: string) => {
            removeTodo(id)
            sync(listTodos())
        },
        [sync]
    )

    const deleteSelected = useCallback(() => {
        removeTodosWhere((t) => t.completed)
        sync(listTodos())
    }, [sync])

    const deleteAll = useCallback(() => {
        clearTodos()
        sync(listTodos())
    }, [sync])

    const hasSelected = useMemo(
        () => todos.some((t) => t.completed),
        [todos]
    )

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
