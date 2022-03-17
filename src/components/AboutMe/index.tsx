import React, { useCallback } from 'react';
import Link from 'next/link'
import { useInView } from 'react-intersection-observer';
import Section from '../Section';
import styles from './AboutMe.module.css';

const LINK_IMAGES = {
  Email: {
    src: 'https://img.shields.io/badge/Email-c14438?style=for-the-badge&logo=Gmail&logoColor=white'
  },
  Github: {
    src: 'https://img.shields.io/badge/-Github-181717?style=for-the-badge&logo=Github&logoColor=white'
  },
  Twitter: {
    src: 'https://img.shields.io/badge/-Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white'
  },
  LinkedIn: {
    src: 'https://img.shields.io/badge/-LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white'
  },
}

interface AboutMeProps {
  name: string
  links: Record<string, string>
}

interface SlidingInSocialBadgeProps extends React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> {
  href: string
}

function SlidingInSocialBadge({ href, ...imgProps }: SlidingInSocialBadgeProps){
  const { ref, inView } = useInView({ threshold: 1 });
  return (
    <a href={href} ref={ref} data-in-view={inView}>
      {/* eslint-disable-next-line jsx-a11y/alt-text */}
      <img {...imgProps} />
    </a>
  )
}

function AnchorToFragment({ fragment, children }: { fragment: string, children: React.ReactNode }){
  return <a href={fragment} onClick={useCallback((e) => {
    e.preventDefault()
    document.querySelector(fragment).scrollIntoView({ behavior: 'smooth' });
  }, [fragment])}>{children}</a>
}

export default function AboutMe({ name, links }: AboutMeProps) {
  return (
    <Section title="Who am I" subTitle="ABOUT ME" initialInView={true} className={styles.aboutMe}>
      <h3>
        I am <i title={name}>{name}</i>, a Software Engineer.
      </h3>

      <aside className={styles.linksContainer} aria-label="Also find me here:">
        <ul>
        {Object.entries(links).map(([linkName, href]) => (
          <li key={linkName}>
            <SlidingInSocialBadge href={href} alt={`${name}'s ${linkName}`} title={`${name}'s ${linkName}`} {...LINK_IMAGES[linkName]!} height="50px" />
          </li>
        ))}
        </ul>
      </aside>
      <p>
        I&apos;ve been solving the problems I encounter with whatever tools I have at my disposal since 2008, from
        Fullstack Websites, to automated IT management, and everything in-between!
      </p>
      <p>
        My experience started with Python, and blossomed into Java, PHP, the Cs, JavaScript, Ruby, Go, Rust and many
        more <AnchorToFragment fragment="#section-work">Technologies</AnchorToFragment>
      </p>
      <p>
        With a <Link href="/blog">passion for solving problems and improving experiences</Link>, I&apos;m always streamlining processes, and making needed complexities work with, and not against the user!
      </p>
      <h3>My Services</h3>
      <p>
        Expanding to meet the needs of my clients, from straightforward landing pages, to complex fully-interactive Fullstack Web Applications, I can not only create them, but also ensure their longevity with maintenance &amp; monitoring over time!
        </p>
      <p>
        From our initial consultation, to the proposal I create, I ensure that your needs are not just understood, but also being efficiently satisfied!
      </p>
    </Section>
  );
}
