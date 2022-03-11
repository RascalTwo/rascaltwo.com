import React from "react";
import { useInView } from "react-intersection-observer";
import styles from './Section.module.css'

interface SectionProps {
	title: string
	subTitle: string
	children: React.ReactNode
}

export default function Section({ title, subTitle, children }: SectionProps){
  const { ref, inView } = useInView({ threshold: 1 });
	return (
		<section id={`section-${subTitle.toLowerCase()}`}>
			<div className={styles.titleWrapper} ref={ref} data-in-view={inView}>
				<p aria-hidden>{subTitle}</p>
				<h2>{title}</h2>
			</div>

			<div className={styles.childrenWrapper}>{children}</div>
		</section>
	)
}