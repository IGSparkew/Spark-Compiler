import * as fs from "fs";
import { getAlpha } from "../lexer/alpha";
import { AstTokenType } from "../models/token";
import { TokenOperator } from "../lexer/model/token";

export class FileLoader {

    private mainFile: string;
    private cursor: number;
    private pathsIncluded: string[];
    private path: string;
    private code: string;

    constructor(mainFile: string, path: string) {
        this.mainFile = mainFile;
        this.cursor = 0;
        this.pathsIncluded = [];
        this.path = path;
        this.code = "";
    }


    load() : string {

        while (this.cursor < this.mainFile.length) {
            const value = this.mainFile[this.cursor++];
            if (value === "#") {
                const {start, end} = this.getIncluded();
                this.pathsIncluded.push(this.mainFile.slice(start, end));
                this.code = this.mainFile.slice(end + 1, this.mainFile.length);
            }
        }

        let preCompValue = "";

        this.pathsIncluded.forEach(file => {
            const c = fs.readFileSync(this.path + file.trim() + ".spk", 'utf-8');
            if (c !== undefined) {
                preCompValue += c;
                preCompValue += "\n" 
            }
        });

        preCompValue += this.code;

        return preCompValue;
    }

    private getIncluded() : {start: number, end: number} {
        const value = this.mainFile[this.cursor++];
        let words = value as string;
        let start = -1;
        while(this.mainFile[this.cursor] !== ";" && this.cursor < this.mainFile.length) {
            words += this.mainFile[this.cursor];

            if (words == "include") {
                start = ++this.cursor;
                continue;
            }

            this.cursor++;
        }


        return {
            start,
            end: this.cursor
        }
    }

}