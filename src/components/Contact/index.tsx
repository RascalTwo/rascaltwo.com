import { useCallback, useState } from 'react'
import { Modal } from '../Modal';
import Section from '../Section'
import styles from './Contact.module.css'

export default function Contact(){
	const [sending, setSending] = useState(false);
	const [message, setMessage] = useState('');
	const closeModal = useCallback(() => setMessage(''), []);

	return (
		<Section title="Get in Touch" subTitle="CONTACT">
			{message ? <Modal onClose={closeModal}>{message}</Modal> : null}

			<form
				className={styles.form}
				aria-label="Contact Form"
				onSubmit={useCallback((e) => {
					e.preventDefault();

					setSending(true);
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
					}).catch(message => message).then(setMessage).then(() => setSending(false));
				}, [])}
			>
				<div>
					<label>
						Name<br/>
						<input className={styles.inputStyles} disabled={sending} type="text" name="name" required placeholder="Name" />
					</label>
				</div>
				<div>
					<label>
						Email<br/>
						<input className={styles.inputStyles} disabled={sending} type="email" name="email" placeholder="Email" />
					</label>
				</div>
				<div>
					<label>
						Phone<br/>
						<input className={styles.inputStyles} disabled={sending} type="tel" name="phone" placeholder="Phone Number" />
					</label>
				</div>
				<div>
					<label>
						Website<br/>
						<input className={styles.inputStyles} disabled={sending} type="url" name="website" placeholder="Website"  />
					</label>
				</div>
				<div className={styles.messageWrapper}>
					<label>
						Message<br/>
						<textarea
							required
							className={`${styles.inputStyles} ${styles.textarea}`}
							disabled={sending}
							name="message"
							placeholder="Message to send!"
						></textarea>
					</label>
					<br/>
					<button className={styles.submitButton} disabled={sending}>Let&apos;s chat!</button>
				</div>
			</form>
		</Section>
	)
}