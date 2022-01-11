import Head from 'next/head'

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

export default function Home({ technologies, work }: HomeProps) {
  const inclusive = useSet<string>();
  const exclusive = useSet<string>();
  const [activated, setActivated] = useState<string | null>(null);
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