import { AstTokenType } from "../models/token";
import { type AssignementExpression, type AstNode, type BinaryExpression, type LogicalExpression } from "../parser/model/ast";
import type { Program } from "../models/program";
import type { BlockStatement, ExpressionStatement, IfStatement, PrintStatement, Statement, WhileStatement } from "../parser/model/statement";


export class Interpreter {
    program: Program;
    variables: Map<string, any>;

    constructor(program: Program) {
        this.program = program;
        this.variables = new Map();
    }

    interprete() {

        for(const statement of this.program.body) {
           this.execute(statement);
        }
    }

    private execute(statement: Statement) {
         switch(statement.type) {
                case "print":
                    console.log("> " + this.evalExpression((statement as PrintStatement).expression));
                    break;
                case "if":
                    this.evalIf(statement as IfStatement);
                    break;
                case "expression":
                    this.evalExpression((statement as ExpressionStatement).expression);
                    break;
                case "while":
                    this.evalWhile(statement as WhileStatement);
                    break;
                default:
                    throw new Error(`Unexpected statement ${(statement as Statement).type}`);
            }
    }

    private evalWhile(smt: WhileStatement) {
        while(this.evalExpression(smt.condition)) {
            this.evalBlockStatement(smt.consequence);
        }
    }

    private evalIf(smt: IfStatement) : any {
        const cond = this.evalExpression(smt.condition);
        if (cond) {
            this.evalBlockStatement(smt.consequence);
        } else {
            if (smt.alternate) {
                switch(smt.alternate.type) {
                    case "if":
                        this.evalIf(smt.alternate);
                        break;
                    case 'block':
                        this.evalBlockStatement(smt.alternate);
                        break;
                }
            }
        }


    }

    private evalBlockStatement(block: BlockStatement) {
        for (let smt of block.statements) {
            this.execute(smt);
        }
    }

    private evalExpression(node: AstNode) : any {
            switch(node.type) {
                case 'binary':
                    return this.evalBinary(node);
                case 'literal':
                    return node.value;
                case 'assignement':
                    return this.evalAssignement(node);
                case 'variable':
                    return this.variables.get(node.value as string);
                case "string":
                    return node.value;
                case 'boolean':
                    return node.value;
                case 'logical':
                    return this.evalLogical(node);
                case 'unary_logical':
                    return !this.evalExpression(node.left)
                case 'unary':
                    if (node.operator == AstTokenType.MINUS) {
                        return this.evalExpression(node.left) * -1;
                    }
                    return this.evalExpression(node.left);
            }

    }

    private evalBinary(node: BinaryExpression) : any {
        switch(node.operator) {
            case AstTokenType.PLUS:
                return this.evalExpression(node.left) + this.evalExpression(node.right)
            case AstTokenType.MINUS:
                return this.evalExpression(node.left) - this.evalExpression(node.right) 
            case AstTokenType.MULT:
                return this.evalExpression(node.left) * this.evalExpression(node.right) 
            case AstTokenType.DIVIDE:
                return this.evalExpression(node.left) / this.evalExpression(node.right) 
        }

        throw new Error(`Unexpected operator ${node.type}`);
    }

    private evalLogical(node: LogicalExpression) : any {
        switch(node.operator) {
            case AstTokenType.SAME:
                return this.evalExpression(node.left) == this.evalExpression(node.right);
            case AstTokenType.NOT_EQUAL:
                return this.evalExpression(node.left) != this.evalExpression(node.right);
            case AstTokenType.GREATER:
                return this.evalExpression(node.left) > this.evalExpression(node.right);
            case AstTokenType.SMALLER:
                return this.evalExpression(node.left) < this.evalExpression(node.right);
            case AstTokenType.GREATER_OR_EQUAL:
                return this.evalExpression(node.left) >= this.evalExpression(node.right);
            case AstTokenType.SMALLER_OR_EQUAL:
                return this.evalExpression(node.left) <= this.evalExpression(node.right);
            case AstTokenType.AND:
                return this.evalExpression(node.left) && this.evalExpression(node.right);
            case AstTokenType.OR:
                return this.evalExpression(node.left) || this.evalExpression(node.left);        
        }
    }

    private evalAssignement(node: AssignementExpression) {
        if (node.left.type !== 'variable') {
            throw new Error(`Expected variable for assignement ` + JSON.stringify(node));
        }

        return this.variables.set(node.left.value!, this.evalExpression(node.right));
    }



}