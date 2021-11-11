import { Dispatch, SetStateAction, useCallback, useState } from "react"

export interface R2Set<T> {
	set: Set<T>
	setSet: Dispatch<SetStateAction<Set<T>>>
	add: (value: T | ((prevState: Set<T>) => T)) => void
	delete: (value: T | ((prevState: Set<T>) => T)) => void
}

export const useSet = <T extends unknown>(initialState: Set<T> | (() => Set<T>) = () => new Set()): R2Set<T> => {
	const [set, setSet] = useState<Set<T>>(initialState);

	const addFunc = useCallback((value: T | ((prevState: Set<T>) => T)) => {
		const newSet = new Set(set);
		newSet.add(value instanceof Function ? value(set) : value)
		setSet(newSet);
	}, [set]);

	const deleteFunc = useCallback((value: T | ((prevState: Set<T>) => T)) => {
		const newSet = new Set(set);
		newSet.delete(value instanceof Function ? value(set) : value)
		setSet(newSet);
	}, [set]);

	return { set, setSet, add: addFunc, delete: deleteFunc }
}

