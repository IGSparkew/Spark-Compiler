export enum TokenOperator {
    PLUS="+",
    MINUS="-",
    MULT = "*",
    DIVIDE="/",
    OPEN_BRACKET="(",
    CLOSED_BRACKET=")",
    EXCLAMATION="!",
    EQUAL = "=",
    QUOTES= '"',
    GREATER=">",
    SMALLER="<",
    SEMICOLON=";"
}

export enum TokenLogical {
    SAME = "==",
    GREATER = ">",
    SMALLER = "<",
    GREATER_OR_EQUAL = ">=",
    SMALLER_OR_EQUAL = "<=",
    NOT_EQUAL = "!="
}

export enum TokenType {
    NUMBER= "NUMBER",
    IDENTIFIER="IDENTIFIER",
    STRING = "STRING"
}

export enum TokenStatement {
    PRINT = "print"
}