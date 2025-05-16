export type AstNode = AssignementExpression | BinaryExpression | NumberLitteral | StringLitteral | IdentifierLitteral | StatementExpression;

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