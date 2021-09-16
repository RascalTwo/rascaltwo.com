import Head from 'next/head'
import Header from '../components/Header'

export default function Home() {
  return (
    <div>
      <Head>
        <title>Joseph Milliken - Portfolio</title>
        <meta name="description" content="Joseph Milliken Portfolio" />
      </Head>

      <Header />
    </div>
  )
}
