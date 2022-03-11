import React from "react";
import styles from './Section.module.css'

interface SectionProps {
	title: string
	subTitle: string
	children: React.ReactNode
}

export default function Section({ title, subTitle, children }: SectionProps){
	return (
		<section id={`section-${subTitle.toLowerCase()}`}>
			<div className={styles.titleWrapper}>
				<p aria-hidden>{subTitle}</p>
				<h2>{title}</h2>
			</div>

			<div className={styles.childrenWrapper}>{children}</div>
		</section>
	)
}