import type { AssignementExpression, AstNode, BinaryExpression, IdentifierLitteral, LogicalExpression, NumberLitteral, StringLitteral } from './model/ast';
import type { ExpressionStatement, PrintStatement, Statement } from './model/statement';
import type { Program } from '../models/program';
import { AstTokenType, type Token } from '../models/token';


export class Parser {
    tokens: Token[];
    cursor: number;
    body: Statement[];
    isFinished: boolean;

    constructor(tokens: Token[]) {
        this.tokens = tokens;
        this.cursor = 0;
        this.body = [];
        this.isFinished = false;
    }

    parse() : Program{
        while(!this.isFinished) {
            const stmt = this.parseStatement();
            if (stmt) {
                this.body.push(stmt);
            }
        }
        return {
            type: 'program',
            body: this.body
        }
    }

    // Statement function

    private parseStatement() : Statement | undefined {
        const token = this.peek();

        if (token == undefined) {
            return;
        }

        switch(token!.type) {
            case AstTokenType.PRINT:
                return this.parsePrint();
            default:
                return this.parseExpressionStatement();
        }
    }

    private parsePrint(): PrintStatement {
        const printToken = this.consume(AstTokenType.PRINT);
        this.consume(AstTokenType.OPEN_BRACKET);
        const expr = this.parseLogicalExpression();
        this.consume(AstTokenType.CLOSED_BRACKET);
        this.consume(AstTokenType.SEMICOLON);
        return {
            type: 'print',
            expression: expr
        }
    }

    private parseExpressionStatement() : ExpressionStatement{
        const expr = this.parseAssignement();
        this.consume(AstTokenType.SEMICOLON);
        return {
            type: 'expression',
            expression: expr
        }
    }



    // Assignement function

    private parseAssignement(): AstNode {
        let left = this.parseTermExpression();
        this.consume(AstTokenType.EQUAL);
        const right = this.parseLogicalExpression();

        if (left.type !== 'variable') {
            throw new Error(`Unexpected type for assignement: ` + JSON.stringify(left));
        }

        return {
            type: 'assignement',
            left: left,
            right: right
        }
    }


    // Binary function

    private parseTermExpression() {
         const operator = [AstTokenType.PLUS, AstTokenType.MINUS];
        let left = this.parseFactorExpression();

        while(this.include(operator)) {
            const value = this.getOperator(operator); 
            this.consume(value!);
                left = {
                    type: 'binary',
                    operator: value?.toString()!,
                    left: left,
                    right: this.parseFactorExpression()
                }            
        }


        return left;
    }

    private parseFactorExpression() : AstNode {
        const operator = [AstTokenType.MULT, AstTokenType.DIVIDE];
        let left = this.parseLitteral();

        while(this.include(operator)) {
            const value = this.getOperator(operator); 
            this.consume(value!);
                left = {
                    type: 'binary',
                    operator: value?.toString()!,
                    left: left,
                    right: this.parseLitteral()
                }            
        }


        return left;
    }

    private parseLogicalExpression() : AstNode {
        let left = this.parseTermExpression();
        const operators = [AstTokenType.SAME, AstTokenType.NOT_EQUAL, AstTokenType.GREATER, AstTokenType.SMALLER];
        while(this.include(operators)) {
            const operator = this.consume(this.getOperator(operators)!);
            const right = this.parseTermExpression()
            left = {
                type:'logical',
                operator: operator.type as string,
                left: left,
                right: right
            }
        }
        

        return left;
    }

    // LITTERAL FUNCTION 

    private parseLitteral(): AstNode {
        const token = this.peek();

        switch(token!.type) {
            case AstTokenType.NUMBER:
                return this.parseNumber();
            case AstTokenType.IDENTIFIER:
                return this.parseIdentifier();
            case AstTokenType.OPEN_BRACKET:
                return this.parseBracket();
            case AstTokenType.STRING:
                return this.parseString();
            default:
                throw new Error('Unexpected token: ' + JSON.stringify(token));
        }
    }

    private parseNumber() : NumberLitteral {
        const token = this.consume(AstTokenType.NUMBER);
        
        if (typeof(token.value) !== 'number') {
            throw new Error('Unexpected value for this type of token');
        }

        return {
            type: 'literal',
            value : token.value 
        }
    }

    private parseIdentifier() : IdentifierLitteral {
       const token = this.consume(AstTokenType.IDENTIFIER);
       if (typeof(token.value) !== 'string') {
            throw new Error('Unexpected value for this type of token');
       } 

       return {
        type: 'variable',
        value: token.value
       }
    }

    private parseString() : StringLitteral {
        const token = this.consume(AstTokenType.STRING);
        if (typeof(token.value) !== 'string') {
            throw new Error('Unexpected value for this type of token');
        }
        
        return {
            type: 'string',
            value: token.value
        }
    }

    private parseBracket() : AstNode {
        this.consume(AstTokenType.OPEN_BRACKET);
        const expr = this.parseTermExpression();
        this.consume(AstTokenType.CLOSED_BRACKET);

        return expr;
    }

    // UTILS FUNCTION

    private peek() : Token | undefined {
        if (this.cursor >= this.tokens.length) {
            this.isFinished = true;
        }

        const token = this.tokens[this.cursor];
        return token;
    }

    private consume(expectedType: AstTokenType) : Token {
        const token = this.peek();
        if (token!.type !== expectedType) {
            throw new Error('Unexpected type for token: ' + JSON.stringify(token));
        }
        this.cursor++;
        return token!;
    }

    private include(operators : AstTokenType[]) : boolean {
        return !! this.getOperator(operators);
    }

    private getOperator(operators : AstTokenType[]) : AstTokenType | undefined {
        const token = this.peek();
        return operators.find(op => token!.type == op)
    }

}