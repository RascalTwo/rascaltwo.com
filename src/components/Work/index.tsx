import Image from 'next/image';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { marked } from 'marked';
import { htmlToText } from 'html-to-text'

import Section from '../Section/index';
import Tabs from '../Tabs/index';

import { WorkData } from '../../types';
import { useWorkContext, useWorkFilterContext } from '../../context';

import styles from './Work.module.css';
import { Modal } from '../Modal';
import Skills from '../Skills';
import { useRouter } from 'next/router';

type FullWorkItemProps = React.HTMLProps<HTMLDivElement> & WorkData

export function FullWorkItem({ slug, tags: { technologies, concepts }, text: { title, description, alt }, urls: { video, image, source, live, ...otherURLs }, ...props }: FullWorkItemProps){
  const media = useMemo(() => {
    if (video) return <video
      src={video}
      className={styles.fullMedia}
      autoPlay
      loop
      controls
      poster={image}
      title={alt}
    />
    if (image) return <img className={styles.fullMedia} src={image} alt={alt} title={alt} />;
    return null;
  }, [alt, video, image]);
  const htmlDescription = useMemo(() => {
    if (!description) return media ? '' : alt;
    return marked.parse(Object.entries(otherURLs).map(([key, value]) => `[${slug} ${key}]: ${value}`).join('\n') + '\n' + description)
  }, [slug, otherURLs, description, media, alt]);


  const techIcons = useMemo(() => Object.entries(technologies).map(([slug, tech]) => <img
    key={slug}
    className={styles.fullIcon}
    src={tech.image}
    title={tech.name}
    alt={tech.name}
    data-background={tech?.background || 'dark'}
  />), [technologies]);
  const conceptIcons = useMemo(() => Object.entries(concepts).filter(([_, concept]) => concept.image != media?.props.src).map(([slug, concept]) => <img
    key={slug}
    className={styles.fullIcon}
    src={concept.image}
    title={concept.name}
    alt={concept.name}
    data-background={concept?.background || 'dark'}
  />), [media, concepts]);

  return <div className={styles.fullWorkItem} {...props}>
    <div className={styles.fullWorkHeader}>
      {source ? <a className={styles.sourceAnchor} href={source}>Source</a> : null}
      {live ? <a className={styles.liveAnchor} href={live}>Live</a> : null}
      <h2>{title}</h2>
    </div>
    {media}

    <div dangerouslySetInnerHTML={{ __html: htmlDescription }}></div>
    <div className={styles.fullWorkTags}>
      <span>
        <h3>Technologies</h3>
        <div className={styles.iconsWrapper}>
          {techIcons}
        </div>
      </span>
      <span>
        <h3>Concepts</h3>
        <div className={styles.iconsWrapper}>
          {conceptIcons}
        </div>
      </span>
    </div>
  </div>
}

interface MiniWorkMedia {
  video: string;
  image: string;
  text: string
  onClick?: () => void
}

function MiniWorkMedia({ video, image, text, onClick }: MiniWorkMedia) {
  const { ref, inView, entry } = useInView({ threshold: 1 });
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (entry?.target?.tagName !== 'VIDEO') return;
    new Promise(r => r(entry.target[playing ? 'play' : 'pause']())).catch(() => undefined);
  }, [playing, entry]);

  const onMouseEnter = useCallback(() => setPlaying(true), []);
  const onMouseLeave = useCallback(() => setPlaying(false), []);

  return (
    <button className={styles.media} onClick={onClick}>
      {playing || inView ? (
        <>
          <video
            ref={ref}
            src={video}
            className={styles.media}
            loop
            playsInline
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            preload="metadata"
            poster={image}
            title={text}
            aria-label={text}
            tabIndex={-1}
          />
          {!playing ? <img src="./118620_play_icon.png" className={styles.playIcon} alt="" /> : null}
        </>
      ) : (
        <img ref={ref} src={image} className={styles.media} alt={text} title={text} onClick={onClick} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} loading="lazy" />
      )}
    </button>
  )
}

interface MiniWorkItemProps extends WorkData {
  onClick: () => void
  inView: boolean
}

function MiniWorkItem({
  slug,
  urls: { image, video, source: sourceURL, ...otherURLs },
  text: { title, alt, description },
  tags: { technologies, concepts },
  onClick,
  inView
}: MiniWorkItemProps) {
  const { ref, inView: itemInView } = useInView({ threshold: 0.5 });
  const text = useMemo(() => {
    let markdown = Object.entries(otherURLs).map(([key, value]) => `[${slug} ${key}]: ${value}`).join('\n') + '\n';
    if (description) markdown += description + ' - ';
    markdown += alt;
    return htmlToText(marked.parse(markdown), {
      selectors: [{ selector: 'a', format: 'inline' }]
    });
  }, [slug, otherURLs, alt, description]);
  const media = useMemo(() => {
    if (video) return <MiniWorkMedia video={video} image={image} text={text} onClick={onClick} />;
    const tech = Object.values(concepts)[0];
    const img = image
      ? <img className={styles.media} src={image} alt={text} title={text} loading="lazy" />
      : (
      <img
        src={tech.image}
        title={text}
        alt={text}
        data-background={tech.background || 'dark'}
        loading="lazy"
      />
    )
    return <button className={styles.media} onClick={onClick} aria-label={`View ${title}`}>{img}</button>
  }, [video, image, concepts, onClick, text, title]);

  const techIcon = useMemo(() => {
    const tech = Object.values(technologies)[0];
    return (
      <img
        aria-hidden
        className={styles.icon}
        data-side="left"
        src={tech.image}
        title={tech.name}
        alt={tech.name}
        data-background={tech?.background || 'dark'}
        loading="lazy"
        data-in-view={itemInView}
      />
    );
  }, [technologies, itemInView]);
  const conceptIcon = useMemo(() => {
    const concept = Object.values(concepts).find(concept => concept.image != media.props.src) || technologies[1];
    if (!concept) return;
    return (
      <img
        aria-hidden
        className={styles.icon}
        data-side="right"
        src={concept.image}
        title={concept.name}
        alt={concept.name}
        data-background={concept?.background || 'dark'}
        loading="lazy"
        data-in-view={itemInView}
      />
    );
  }, [technologies, media, concepts, itemInView]);

  return (
    <div className={styles.workItem} data-background={media.props['data-background']} ref={ref} data-in-view={inView}>
      <a className={styles.text} href={sourceURL} target="_blank" rel="noreferrer">
        {title}
      </a>
      {media}
      {techIcon}
      {conceptIcon}
    </div>
  );
}

interface FilteredWorkProps {
  onClick: (data: WorkData) => void
}

function FilteredWork({ onClick }: FilteredWorkProps) {
  const { ref, inView } = useInView({ threshold: 0.33 });

  const work = useWorkContext();
  const { inclusive, exclusive } = useWorkFilterContext();
  const filteredWork = work.filter(data => {
    if (!inclusive.set.size && !exclusive.set.size) return true;
    const tags = ['concepts', 'technologies'].flatMap(key => Object.keys(data.tags[key]));
    const exclusiveCount = tags.filter(tag => exclusive.set.has(tag)).length;
    // Remove if any exclusive tags exist
    if (exclusive.set.size && exclusiveCount) return false;

    const inclusiveCount = tags.filter(tag => inclusive.set.has(tag)).length;
    // Only keep when all inclusive tags exist
    return inclusiveCount === inclusive.set.size && inclusiveCount >= exclusiveCount;
  });

  useEffect(() => {
    if (filteredWork.length) return;
    if (inclusive.lastAdded !== null) inclusive.setSet(new Set([inclusive.lastAdded]))
  }, [filteredWork, inclusive]);

  return (
    <div className={styles.wrapper} ref={ref}>
      {Object.entries(filteredWork).map(([slug, data]) => (
        <MiniWorkItem key={slug} slug={slug} {...data} onClick={() => onClick(data)} inView={inView} />
      ))}
    </div>
  );
}

export default function Work() {
  const router = useRouter();
  const [selected, setSelected] = useState<WorkData | null>(null);
  const selectWork = useCallback((data: WorkData) => {
    router.push(router.route, `/work/${data.slug}`, { shallow: true });
    setSelected(data);
  }, [router]);

  useEffect(() => {
    if (router.asPath.length === 1) setSelected(null);
  }, [router]);

  return (
    <Section title="Experience" subTitle="WORK" className={styles.section}>
      {selected ? <Modal onClose={() => {
        setSelected(null)
        router.push(router.route, router.route, { shallow: true });
      }}><FullWorkItem {...selected} /></Modal> : null}
      <Skills />
      <Tabs navLabel="List Type" className={styles.tabWrapper}>
        {{
          Filtered: <FilteredWork onClick={(data) => selectWork(data)} />,
        }}
      </Tabs>
    </Section>
  );
}
