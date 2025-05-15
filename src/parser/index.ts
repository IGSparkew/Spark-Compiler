/**
 * Input file of the parser
 */

import type { Token } from "../models/token";
import type { Program } from "../models/program";
import { Parser } from "./parser";


/**
 * 
 * @param tokens 
 * @returns {Program}
 */
export function Parse(tokens: Token[]) : Program {
    const parser = new Parser(tokens);

    return parser.parse();
}