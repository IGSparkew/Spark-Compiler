import type { AssignementExpression, AstNode, BinaryExpression, BooleanLitteral, IdentifierLitteral, LogicalExpression, NumberLitteral, StringLitteral } from './model/ast';
import type { BlockStatement, ExpressionStatement, IfStatement, PrintStatement, Statement, WhileStatement } from './model/statement';
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
            case AstTokenType.IF:
                return this.parseIf();
            case AstTokenType.WHILE:
                return this.parseWhile();
            default:
                return this.parseExpressionStatement();
        }
    }

    private parsePrint(): PrintStatement {
        const printToken = this.consume(AstTokenType.PRINT);
        this.consume(AstTokenType.OPEN_BRACKET);
        const expr = this.parseExpression();
        this.consume(AstTokenType.CLOSED_BRACKET);
        this.consume(AstTokenType.SEMICOLON);
        return {
            type: 'print',
            expression: expr
        }
    }

    private parseIf() : IfStatement {
        this.consume(AstTokenType.IF);
        this.consume(AstTokenType.OPEN_BRACKET);
        const condition = this.parseExpression();
        this.consume(AstTokenType.CLOSED_BRACKET);
        const consequence = this.parseBlockStatement();
        
        let alternate = undefined;
        
        if (this.peek()?.type == AstTokenType.ELSE) {
            this.consume(AstTokenType.ELSE);
            if (this.peek()?.type == AstTokenType.IF) {
                alternate = this.parseIf();
            } else {
                alternate = this.parseBlockStatement();
            }
        }
        
        return {
            type: 'if',
            condition,
            consequence,
            alternate
        }
    }

    private parseWhile() : WhileStatement {
        this.consume(AstTokenType.WHILE);
        this.consume(AstTokenType.OPEN_BRACKET);
        const condition = this.parseExpression();
        this.consume(AstTokenType.CLOSED_BRACKET);
        const consequence = this.parseBlockStatement();

        return {
            type:'while',
            condition,
            consequence
        }
    }

    private parseBlockStatement(): BlockStatement {
        this.consume(AstTokenType.OPEN_BRACE);
        const statements : Statement[] = [];

         while(this.peek()?.type !== AstTokenType.CLOSED_BRACE && !this.isFinished) {
            const smt = this.parseStatement();
            if (smt) statements.push(smt);
        }

        this.consume(AstTokenType.CLOSED_BRACE);

        return {
            type: 'block',
            statements,
        }

    }

    private parseExpressionStatement() : ExpressionStatement{
        const expr = this.parseExpression();
        this.consume(AstTokenType.SEMICOLON);
        return {
            type: 'expression',
            expression: expr
        }
    }

    private parseExpression(): AstNode {
        return this.parseAssignement();
    }


    // Assignement function

    private parseAssignement(): AstNode {
        let left = this.parseIncrementalAssignement();
        if (this.peek()?.type == AstTokenType.EQUAL) {
            this.consume(AstTokenType.EQUAL);
            const right = this.parseAssignement();

            if (left.type !== 'variable') {
                throw new Error(`Unexpected type for assignement: ` + JSON.stringify(left));
            }

            return {
                type: 'assignement',
                left: left,
                right: right
            }
        }
        
        return left;
    }

    private parseIncrementalAssignement() : AstNode {
        const operators = [AstTokenType.PLUS_EQUAL, AstTokenType.MINUS_EQUAL, AstTokenType.MULT_EQUAL, AstTokenType.DIVIDE_EQUAL];
        let left = this.parseLogicalOrExpression();
        if (this.include(operators)) {
            const type = this.getOperator(operators);
            const op = this.consume(type!)
            const right = this.parseExpression();
            left = {
                type: 'increment_assignement',
                operator: op.type,
                right,
                left
            }
        }

        return left;
        
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
        let left = this.parseUnaryExpression();

        while(this.include(operator)) {
            const value = this.getOperator(operator); 
            this.consume(value!);
                left = {
                    type: 'binary',
                    operator: value?.toString()!,
                    left: left,
                    right: this.parseUnaryExpression()
                }            
        }


        return left;
    }

    private parseUnaryExpression() : AstNode {
        const operator = [AstTokenType.PLUS, AstTokenType.MINUS];
        if (this.include(operator)) {
            return {
                type: 'unary',
                operator: this.consume(this.getOperator(operator)!).type,
                left: this.parseLitteral()
            }
        }

        return this.parseLitteral();
    }

    // LOGICAL EXPRESSION

    private parseLogicalExpression() : AstNode {
        let left = this.parseUnaryLogicalExpression();
        const operators = [AstTokenType.SAME, AstTokenType.NOT_EQUAL, AstTokenType.GREATER, AstTokenType.SMALLER, AstTokenType.GREATER_OR_EQUAL, AstTokenType.SMALLER_OR_EQUAL];
        while(this.include(operators)) {
            const operator = this.consume(this.getOperator(operators)!);
            const right = this.parseUnaryLogicalExpression()
            left = {
                type:'logical',
                operator: operator.type as string,
                left: left,
                right: right
            }
        }
        

        return left;
    }

    private parseUnaryLogicalExpression() : AstNode {
        if (this.peek()?.type == AstTokenType.EXCLAMATION) {
            return {
                type: 'unary_logical',
                operator: this.consume(AstTokenType.EXCLAMATION).type,
                left: this.parseTermExpression()
            }
        }

        return this.parseTermExpression();
    }

    private parseLogicalOrExpression(): AstNode {
        let left = this.parseLogicalAndExpression();
        while(this.peek()?.type == AstTokenType.OR) {
            const op = this.consume(AstTokenType.OR);
            const right = this.parseLogicalAndExpression();
            left = {
                type: 'logical',
                operator: op.type,
                left,
                right
            }
        }

        return left;
    }

    private parseLogicalAndExpression(): AstNode {
        let left = this.parseLogicalExpression();
        while(this.peek()?.type == AstTokenType.AND) {
            const op = this.consume(AstTokenType.AND);
            const right = this.parseLogicalExpression();
            left = {
                type: 'logical',
                operator: op.type,
                left,
                right
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
            case AstTokenType.BOOLEAN:
                return this.parseBoolean();
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

    private parseBoolean(): BooleanLitteral {
        const token = this.consume(AstTokenType.BOOLEAN);
        if (typeof(token.value) !== 'boolean') {
            throw new Error('Unexpected value for this type of token');
        }

        return {
            type: 'boolean',
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
            throw new Error('Unexpected type for token: ' + JSON.stringify(token) + 'The expected type is ' + expectedType.toString());
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