import { createContext, useContext } from "react";
import { R2Set } from "./hooks";
import { Technologies, WorkData } from "./types";

export const WorkContext = createContext<WorkData[]>([]);
export const useWorkContext = () => useContext(WorkContext);

export const TechnologiesContext = createContext<Technologies>({});
export const useTechnologiesContext = () => useContext(TechnologiesContext);

export const WorkFilterContext = createContext<{
	inclusive: R2Set<string>
	exclusive: R2Set<string>
}>(undefined);
export const useWorkFilterContext = () => useContext(WorkFilterContext);