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
    STRING= 'STRING'

}
