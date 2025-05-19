import * as fs from "fs";
import { getAlpha } from "../lexer/alpha";

export class FileLoader {

    private path: string;
    private cursor: number;

    constructor(path: string) {
        this.path = path;
        this.cursor = 0;
    }


    load() : string {
        const mainFile = fs.readFileSync(this.path, 'utf-8');

        while (this.cursor < mainFile.length) {
            const value = mainFile[this.cursor++];
            


        }

        return "";
    }

}