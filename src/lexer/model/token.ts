export type Token = {
    type: string,
    value?: number | string
}

export enum TokenOperator {
    PLUS="+",
    MINUS="-",
    MULT = "*",
    DIVIDE="/",
    OPEN_BRACKET="(",
    CLOSED_BRACKET=")",
    EQUAL = "="
}

export enum TokenType {
    NUMBER= "number",
    IDENTIFIER="identifier"
}

export enum TokenStatement {
    PRINT = "print"
}