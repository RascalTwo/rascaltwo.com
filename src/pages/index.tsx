import Head from 'next/head'
import YAML from 'yaml'

import Header from '../components/Header'
import Section from '../components/Section'
import Skills from '../components/Skills'
import { Technologies } from '../types'


interface HomeProps {
	technologies: Technologies
}

export default function Home({ technologies }: HomeProps) {
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
          <p>My experience started with Java, and blossomed into PHP, Python, the Cs, JavaScript, Ruby, Go, Rust and many more <a href="#section-skills">Technologies</a></p>
        </Section>
        <Skills technologies={technologies} />
        <Section title="WORK" subTitle="Projects I've Made">
        </Section>
      </main>
    </div>
  )
}

export async function getStaticProps(){
  let technologies = {};

  try{
    const response = await fetch('https://raw.githubusercontent.com/RascalTwo/RascalTwo/main/data/technologies.yaml');
    const rawYAML = await response.text();
    technologies = YAML.parse(rawYAML)
  }
  catch(e){
    console.error('Unable to fetch technologies:', e);
  }

  return { props: { technologies } }
}