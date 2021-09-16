import { useEffect, useMemo, useState } from "react"

/**
 * @param args Arguments of {@link window.setTimeout}
 * @returns {Function} function to clear the set timeout
 */
const createTimeoutEffect = (...args: Parameters<typeof window.setTimeout>) => {
	const timeout = window.setTimeout(...args);
	return () => clearTimeout(timeout);
}

interface TypewriterProps {
	phrases: string[]
	typingRate: number
	pauseMS: number
}

export default function Typewriter({ phrases, typingRate, pauseMS }: TypewriterProps){
	// Current phrase index, phrase, and the next phrase
	const [phraseIndex, setPhraseIndex] = useState(0);
	const phrase = useMemo(() => phrases[phraseIndex] ?? '', [phraseIndex, phrases]);
	const nextPhrase = useMemo(() => phrases[(phraseIndex + 1) % phrases.length] ?? '', [phraseIndex, phrases]);


	// Current text index and text itself
	const [textIndex, setTextIndex] = useState(0);
	const text = useMemo(() =>  phrase.slice(0, textIndex), [phrase, textIndex])


	// If text is being written or backspaces
	const [writing, setWriting] = useState(true);

	useEffect(() => {
		// Don't cycle when there is not at least two phrases
		if (phrases.length <= 1) return;

		// If writing and reached end of the phrase, start backspacing
		if (writing && textIndex === phrase.length) {
			return createTimeoutEffect(() => setWriting(false), pauseMS / 2);
		}

		// If backspacing and the next phrase starts with the current phrase,
		// move onto the next phrase
		if (!writing && nextPhrase.startsWith(text)){
			return createTimeoutEffect(() => {
				setWriting(true);
				setPhraseIndex(pi => (pi + 1) % phrases.length);
			}, pauseMS);
		}

		// Change text index by one accordingly
		return createTimeoutEffect(() => setTextIndex(i => i + (writing ? 1 : -1)), typingRate);
	}, [phrases, typingRate, pauseMS, writing, textIndex, nextPhrase, text, phrase.length]);

	return <p>{text}</p>
}
