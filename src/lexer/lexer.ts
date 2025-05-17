import { TokenLogical, TokenOperator, TokenType } from "./model/token";
import { filter_character, findKeyOfTokenLogical, findKeyOfTokenOperator, isAlpha, isDigit } from "../utils";

import { getNumber } from "./number";
import { getAlpha } from "./alpha";
import { getStatement } from "./statement";
import { type Token } from "../models/token";
import { getBoolean } from "./boolean";

export class Lexer {
    cursor: number;
    character: string;
    code: string;
    tokens: Token[];

    constructor(code: string) {
        this.cursor = 0;
        this.character= '';
        this.code = code;
        this.tokens = []
    }

    lex() {       
       while(this.cursor < this.code.length) {
        this.character = this.code[this.cursor++]!;

        if (filter_character(this.character)) {
            continue;
        }

        let tokend = false;
        let types = Object.entries(TokenOperator);

        if (this.character == TokenOperator.QUOTES) {
            this.setString();
            continue;
        }

        if (this.lexLogicalOperator()) continue;

        if (this.lexIncrementalAssignementOperator()) continue;


        for(let [key, value] of types) {
            if (value == this.character) {
                this.add_token(key, value);
                tokend = true;
            }
        }

        if (!tokend) {
            if (isDigit(this.character)) {
                this.number();
                continue;
            }

            if (isAlpha(this.character)) {
                this.alpha();
                continue;
            }

            throw new Error(`Unexpected Token ${this.character}`);
        }
       }
    }

    private lexLogicalOperator() {
        if (this.character == TokenOperator.EQUAL && this.code[this.cursor] == TokenOperator.EQUAL) {
            this.add_token(findKeyOfTokenLogical(TokenLogical.SAME)!, TokenLogical.SAME);
            this.cursor += 1
            return true;
        }

        if (this.character == TokenOperator.EXCLAMATION && this.code[this.cursor] == TokenOperator.EQUAL) {
            this.add_token(findKeyOfTokenLogical(TokenLogical.NOT_EQUAL)!, TokenLogical.NOT_EQUAL);
            return true;
        }

        if (this.character == TokenOperator.GREATER) {
            if (this.code[this.cursor] == TokenOperator.EQUAL) {
                this.add_token(findKeyOfTokenLogical(TokenLogical.GREATER_OR_EQUAL)!, TokenLogical.GREATER_OR_EQUAL);
                this.cursor += 1
            } else {
                this.add_token(findKeyOfTokenLogical(TokenLogical.GREATER)!, TokenLogical.GREATER);
            }

            return true;
        }

        if (this.character == TokenOperator.SMALLER) {
            if (this.code[this.cursor] == TokenOperator.EQUAL) {
                this.add_token(findKeyOfTokenLogical(TokenLogical.SMALLER_OR_EQUAL)!, TokenLogical.SMALLER_OR_EQUAL);
                this.cursor += 1;
            } else {
                this.add_token(findKeyOfTokenLogical(TokenLogical.SMALLER)!, TokenLogical.SMALLER);
            }

            return true;
        }

        if (this.character == "&" && this.code[this.cursor] == "&") {
            this.add_token(findKeyOfTokenLogical(TokenLogical.AND)!, TokenLogical.AND);
            this.cursor+=1;
            return true;
        } 

        if (this.character == "|" && this.code[this.cursor] == "|") {
            this.add_token(findKeyOfTokenLogical(TokenLogical.OR)!, TokenLogical.OR);
            this.cursor+=1;
            return true;
        }

        return false;
    }

    private lexIncrementalAssignementOperator() {
        if (this.character == TokenOperator.PLUS && this.code[this.cursor] == "=") {
            this.add_token(findKeyOfTokenOperator(TokenOperator.PLUS_EQUAL)!, TokenOperator.PLUS_EQUAL);
            this.cursor += 1;
            return true;
        }

        if (this.character == TokenOperator.MINUS && this.code[this.cursor] == "=") {
             this.add_token(findKeyOfTokenOperator(TokenOperator.MINUS_EQUAL)!, TokenOperator.MINUS_EQUAL);
            this.cursor += 1;
            return true;           
        }

        if (this.character == TokenOperator.MULT && this.code[this.cursor] == "=") {
            this.add_token(findKeyOfTokenOperator(TokenOperator.MULT_EQUAL)!, TokenOperator.MULT_EQUAL);
            this.cursor += 1;
            return true;
        }

        if (this.character == TokenOperator.DIVIDE && this.code[this.cursor] == "=") {
            this.add_token(findKeyOfTokenOperator(TokenOperator.DIVIDE_EQUAL)!, TokenOperator.DIVIDE_EQUAL);
            this.cursor += 1;
            return true;           
        }

        return false;
    }

    private number() {
        let {start, end} = getNumber(this.code, this.cursor);

        this.add_token(TokenType.NUMBER, parseFloat(this.code.slice(start, end)));
        this.cursor = end;
    }

    private alpha () {
        let {start, end} = getAlpha(this.code, this.cursor);

        const value = this.code.slice(start, end);

        const identifier = getStatement(value);

        const booleanValue = getBoolean(value);

        if (identifier !== undefined) {
            this.tokens.push(identifier)
        } else if (booleanValue !== undefined) {
            this.tokens.push(booleanValue);
        } else {
            this.add_token(TokenType.IDENTIFIER, value);
        }

        this.cursor = end;
    }

    private add_token(type: string, value?: number | string) {
        this.tokens.push({
            type: type,
            value: value
        });
    }

    private setString() {
        let start = ++this.cursor;
        while(this.cursor < this.code.length && this.code[this.cursor] !== TokenOperator.QUOTES) this.cursor++;
        if (this.code[this.cursor] !== TokenOperator.QUOTES) throw new Error('Unterminated String starting at ' + start);
        this.tokens.push({type: TokenType.STRING, value: this.code.slice(start-1, this.cursor)});
        this.cursor++;
    }

}


