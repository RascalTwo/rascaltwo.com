import React from 'react';
import Section from '../Section';
import styles from './AboutMe.module.css';

const LINK_IMAGES = {
  Email: 'https://img.shields.io/badge/Email-c14438?style=for-the-badge&logo=Gmail&logoColor=white',
  Github: 'https://img.shields.io/badge/-Github-181717?style=for-the-badge&logo=Github&logoColor=white',
  Twitter: 'https://img.shields.io/badge/-Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white',
  LinkedIn: 'https://img.shields.io/badge/-LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white',
}

interface AboutMeProps {
  links: Record<string, string>
}

export default function AboutMe({ links }: AboutMeProps) {
  return (
    <Section title="ABOUT ME" subTitle="Who am I">
      <h3>
        I am <i title="Rascal Two">Joseph Milliken</i>, a Software Engineer.
      </h3>

      <aside className={styles.linksContainer}>
        {Object.entries(links).map(([name, href]) => (
          <a key={name} href={href}>
            <img src={LINK_IMAGES[name]!} alt={name} title={name} />
            <br />
          </a>
        ))}
      </aside>
      <p>
        I&apos;ve been solving the problems I encounter with whatever tools I have at my disposal since 2008, from
        Fullstack Websites, to automated IT management, and everything inbetween!
      </p>
      <p>
        My experience started with Java, and blossomed into PHP, Python, the Cs, JavaScript, Ruby, Go, Rust and many
        more <a href="#section-skills">Technologies</a>
      </p>
      <p>
        With a passion for solving problems and improving experiences, I&apos;m always streamlining various
        processes, and making needed complexity work with and not against the user!
      </p>
    </Section>
  );
}
