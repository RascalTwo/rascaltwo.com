import Image from 'next/image'
import React, { useCallback, useMemo } from "react";
import Section from "../Section";
import Tabs from "../Tabs";
import { Technology } from '../../types';
import { useActivatedTabContext, useTechnologiesContext, useWorkFilterContext } from '../../context';

import styles from './Skills.module.css'


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
}

function Skill({ slug, technology: { background, name, image } }: SkillProps){
	const { setActivated } = useActivatedTabContext();
	const { inclusive, exclusive } = useWorkFilterContext();
	const isInclusive = useMemo(() => inclusive.set.has(slug), [slug, inclusive]);
	const isExclusive = useMemo(() => exclusive.set.has(slug), [slug, exclusive]);

	return (
    <button
			className={styles.skill}
			data-background={useMemo(() => background || 'dark', [background])}
			data-inclusive={isInclusive}
			data-exclusive={isExclusive}
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

export default function Skills(){
	const technologies = useTechnologiesContext();
	if (!Object.keys(technologies)) return null;

	return (
		<Section title="Technologies I've Used" subTitle="SKILLS">
			<Tabs navLabel='Technology Type Tabs'>
				{{
					...Object.entries(technologies)
					.sort(([a], [b]) => CATEGORIES_ORDER.indexOf(a) - CATEGORIES_ORDER.indexOf(b))
					.reduce((map, [key, values]) => ({
						...map,
						[key]:
							<div className={styles.wrapper}>
								{Object.entries(values) // @ts-ignore
									.map(([slug, technology]) =>
										<Skill key={slug} slug={slug} technology={technology} />
								)}
							</div>
					}), {}),
					'Help': (
						<span>
						All of these Technology icons can be used to filter the projects listed just below!
						<br/>
						Simply Left-Click the Technologies you want to see projects made with, or Right-Click technologies you don&apos;t want to see projects made with
						</span>
					)
				}}
			</Tabs>
		</Section>
	)
}