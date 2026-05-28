import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { TodoItem } from "."

describe("TodoItem", () => {
    it("renders title and calls onToggle", async () => {
        const user = userEvent.setup()
        const onToggle = vi.fn()
        render(
            <TodoItem
                todo={{ id: "1", title: "Buy milk", completed: false }}
                onToggle={onToggle}
                onDelete={vi.fn()}
            />
        )
        expect(screen.getByText("Buy milk")).toBeInTheDocument()
        await user.click(screen.getByRole("checkbox"))
        expect(onToggle).toHaveBeenCalledWith("1")
    })

    it("calls onDelete when delete is clicked", async () => {
        const user = userEvent.setup()
        const onDelete = vi.fn()
        render(
            <TodoItem
                todo={{ id: "2", title: "Walk dog", completed: true }}
                onToggle={vi.fn()}
                onDelete={onDelete}
            />
        )
        await user.click(screen.getByRole("button", { name: "削除" }))
        expect(onDelete).toHaveBeenCalledWith("2")
    })
})
