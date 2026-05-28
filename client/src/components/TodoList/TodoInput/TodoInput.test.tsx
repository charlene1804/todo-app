import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { TodoInput } from "."

describe("TodoInput", () => {
    it("calls onAdd and clears input when add succeeds", async () => {
        const user = userEvent.setup()
        const onAdd = vi.fn(() => true)
        render(<TodoInput onAdd={onAdd} />)
        const input = screen.getByPlaceholderText("ここにTODOを入力")
        await user.type(input, "Buy milk")
        await user.click(screen.getByRole("button", { name: "追加" }))
        expect(onAdd).toHaveBeenCalledWith("Buy milk")
        expect(input).toHaveValue("")
    })

    it("calls onAdd on Enter", async () => {
        const user = userEvent.setup()
        const onAdd = vi.fn(() => true)
        render(<TodoInput onAdd={onAdd} />)
        const input = screen.getByPlaceholderText("ここにTODOを入力")
        await user.type(input, "Walk dog{Enter}")
        expect(onAdd).toHaveBeenCalledWith("Walk dog")
    })

    it("keeps input when onAdd returns false", async () => {
        const user = userEvent.setup()
        const onAdd = vi.fn(() => false)
        render(<TodoInput onAdd={onAdd} />)
        const input = screen.getByPlaceholderText("ここにTODOを入力")
        await user.type(input, "Keep me")
        await user.click(screen.getByRole("button", { name: "追加" }))
        expect(onAdd).toHaveBeenCalledWith("Keep me")
        expect(input).toHaveValue("Keep me")
    })

    it("does not call onAdd when disabled", async () => {
        const user = userEvent.setup()
        const onAdd = vi.fn(() => true)
        render(<TodoInput onAdd={onAdd} disabled />)
        const input = screen.getByPlaceholderText("ここにTODOを入力")
        await user.type(input, "Nope")
        await user.click(screen.getByRole("button", { name: "追加" }))
        expect(onAdd).not.toHaveBeenCalled()
    })
})
