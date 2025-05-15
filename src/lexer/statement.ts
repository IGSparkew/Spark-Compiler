import type { Token } from "../models/token";
import { TokenStatement } from "./model/token";

export function getStatement(identifier: string) : Token | undefined {

    const statements = Object.entries(TokenStatement);

    for (let [key, value] of statements) {
        if (identifier == value) {
            return {
                type: key,
                value
            }
        }
    } 

    return undefined
}