import React, { useState } from "react";
import styles from './Tabs.module.css'

interface TabsProps {
	children: Record<string, React.ReactNode>
}

export default function Tabs({ children }: TabsProps){
	const [activeTab, setActiveTab] = useState(Object.keys(children)[0]);
	return (
		<div className={styles.wrapper}>
			<nav>
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
			</nav>
			<div className={styles.content}>
				{children[activeTab]}
			</div>
		</div>
	)
}