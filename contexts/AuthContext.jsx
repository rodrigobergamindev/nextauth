import { createContext, useState } from "react";
import { api } from '../services/api'




export const AuthContext = createContext({});

export function AuthProvider({ children }) {
    
    const [user, setUser] = useState()
    
    const isAuthenticated = false;

    async function signIn({email, password}) {
       try {
        const response = await api.post('sessions', {
            email,
            password
        })

        console.log(response.data)

       } catch (error) {
           console.log(error)
       }
    }

    return (
        <AuthContext.Provider value={{signIn, isAuthenticated}}>
            {children}
        </AuthContext.Provider>
    )
}