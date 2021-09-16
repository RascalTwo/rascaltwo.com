import { useCallback } from 'react'
import Typewriter from '../Typewriter'
import styles from './Header.module.css'

export default function Header(){
	return (
		<header className={styles.header}>
			<span>
				<p>Hello!</p>
				<Typewriter
					phrases={[
						"I'm Joseph Milliken",
						"I'm Rascal Two",
						"I'm a Software Engineer",
						"I'm a Fullstack Developer",
						"I'm a Polyglot"
					]}
					typingRate={250}
					pauseMS={2500}
					initialIndex={4}
					render={useCallback(text => <h1>{text}</h1>, [])}
				/>
			</span>
		</header>
	)
}