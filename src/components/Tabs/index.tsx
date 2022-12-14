import React, { useEffect, useState } from "react";
import { useActivatedTabContext } from "../../context";
import styles from './Tabs.module.css'

interface TabsProps {
	navLabel: string
	className?: string
	children: Record<string, React.ReactNode>
}

export default function Tabs({ navLabel, className='', children }: TabsProps){
	const { activated, setActivated } = useActivatedTabContext();
	const [activeTab, setActiveTab] = useState(Object.keys(children)[0]);
	useEffect(() => {
		if (!activated || !Object.keys(children).includes(activated)) return;

		setActiveTab(activated);
		setActivated(null);
	}, [activated, setActivated, children]);

	return (
		<div className={`${styles.wrapper} ${className}`}>
			{Object.keys(children).length > 1 ? 
			<nav aria-label={navLabel}>
				<ul className={styles.tabs}>
					{Object.keys(children).map(key =>
						<li key={key} className={styles.tab}>
							<button
								onClick={() => setActiveTab(key)}
								data-active={activeTab === key}
							>
								{key}
							</button>
						</li>
					)}
				</ul>
			</nav> : null}
			<div className={styles.content}>
				{children[activeTab]}
			</div>
		</div>
	)
}