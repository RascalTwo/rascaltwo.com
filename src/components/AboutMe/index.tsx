import React from 'react';
import Link from 'next/link'
import { useInView } from 'react-intersection-observer';
import Section from '../Section';
import styles from './AboutMe.module.css';

const LINK_IMAGES = {
  Email: {
    src: 'https://img.shields.io/badge/Email-c14438?style=for-the-badge&logo=Gmail&logoColor=white',
    width: 152.223 + 'px'
  },
  Github: {
    src: 'https://img.shields.io/badge/-Github-181717?style=for-the-badge&logo=Github&logoColor=white',
    width: 170.533 + 'px'
  },
  Twitter: {
    src: 'https://img.shields.io/badge/-Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white',
    width: 185.267 + 'px'
  },
  LinkedIn: {
    src: 'https://img.shields.io/badge/-LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white',
    width: 198.217 + 'px'
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

export default function AboutMe({ name, links }: AboutMeProps) {
  return (
    <Section title="Who am I" subTitle="ABOUT ME" initialInView={true}>
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
        more <a href="#section-skills">Technologies</a>
      </p>
      <p>
        With a <Link href="/blog">passion for solving problems and improving experiences</Link>, I&apos;m always streamlining processes, and making needed complexities work with, and not against the user!
      </p>
    </Section>
  );
}
