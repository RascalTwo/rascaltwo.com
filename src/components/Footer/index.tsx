import Link from 'next/link'
import styles from './Footer.module.css'

export default function Footer(){
	return (
		<footer className={styles.footer}>Copyright © 2016 <Link href="/">Joseph Milliken</Link>. All rights reserved</footer>
	)
}