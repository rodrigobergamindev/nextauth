import { parseCookies, destroyCookie } from "nookies"
import { useContext, useEffect } from "react"
import { AuthContext } from "../contexts/AuthContext"
import { setupAPIClient } from "../services/api"
import { api } from "../services/apiClient"
import { AuthTokenError } from "../services/errors/AuthTokenError"

export default function Dashboard() {

    const {user} = useContext(AuthContext)

    useEffect(() => {
       api.get('/me').then(response => console.log(response)).catch(error => console.log(error))
    }, [])

    return (
        <div>
            Dashboard:

            <span>email: {user?.email}</span>
        </div>
    )
}


export async function getServerSideProps (context) {
    const apiClient = setupAPIClient(context)
    

    try {
      const response = await apiClient.get('/me');
      
    } catch (error) {
      if(error instanceof AuthTokenError) {
        destroyCookie(context, 'nextauth.token')
        destroyCookie(context, 'nextauth.refreshToken')

        return {
          redirect: {
            destination: '/',
            permanent: false,
          }
        }
      }
    
    }

    const cookies = parseCookies(context)
  
    if(!cookies['nextauth.token']) {
  
      return {
        redirect: {
          destination: '/',
          permanent: false,
        }
      }
    }
  
    return {
      props: {}
    }
    
  }