import { isDigit } from "../utils";

export function getNumber(code: string, cursor: number) {
    const start = cursor - 1;
    while(isDigit(code[cursor]) || code[cursor] == "." && isDigit(code[cursor + 1])) {
        cursor++;
    }
    
    return {start: start, end: cursor};
}