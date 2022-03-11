import Image from 'next/image';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { marked } from 'marked';
import { htmlToText } from 'html-to-text'

import Section from '../Section/index';
import Tabs from '../Tabs/index';

import { Technology, WorkData } from '../../types';
import { useTechnologiesContext, useWorkContext, useWorkFilterContext } from '../../context';

import styles from './Work.module.css';
import { R2Set } from '../../hooks';
import { Modal } from '../Modal';
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
          />
          {!playing ? <img src="./118620_play_icon.png" className={styles.playIcon} /> : null}
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
  }, [video, image, concepts]);

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
      />
    );
  }, [technologies]);
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
      />
    );
  }, [technologies, media, concepts]);

  return (
    <div className={styles.workItem} data-background={media.props['data-background']} data-in-view={inView}>
      <a className={styles.text} href={sourceURL} target="_blank" rel="noreferrer" aria-hidden>
        {title}
      </a>
      {media}
      {techIcon}
      {conceptIcon}
    </div>
  );
}

interface TechnologyBadgeProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  tag: string;
  badgeType: 'inclusive' | 'exclusive';
}

function TechnologyBadge({ tag, badgeType, ...props }: TechnologyBadgeProps) {
  const technologies = useTechnologiesContext();
  const technology = Object.values(technologies)
    .flatMap(techs => Object.entries(techs))
    .reduce((map, [slug, tech]) => ({ ...map, [slug]: tech }), {} as Record<string, Technology>)[tag];


  return (
    <button
      className={styles.badge}
      aria-label={`${badgeType[0].toUpperCase() + badgeType.slice(1)} ${technology.name} tag`}
      data-background={technology.background ?? 'dark'}
      data-type={badgeType}
      {...props}
    >
      <span className={styles.badgeIconWrapper} aria-hidden>
        <Image
          src={technology.image}
          alt={technology.name}
          title={technology.name}
          layout="fill"
          objectFit="contain"
          objectPosition="left center"
          className={styles.badgeImage}
        />
      </span>

      <span className={styles.badgeCaption} aria-hidden >{technology.name}</span>
    </button>
  );
}

/**
 * From https://www.tutorialspoint.com/levenshtein-distance-in-javascript
 */
const levenshteinDistance = (str1: string, str2: string) => {
  const track = Array(str2.length + 1)
    .fill(null)
    .map(() => Array(str1.length + 1).fill(null));
  for (let i = 0; i <= str1.length; i += 1) {
    track[0][i] = i;
  }
  for (let j = 0; j <= str2.length; j += 1) {
    track[j][0] = j;
  }
  for (let j = 1; j <= str2.length; j += 1) {
    for (let i = 1; i <= str1.length; i += 1) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      track[j][i] = Math.min(
        track[j][i - 1] + 1, // deletion
        track[j - 1][i] + 1, // insertion
        track[j - 1][i - 1] + indicator, // substitution
      );
    }
  }
  return track[str2.length][str1.length];
};

function NewWorkForm({ onAdd }: { onAdd: (slug: string) => void }) {
  const technologies = useTechnologiesContext();
  const technologiesMap = Object.values(technologies)
    .flatMap(techs => Object.entries(techs))
    .reduce((map, [slug, tech]) => ({ ...map, [slug]: tech }), {} as Record<string, Technology>);

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        let value = (e.currentTarget.elements[0] as HTMLInputElement).value;
        if (!(value in technologiesMap)) {
          const closest: [number, string, string] = Object.entries(technologiesMap).reduce((closest, [slug, tech]) => {
						const distance = Math.min(levenshteinDistance(value, slug), levenshteinDistance(value, tech.name));
						if (distance < closest[0]) return [distance, slug, tech.name];
						return closest;
					}, [Number.MAX_SAFE_INTEGER, '', '']);

          if (!confirm(`Invalid technology provieded, did you mean ${closest[2]}?`)) return;
          value = closest[1];
        }
        return onAdd(value);
      }}
    >
      <input list="new-work-datalist" placeholder="Tag to add" autoFocus />
      <datalist id="new-work-datalist">
        {Object.entries(technologiesMap).map(([slug, tech]) => (
          <option key={slug} value={slug}>
            {tech.name}
          </option>
        ))}
      </datalist>
      <button>Add</button>
    </form>
  );
}

interface FilteredWorkProps {
  onClick: (data: WorkData) => void
}

function FilteredWork({ onClick }: FilteredWorkProps) {
  const { ref, inView } = useInView({ threshold: 0.33 });

  const work = useWorkContext();
  const { inclusive, exclusive } = useWorkFilterContext();
  const [addingTo, setAddingTo] = useState<R2Set<string> | null>(null);
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

  const handleBadgeClick = useCallback(
    (tag: string) => {
      return (inclusive.set.has(tag) ? inclusive : exclusive).delete(tag);
    },
    [inclusive, exclusive],
  );

  const handleAddTag = useCallback(
    (set: R2Set<string>) => setAddingTo(existing => (existing === set ? null : set)),
    [],
  );

  return (
    <div className={styles.wrapper} ref={ref}>
      {Object.entries(filteredWork).map(([slug, data]) => (
        <MiniWorkItem key={slug} slug={slug} {...data} onClick={() => onClick(data)} inView={inView} />
      ))}
			<div className={styles.filterForm}>
				<div style={{ textAlign: 'center' }}>Tags</div>
        <span className={styles.filterButtons}>
          <button type="button" aria-label="Add Inclusive Tag" onClick={handleAddTag.bind(null, inclusive)}>
            Include
          </button>
          <button type="button" aria-label="Add Exclusive Tag" onClick={handleAddTag.bind(null, exclusive)}>
            Exclude
          </button>
          <button
            type="button"
            aria-label="Clear All Tags"
            className={styles.clearFilterButton}
            onClick={useCallback(() => {
              inclusive.setSet(new Set());
              exclusive.setSet(new Set());
            }, [inclusive, exclusive])}
          >
            Clear
          </button>
        </span>
          {addingTo ? (
            <NewWorkForm
              onAdd={tag => {
                addingTo.add(tag);
                setAddingTo(null);
              }}
            />
          ) : null}
        <div className={styles.filterBadges}>
          {Object.entries({
            exclusive: exclusive,
            inclusive: inclusive,
          })
            .map(([type, { set }]) => Array.from(set).map(tag => ({ tag, type })))
            .flat()
            .map(({ tag, type }) => (
              <TechnologyBadge
                key={tag}
                tag={tag}
                badgeType={type as 'inclusive' | 'exclusive'}
                onClick={handleBadgeClick.bind(null, tag)}
              />
            ))}
        </div>
      </div>
    </div>
  );
}

export default function Work() {
  const router = useRouter();
  const work = useWorkContext();
  const [selected, setSelected] = useState<WorkData | null>(null);
  const selectWork = useCallback((data: WorkData) => {
    setSelected(data);
    router.push(router.route, `/work/${data.slug}`, { shallow: true });
  }, [router]);

  return (
    <Section title="Experience" subTitle="WORK">
      {selected ? <Modal onClose={() => {
        setSelected(null)
        router.push(router.route, router.route, { shallow: true });
      }}><FullWorkItem {...selected} /></Modal> : null}
      <Tabs navLabel="List Type">
        {{
          Filtered: <FilteredWork onClick={(data) => selectWork(data)} />,
        }}
      </Tabs>
    </Section>
  );
}
