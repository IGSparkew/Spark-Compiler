/**
 * Input file of lexer
 */

import { Lexer } from "./lexer";

/**
 * 
 * @param code 
 * @returns {Token[]}
 */
export function Lex(code: string) {
    const lexer = new Lexer(code);
    lexer.lex();

    return lexer.tokens;
}