import { useCallback } from 'react'
import Section from '../Section'
import styles from './Contact.module.css'

export default function Contact(){
	return (
		<Section title="CONTACT" subTitle="Get in Touch">
			<form
				className={styles.form}
				onSubmit={useCallback((e) => {
					e.preventDefault();
					// @ts-ignore
					const params = new URLSearchParams(new FormData(e.target as HTMLFormElement)).toString()
					return fetch('/api/contact', {
						method: 'POST',
						body: params,
						headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
					}).then(() => {
						alert('Thank you for the message!\nI\'ll get back to you within one business day!');
						(e.target as HTMLFormElement).reset();
					});
				}, [])}
			>
				<div>
					<input className={styles.inputStyles} type="text" name="name" required placeholder="Name" />
				</div>
				<div>
					<input className={styles.inputStyles} type="email" name="email" placeholder="Email" />
				</div>
				<div>
					<input className={styles.inputStyles} type="tel" name="phone" placeholder="Phone Number" />
				</div>
				<div>
					<input className={styles.inputStyles} type="url" name="website" placeholder="Website"  />
				</div>
				<div className={styles.messageWrapper}>
					<textarea
						required
						className={`${styles.inputStyles} ${styles.textarea}`}
						name="message"
						placeholder="Message to send!"
					></textarea>
					<button className={styles.submitButton}>Let&apos;s chat!</button>
				</div>
			</form>
		</Section>
	)
}