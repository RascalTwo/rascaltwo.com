import { CSSProperties, useCallback, useEffect, useState } from 'react'
import Typewriter from '../Typewriter'
import styles from './Header.module.css'

export default function Header({ name }: { name: string }){
	const [bgUrl, setBGUrl] = useState('header-low.webp');

	useEffect(() => {
		if (bgUrl === 'header-high.png') return;
		const timeout = setTimeout(
			() => setBGUrl(`header-${bgUrl === 'header-low.webp' ? 'medium' : 'high'}.png`),
			bgUrl === 'header-low.webp' ? 5000 : 10000
		);
		return () => clearTimeout(timeout);
	}, [bgUrl]);

	return (
		<header
			className={styles.header}
			style={{
				'--bg-url': `url(/${bgUrl})`
			} as CSSProperties}
		>
			<span>
				<h1>{name}</h1>
				<Typewriter
					phrases={[
						"Software Engineer",
						"Fullstack Developer",
						"Polyglot"
					]}
					typingRate={250}
					pauseMS={[0, 10000]}
					initialIndex={8}
					render={useCallback(text => <span>{text}</span>, [])}
				/>
			</span>
		</header>
	)
}