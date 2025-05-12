import { PriorizeOperator, AstTokenType } from './model/ast';
import { TokenOperator, TokenStatement } from '../lexer/model/token';
import {AstOperator} from './model/ast';
import { TokenType, type Token } from "../lexer/model/token";
import type { AstNode } from './model/ast';
import type { PrintStatement, Statement } from './model/statement';
import type { Program } from './model/program';


export class Parser {
    tokens: Token[];
    cursor: number;
    outputStack: AstNode[];
    body: Statement[]
    operatorStack: Token[];

    constructor(tokens: Token[]) {
        this.tokens = tokens;
        this.cursor = 0;
        this.outputStack = [];
        this.operatorStack = [];
        this.body = [];
    }

    parse() : Program {
        while (!this.isEnd()) {
            const smt = this.parseStatement();
            this.body.push(smt)



        }

        return {
            type: "program",
            body: this.body
        }
    }


    private parseStatement() : Statement {
        const token = this.peek();

        if (token.type == TokenStatement.PRINT) {
            return this.parsePrintToken();
        }

        const expr = this.parseExpression();

        return {
            type: "expression",
            expression: expr
        }
    }


    private parseExpression() : AstNode {

        if (this.tokens.length <= 0) {
            throw new Error('Error parsing no token founds!');
        }

        while (!this.isEnd()) {
            const token = this.peek();
            switch (token?.type) {
                case TokenType.NUMBER:
                    this.addNumber(this.next()!);
                    break;
                case TokenType.IDENTIFIER:
                    this.addIdentifier(this.next()!);
                    break;
                case AstTokenType.OPEN_BRACKET:
                    this.operatorStack.push(this.next()!);
                    break;
                case AstTokenType.CLOSED_BRACKET:
                    this.next()!;
                    this.reduceUntilOpenBracket();
                    break;
                default:
                    if (this.isOperator(token)) {
                        this.reduceByPrecedence(token!);
                        this.operatorStack.push(this.next()!);
                        break;
                    }
                    throw new Error('Unexpected token ' + JSON.stringify(token));

            }
        }

        while (this.operatorStack.length > 0) {
            this.applyOperator();
        }

        return this.outputStack[0]!;

    }

    // Stack Function

    private addNumber(token: Token) {

        if (typeof (token.value) !== 'number') {
            throw new Error('Unexpected token value ' + JSON.stringify(token));
        }

        this.outputStack.push({
            type: 'literal',
            value: token.value
        })
    }

    private isOperator(token: Token | undefined): boolean {
        return token !== undefined && Object.keys(AstOperator).includes(token.type);
    }

    private addIdentifier(token: Token) {
        if (typeof (token.value) !== 'string') {
            throw new Error('Unexpected token value ' + JSON.stringify(token));
        }

        this.outputStack.push({
            type: 'variable',
            value: token.value
        });
    }

    // BRACKET FUNCTION

    private reduceUntilOpenBracket() {
       while (
        this.operatorStack.length > 0 &&
        this.operatorStack[this.operatorStack.length - 1]?.type !== AstTokenType.OPEN_BRACKET
    ) {
        this.applyOperator();
    }

    if (
        this.operatorStack.length === 0 ||
        this.operatorStack[this.operatorStack.length - 1]?.type !== AstTokenType.OPEN_BRACKET
    ) {
        throw new Error("Mismatched parentheses");
    }

        this.operatorStack.pop();
    }

    //OPERATOR FUNCTION

    private reduceByPrecedence(token: Token) {
        while (
            this.operatorStack.length > 0 &&
            this.operatorStack[this.operatorStack.length - 1]?.type !== TokenOperator.OPEN_BRACKET &&
            this.getPrecedence(this.operatorStack[this.operatorStack.length - 1]) >= this.getPrecedence(token)
        ) {
            this.applyOperator();
        }
    }

    private getPrecedence(token: Token | undefined): number {
        if (token == undefined || token.value == undefined) {
            throw new Error('Unexepected token not exist !');
        }


        return PriorizeOperator[token.value] ?? 0;
    }

    private applyOperator() {

        const operator = this.operatorStack.pop();

        if (!operator) throw new Error("Operator stack empty");

        const right = this.outputStack.pop();
        const left = this.outputStack.pop();
                
        if (
            operator?.type === TokenOperator.OPEN_BRACKET ||
            operator?.type === TokenOperator.CLOSED_BRACKET
        ) {
            throw new Error("Tried to apply a bracket as an operator");
        }

        if (!left || !right) throw new Error("Output stack missing operands");

        if (typeof (operator.value) !== 'string') throw new Error("Operator not conformed!");

        if (operator.type === AstTokenType.EQUAL) {
            if (left.type !== 'variable') {
                throw new Error("Left side of assignment must be a variable");
            }

            this.outputStack.push({
                type: 'assignement',
                left: left,
                right: right
            });
            return;
        }

        this.outputStack.push({
            type: 'binary',
            operator: operator.value!,
            left: left,
            right: right,
        });
    }

    // Statement

    private parsePrintToken() : PrintStatement{
        this.next();

        const open = this.next();
        if (open.type !== TokenOperator.OPEN_BRACKET) {
            throw new Error('Expected ( after print');
        }

        const argument = this.parseExpression();

        const close = this.next();

        if (close?.type !== TokenOperator.CLOSED_BRACKET) {
            throw new Error("Expected ')' after print argument");
        }

    return {
        type: 'print',
        expression: argument
    };
    }


    // UTILS FUNCTION

    private peek() : Token {
        return this.tokens[this.cursor]!;
    }

    private next() : Token {
        return this.tokens[this.cursor++]!;
    }

    private isEnd() : boolean {
        return this.cursor >= this.tokens.length;
    }

}