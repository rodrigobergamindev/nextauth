import { createContext, useState, useEffect } from "react";
import {setCookie, parseCookies, destroyCookie} from 'nookies'
import { api } from '../services/apiClient'
import Router from 'next/router'



export const AuthContext = createContext({});

export function signOut() {
    destroyCookie(undefined, 'nextauth.token')
    destroyCookie(undefined, 'nextauth.refreshToken')
  
    Router.push('/')
}

export function AuthProvider({ children }) {
    

    const [user, setUser] = useState()
    
    const isAuthenticated = !!user;

    useEffect(() => {
        const {'nextauth.token': token} = parseCookies()

        if(token) {
            api.get('/me').then(response => {
                const {email, permissions, roles} = response.data
                setUser({
                    email,
                    permissions,
                    roles
                })
            }).catch(() => {
                signOut()
            })
        }
    }, [])

    async function signIn({email, password}) {
       try {
        const response = await api.post('sessions', {
            email,
            password
        })

        const {token, refreshToken, permissions, roles} = response.data

        setCookie(undefined, 'nextauth.token', token, {
            maxAge: 60 * 60 * 24 * 30, // 30 days
            path: '/'
        })
        setCookie(undefined, 'nextauth.refreshToken', refreshToken,  {
            maxAge: 60 * 60 * 24 * 30, // 30 days
            path: '/'
        })

        //localStorage --> apenas do lado cliente
        //sessionStorage --> Funcionamento enquanto o usuário está com uma sessão ativa
        //cookies --> lado cliente e lado servidor

        setUser({
            email,
            permissions,
            roles
        })

        api.defaults.headers['Authorization'] = `Bearer ${token}`
        Router.push('/dashboard')

       } catch (error) {
           console.log(error)
       }
    }

    return (
        <AuthContext.Provider value={{signIn, isAuthenticated, user}}>
            {children}
        </AuthContext.Provider>
    )
}