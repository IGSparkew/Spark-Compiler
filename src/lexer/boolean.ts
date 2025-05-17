import type { Token } from "../models/token";
import { TokenBoolean, TokenType } from "./model/token";


export function getBoolean(identifier: string) : Token | undefined {
    
    const statements = Object.entries(TokenBoolean);
    
        for (let [_, value] of statements) {
            if (identifier == value) {
                return {
                    type: TokenType.BOOLEAN,
                    value: Boolean(value)
                }
            }
        } 
    
        return undefined
}