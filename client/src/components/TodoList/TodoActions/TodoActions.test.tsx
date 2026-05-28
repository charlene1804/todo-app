import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { TodoActions } from "."

describe("TodoActions", () => {
    it("calls onDeleteSelected when enabled", async () => {
        const user = userEvent.setup()
        const onDeleteSelected = vi.fn()
        render(
            <TodoActions
                hasSelected
                hasTodos
                onDeleteSelected={onDeleteSelected}
                onDeleteAll={vi.fn()}
            />
        )
        await user.click(screen.getByRole("button", { name: "選択削除" }))
        expect(onDeleteSelected).toHaveBeenCalledOnce()
    })

    it("calls onDeleteAll when enabled", async () => {
        const user = userEvent.setup()
        const onDeleteAll = vi.fn()
        render(
            <TodoActions
                hasSelected={false}
                hasTodos
                onDeleteSelected={vi.fn()}
                onDeleteAll={onDeleteAll}
            />
        )
        await user.click(screen.getByRole("button", { name: "全削除" }))
        expect(onDeleteAll).toHaveBeenCalledOnce()
    })

    it("disables delete selected when nothing is selected", () => {
        render(
            <TodoActions
                hasSelected={false}
                hasTodos
                onDeleteSelected={vi.fn()}
                onDeleteAll={vi.fn()}
            />
        )
        expect(screen.getByRole("button", { name: "選択削除" })).toBeDisabled()
        expect(screen.getByRole("button", { name: "全削除" })).toBeEnabled()
    })

    it("disables delete all when there are no todos", () => {
        render(
            <TodoActions
                hasSelected={false}
                hasTodos={false}
                onDeleteSelected={vi.fn()}
                onDeleteAll={vi.fn()}
            />
        )
        expect(screen.getByRole("button", { name: "全削除" })).toBeDisabled()
    })

    it("disables both actions when disabled prop is set", () => {
        render(
            <TodoActions
                hasSelected
                hasTodos
                onDeleteSelected={vi.fn()}
                onDeleteAll={vi.fn()}
                disabled
            />
        )
        expect(screen.getByRole("button", { name: "選択削除" })).toBeDisabled()
        expect(screen.getByRole("button", { name: "全削除" })).toBeDisabled()
    })
})
