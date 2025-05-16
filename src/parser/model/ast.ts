export type AstNode = AssignementExpression | BinaryExpression | NumberLitteral | StringLitteral | IdentifierLitteral | StatementExpression | LogicalExpression;

export interface BinaryExpression {
    type: 'binary',
    operator: string,
    left: AstNode,
    right: AstNode,
}

export interface AssignementExpression {
    type: 'assignement',
    left: AstNode,
    right: AstNode
}

export interface LogicalExpression {
    type: 'logical',
    operator: string
    left: AstNode,
    right: AstNode
}

export interface NumberLitteral {
    type: 'literal';
    value?: number | undefined;
}

export interface StringLitteral {
    type: 'string';
    value?: string | undefined;
}

export interface StatementExpression {
    type: 'statement',
    left: AstNode
}

export interface IdentifierLitteral {
    type: 'variable';
    value: string | undefined ;
}