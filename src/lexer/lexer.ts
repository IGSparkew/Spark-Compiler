import { TokenOperator, TokenType } from "./model/token";
import { filter_character, isAlpha, isDigit } from "../utils";

import { getNumber } from "./number";
import { getAlpha } from "./alpha";
import { getStatement } from "./statement";
import { type Token } from "../models/token";

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

    private number() {
        let {start, end} = getNumber(this.code, this.cursor);

        this.add_token(TokenType.NUMBER, parseFloat(this.code.slice(start, end)));
        this.cursor = end;
    }

    private alpha () {
        let {start, end} = getAlpha(this.code, this.cursor);

        const value = this.code.slice(start, end);

        const identifier = getStatement(value);

        if (identifier !== undefined) {
            this.tokens.push(identifier)
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


