import { Compiler } from "./compiler";



export function Compile(code: string, debug: boolean = false, showAscii:boolean = true, lexeronly:boolean = false, parserOnly: boolean = false) {
    const compiler = new Compiler(code, debug, showAscii, lexeronly, parserOnly);
    compiler.execute();
}