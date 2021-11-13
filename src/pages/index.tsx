import Head from 'next/head'
import YAML from 'yaml'

import Header from '../components/Header/index'
import Skills from '../components/Skills/index'
import Work from '../components/Work/index'
import Contact from '../components/Contact/index'
import type { Technologies, WorkData, WorkSource } from '../types'

import { TechnologiesContext, WorkContext, WorkFilterContext } from '../context'
import { useSet } from '../hooks'
import AboutMe from '../components/AboutMe'
import Footer from '../components/Footer'
import GitHubCorner from '../components/GitHubCorner'


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

      <GitHubCorner />

      <Header />

      <main>
        <AboutMe />
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
      <Footer />
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

  let work: WorkData[] = []
  const allTechnologies = Object.values(technologies).reduce((all, mapping) => ({ ...all, ...mapping }), {})

  try{
    const response = await fetch('https://raw.githubusercontent.com/RascalTwo/RascalTwo/main/data/projects.yaml');
    const rawYAML = await response.text();
    work = Object.entries(YAML.parse(rawYAML)).map(([slug, data]: [string, WorkData]) => {
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
  }
  catch(e){
    console.error('Unable to fetch work:', e);
  }

  return { props: { technologies, work } }
}