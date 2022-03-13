import React from "react";
import { useInView } from "react-intersection-observer";
import styles from './Section.module.css'

interface SectionProps {
	title: string
	subTitle: string
	initialInView?: boolean
	className?: string;
	children: React.ReactNode
}

export default function Section({ title, subTitle, initialInView=false, className='', children }: SectionProps){
  const { ref, inView } = useInView({ threshold: 0.25, initialInView });
	return (
		<section id={`section-${subTitle.toLowerCase()}`} ref={ref}>
			<div className={styles.titleWrapper} data-in-view={inView}>
				<p aria-hidden>{subTitle}</p>
				<h2>{title}</h2>
			</div>

			<div className={`${styles.childrenWrapper} ${className}`}>{children}</div>
		</section>
	)
}