import type { Statement } from "./statement";

export interface Program {
    type: 'program',
    body: Statement[]
}