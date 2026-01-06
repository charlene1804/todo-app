interface TodoActionsProps {
    hasSelected: boolean
    hasTodos: boolean
    onDeleteSelected: () => void
    onDeleteAll: () => void
}

export function TodoActions({
    hasSelected,
    hasTodos,
    onDeleteSelected,
    onDeleteAll,
}: TodoActionsProps) {
    return (
        <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
            <button onClick={onDeleteSelected} disabled={!hasSelected}>
                選択削除
            </button>
            <button onClick={onDeleteAll} disabled={!hasTodos}>
                全削除
            </button>
        </div>
    )
}

