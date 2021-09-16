import Head from 'next/head'
import Typewriter from '../components/Typewriter'

export default function Home() {
  return (
    <div>
      <Head>
        <title>Joseph Milliken - Portfolio</title>
        <meta name="description" content="Joseph Milliken Portfolio" />
      </Head>

      <header>
        <h1>Hello!</h1>
        <Typewriter
          phrases={[
            'I am Joseph Milliken',
            'I am Rascal Two',
            'I am a Software Engineer',
            'I am a Fullstack Developer',
            'I am a Polyglot'
          ]}
          typingRate={250}
          pauseMS={2500}
          initialIndex={4}
        />
      </header>
    </div>
  )
}
