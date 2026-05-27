import styles from "./TodoActions.module.css"

interface TodoActionsProps {
    hasSelected: boolean
    hasTodos: boolean
    onDeleteSelected: () => void | Promise<void>
    onDeleteAll: () => void | Promise<void>
    disabled?: boolean
}

export function TodoActions({
    hasSelected,
    hasTodos,
    onDeleteSelected,
    onDeleteAll,
    disabled,
}: TodoActionsProps) {
    const d = Boolean(disabled)
    return (
        <div className={styles.actionsContainer}>
            <button
                type="button"
                onClick={() => void onDeleteSelected()}
                disabled={d || !hasSelected}
                className={`${styles.actionButton} ${styles.deleteSelectedButton}`}
            >
                選択削除
            </button>
            <button
                type="button"
                onClick={() => void onDeleteAll()}
                disabled={d || !hasTodos}
                className={`${styles.actionButton} ${styles.deleteAllButton}`}
            >
                全削除
            </button>
        </div>
    )
}
