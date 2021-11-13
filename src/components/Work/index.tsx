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

interface MiniWorkMedia {
  video: string;
  image: string;
  text: string
}

function MiniWorkMedia({ video, image, text }: MiniWorkMedia) {
  const { ref, inView, entry } = useInView({ threshold: 1 });
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (entry?.target?.tagName !== 'VIDEO') return;
    new Promise(r => r(entry.target[playing ? 'play' : 'pause']())).catch(() => undefined);
  }, [playing, entry]);

  const onMouseEnter = useCallback(() => setPlaying(false), []);
  const startPlaying = useCallback(() => setPlaying(true), []);

  return playing || inView ? (
    <video
      ref={ref}
      src={video}
      className={styles.media}
      autoPlay
      loop
      playsInline
      onMouseEnter={onMouseEnter}
      onMouseLeave={startPlaying}
      onCanPlayThrough={startPlaying}
      poster={image}
      title={text}
    />
  ) : (
    <img ref={ref} src={image} className={styles.media} alt={text} title={text} />
  );
}

function WorkItem({
  slug,
  urls: { image, video, source: sourceURL, ...otherURLs },
  text: { title, alt, description },
  tags: { technologies, concepts },
}: WorkData) {
  const text = useMemo(() => {
    let markdown = Object.entries(otherURLs).map(([key, value]) => `[${slug} ${key}]: ${value}`).join('\n') + '\n';
    if (description) markdown += description + ' - ';
    markdown += alt;
    return htmlToText(marked.parse(markdown), {
      selectors: [{ selector: 'a', format: 'inline' }]
    });
  }, [slug, otherURLs, alt, description]);
  const media = useMemo(() => {
    if (video) return <MiniWorkMedia video={video} image={image} text={text} />;
    if (image) return <img className={styles.media} src={image} alt={text} title={text} />;

    const tech = Object.values(concepts)[0];
    return (
      <img
        className={styles.media}
        src={tech.image}
        title={text}
        alt={text}
        data-background={tech.background || 'dark'}
      />
    );
  }, [video, image, concepts]);

  const techIcon = useMemo(() => {
    const tech = Object.values(technologies)[0];
    return (
      <img
        className={styles.icon}
        data-side="left"
        src={tech.image}
        title={tech.name}
        alt={tech.name}
        data-background={tech?.background || 'dark'}
      />
    );
  }, [technologies]);
  const conceptIcon = useMemo(() => {
    const concept = Object.values(concepts).find(concept => concept.image != media.props.src) || technologies[1];
    if (!concept) return;
    return (
      <img
        className={styles.icon}
        data-side="right"
        src={concept.image}
        title={concept.name}
        alt={concept.name}
        data-background={concept?.background || 'dark'}
      />
    );
  }, [media, concepts]);

  return (
    <div className={styles.workItem} data-background={media.props['data-background']}>
      <a className={styles.text} href={sourceURL} target="_blank" rel="noreferrer">
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
      data-background={technology.background ?? 'dark'}
      data-type={badgeType}
      {...props}
    >
      <span className={styles.badgeIconWrapper}>
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

      <span className={styles.badgeCaption}>{technology.name}</span>
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

function FilteredWork() {
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
    <div className={styles.wrapper}>
			<div className={styles.filterForm}>
				<div style={{ textAlign: 'center' }}>Tags</div>
        <span className={styles.filterButtons}>
          <button type="button" onClick={handleAddTag.bind(null, inclusive)}>
            Include
          </button>
          <button type="button" onClick={handleAddTag.bind(null, exclusive)}>
            Exclude
          </button>
          <button
            type="button"
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
      {Object.entries(filteredWork).map(([slug, data]) => (
        <WorkItem key={slug} slug={slug} {...data} />
      ))}
    </div>
  );
}

export default function Work() {
  const work = useWorkContext();

  return (
    <Section title="WORK" subTitle="Projects I've Made">
      <Tabs>
        {{
          All: (
            <div className={styles.wrapper}>
              {Object.entries(work).map(([slug, data]) => (
                <WorkItem key={slug} slug={slug} {...data} />
              ))}
            </div>
          ),
          Filtered: <FilteredWork />,
        }}
      </Tabs>
    </Section>
  );
}
