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
    SEMICOLON=";",
    OPEN_BRACE="{",
    CLOSED_BRACE="}",
    PLUS_EQUAL="+=",
    MINUS_EQUAL="-=",
    MULT_EQUAL="*=",
    DIVIDE_EQUAL="/=",
}

export enum TokenLogical {
    SAME = "==",
    GREATER = ">",
    SMALLER = "<",
    GREATER_OR_EQUAL = ">=",
    SMALLER_OR_EQUAL = "<=",
    NOT_EQUAL = "!=",
    AND="&&",
    OR="||"
}

export enum TokenType {
    NUMBER= "NUMBER",
    IDENTIFIER= "IDENTIFIER",
    STRING = "STRING",
    BOOLEAN= "BOOLEAN"
}

export enum TokenBoolean {
    TRUE = "true",
    FALSE = "false"
}

export enum TokenStatement {
    PRINT = "print",
    IF="if",
    ELSE="else",
    WHILE="while"
}