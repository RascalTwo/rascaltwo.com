import React from "react";
import styles from './Section.module.css'

interface SectionProps {
	title: string
	subTitle: string
	children: React.ReactNode
}

export default function Section({ title, subTitle, children }: SectionProps){
	return (
		<section id={`section-${title.toLowerCase()}`}>
			<div className={styles.titleWrapper}>
				<h2>{title}</h2>
				<p>{subTitle}</p>
			</div>

			<div className={styles.childrenWrapper}>{children}</div>

			<span>&nbsp;</span>
		</section>
	)
}