export type AstNode = AssignementExpression | BinaryExpression | NumberLitteral | IdentifierLitteral | StatementExpression;

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

export interface NumberLitteral {
    type: 'literal';
    value?: number | undefined;
}

export interface StatementExpression {
    type: 'statement',
    left: AstNode
}

export interface IdentifierLitteral {
    type: 'variable';
    value: string | undefined ;
}