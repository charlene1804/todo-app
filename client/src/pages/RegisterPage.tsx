import { useState, type FormEvent } from "react"
import { Link, Navigate, useNavigate } from "react-router-dom"
import { AuthRequestError, registerRequest } from "../api/authApi"
import { getAccessToken, setAccessToken } from "../api/authToken"
import { AuthFormFields } from "./AuthFormFields"
import styles from "./AuthPage.module.css"

export function RegisterPage() {
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
            const result = await registerRequest(
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
            <h1 className={styles.title}>新規登録</h1>
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
                    passwordAutoComplete="new-password"
                />
                <button
                    type="submit"
                    className={styles.submit}
                    disabled={pending}
                >
                    登録する
                </button>
            </form>
            <p className={styles.footer}>
                <Link to="/login" className={styles.link}>
                    ログインはこちら
                </Link>
            </p>
        </div>
    )
}
