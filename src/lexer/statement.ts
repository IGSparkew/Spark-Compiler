import { TokenStatement, type Token } from "./model/token";

export function getStatement(identifier: string) : Token | undefined {

    const statements = Object.values(TokenStatement);

    for (let st of statements) {
        if (identifier == st) {
            return {
                type: st
            }
        }
    } 

    return undefined
}