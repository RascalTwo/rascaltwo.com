import { Dispatch, SetStateAction, useCallback, useState } from "react"

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

