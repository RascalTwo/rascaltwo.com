import Link from 'next/link'
import Image from 'next/image'
import LCDCounter from '../LCDCounter';

import styles from './Footer.module.css'
import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

const LINK_IMAGES = {
	Twitter: 'https://res.cloudinary.com/rascaltwo/image/upload/v1631924094/twitter_plruty.svg',
	Github: 'https://res.cloudinary.com/rascaltwo/image/upload/v1631924070/github_ilqm1g.svg',
	LinkedIn: 'https://res.cloudinary.com/rascaltwo/image/upload/v1647012653/linkedin_xcgtzl.svg',
	Email: 'https://res.cloudinary.com/rascaltwo/image/upload/v1647013328/email_vebz1u.svg'
}

export default function Footer({ name, links } : { name: string, links: Record<string, string> }){
	const { ref, inView } = useInView({ threshold: 0.5 });
  const [viewCount, setViewCount] = useState(0);
  useEffect(() => {
    if (inView && !viewCount) fetch('/api/views', { method: 'POST', body: JSON.stringify({ pathname: window.location.pathname }) })
      .then(r => r.json())
      .then(({ views }) => setViewCount(views));
  }, [viewCount, inView]);
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
      <div ref={ref}>
        <LCDCounter
          number={viewCount}
          title={`Retro LCD display showing ${viewCount} as the viewer count for this page`}
        />
      </div>
		</footer>
	)
}