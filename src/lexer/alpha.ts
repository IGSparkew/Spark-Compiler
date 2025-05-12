import { isAlpha, isDigit } from "../utils";

export function getAlpha(code: string, cursor: number) {
    const start = cursor - 1;
    while(isAlpha(code[cursor]) || isDigit(code[cursor])) {
        cursor++;
    }
    
    return {start: start, end: cursor};
}