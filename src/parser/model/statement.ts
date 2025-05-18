import type { AstNode, IdentifierLitteral } from "./ast"

export type Statement = ExpressionStatement | PrintStatement | IfStatement | BlockStatement | WhileStatement | FuncStatement | ReturnStatement

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
    statements: Statement[],
    return?: ReturnStatement
}

export interface WhileStatement {
    type:'while',
    condition: AstNode,
    consequence: BlockStatement
}

export interface FuncStatement {
    type: 'func',
    name: string,
    params: string[],
    body: BlockStatement,
}

export interface ReturnStatement {
    type: 'return',
    expression?: AstNode; 
}

