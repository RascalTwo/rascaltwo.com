import Head from 'next/head'
import getConfig from 'next/config'
import { useRouter } from 'next/router'

import Header from '../components/Header/index'
import Skills from '../components/Skills/index'
import Work from '../components/Work/index'
import Contact from '../components/Contact/index'
import type { Technologies, WorkData } from '../types'

import { ActivatedTabContext, TechnologiesContext, WorkContext, WorkFilterContext } from '../context'
import { useSet } from '../hooks'
import AboutMe from '../components/AboutMe'
import Footer from '../components/Footer'
import GitHubCorner from '../components/GitHubCorner'
import { fetchWorkDataAndTechnologies } from '../ssrHelpers'
import { useState } from 'react'


interface HomeProps {
	technologies: Technologies
  work: WorkData[]
}

interface Config {
  publicRuntimeConfig: Record<string, {
    name: string,
    links: Record<string, string>
  }>
}

export default function Home({ technologies, work }: HomeProps) {
  const { publicRuntimeConfig: { [useRouter().locale]: { name, links } } }: Config = getConfig();

  const inclusive = useSet<string>();
  const exclusive = useSet<string>();
  const [activated, setActivated] = useState<string | null>(null);
  return (
    <div>
      <Head>
        <title>{name} - Portfolio</title>
        <meta name="description" content={`${name} Portfolio`} />
      </Head>

      <GitHubCorner />

      <Header />

      <main>
        <AboutMe links={links} />
        <TechnologiesContext.Provider value={technologies}>
          <WorkContext.Provider value={work}>
            <WorkFilterContext.Provider value={{ inclusive, exclusive }}>
              <ActivatedTabContext.Provider value={{ activated, setActivated }}>
                <Skills />
                <Work />
              </ActivatedTabContext.Provider>
            </WorkFilterContext.Provider>
          </WorkContext.Provider>
        </TechnologiesContext.Provider>
        <Contact />
      </main>
      <Footer />
    </div>
  )
}

export async function getStaticProps(){
  const { technologies, work } = await fetchWorkDataAndTechnologies();
  return { props: { technologies, work } }
}