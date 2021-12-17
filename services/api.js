import axios from 'axios'
import { parseCookies, setCookie } from 'nookies'
import { signOut } from '../contexts/AuthContext';

let cookies = parseCookies()
let isRefreshing = false;
let failedRequestQueue = []

export const api = axios.create({
    baseURL: 'http://localhost:3333',
    headers: {
        Authorization: `Bearer ${cookies['nextauth.token']}`
    }
})


api.interceptors.response.use(response => {
    return response
}, error => {
    if (error.response.status === 401) {
        if(error.response.data?.code === 'token.expired') { 
            cookies = parseCookies()

            const { 'nextauth.refreshToken' : refreshToken } = cookies;
            const originalConfig = error.config

            
          if(!isRefreshing) {
             
            isRefreshing = true


            api.post('/refresh', {
                refreshToken,
            }).then(
                response => {
                    const {token} = response.data
                 
                                
            setCookie(undefined, 'nextauth.token', token, {
                maxAge: 60 * 60 * 24 * 30, // 30 days
                path: '/'
            })
            setCookie(undefined, 'nextauth.refreshToken', response.data.refreshToken,  {
                maxAge: 60 * 60 * 24 * 30, // 30 days
                path: '/'
            })

            api.defaults.headers['Authorization'] = `Bearer ${token}`;

            failedRequestQueue.forEach(request => request.onSuccess(token))
            failedRequestQueue = [];


            }).
            catch(
                error => {
                    failedRequestQueue.forEach(request => request.onFailure(error))
                    failedRequestQueue = [];

                    if (process.browser) {
                        signOut();
                      }
                }
            ).
            finally(() => {
                isRefreshing = false;

            })
            
          }
        
          
        return new Promise((resolve, reject) => {
            failedRequestQueue.push({
                onSuccess: (token) => {
                    originalConfig.headers['Authorization'] = `Bearer ${token}`;

                    resolve(api(originalConfig))
                } ,
                onFailure: (error) => {
                    reject(error)
                }
            })
        })
        

        
    } else {
       signOut();
       return Promise.reject(error)
    }
    }
    
    console.log(error)
    return Promise.reject(error)

})