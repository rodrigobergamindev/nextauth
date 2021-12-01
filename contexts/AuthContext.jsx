import { createContext } from "react";



export const AuthContext = createContext({});

export function AuthProvider({ children }) {
    
    const isAuthenticated = false;

    async function signIn({email, password}) {
        console.log({email, password})
    }

    return (
        <AuthContext.Provider value={{signIn, isAuthenticated}}>
            {children}
        </AuthContext.Provider>
    )
}