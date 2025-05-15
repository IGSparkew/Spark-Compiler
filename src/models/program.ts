import type { Statement } from "../parser/model/statement";

export interface Program {
    type: 'program',
    body: Statement[]
}