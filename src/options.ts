import type { ParseArgsOptionsConfig } from "util";

export const options : ParseArgsOptionsConfig = {
    exemple : {
        type: 'boolean'
    },
    debug : {
        type: 'boolean'
    },
    ascii : {
        type: 'boolean'
    },
    file: {
        type: 'string'
    },
    lexer: {
        type: 'boolean'
    },
    parser: {
        type: 'boolean'
    }  
}

export const optionsCli : ParseArgsOptionsConfig = {
    debug : {
        type: 'boolean'
    },
    ascii : {
        type: 'boolean'
    },
    file: {
        type: 'string'
    },
    folder: {
        type: 'string'
    },
        lexer: {
        type: 'boolean'
    },
    parser: {
        type: 'boolean'
    }     
}