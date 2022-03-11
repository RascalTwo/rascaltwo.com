import Link from 'next/link'
import Image from 'next/image'

import styles from './Footer.module.css'

const LINK_IMAGES = {
	Twitter: 'https://res.cloudinary.com/rascaltwo/image/upload/v1631924094/twitter_plruty.svg',
	Github: 'https://res.cloudinary.com/rascaltwo/image/upload/v1631924070/github_ilqm1g.svg',
	LinkedIn: 'https://res.cloudinary.com/rascaltwo/image/upload/v1647012653/linkedin_xcgtzl.svg',
	Email: 'https://res.cloudinary.com/rascaltwo/image/upload/v1647013328/email_vebz1u.svg'
}

export default function Footer({ name, links } : { name: string, links: Record<string, string> }){
	return (
		<footer className={styles.footer}>
			<ul>
				{Object.entries(links).map(([linkName, href]) => (
					<li key={linkName}>
						<a href={href}>
							<Image src={LINK_IMAGES[linkName]!} alt={`${name}'s ${linkName}`} title={`${name}'s ${linkName}`} width="33" height="33"/>
						</a>
					</li>
        ))}
			</ul>
			<p>Copyright © 2016 <Link href="/">{name}</Link>. All rights reserved</p>
		</footer>
	)
}