import type { Todo } from "../types/todo"
import { apiJson } from "./http"

type TodoRow = {
    id: string
    title: string
    completed: boolean
    createdAt?: string
}

function toTodo(row: TodoRow): Todo {
    return {
        id: row.id,
        title: row.title,
        completed: row.completed,
    }
}

export async function listTodos(): Promise<Todo[]> {
    const rows = await apiJson<TodoRow[]>("GET", "/todos")
    return rows.map(toTodo)
}

export async function createTodo(title: string): Promise<Todo> {
    const row = await apiJson<TodoRow>("POST", "/todos", { title })
    return toTodo(row)
}

export async function patchTodo(
    id: string,
    patch: { title?: string; completed?: boolean }
): Promise<Todo> {
    const row = await apiJson<TodoRow>("PATCH", `/todos/${encodeURIComponent(id)}`, patch)
    return toTodo(row)
}

export async function deleteTodo(id: string): Promise<void> {
    await apiJson<void>("DELETE", `/todos/${encodeURIComponent(id)}`)
}
