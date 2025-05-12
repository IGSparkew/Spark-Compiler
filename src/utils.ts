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