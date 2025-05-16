import { AstTokenType } from "../models/token";
import { type AssignementExpression, type AstNode, type BinaryExpression, type LogicalExpression } from "../parser/model/ast";
import type { Program } from "../models/program";
import type { Statement } from "../parser/model/statement";


export class Interpreter {
    program: Program;
    variables: Map<string, any>;

    constructor(program: Program) {
        this.program = program;
        this.variables = new Map();
    }

    interprete() {

        for(const statement of this.program.body) {

            switch((statement as Statement).type) {
                case "print":
                    console.log("> " + this.evalExpression(statement.expression));
                    break;
                case "expression":
                    this.evalExpression(statement.expression);
                    break;
                default:
                    throw new Error(`Unexpected statement ${statement.type}`);
            }

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
                    console.log(node.value);
                    return this.variables.get(node.value as string);
                case "string":
                    return node.value;
                case 'logical':
                    return this.evalLogical(node);
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
        }
    }

    private evalAssignement(node: AssignementExpression) {
        if (node.left.type !== 'variable') {
            throw new Error(`Expected variable for assignement ` + JSON.stringify(node));
        }

        return this.variables.set(node.left.value!, this.evalExpression(node.right));
    }



}