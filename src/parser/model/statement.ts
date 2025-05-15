import type { AstNode, IdentifierLitteral } from "./ast"

export type Statement = ExpressionStatement | PrintStatement

export interface PrintStatement {
    type: 'print'
    expression: AstNode
}

export interface ExpressionStatement {
    type: 'expression',
    expression: AstNode
}

