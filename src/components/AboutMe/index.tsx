import React from 'react';
import { useInView } from 'react-intersection-observer';
import Section from '../Section';
import styles from './AboutMe.module.css';

const LINK_IMAGES = {
  Email: 'https://img.shields.io/badge/Email-c14438?style=for-the-badge&logo=Gmail&logoColor=white',
  Github: 'https://img.shields.io/badge/-Github-181717?style=for-the-badge&logo=Github&logoColor=white',
  Twitter: 'https://img.shields.io/badge/-Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white',
  LinkedIn: 'https://img.shields.io/badge/-LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white',
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
      <img {...imgProps} />
    </a>
  )
}

export default function AboutMe({ name, links }: AboutMeProps) {
  return (
    <Section title="Who am I" subTitle="ABOUT ME">
      <h3>
        I am <i title={name}>{name}</i>, a Software Engineer.
      </h3>

      <aside className={styles.linksContainer} aria-label="Also find me here:">
        <ul>
        {Object.entries(links).map(([linkName, href]) => (
          <li key={linkName}>
            <SlidingInSocialBadge href={href} src={LINK_IMAGES[linkName]!} alt={`${name}'s ${linkName}`} title={`${name}'s ${linkName}`} />
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
        With a passion for solving problems and improving experiences, I&apos;m always streamlining
        processes, and making needed complexities work with, and not against the user!
      </p>
    </Section>
  );
}
