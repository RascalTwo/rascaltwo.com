import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";


export const IS_PRODUCTION = process.env.NODE_ENV === 'production';


type Destructor = () => void

export const usePortal = (selector: string, content: React.ReactNode, callback?: ((element: Element) => (void | Destructor))) => {
	const [mounted, setMounted] = useState(false);
	useEffect(() => setMounted(true), []);

	const [element, setElement] = useState<Element>();

	useEffect(() => {
		if (!mounted) return;
		setElement(document.querySelector(selector)!);
	}, [mounted, selector])

	useEffect(() => callback(element), [element, callback]);

	return element ? createPortal(content, element) : null;
}