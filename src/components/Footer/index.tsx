import Link from 'next/link'
import styles from './Footer.module.css'

export default function Footer({ name } : { name: string}){
	return (
		<footer className={styles.footer}>Copyright © 2016 <Link href="/">{name}</Link>. All rights reserved</footer>
	)
}