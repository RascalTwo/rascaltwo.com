import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react"

export interface R2Set<T> {
	set: Set<T>
	setSet: Dispatch<SetStateAction<Set<T>>>
	add: (value: T | ((prevState: Set<T>) => T)) => void
	delete: (value: T | ((prevState: Set<T>) => T)) => void
	lastAdded: T | null
}

export const useSet = <T extends unknown>(initialState: Set<T> | (() => Set<T>) = () => new Set()): R2Set<T> => {
	const [set, setSet] = useState<Set<T>>(initialState);
	const [lastAdded, setLastAdded] = useState<T|null>(null);

	const addFunc = useCallback((value: T | ((prevState: Set<T>) => T)) => {
		const newSet = new Set(set);
		const newValue = value instanceof Function ? value(set) : value
		newSet.add(newValue);
		setLastAdded(newValue);
		setSet(newSet);
	}, [set]);

	const deleteFunc = useCallback((value: T | ((prevState: Set<T>) => T)) => {
		const newSet = new Set(set);
		newSet.delete(value instanceof Function ? value(set) : value)
		setSet(newSet);
	}, [set]);

	return { set, setSet, add: addFunc, delete: deleteFunc, lastAdded }
}


const SELECTION_HOOK = {
	rootListener: null,
	listeners: []
}

export const useSelection = (): [Node, Dispatch<SetStateAction<Element>>] => {
	const [selected, setSelected] = useState<Node>(null);
	const [within, setWithin] = useState<Element>(null);
	const updateSelected = useCallback((selected: Node) => {
		if (within?.contains(selected)) setSelected(selected);
	}, [within, setSelected]);

	useEffect(() => {
		if (!SELECTION_HOOK.rootListener){
			const listener = () => {
				const selected = document.getSelection();
				SELECTION_HOOK.listeners.forEach(hookUpdates => hookUpdates(selected.anchorNode));
			};
			SELECTION_HOOK.rootListener = listener;
			document.addEventListener('selectionchange', listener);
		}
		SELECTION_HOOK.listeners.push(updateSelected);
		return () => {
			SELECTION_HOOK.listeners.splice(SELECTION_HOOK.listeners.indexOf(updateSelected), 1)
			if (SELECTION_HOOK.listeners.length) return

			document.removeEventListener('selectionchange', SELECTION_HOOK.rootListener);
			SELECTION_HOOK.rootListener = null;
		}
	}, [updateSelected]);

	return [selected, setWithin];
}