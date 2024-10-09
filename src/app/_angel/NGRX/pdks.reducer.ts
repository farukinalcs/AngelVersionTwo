import { createReducer,on } from "@ngrx/store";
import { pdksIncrement } from "./pdks.action";

export const initialPdks = 0;

export const PdksReducer = createReducer(
    initialPdks,
    on(pdksIncrement,(state)=>state +=1)
)