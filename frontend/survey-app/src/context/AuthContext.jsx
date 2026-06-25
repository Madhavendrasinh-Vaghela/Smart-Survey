import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        try {
            const stored = sessionStorage.getItem('survey_user')
            return stored ? JSON.parse(stored) : null
        } catch { return null }
    })

    const [token, setToken] = useState(() => {
        return sessionStorage.getItem('survey_token') || null
    })

    const login = (userData, accessToken) => {
        setUser(userData)
        setToken(accessToken)
        sessionStorage.setItem('survey_user', JSON.stringify(userData))
        sessionStorage.setItem('survey_token', accessToken)
    }

    const logout = () => {
        setUser(null)
        setToken(null)
        sessionStorage.removeItem('survey_user')
        sessionStorage.removeItem('survey_token')
    }

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)