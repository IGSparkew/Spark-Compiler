import { Compiler } from "./compiler";



export function Compile(code: string, debug: boolean = false, showAscii:boolean = true) {
    const compiler = new Compiler(code, debug, showAscii);
    compiler.execute();
}