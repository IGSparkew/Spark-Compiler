import { TokenLogical } from "./lexer/model/token";

export function filter_character(char: string): boolean {
    return char === " " || char === "\0" || char === "\n" || char === "\r" || char === "\t"
}

export function isDigit(c: string | undefined) {
    if (c == undefined) return false;
    const digit = '0123456789';
    return digit.includes(c);
}

export function isAlpha(c: string | undefined) {
    if (c== undefined) return false;
    return c >=  "a" && c <= "z" || c >=  "A" && c <= "Z" || c === "_";
}

export function findKeyOfTokenLogical(value: string | TokenLogical) {
    const match = Object.entries(TokenLogical).find(([k, v]) => v == value);
    if (match) {
        const [k] = match;
        return k;
    }

    return undefined;
}