import styles from "./AuthPage.module.css"

type AuthFormFieldsProps = {
    email: string
    password: string
    onEmailChange: (value: string) => void
    onPasswordChange: (value: string) => void
    disabled: boolean
    passwordAutoComplete?: "current-password" | "new-password"
}

export function AuthFormFields({
    email,
    password,
    onEmailChange,
    onPasswordChange,
    disabled,
    passwordAutoComplete = "current-password",
}: AuthFormFieldsProps) {
    return (
        <>
            <label className={styles.label}>
                メールアドレス
                <input
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => onEmailChange(e.target.value)}
                    className={styles.input}
                    disabled={disabled}
                    required
                />
            </label>
            <label className={styles.label}>
                パスワード
                <input
                    type="password"
                    autoComplete={passwordAutoComplete}
                    value={password}
                    onChange={(e) => onPasswordChange(e.target.value)}
                    className={styles.input}
                    disabled={disabled}
                    required
                    minLength={8}
                />
            </label>
        </>
    )
}
