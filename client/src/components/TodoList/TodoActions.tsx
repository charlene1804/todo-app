import styles from "./TodoActions.module.css"

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
        <div className={styles.actionsContainer}>
            <button
                onClick={onDeleteSelected}
                disabled={!hasSelected}
                className={`${styles.actionButton} ${styles.deleteSelectedButton}`}
            >
                選択削除
            </button>
            <button
                onClick={onDeleteAll}
                disabled={!hasTodos}
                className={`${styles.actionButton} ${styles.deleteAllButton}`}
            >
                全削除
            </button>
        </div>
    )
}

