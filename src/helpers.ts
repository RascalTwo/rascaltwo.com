import getConfig from 'next/config'
import { useRouter } from 'next/router'
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

export const useLocaleConfig = () => {
  const config = getConfig().publicRuntimeConfig;
	const localeConfig = config[useRouter().locale];
	const name = localeConfig.name;
  return {
    ...localeConfig,
		meta: {
			...config.meta,
			title: config.meta.title.replace('NAME', name),
			oembedFilename: name.endsWith('Two') ? 'oembed.json' : 'oembed-jm.json'
		}
  } as {
    name: string;
    links: Record<string, string>;
    website: string;
    meta: Record<'description' | 'keywords' | 'title' | 'oembedFilename', string>;
  };
};