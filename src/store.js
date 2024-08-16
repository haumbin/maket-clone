// 상태관리를 위한 프론트엔드의 저장소 느낌 현재 상태를 여기에 저장한다.
import { writable } from "svelte/store";

export const user$ = writable(null);
