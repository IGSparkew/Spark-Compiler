import * as fs from 'fs'; 

const scriptFolderPathName = 'scripts';
const exempleFolderPathName = 'exemples';

export function ScriptReader(argsValues : { [x: string]: string | boolean | (string | boolean)[] | undefined }) :  {path: string, code: string} {

        let folderPathName = scriptFolderPathName;

        if (argsValues.file === undefined && typeof(argsValues.file) !== 'string') {
            throw new Error(`Error no file set to compiled`);
        }

        if (typeof(argsValues.exemple) == 'boolean' && argsValues.exemple == true) {
            folderPathName = exempleFolderPathName;
        }

        return reader(folderPathName, argsValues);
}

export function CLIReader(argsValues : { [x: string]: string | boolean | (string | boolean)[] | undefined }) :  {path: string, code: string} {
        let folderPathName = ""
        
        if (argsValues.folder !== undefined && typeof(argsValues.folder) == 'string') {
            folderPathName = argsValues.folder;
        }

        
        return reader(folderPathName, argsValues);

}

function reader(folderPathName: string, argsValues : { [x: string]: string | boolean | (string | boolean)[] | undefined }) : {path: string, code: string} {
        if (argsValues.file === undefined && typeof(argsValues.file) !== 'string') {
            throw new Error(`Error no file set to compiled`);
        }

        let file = "";

        file = argsValues.file as string;
        let path = `./${folderPathName}/`;

        if (folderPathName.length == 0) {
            path = "./";
        }
        
        let finalpath = path + file + ".spk";
        
        const code = fs.readFileSync(finalpath, 'utf-8');

        return {
            path,
            code
        }

}