export type Token = {
    type: string,
    value?: number | string
}

export enum AstTokenType {
    PRINT = 'PRINT' , 
    OPEN_BRACKET = 'OPEN_BRACKET' , 
    CLOSED_BRACKET = 'CLOSED_BRACKET' , 
    NUMBER = 'NUMBER' , 
    IDENTIFIER = 'IDENTIFIER' , 
    PLUS = 'PLUS' , 
    MINUS = 'MINUS' , 
    MULT='MULT' , 
    DIVIDE = 'DIVIDE' , 
    EQUAL = 'EQUAL',
    STRING= 'STRING',
    SAME= "SAME",
    GREATER="GREATER",
    GREATER_OR_EQUAL="GREATER_OR_EQUAL",
    SMALLER="SMALLER",
    SMALLER_OR_EQUAL="SMALLER_OR_EQUAL",
    NOT_EQUAL='NOT_EQUAL',
    SEMICOLON='SEMICOLON',
    OPEN_BRACE="OPEN_BRACE",
    CLOSED_BRACE="CLOSED_BRACE",
    AND='AND',
    OR='OR',
    IF='IF',
    ELSE='ELSE',
    EXCLAMATION='EXCLAMATION'
}
