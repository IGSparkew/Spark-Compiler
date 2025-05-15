/**
 * Input file for interpreter
 */

import type { Program } from "../models/program";
import { Interpreter } from "./interpreter";

/**
 * 
 * @param program 
 * @returns {void}
 */
export function Interprete(program: Program) {
    const interpreter = new Interpreter(program);

    return interpreter.interprete();
}