import { useCallback } from 'react'
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
        <span>
          <p>Hello!</p>
          <Typewriter
            phrases={[
              "I'm Joseph Milliken",
              "I'm Rascal Two",
              "I'm a Software Engineer",
              "I'm a Fullstack Developer",
              "I'm a Polyglot"
            ]}
            typingRate={250}
            pauseMS={2500}
            initialIndex={4}
            render={useCallback(text => <h1>{text}</h1>, [])}
          />
        </span>
      </header>
    </div>
  )
}
