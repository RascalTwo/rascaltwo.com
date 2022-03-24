import Image from 'next/image'
import React, { CSSProperties, useCallback, useEffect, useMemo, useRef } from "react";
import Tabs from "../Tabs";
import { Technology } from '../../types';
import { useActivatedTabContext, useTechnologiesContext, useWorkFilterContext } from '../../context';

import styles from './Skills.module.css'
import { useInView } from 'react-intersection-observer';
import { useSelection } from '../../hooks';


const CATEGORIES_ORDER = [
  'Languages',
  'Frameworks',
  'Services',
  'Platforms',
  'Data',
  'Equipment',
  'Libraries',
  'Tooling',
	'Protocols',
	'Concepts'
];

interface SkillProps {
	slug: string
	technology: Technology
	inView: boolean
	delay: number
}

function Skill({ slug, technology: { background, name, image }, inView, delay }: SkillProps){
	const { setActivated } = useActivatedTabContext();
	const { inclusive, exclusive } = useWorkFilterContext();
	const isInclusive = useMemo(() => inclusive.set.has(slug), [slug, inclusive]);
	const isExclusive = useMemo(() => exclusive.set.has(slug), [slug, exclusive]);

	const ref = useRef<HTMLButtonElement | null>(null);

	const [selected, setWithin] = useSelection();
	useEffect(() => setWithin(ref.current), [setWithin]);

	return (
    <button
			ref={ref}
			className={styles.skill}
			data-background={useMemo(() => background || 'dark', [background])}
			data-inclusive={isInclusive}
			data-exclusive={isExclusive}
			data-in-view={inView}
			data-selected={!!selected}
			style={{
				'--delay': delay + 'ms'
			} as CSSProperties}
			tabIndex={0}
			aria-label={`${name} Logo`}
			onClick={useCallback(() => {
				setActivated('Filtered');
				if (isInclusive)  return inclusive.delete(slug);

				inclusive.add(slug);
				if (isExclusive) exclusive.delete(slug);
			}, [setActivated, exclusive, inclusive, isExclusive, isInclusive, slug])}
			onContextMenu={useCallback((e) => {
				e.preventDefault();
				setActivated('Filtered');
				if (isExclusive) return exclusive.delete(slug);

				exclusive.add(slug);
				if (isInclusive) inclusive.delete(slug)
			}, [setActivated, exclusive, inclusive, isExclusive, isInclusive, slug])}
		>
      <Image src={image} alt={name} title={name} layout="fill" objectFit="contain" className={styles.img} aria-hidden />
      <span aria-hidden className={styles.text}>{name}</span>
    </button>
  );
}

interface SkillTabProps {
	categorySkills: Record<string, Technology>
}

function SkillTab({ categorySkills }: SkillTabProps){

  const { ref, inView } = useInView({ threshold: 0.33 });
	return (
		<div className={styles.wrapper} ref={ref}>
			{Object.entries(categorySkills) // @ts-ignore
				.map(([slug, technology], i) =>
					<Skill key={slug} slug={slug} technology={technology} inView={inView} delay={i * 125} />
			)}
		</div>
	)
}

export default function Skills(){
	const technologies = useTechnologiesContext();
	if (!Object.keys(technologies)) return null;

	return (
		<Tabs navLabel='Technology Type Tabs'>
			{{
				...Object.entries(technologies)
				.sort(([a], [b]) => CATEGORIES_ORDER.indexOf(a) - CATEGORIES_ORDER.indexOf(b))
				.reduce((map, [key, values]) => ({
					...map,
					[key]: <SkillTab key={key} categorySkills={values} />
				}), {})
			}}
		</Tabs>
	)
}