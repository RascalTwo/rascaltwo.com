import React from 'react';
import Section from '../Section';
import styles from './AboutMe.module.css';

const LINKS = {
  Email: [
    'https://img.shields.io/badge/Email-c14438?style=for-the-badge&logo=Gmail&logoColor=white',
    'mailto:therealrascaltwo@gmail.com',
  ],
  Github: [
    'https://img.shields.io/badge/-Github-181717?style=for-the-badge&logo=Github&logoColor=white',
    'https://github.com/RascalTwo',
  ],
  Twitter: [
    'https://img.shields.io/badge/-Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white',
    'https://twitter.com/RealRascalTwo',
  ],
  LinkedIn: [
    'https://img.shields.io/badge/-LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white',
    'https://linkedin.com/in/joseph97milliken/',
  ],
};

export default function AboutMe() {
  return (
    <Section title="ABOUT ME" subTitle="Who am I">
      <h3>
        I am <i title="Rascal Two">Joseph Milliken</i>, a Software Engineer.
      </h3>

      <aside className={styles.linksContainer}>
        {Object.entries(LINKS).map(([name, [image, href]]) => (
          <a key={name} href={href}>
            <img src={image} alt={name} title={name} />
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
