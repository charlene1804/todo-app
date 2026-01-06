import TodoList from "./components/TodoList"
import styles from "./App.module.css"

function App() {
  return (
    <div className={styles.app}>
      <h1 className={styles.title}>TODOアプリ</h1>
      <TodoList />
    </div>
  )
}

export default App
