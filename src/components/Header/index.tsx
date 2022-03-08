import { useCallback } from 'react'
import Typewriter from '../Typewriter'
import styles from './Header.module.css'

export default function Header({ name }: { name: string }){
	return (
		<header className={styles.header}>
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