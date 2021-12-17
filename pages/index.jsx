import Head from 'next/head'
import Image from 'next/image'
import { useContext, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext';
import styles from '../styles/home.module.css'
import {parseCookies} from 'nookies'



export default function Home() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const {signIn} = useContext(AuthContext)

  async function handleSubmit(event) {
   
    event.preventDefault()
    const data = {
      email,
      password
    }

    await signIn(data)
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Next Auth</title>
        <meta name="description" content="Next Auth" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <form onSubmit={handleSubmit} className={styles.main}>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <button type="submit">Entrar</button>
      </form>

    </div>
  )
}


export async function getServerSideProps (context) {

  const cookies = parseCookies(context)

  if(cookies['nextauth.token']) {

    return {
      redirect: {
        destination: '/dashboard',
        permanent: false,
      }
    }
  }

  return {
    props: {}
  }
  
}