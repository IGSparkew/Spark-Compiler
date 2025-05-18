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
    }    
}