export type AstNode = AssignementExpression | BinaryExpression | NumberLitteral | StringLitteral | IdentifierLitteral | LogicalExpression | UnaryExpression | UnaryLogicalExpression;

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

export interface UnaryExpression {
    type: 'unary',
    operator:string,
    left: AstNode
}

export interface UnaryLogicalExpression {
    type: 'unary_logical',
    operator:string,
    left: AstNode
}

export interface NumberLitteral {
    type: 'literal';
    value?: number | undefined;
}

export interface StringLitteral {
    type: 'string';
    value?: string | undefined;
}

export interface IdentifierLitteral {
    type: 'variable';
    value: string | undefined ;
}