import type { ReactNode } from "react"
import { Navigate } from "react-router-dom"
import { getAccessToken } from "../api/authToken"

type ProtectedRouteProps = {
    children: ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    if (!getAccessToken()) {
        return <Navigate to="/login" replace />
    }
    return children
}
