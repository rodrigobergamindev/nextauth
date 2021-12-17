import { parseCookies } from "nookies"
import { useContext, useEffect } from "react"
import { AuthContext } from "../contexts/AuthContext"
import { api } from "../services/api"

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