import Image from 'next/image'
import React from "react";
import Section from "../Section";
import Tabs from "../Tabs";
import TECHNOLOGIES from '../../data/technologies.yaml'
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
	'Protocols'
];

export default function Skills(){
	return (
		<Section title="SKILLS" subTitle="Technologies I've Used">
			<Tabs>
				{Object.entries(TECHNOLOGIES)
					.sort(([a], [b]) => CATEGORIES_ORDER.indexOf(a) - CATEGORIES_ORDER.indexOf(b))
					.reduce((map, [key, values]) => ({
						...map,
						[key]:
							<div className={styles.wrapper}>
								{Object.entries(values) // @ts-ignore
									.map(([slug, { name, image, background }]) =>
										<div
											key={slug}
											className={styles.skill}
											data-background={background || 'dark'}
										>
											<Image
												src={image}
												alt={name}
												title={name}
												layout="fill"
												objectFit="contain"
												className={styles.img}
											/>
										</div>
								)}
							</div>
					}), {})
				}
			</Tabs>
		</Section>
	)
}