import type { AstNode, IdentifierLitteral } from "./ast"

export type Statement = ExpressionStatement | PrintStatement | IfStatement | BlockStatement

export interface PrintStatement {
    type: 'print'
    expression: AstNode
}

export interface IfStatement {
    type: 'if',
    condition: AstNode
    consequence: BlockStatement,
    alternate?: BlockStatement | IfStatement  
}

export interface ExpressionStatement {
    type: 'expression',
    expression: AstNode
}

export interface BlockStatement {
    type: 'block',
    statements: Statement[]
}

