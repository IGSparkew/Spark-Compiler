import { AstOperator, type AssignementExpression, type AstNode, type BinaryExpression, type IdentifierLitteral } from "../models/ast";


export class Interpreter {
    ast: AstNode[];
    variables: Map<string, AstNode>;

    constructor(ast: AstNode[]) {
        this.ast = ast;
        this.variables = new Map();
    }

    interprete() {
        for (const node of this.ast) {
            return this.evalExpression(node);
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
            case AstOperator.PLUS:
                return this.evalExpression(node.left) + this.evalExpression(node.right)
            case AstOperator.MINUS:
                return this.evalExpression(node.left) - this.evalExpression(node.right) 
            case AstOperator.MULT:
                return this.evalExpression(node.left) * this.evalExpression(node.right) 
            case AstOperator.DIVIDE:
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