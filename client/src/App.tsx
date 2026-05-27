import { Navigate, Route, Routes, useNavigate } from "react-router-dom"
import TodoList from "./components/TodoList"
import { clearAccessToken } from "./api/authToken"
import { LoginPage } from "./pages/LoginPage"
import { RegisterPage } from "./pages/RegisterPage"
import { ProtectedRoute } from "./routes/ProtectedRoute"
import styles from "./App.module.css"

function HomePage() {
    const navigate = useNavigate()
    return (
        <div className={styles.app}>
            <header className={styles.header}>
                <h1 className={styles.title}>TODOアプリ</h1>
                <button
                    type="button"
                    className={styles.logout}
                    onClick={() => {
                        clearAccessToken()
                        navigate("/login", { replace: true })
                    }}
                >
                    ログアウト
                </button>
            </header>
            <TodoList />
        </div>
    )
}

export default function App() {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
                path="/"
                element={
                    <ProtectedRoute>
                        <HomePage />
                    </ProtectedRoute>
                }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    )
}
