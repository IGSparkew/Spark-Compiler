import { AstTokenType } from "../models/token";
import { type AssignementExpression, type AstNode, type BinaryExpression, type BooleanLitteral, type FunctionCaller, type IdentifierLitteral, type IncrementAssignementExpression, type LogicalExpression, type NumberLitteral, type StringLitteral } from "../parser/model/ast";
import type { Program } from "../models/program";
import type { BlockStatement, ExpressionStatement, FuncStatement, IfStatement, PrintStatement, Statement, WhileStatement } from "../parser/model/statement";


export class Interpreter {
    program: Program;
    variables: Map<string, any>;
    functions: Map<string, FuncStatement>;

    constructor(program: Program) {
        this.program = program;
        this.variables = new Map();
        this.functions = new Map();
    }

    interprete() {


        //Filter / pre compile
        const dc_func: Statement[] = [];
        const runtime: Statement[] = [];

        for (const smt of this.program.body) {
            if (smt.type == 'func') {
                dc_func.push(smt);
            } else {
                runtime.push(smt);
            }
        }


        //Declaration function
        dc_func.forEach(s => this.execute(s));

        // execute code
        runtime.forEach(s => this.execute(s));
    }

    private execute(statement: Statement, localEnv?: Map<string,any>) {
         switch(statement.type) {
                case "print":
                    console.log("> " + this.evalExpression((statement as PrintStatement).expression, localEnv));
                    break;
                case "if":
                    this.evalIf(statement as IfStatement);
                    break;
                case "expression":
                    this.evalExpression((statement as ExpressionStatement).expression, localEnv);
                    break;
                case "while":
                    this.evalWhile(statement as WhileStatement, localEnv);
                    break;
                case "func":
                    this.functions.set((statement as FuncStatement).name, statement);
                    break;
                case "return":
                    if (statement.expression == undefined) return;
                    return this.evalExpression(statement.expression, localEnv)
                default:
                    throw new Error(`Unexpected statement ${(statement as Statement).type}`);
            }
    }

    private evalWhile(smt: WhileStatement, localEnv?:Map<string,any>) {
        while(this.evalExpression(smt.condition, localEnv)) {
            this.evalBlockStatement(smt.consequence, localEnv);
        }
    }

    private evalIf(smt: IfStatement, localEnv?:Map<string,any>) : any {
        const cond = this.evalExpression(smt.condition);
        if (cond) {
            this.evalBlockStatement(smt.consequence);
        } else {
            if (smt.alternate) {
                switch(smt.alternate.type) {
                    case "if":
                        this.evalIf(smt.alternate, localEnv);
                        break;
                    case 'block':
                        this.evalBlockStatement(smt.alternate, localEnv);
                        break;
                }
            }
        }


    }

    private evalBlockStatement(block: BlockStatement, localEnv?:Map<string,any>) {
        for (let smt of block.statements) {
            const value = this.execute(smt, localEnv);
            if (smt.type == 'return') {
                if (value !== undefined) return value;
                return;
            }
        }
    }

    private evalExpression(node: AstNode, localEnv?:Map<string,any>) : any {
            switch(node.type) {
                case 'binary':
                    return this.evalBinary(node, localEnv);
                case 'literal':
                    return node.value;
                case 'assignement':
                    return this.evalAssignement(node, localEnv);
                case 'increment_assignement':
                    return this.evalIncrementAssignement(node, localEnv);
                case 'variable':
                    if (localEnv !== undefined) return this.evalExpression(localEnv.get(node.value as string));
                    return this.variables.get(node.value as string);
                case "string":
                    return node.value;
                case "function_caller":
                    return this.evalFunction(node)
                case 'boolean':
                    return node.value;
                case 'logical':
                    return this.evalLogical(node, localEnv);
                case 'unary_logical':
                    return !this.evalExpression(node.left, localEnv)
                case 'unary':
                    if (node.operator == AstTokenType.MINUS) {
                        return this.evalExpression(node.left, localEnv) * -1;
                    }
                    return this.evalExpression(node.left, localEnv);
            }

    }
    
    private evalFunction(node: FunctionCaller): any {
        const fn = this.functions.get(node.call);
        if (fn === undefined) {
            throw new Error(`Error function ${node.call} not exist`);
        }

        const params: Map<string, any> = new Map();

        if (fn.params.length > 0) {
            for (let i = 0 ; i < fn.params.length; i++) {
                if (node.arguments[i] === undefined) {
                    throw new Error(`Unexpected parmeters had no arguments from this caller`);
                }
                 params.set(fn.params[i]!, node.arguments[i]);
            }
        }
        
        return this.evalFunctionBody(fn, params);

    }

    private evalFunctionBody(fn: FuncStatement, params: Map<string, any>) : any {
        return this.evalBlockStatement(fn.body, params);
    }

    private evalIncrementAssignement(node: IncrementAssignementExpression, localEnv?:Map<string,any>): any {
        switch(node.operator) {
            case AstTokenType.PLUS_EQUAL:
                let plusResult = this.evalExpression(node.left, localEnv) + this.evalExpression(node.right, localEnv);
                if (localEnv !== undefined) return localEnv.set((node.left as IdentifierLitteral).value!, plusResult);
                return this.variables.set((node.left as IdentifierLitteral).value!, plusResult);
            case AstTokenType.MINUS_EQUAL:
                let minResult = this.evalExpression(node.left, localEnv) - this.evalExpression(node.right, localEnv);
                if (localEnv !== undefined) return localEnv.set((node.left as IdentifierLitteral).value!, minResult);
                return this.variables.set((node.left as IdentifierLitteral).value!, minResult);
            case AstTokenType.MULT_EQUAL:
                let multResult = this.evalExpression(node.left, localEnv) * this.evalExpression(node.right, localEnv);
                if (localEnv !== undefined) return localEnv.set((node.left as IdentifierLitteral).value!, multResult);
                return this.variables.set((node.left as IdentifierLitteral).value!, multResult);
            case AstTokenType.DIVIDE_EQUAL:
                let divideResult = this.evalExpression(node.left, localEnv) - this.evalExpression(node.right, localEnv);
                if (localEnv !== undefined) return localEnv.set((node.left as IdentifierLitteral).value!, divideResult);
                return this.variables.set((node.left as IdentifierLitteral).value!, divideResult);
        }
    }

    private evalBinary(node: BinaryExpression, localEnv?:Map<string,any>) : any {
        switch(node.operator) {
            case AstTokenType.PLUS:
                return this.evalExpression(node.left, localEnv) + this.evalExpression(node.right, localEnv)
            case AstTokenType.MINUS:
                return this.evalExpression(node.left, localEnv) - this.evalExpression(node.right, localEnv) 
            case AstTokenType.MULT:
                return this.evalExpression(node.left, localEnv) * this.evalExpression(node.right, localEnv) 
            case AstTokenType.DIVIDE:
                return this.evalExpression(node.left, localEnv) / this.evalExpression(node.right, localEnv) 
        }

        throw new Error(`Unexpected operator ${node.type}`);
    }

    private evalLogical(node: LogicalExpression, localEnv?:Map<string,any>) : any {
        switch(node.operator) {
            case AstTokenType.SAME:
                return this.evalExpression(node.left, localEnv) == this.evalExpression(node.right, localEnv);
            case AstTokenType.NOT_EQUAL:
                return this.evalExpression(node.left, localEnv) != this.evalExpression(node.right, localEnv);
            case AstTokenType.GREATER:
                return this.evalExpression(node.left, localEnv) > this.evalExpression(node.right), localEnv;
            case AstTokenType.SMALLER:
                return this.evalExpression(node.left, localEnv) < this.evalExpression(node.right, localEnv);
            case AstTokenType.GREATER_OR_EQUAL:
                return this.evalExpression(node.left, localEnv) >= this.evalExpression(node.right, localEnv);
            case AstTokenType.SMALLER_OR_EQUAL:
                return this.evalExpression(node.left, localEnv) <= this.evalExpression(node.right, localEnv);
            case AstTokenType.AND:
                return this.evalExpression(node.left, localEnv) && this.evalExpression(node.right, localEnv);
            case AstTokenType.OR:
                return this.evalExpression(node.left, localEnv) || this.evalExpression(node.left, localEnv);        
        }
    }

    private evalAssignement(node: AssignementExpression, localEnv?:Map<string,any>) {
        if (node.left.type !== 'variable') {
            throw new Error(`Expected variable for assignement ` + JSON.stringify(node));
        }

        if (localEnv !== undefined) return localEnv.set(node.left.value!, this.evalExpression(node.right, localEnv));

        return this.variables.set(node.left.value!, this.evalExpression(node.right));
    }



}