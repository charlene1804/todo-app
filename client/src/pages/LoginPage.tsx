import { useState, type FormEvent } from "react"
import { Link, Navigate, useNavigate } from "react-router-dom"
import { AuthRequestError, loginRequest } from "../api/authApi"
import { getAccessToken, setAccessToken } from "../api/authToken"
import { AuthFormFields } from "./AuthFormFields"
import styles from "./AuthPage.module.css"

export function LoginPage() {
    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState<string | null>(null)
    const [pending, setPending] = useState(false)

    if (getAccessToken()) {
        return <Navigate to="/" replace />
    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault()
        setError(null)
        setPending(true)
        try {
            const result = await loginRequest(
                email.trim().toLowerCase(),
                password
            )
            setAccessToken(result.token)
            navigate("/", { replace: true })
        } catch (err) {
            if (err instanceof AuthRequestError) {
                setError(err.message)
            } else if (err instanceof Error) {
                setError(err.message)
            } else {
                setError("エラーが発生しました")
            }
        } finally {
            setPending(false)
        }
    }

    return (
        <div className={styles.page}>
            <h1 className={styles.title}>ログイン</h1>
            <form className={styles.form} onSubmit={(e) => void handleSubmit(e)}>
                {error ? (
                    <p className={styles.error} role="alert">
                        {error}
                    </p>
                ) : null}
                <AuthFormFields
                    email={email}
                    password={password}
                    onEmailChange={setEmail}
                    onPasswordChange={setPassword}
                    disabled={pending}
                />
                <button
                    type="submit"
                    className={styles.submit}
                    disabled={pending}
                >
                    ログイン
                </button>
            </form>
            <p className={styles.footer}>
                <Link to="/register" className={styles.link}>
                    新規登録はこちら
                </Link>
            </p>
        </div>
    )
}
