import { parseCookies, destroyCookie } from "nookies"

import { setupAPIClient } from "../services/api"
import { api } from "../services/apiClient"
import { AuthTokenError } from "../services/errors/AuthTokenError"
import decode from 'jwt-decode'
import {validateUserPermissions} from '../utils/validateUserPermissions'

export default function Metrics() {

    return (
        <div>
            <span>Metrics</span>
        </div>
    )
}


export async function getServerSideProps (context) {
    const apiClient = setupAPIClient(context)
    let user = {}

    try {
      const response = await apiClient.get('/me');
      const {roles, permissions} = response.data

      const cookies = parseCookies(context)
      const token = cookies['nextauth.token']
  
      if(!token) {
    
        return {
          redirect: {
            destination: '/',
            permanent: false,
          }
        }
  
      }
  
      const user = decode(token)

      const userHasValidPermissions = validateUserPermissions({
          user,
          permissions,
          roles
      })
     
      if(!userHasValidPermissions) {
          return {
             redirect: {
                 destination: '/dashboard',
                 permanent: false,
             }
          }
      }
      
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

  
    return {
      props: {}
    }
    
  }