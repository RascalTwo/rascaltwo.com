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
import ThemeToggler from '../components/ThemeToggler'
import GitHubCorner from '../components/GitHubCorner'
import { fetchWorkDataAndTechnologies } from '../ssrHelpers'
import { useLocaleConfig } from '../helpers'
import { useState } from 'react'


interface HomeProps {
	technologies: Technologies
  work: WorkData[]
}

export default function Home({ technologies, work }: HomeProps) {
  const { name, links, website } = useLocaleConfig();

  const inclusive = useSet<string>();
  const exclusive = useSet<string>();
  const [activated, setActivated] = useState<string | null>(null);
  return (
    <div>
      <Head>
        <title>{name} - Software Engineer</title>
        <meta name="description" content={`Your next Software Engineer!`} />
        <meta property="og:type" content="website"/>
        <meta property="og:site_name" content={name} />
        <meta property="og:title" content="Homepage"/>
        <meta property="og:description" content={`Your next Software Engineer!`}/>
        <meta property="og:url" content={website}/>
        <meta property="og:image" content={`${website}/header-low.webp`}/>

        <meta name="twitter:image" content={`${website}/header-low.webp`}/>
        <meta name="twitter:image:alt" content="Logo"/>
        <meta name="twitter:description" content={`Your next Software Engineer!`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@RealRascalTwo" />
        <meta name="twitter:creator" content="@RealRascalTwo" />
      </Head>

      <ThemeToggler />
      <GitHubCorner />

      <Header name={name} />

      <main>
        <AboutMe name={name} links={links} />
        <TechnologiesContext.Provider value={technologies}>
          <WorkContext.Provider value={work}>
            <WorkFilterContext.Provider value={{ inclusive, exclusive }}>
              <ActivatedTabContext.Provider value={{ activated, setActivated }}>
                <Work />
              </ActivatedTabContext.Provider>
            </WorkFilterContext.Provider>
          </WorkContext.Provider>
        </TechnologiesContext.Provider>
        <Contact />
      </main>
      <Footer name={name} links={links} />
    </div>
  )
}

export async function getStaticProps(){
  const { technologies, work } = await fetchWorkDataAndTechnologies();
  return { props: { technologies, work } }
}