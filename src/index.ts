import { Interpreter } from './interpreter/interpreter';
import { Lexer } from "./lexer/lexer";
import { Parser } from "./parser/parser";

const code = 'a = (3 + 5) * 5';

const lexer = new Lexer(code);
lexer.lex();
const tokens = lexer.tokens; 
const parser = new Parser(tokens);


console.log("token:=====================")
console.log(parser.tokens);


console.log("ast:=====================")
const ast = parser.parse()
const interpreter = new Interpreter(ast!);

console.log(ast)
console.log("Interpreter:=====================")

console.log(interpreter.interprete());