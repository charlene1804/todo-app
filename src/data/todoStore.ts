import type { Todo } from "../types/todo"

const STORAGE_KEY = "todos"

interface LegacyTodo {
    id: number
    text: string
    selected: boolean
}

function isLegacyTodo(value: unknown): value is LegacyTodo {
    if (typeof value !== "object" || value === null) return false
    const o = value as Record<string, unknown>
    return (
        typeof o.text === "string" &&
        typeof o.selected === "boolean" &&
        typeof o.id === "number"
    )
}

function normalizeTodo(value: unknown): Todo | null {
    if (typeof value !== "object" || value === null) return null
    if (isLegacyTodo(value)) {
        return {
            id: String(value.id),
            title: value.text,
            completed: value.selected,
        }
    }
    const o = value as Record<string, unknown>
    if (
        typeof o.id === "string" &&
        typeof o.title === "string" &&
        typeof o.completed === "boolean"
    ) {
        return { id: o.id, title: o.title, completed: o.completed }
    }
    return null
}

function readRaw(): unknown[] {
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY)
        if (!raw) return []
        const parsed = JSON.parse(raw) as unknown
        return Array.isArray(parsed) ? parsed : []
    } catch {
        return []
    }
}

function writeTodos(todos: Todo[]): void {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
}

export function listTodos(): Todo[] {
    const raw = readRaw()
    const normalized = raw
        .map(normalizeTodo)
        .filter((t): t is Todo => t !== null)
    const stored = window.localStorage.getItem(STORAGE_KEY)
    const serialized = JSON.stringify(normalized)
    if (stored !== serialized) {
        writeTodos(normalized)
    }
    return normalized
}

export function createTodo(title: string): Todo {
    const trimmed = title.trim()
    if (!trimmed) {
        throw new Error("Title is required")
    }
    const todo: Todo = {
        id: crypto.randomUUID(),
        title: trimmed,
        completed: false,
    }
    const todos = [...listTodos(), todo]
    writeTodos(todos)
    return todo
}

export function updateTodo(
    id: string,
    patch: Partial<Pick<Todo, "title" | "completed">>
): Todo | undefined {
    const todos = listTodos()
    let updated: Todo | undefined
    const next = todos.map((t) => {
        if (t.id !== id) return t
        updated = { ...t, ...patch }
        return updated
    })
    if (updated) writeTodos(next)
    return updated
}

export function removeTodo(id: string): void {
    writeTodos(listTodos().filter((t) => t.id !== id))
}

export function removeTodosWhere(
    predicate: (todo: Todo) => boolean
): void {
    writeTodos(listTodos().filter((t) => !predicate(t)))
}

export function clearTodos(): void {
    writeTodos([])
}
