import { AstTokenType } from "../models/token";
import { type AssignementExpression, type AstNode, type BinaryExpression } from "../parser/model/ast";
import type { Program } from "../models/program";
import type { Statement } from "../parser/model/statement";


export class Interpreter {
    program: Program;
    variables: Map<string, AstNode>;

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

    private evalExpression(node: AstNode) {
            switch(node.type) {
                case 'binary':
                    return this.evalBinary(node);
                    break;
                case 'literal':
                    return node.value;
                case 'assignement':
                    return this.evalAssignement(node);
                case 'variable':
                    return this.variables.get(node.value!);
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

    private evalAssignement(node: AssignementExpression) {
        if (node.left.type !== 'variable') {
            throw new Error(`Expected variable for assignement ` + JSON.stringify(node));
        }

        return this.variables.set(node.left.value!, node.right)
    }



}