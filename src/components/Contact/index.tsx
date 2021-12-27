import { useCallback, useState } from 'react'
import { Modal } from '../Modal';
import Section from '../Section'
import styles from './Contact.module.css'

export default function Contact(){
	const [message, setMessage] = useState('');
	const closeModal = useCallback(() => setMessage(''), []);

	return (
		<Section title="CONTACT" subTitle="Get in Touch">
			{message ? <Modal onClose={closeModal}>{message}</Modal> : null}

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
					}).then(async r => {
						const message = await r.text();
						if (r.ok) return message;
						throw message;
					}).then(message => {
						(e.target as HTMLFormElement).reset();
						return message
					}).catch(message => message).then(setMessage);
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