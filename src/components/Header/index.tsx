import { CSSProperties, useCallback, useEffect, useMemo, useState } from 'react';
import Typewriter from '../Typewriter';
import styles from './Header.module.css';

function Name({ name }: { name: string }) {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => setLoaded(true), []);

  const letters = useMemo(() => name.split(''), [name]);
  const rotOffset = useMemo(() => 0.5 - letters.length / 2, [letters]);

  return (
    <h1 className={styles.name} data-loaded={loaded} aria-label={name}>
      {letters.map((l, i) => (
        <div
          key={i}
          style={
            {
              '--degrees': (i + rotOffset) * 10 + 'deg',
              '--delay': 2750 + i * 100 + 'ms',
            } as CSSProperties
          }
        >
          {l}
        </div>
      ))}
    </h1>
  );
}

export default function Header({ name }: { name: string }) {
  const [bgUrl, setBGUrl] = useState('header-low.webp');

  useEffect(() => {
    if (bgUrl === 'header-high.png') return;
    const timeout = setTimeout(
      () => setBGUrl(`header-${bgUrl === 'header-low.webp' ? 'medium' : 'high'}.png`),
      bgUrl === 'header-low.webp' ? 10000 : 20000,
    );
    return () => clearTimeout(timeout);
  }, [bgUrl]);

  return (
    <header
      className={styles.header}
      style={
        {
          '--bg-url': `url(/${bgUrl})`,
        } as CSSProperties
      }
    >
      <Name name={name} />
      <Typewriter
        phrases={['Software Engineer', 'Fullstack Developer', 'Polyglot']}
        typingRate={250}
        pauseMS={[0, 10000]}
        initialIndex={0}
        render={useCallback(
          text => (
            <span>{text}</span>
          ),
          [],
        )}
      />
    </header>
  );
}
