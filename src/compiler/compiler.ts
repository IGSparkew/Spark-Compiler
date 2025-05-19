import { Interprete } from "../interpreter";
import { Lex } from "../lexer";
import type { Program } from "../models/program";
import type { Token } from "../models/token";
import { Parse } from "../parser";


export class Compiler {

    private debug: boolean;
    private code: string;
    private tokens: Token[];
    private program?: Program;
    private showAscii: boolean;
    private lexerOnly: boolean;
    private parserOnly: boolean;

    constructor(code: string, debug: boolean, showAscii: boolean, lexerOnly:boolean, parserOnly:boolean) {
        this.code = code;
        this.debug = debug;
        this.tokens = [];
        this.showAscii = showAscii;
        this.lexerOnly=lexerOnly;
        this.parserOnly=parserOnly;
    }


    execute() {

        if (this.showAscii) {
            console.log(` $$$$$$\                                $$\              $$$$$$\                                    $$\ $$\                     
$$  __$$\                               $$ |            $$  __$$\                                   \__|$$ |                    
$$ /  \__| $$$$$$\   $$$$$$\   $$$$$$\  $$ |  $$\       $$ /  \__| $$$$$$\  $$$$$$\$$$$\   $$$$$$\  $$\ $$ | $$$$$$\   $$$$$$\  
\$$$$$$\  $$  __$$\  \____$$\ $$  __$$\ $$ | $$  |      $$ |      $$  __$$\ $$  _$$  _$$\ $$  __$$\ $$ |$$ |$$  __$$\ $$  __$$\ 
 \____$$\ $$ /  $$ | $$$$$$$ |$$ |  \__|$$$$$$  /       $$ |      $$ /  $$ |$$ / $$ / $$ |$$ /  $$ |$$ |$$ |$$$$$$$$ |$$ |  \__|
$$\   $$ |$$ |  $$ |$$  __$$ |$$ |      $$  _$$<        $$ |  $$\ $$ |  $$ |$$ | $$ | $$ |$$ |  $$ |$$ |$$ |$$   ____|$$ |      
\$$$$$$  |$$$$$$$  |\$$$$$$$ |$$ |      $$ | \$$\       \$$$$$$  |\$$$$$$  |$$ | $$ | $$ |$$$$$$$  |$$ |$$ |\$$$$$$$\ $$ |      
 \______/ $$  ____/  \_______|\__|      \__|  \__|       \______/  \______/ \__| \__| \__|$$  ____/ \__|\__| \_______|\__|      
          $$ |                                                                            $$ |                                  
          $$ |                                                                            $$ |                                  
          \__|                                                                            \__|                                  `);
        
          
          console.log(`
            by @IGSparkew. Copyright@${new Date().getFullYear()}
            LICENSE GNU AFFERO GENERAL PUBLIC LICENSE Version 3              
            `);   
        }

        if (this.code.length == 0) {
            throw new Error('Code input empty');
        }

        this.tokens = Lex(this.code);

        if (this.tokens.length == 0) {
            return;
        }

        if (this.debug) {
            console.log("================LEXER=================")
            console.log(this.tokens);
        }

        if (this.lexerOnly) {
            return;
        }

        this.program = Parse(this.tokens);

        if (this.program === undefined) {
            return;
        }

        if (this.debug) {
            console.log("===================Parser================");
            console.log(JSON.stringify(this.program));
        }

        if (this.parserOnly) {
            return;
        }

        if (this.debug) {
            console.log("===================Result================");
        }

        Interprete(this.program);
    }
}