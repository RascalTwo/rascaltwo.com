import Head from 'next/head'
import Header from '../components/Header'
import Section from '../components/Section'
import Skills from '../components/Skills'

export default function Home() {
  return (
    <div>
      <Head>
        <title>Joseph Milliken - Portfolio</title>
        <meta name="description" content="Joseph Milliken Portfolio" />
      </Head>

      <Header />

      <main>
        <Section title="ABOUT ME" subTitle="Who am I">
          <h3>I am <i title="Rascal Two">Joseph Milliken</i>, a Software Engineer.</h3>
          <p>I&apos;ve been solving the problems I encounter with whatever tools I have at my disposal since 2008, from Fullstack Websites, to automated IT management, and everything inbetween!</p>
          <p>My experience started with Java, and blossemed into PHP, Python, the Cs, JavaScript, Ruby, Go, Rust and many more <a href="#section-skills">Technologies</a></p>
        </Section>
        <Skills />
        <Section title="WORK" subTitle="Projects I've Made">
        </Section>
      </main>
    </div>
  )
}
