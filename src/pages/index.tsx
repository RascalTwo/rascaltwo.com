import Head from 'next/head'
import YAML from 'yaml'

import Header from '../components/Header/index'
import Section from '../components/Section/index'
import Skills from '../components/Skills/index'
import Work from '../components/Work/index'
import Contact from '../components/Contact/index'
import type { Technologies, WorkData, WorkSource } from '../types'

import WORK from '../data/work.yaml'

import { TechnologiesContext, WorkContext, WorkFilterContext } from '../context'
import { useSet } from '../hooks'


interface HomeProps {
	technologies: Technologies
  work: WorkData[]
}

export default function Home({ technologies, work }: HomeProps) {
  const inclusive = useSet<string>();
  const exclusive = useSet<string>();
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
        <TechnologiesContext.Provider value={technologies}>
          <WorkContext.Provider value={work}>
            <WorkFilterContext.Provider value={{ inclusive, exclusive }}>
              <Skills />
              <Work />
            </WorkFilterContext.Provider>
          </WorkContext.Provider>
        </TechnologiesContext.Provider>
        <Contact />
      </main>
    </div>
  )
}

const sourceToURL = ({ repo, gist }: WorkSource) => {
	if (repo) return 'https://github.com/RascalTwo/' + repo;
	if (gist) return 'https://gist.github.com/RascalTwo/' + gist;
	throw new Error('Source must have at least one value');
}

export async function getStaticProps(){
  let technologies: Technologies = {};

  try{
    const response = await fetch('https://raw.githubusercontent.com/RascalTwo/RascalTwo/main/data/technologies.yaml');
    const rawYAML = await response.text();
    technologies = YAML.parse(rawYAML)
  }
  catch(e){
    console.error('Unable to fetch technologies:', e);
  }


  const allTechnologies = Object.values(technologies).reduce((all, mapping) => ({ ...all, ...mapping }), {})

  const work = Object.entries(WORK).map(([slug, data]: [string, WorkData]) => {
    data.slug = slug;
    if (!('urls' in data)) data.urls = {};
    if (!data.urls.source) data.urls.source = sourceToURL(data.source);
    for (const key of ['technologies', 'concepts']){
      data.tags[key] = data.tags[key].split(' ').map(slug => {
        const tech = allTechnologies[slug]
        return [tech ?? null, slug]
      }).reduce((obj, [tech, slug]) => ({ ...obj, [slug]: tech }), {})
    }
    return data;
  });

  return { props: { technologies, work } }
}